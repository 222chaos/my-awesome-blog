from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SubscriptionBase(BaseModel):
    email: str
    is_active: Optional[bool] = True
    is_verified: Optional[bool] = False


class SubscriptionCreate(SubscriptionBase):
    email: str


class SubscriptionUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


class SubscriptionInDBBase(SubscriptionBase):
    id: int
    verification_token: Optional[str] = None
    subscribed_at: datetime
    verified_at: Optional[datetime] = None
    unsubscribed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Subscription(SubscriptionInDBBase):
    pass


class SubscriptionRequest(BaseModel):
    email: str


class SubscriptionVerification(BaseModel):
    token: str