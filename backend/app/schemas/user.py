from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, field_serializer


# Base schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    email: EmailStr = Field(..., description="User email")
    full_name: Optional[str] = Field(None, max_length=100, description="Full name")
    avatar: Optional[str] = Field(None, max_length=500, description="Avatar URL")
    bio: Optional[str] = Field(None, description="User bio")
    website: Optional[str] = Field(None, max_length=200, description="Website URL")
    twitter: Optional[str] = Field(None, max_length=100, description="Twitter handle")
    github: Optional[str] = Field(None, max_length=100, description="GitHub username")
    linkedin: Optional[str] = Field(None, max_length=100, description="LinkedIn profile URL")


# Create schemas
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128, description="Password")


class UserCreateAdmin(UserCreate):
    is_superuser: bool = False


# Update schemas
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = Field(None, description="User email")
    full_name: Optional[str] = Field(None, max_length=100, description="Full name")
    password: Optional[str] = Field(None, min_length=6, max_length=128, description="Password")
    avatar: Optional[str] = Field(None, max_length=500, description="Avatar URL")
    bio: Optional[str] = Field(None, description="User bio")
    website: Optional[str] = Field(None, max_length=200, description="Website URL")
    twitter: Optional[str] = Field(None, max_length=100, description="Twitter handle")
    github: Optional[str] = Field(None, max_length=100, description="GitHub username")
    linkedin: Optional[str] = Field(None, max_length=100, description="LinkedIn profile URL")


# Response schemas
class UserInDBBase(UserBase):
    id: UUID
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer('id')
    def serialize_id(self, value: UUID) -> str:
        return str(value)

    model_config = {'from_attributes': True}


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    hashed_password: str


# User statistics schema
class UserStats(BaseModel):
    article_count: int = Field(..., description="用户发布的文章数量")
    comment_count: int = Field(..., description="用户发表的评论数量")
    joined_date: str = Field(..., description="用户加入日期")
    total_views: int = Field(default=0, description="用户文章总浏览量")


# Avatar upload response schema
class AvatarResponse(BaseModel):
    avatar_url: str = Field(..., description="头像URL")
    message: str = Field(default="Avatar uploaded successfully", description="上传结果消息")


# Password update schema
class PasswordUpdate(BaseModel):
    old_password: str = Field(..., min_length=6, max_length=128, description="旧密码")
    new_password: str = Field(..., min_length=6, max_length=128, description="新密码")