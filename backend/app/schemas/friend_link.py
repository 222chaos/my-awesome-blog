from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FriendLinkBase(BaseModel):
    name: str
    url: str
    favicon: Optional[str] = None
    avatar: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True
    is_featured: Optional[bool] = False


class FriendLinkCreate(FriendLinkBase):
    name: str
    url: str


class FriendLinkUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    favicon: Optional[str] = None
    avatar: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class FriendLinkInDBBase(FriendLinkBase):
    id: str
    click_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FriendLink(FriendLinkInDBBase):
    pass