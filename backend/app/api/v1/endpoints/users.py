from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
import os
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app import crud
from app.crud.user import get_user_stats
from app.schemas.user import User, UserCreate, UserUpdate, UserStats, AvatarResponse
from app.models.user import User as UserModel
from app.services.image_service import ImageService
from app.services.oss_service import oss_service

router = APIRouter()


@router.get("/", response_model=List[User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve users
    """
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=User)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Create new user (admin only)
    """
    # Check if user exists
    user = crud.get_user_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username already exists",
        )

    user = crud.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    user = crud.create_user(db, user=user_in)
    return user


# /me endpoints for current user operations


@router.get("/me", response_model=User)
def read_current_user(
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    Get current user's profile
    """
    return current_user


@router.put("/me", response_model=User)
def update_current_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    Update current user's profile
    """
    user = crud.update_user(db, user_id=current_user.id, user_update=user_in)
    return user


@router.post("/me/avatar", response_model=AvatarResponse)
def upload_current_user_avatar(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    Upload current user's avatar
    """
    from app.utils.logger import app_logger
    
    app_logger.info(f"Starting avatar upload for user: {current_user.id}, file: {file.filename}")
    
    # Check if file is an allowed image type
    allowed_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        app_logger.error(f"File type {file_extension} not allowed for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_extension} not allowed. Allowed types: {allowed_extensions}"
        )

    # Use ImageService to process avatar
    image_service = ImageService()

    # Save uploaded file temporarily
    temp_file_path = f"temp_avatar_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            # Read file content in chunks to handle large files
            while content := file.file.read(1024 * 1024):  # 1MB chunks
                buffer.write(content)
    except Exception as e:
        app_logger.error(f"Error saving temporary file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error saving uploaded file"
        )

    try:
        # Validate image format
        if not image_service.validate_image_format(temp_file_path):
            app_logger.error(f"Invalid image format for user {current_user.id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image format. Supported formats: JPEG, PNG, WEBP, GIF"
            )
        
        # Get image info
        image_info = image_service.get_image_info(temp_file_path)
        app_logger.info(f"Image info: {image_info}")
        
        # Upload avatar to OSS
        with open(temp_file_path, "rb") as f:
            file_data = f.read()
        avatar_url = oss_service.upload_file(file_data, file.filename, f"avatars/user_{current_user.id}")
        
        if not avatar_url:
            app_logger.error(f"Failed to upload avatar to OSS for user {current_user.id}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload avatar to cloud storage"
            )

        # Update user's avatar in database
        updated_user = crud.update_user(db, user_id=current_user.id, user_update=UserUpdate(avatar=avatar_url))
        
        if not updated_user:
            app_logger.error(f"Failed to update user avatar in database for user {current_user.id}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user avatar in database"
            )

        # Clean up temporary file
        os.remove(temp_file_path)
        
        app_logger.info(f"Avatar uploaded successfully for user {current_user.id}, URL: {avatar_url}")

        return AvatarResponse(
            avatar_url=avatar_url,
            message="Avatar uploaded successfully"
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        app_logger.error(f"Unexpected error processing avatar for user {current_user.id}: {str(e)}")
        # Clean up temporary file in case of error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing avatar: {str(e)}"
        )


@router.get("/me/stats", response_model=UserStats)
def read_current_user_stats(
    *,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    Get current user's statistics
    """
    stats = get_user_stats(db, user_id=current_user.id)
    if not stats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User statistics not found"
        )
    return stats


@router.get("/{user_id}", response_model=User)
def read_user_by_id(
    user_id: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific user by id
    """
    from uuid import UUID
    user_uuid = UUID(user_id)
    user = crud.get_user(db, user_id=user_uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.put("/{user_id}", response_model=User)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: str,
    user_in: UserUpdate
) -> Any:
    """
    Update a user
    """
    from uuid import UUID
    user_uuid = UUID(user_id)
    user = crud.get_user(db, user_id=user_uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user = crud.update_user(db, user_id=user_uuid, user_update=user_in)
    return user


@router.delete("/{user_id}", response_model=dict)
def delete_user(
    *,
    db: Session = Depends(get_db),
    user_id: str
) -> Any:
    """
    Delete a user
    """
    from uuid import UUID
    user_uuid = UUID(user_id)
    deleted = crud.delete_user(db, user_id=user_uuid)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {"message": "User deleted successfully"}