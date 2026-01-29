from sqlalchemy import Column, Integer, ForeignKey, UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class ArticleTag(Base):
    __tablename__ = "article_tags"

    article_id = Column(UUID(as_uuid=True), ForeignKey("articles.id"), primary_key=True)
    tag_id = Column(UUID(as_uuid=True), ForeignKey("tags.id"), primary_key=True)

    # Relationships
    article = relationship("Article", back_populates="article_tags", overlaps="articles,tags")
    tag = relationship("Tag", back_populates="article_tags", overlaps="articles,tags")