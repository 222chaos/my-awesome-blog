from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.timeline_event import TimelineEvent
from app.schemas.timeline_event import TimelineEventCreate, TimelineEventUpdate


def get_timeline_event(db: Session, event_id: int) -> Optional[TimelineEvent]:
    """获取单个时间轴事件"""
    return db.query(TimelineEvent).filter(TimelineEvent.id == event_id).first()


def get_timeline_events(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    is_active: Optional[bool] = True,
    event_type: Optional[str] = None
) -> List[TimelineEvent]:
    """获取时间轴事件列表"""
    query = db.query(TimelineEvent)
    
    if is_active is not None:
        query = query.filter(TimelineEvent.is_active == is_active)
    
    if event_type is not None:
        query = query.filter(TimelineEvent.event_type == event_type)
    
    # 按日期降序排列（最新的在前）
    query = query.order_by(TimelineEvent.event_date.desc(), TimelineEvent.sort_order.asc())
    
    return query.offset(skip).limit(limit).all()


def get_active_timeline_events(db: Session, limit: int = 20) -> List[TimelineEvent]:
    """获取活跃的时间轴事件"""
    return (
        db.query(TimelineEvent)
        .filter(TimelineEvent.is_active == True)
        .order_by(TimelineEvent.event_date.desc(), TimelineEvent.sort_order.asc())
        .limit(limit)
        .all()
    )


def get_timeline_events_by_type(db: Session, event_type: str, skip: int = 0, limit: int = 100) -> List[TimelineEvent]:
    """根据类型获取时间轴事件"""
    return (
        db.query(TimelineEvent)
        .filter(TimelineEvent.event_type == event_type, TimelineEvent.is_active == True)
        .order_by(TimelineEvent.event_date.desc(), TimelineEvent.sort_order.asc())
        .offset(skip).limit(limit)
        .all()
    )


def get_recent_timeline_events(db: Session, days: int = 365, limit: int = 20) -> List[TimelineEvent]:
    """获取最近N天的时间轴事件"""
    from datetime import datetime, timedelta
    from sqlalchemy import and_
    
    cutoff_date = datetime.utcnow().date() - timedelta(days=days)
    
    return (
        db.query(TimelineEvent)
        .filter(and_(TimelineEvent.event_date >= cutoff_date, TimelineEvent.is_active == True))
        .order_by(TimelineEvent.event_date.desc(), TimelineEvent.sort_order.asc())
        .limit(limit)
        .all()
    )


def create_timeline_event(db: Session, event: TimelineEventCreate) -> TimelineEvent:
    """创建新时间轴事件"""
    db_event = TimelineEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def update_timeline_event(
    db: Session, event_id: int, event_update: TimelineEventUpdate
) -> Optional[TimelineEvent]:
    """更新时间轴事件"""
    db_event = get_timeline_event(db, event_id)
    if db_event:
        update_data = event_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_event, field, value)
        db.commit()
        db.refresh(db_event)
    return db_event


def delete_timeline_event(db: Session, event_id: int) -> bool:
    """删除时间轴事件"""
    db_event = get_timeline_event(db, event_id)
    if db_event:
        db.delete(db_event)
        db.commit()
        return True
    return False


def get_milestone_events(db: Session, limit: int = 10) -> List[TimelineEvent]:
    """获取里程碑事件"""
    return (
        db.query(TimelineEvent)
        .filter(TimelineEvent.event_type == 'milestone', TimelineEvent.is_active == True)
        .order_by(TimelineEvent.event_date.desc(), TimelineEvent.sort_order.asc())
        .limit(limit)
        .all()
    )


def get_achievement_events(db: Session, limit: int = 10) -> List[TimelineEvent]:
    """获取成就事件"""
    return (
        db.query(TimelineEvent)
        .filter(TimelineEvent.event_type == 'achievement', TimelineEvent.is_active == True)
        .order_by(TimelineEvent.event_date.desc(), TimelineEvent.sort_order.asc())
        .limit(limit)
        .all()
    )