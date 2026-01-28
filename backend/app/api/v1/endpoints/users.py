from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
import os
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app import crud
from app.schemas.user import User, UserCreate, UserUpdate, UserStats, AvatarResponse
from app.models.user import User as UserModel
from app.services.image_service import ImageService

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
    # Check if file is an allowed image type
    allowed_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_extension} not allowed. Allowed types: {allowed_extensions}"
        )

    # Use ImageService to process and save avatar
    image_service = ImageService()

    # Save uploaded file temporarily
    temp_file_path = f"temp_avatar_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        buffer.write(file.file.read())

    try:
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join("static", "avatars")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Process image using ImageService
        result = image_service.compress_and_create_variants(
            temp_file_path,
            upload_dir,
            f"avatar_{current_user.username}"
        )
        
        # Use the first variant as the processed image path
        processed_image_path = os.path.join(upload_dir, result['variants'][0]['file_path'])

        # Update user's avatar in database
        avatar_url = processed_image_path
        crud.update_user(db, user_id=current_user.id, user_update=UserUpdate(avatar=avatar_url))

        # Clean up temporary file
        os.remove(temp_file_path)

        return AvatarResponse(
            avatar_url=avatar_url,
            message="Avatar uploaded successfully"
        )
    except Exception as e:
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
    stats = crud.get_user_stats(db, user_id=current_user.id)
    if not stats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User statistics not found"
        )
    return stats