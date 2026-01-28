from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
import os
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.image import Image, ImageCreate, ImageUpdate
from app.models.user import User
from app.services.image_service import ImageService
from app.core.config import settings

router = APIRouter()


@router.get("/", response_model=List[Image])
def read_images(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve images
    """
    images = crud.get_images(
        db, 
        skip=skip, 
        limit=limit
    )
    return images


@router.post("/", response_model=Image)
def upload_image(
    *,
    file: UploadFile = File(...),
    title: str = None,
    description: str = None,
    alt_text: str = None,
    is_featured: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Upload a new image
    """
    # Check if file is an allowed image type
    allowed_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_extension} not allowed. Allowed types: {allowed_extensions}"
        )
    
    # Use ImageService to process and save the image
    image_service = ImageService()
    
    # Save uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    try:
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(settings.STATIC_FILES_DIR, "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Process image using ImageService
        result = image_service.compress_and_create_variants(
            temp_file_path, 
            upload_dir,
            title or file.filename
        )
        
        # Use the first variant as the processed image path
        processed_image_path = os.path.join(upload_dir, result['variants'][0]['file_path'])
        
        # Create image record in database
        image_in = ImageCreate(
            filename=os.path.basename(processed_image_path),
            original_filename=file.filename,
            filepath=processed_image_path,
            title=title or file.filename,
            description=description,
            alt_text=alt_text,
            file_size=os.path.getsize(processed_image_path),
            mime_type=file.content_type,
            width=result['original_width'],
            height=result['original_height'],
            is_featured=is_featured,
            uploader_id=current_user.id
        )
        
        image = crud.create_image(db, image=image_in)
        
        # Clean up temporary file
        os.remove(temp_file_path)
        
        return image
    except Exception as e:
        # Clean up temporary file in case of error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing image: {str(e)}"
        )


@router.get("/{image_id}", response_model=Image)
def read_image_by_id(
    image_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific image by id
    """
    from uuid import UUID
    try:
        image_uuid = UUID(image_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image ID format",
        )
    
    image = crud.get_image(db, image_id=image_uuid)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
    
    return image


@router.put("/{image_id}", response_model=Image)
def update_image(
    *,
    image_id: str,
    image_in: ImageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Update an image
    """
    from uuid import UUID
    try:
        image_uuid = UUID(image_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image ID format",
        )
    
    image = crud.get_image(db, image_id=image_uuid)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
    
    image = crud.update_image(
        db, 
        image_id=image_uuid, 
        image_update=image_in
    )
    return image


@router.delete("/{image_id}", response_model=dict)
def delete_image(
    *,
    image_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Delete an image
    """
    from uuid import UUID
    try:
        image_uuid = UUID(image_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image ID format",
        )
    
    image = crud.get_image(db, image_id=image_uuid)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
    
    # Also delete the physical file
    if os.path.exists(image.filepath):
        os.remove(image.filepath)
    
    # Delete image variants if they exist
    base_path = os.path.splitext(image.filepath)[0]
    for size in ['hero', 'large', 'medium', 'small', 'thumbnail']:
        variant_path = f"{base_path}_{size}.jpg"
        if os.path.exists(variant_path):
            os.remove(variant_path)
    
    deleted = crud.delete_image(db, image_id=image_uuid)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
    
    return {"message": "Image deleted successfully"}