from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.image import Image, ImageVariant
from app.schemas.image import ImageCreate, ImageUpdate, ImageVariantCreate, ImageVariantUpdate


def get_image(db: Session, image_id: int) -> Optional[Image]:
    """获取单个图片"""
    return db.query(Image).filter(Image.id == image_id).first()


def get_image_by_path(db: Session, file_path: str) -> Optional[Image]:
    """通过文件路径获取图片"""
    return db.query(Image).filter(Image.file_path == file_path).first()


def get_images(
    db: Session, 
    skip: int = 0, 
    limit: int = 100
) -> List[Image]:
    """获取图片列表"""
    return db.query(Image).offset(skip).limit(limit).all()


def create_image(db: Session, image: ImageCreate) -> Image:
    """创建新图片"""
    db_image = Image(**image.model_dump())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def update_image(db: Session, image_id: int, image_update: ImageUpdate) -> Optional[Image]:
    """更新图片信息"""
    db_image = get_image(db, image_id)
    if db_image:
        update_data = image_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_image, field, value)
        db.commit()
        db.refresh(db_image)
    return db_image


def delete_image(db: Session, image_id: int) -> bool:
    """删除图片及所有变体"""
    db_image = get_image(db, image_id)
    if db_image:
        # 删除所有相关的图片变体
        db.query(ImageVariant).filter(ImageVariant.image_id == image_id).delete()
        # 删除图片本身
        db.delete(db_image)
        db.commit()
        return True
    return False


def get_image_variants(db: Session, image_id: int) -> List[ImageVariant]:
    """获取图片的所有变体"""
    return db.query(ImageVariant).filter(ImageVariant.image_id == image_id).all()


def get_image_variant_by_name(db: Session, image_id: int, variant_name: str) -> Optional[ImageVariant]:
    """根据名称获取图片变体"""
    return (
        db.query(ImageVariant)
        .filter(ImageVariant.image_id == image_id, ImageVariant.variant_name == variant_name)
        .first()
    )


def create_image_variant(db: Session, image_variant: ImageVariantCreate, image_id: int) -> ImageVariant:
    """创建图片变体"""
    db_variant = ImageVariant(**image_variant.model_dump(), image_id=image_id)
    db.add(db_variant)
    db.commit()
    db.refresh(db_variant)
    return db_variant


def update_image_variant(
    db: Session, variant_id: int, variant_update: ImageVariantUpdate
) -> Optional[ImageVariant]:
    """更新图片变体"""
    db_variant = db.query(ImageVariant).filter(ImageVariant.id == variant_id).first()
    if db_variant:
        update_data = variant_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_variant, field, value)
        db.commit()
        db.refresh(db_variant)
    return db_variant


def delete_image_variant(db: Session, variant_id: int) -> bool:
    """删除图片变体"""
    db_variant = db.query(ImageVariant).filter(ImageVariant.id == variant_id).first()
    if db_variant:
        db.delete(db_variant)
        db.commit()
        return True
    return False


def get_image_with_variants(db: Session, image_id: int) -> Optional[Image]:
    """获取图片及其所有变体"""
    return db.query(Image).filter(Image.id == image_id).first()


def get_optimized_images(db: Session, skip: int = 0, limit: int = 100) -> List[Image]:
    """获取已优化的图片"""
    return (
        db.query(Image)
        .filter(Image.is_optimized == True)
        .offset(skip).limit(limit)
        .all()
    )


def mark_image_as_optimized(db: Session, image_id: int) -> bool:
    """标记图片为已优化"""
    db_image = get_image(db, image_id)
    if db_image:
        db_image.is_optimized = True
        db.commit()
        db.refresh(db_image)
        return True
    return False