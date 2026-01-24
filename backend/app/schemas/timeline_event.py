from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class TimelineEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: date
    event_type: Optional[str] = 'milestone'  # milestone, achievement, update
    icon: Optional[str] = None
    color: Optional[str] = None
    is_active: Optional[bool] = True
    sort_order: Optional[int] = 0


class TimelineEventCreate(TimelineEventBase):
    title: str
    event_date: date


class TimelineEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[date] = None
    event_type: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class TimelineEventInDBBase(TimelineEventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TimelineEvent(TimelineEventInDBBase):
    pass