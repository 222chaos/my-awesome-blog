from datetime import datetime
from typing import Optional
from pydantic import BaseModel


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
    id: str
    author_id: str
    view_count: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Article(ArticleInDBBase):
    pass


class ArticleWithAuthor(Article):
    author: Optional["User"] = None


# For nested relationships
from app.schemas.user import User
ArticleWithAuthor.update_forward_refs()