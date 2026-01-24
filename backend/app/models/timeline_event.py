from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    event_date = Column(Date, nullable=False)
    event_type = Column(String(50), default='milestone')  # milestone, achievement, update
    icon = Column(String(50))
    color = Column(String(7))
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())