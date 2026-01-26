from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# Base schemas
class CommentBase(BaseModel):
    content: str


# Create schemas
class CommentCreate(CommentBase):
    article_id: str
    parent_id: Optional[str] = None


# Update schemas
class CommentUpdate(BaseModel):
    content: Optional[str] = None
    is_approved: Optional[bool] = None


# Response schemas
class CommentInDBBase(CommentBase):
    id: str
    article_id: str
    author_id: str
    parent_id: Optional[str] = None
    is_approved: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Comment(CommentInDBBase):
    pass


class CommentWithAuthor(Comment):
    author: Optional["User"] = None


class CommentWithArticle(Comment):
    article: Optional["Article"] = None


class CommentWithAuthorAndArticle(Comment):
    author: Optional["User"] = None
    article: Optional["Article"] = None


# For nested relationships
from app.schemas.user import User
from app.schemas.article import Article
CommentWithAuthor.update_forward_refs()
CommentWithArticle.update_forward_refs()
CommentWithAuthorAndArticle.update_forward_refs()