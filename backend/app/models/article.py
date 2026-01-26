from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, BigInteger, UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(String(500))
    cover_image = Column(String(255))
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True))
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    # 新增字段
    read_time = Column(Integer)  # 阅读时长（分钟）
    featured_image_id = Column(UUID(as_uuid=True), ForeignKey("images.id"))
    is_featured = Column(Boolean, default=False)
    is_pinned = Column(Boolean, default=False)
    meta_title = Column(String(200))
    meta_description = Column(Text)
    
    # Foreign keys
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    featured_image = relationship("Image", foreign_keys=[featured_image_id])
    
    # Relationships
    author = relationship("User", back_populates="articles")
    comments = relationship("Comment", back_populates="article", cascade="all, delete-orphan")
    categories = relationship("Category", secondary="article_categories", back_populates="articles")
    tags = relationship("Tag", secondary="article_tags", back_populates="articles")
    article_categories = relationship("ArticleCategory", back_populates="article", cascade="all, delete-orphan")
    article_tags = relationship("ArticleTag", back_populates="article", cascade="all, delete-orphan")