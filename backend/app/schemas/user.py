from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


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
    id: str
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    hashed_password: str