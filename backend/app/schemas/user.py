from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# Base schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None


# Create schemas
class UserCreate(UserBase):
    password: str


class UserCreateAdmin(UserCreate):
    is_superuser: bool = False


# Update schemas
class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


# Response schemas
class UserInDBBase(UserBase):
    id: int
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