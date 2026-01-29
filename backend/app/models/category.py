from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    color = Column(String(7))  # 十六进制颜色值，如 #06B6D4
    icon = Column(String(50))  # 图标名称，如 'folder'
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    articles = relationship("Article", secondary="article_categories", back_populates="categories", overlaps="article_categories")
    article_categories = relationship("ArticleCategory", back_populates="category", cascade="all, delete-orphan", overlaps="articles,categories")