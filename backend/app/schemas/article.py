from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, field_serializer


# Base schemas
class ArticleBase(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    is_published: bool = False


# Create schemas
class ArticleCreate(ArticleBase):
    pass


class ArticleCreateWithAuthor(ArticleCreate):
    author_id: str


# Update schemas
class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    is_published: Optional[bool] = None


# Response schemas
class ArticleInDBBase(ArticleBase):
    id: UUID
    author_id: UUID
    view_count: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer('id', 'author_id')
    def serialize_uuids(self, value: UUID) -> str:
        return str(value)

    model_config = {'from_attributes': True}


class Article(ArticleInDBBase):
    pass


class ArticleWithAuthor(Article):
    author: Optional["User"] = None
    categories: Optional[List["Category"]] = []
    tags: Optional[List["Tag"]] = []

# For nested relationships
from app.schemas.user import User
from app.schemas.category import Category
from app.schemas.tag import Tag
ArticleWithAuthor.model_rebuild()
ArticleWithAuthor.update_forward_refs()