from sqlalchemy import Column, Integer, Boolean, ForeignKey, UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class ArticleCategory(Base):
    __tablename__ = "article_categories"

    article_id = Column(UUID(as_uuid=True), ForeignKey("articles.id"), primary_key=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), primary_key=True)
    is_primary = Column(Boolean, default=False)

    # Relationships
    article = relationship("Article", back_populates="article_categories", overlaps="articles,categories")
    category = relationship("Category", back_populates="article_categories", overlaps="articles,categories")