from typing import List, Optional
import uuid
from uuid import UUID
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionCreate


def get_subscription(db: Session, subscription_id: UUID) -> Optional[Subscription]:
    """获取单个订阅"""
    return db.query(Subscription).filter(Subscription.id == subscription_id).first()


def get_subscription_by_email(db: Session, email: str) -> Optional[Subscription]:
    """通过邮箱获取订阅"""
    return db.query(Subscription).filter(Subscription.email == email).first()


def get_subscriptions(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    is_active: Optional[bool] = True,
    is_verified: Optional[bool] = None
) -> List[Subscription]:
    """获取订阅列表"""
    query = db.query(Subscription)
    
    if is_active is not None:
        query = query.filter(Subscription.is_active == is_active)
    
    if is_verified is not None:
        query = query.filter(Subscription.is_verified == is_verified)
    
    return query.offset(skip).limit(limit).all()


def create_subscription(db: Session, subscription: SubscriptionCreate) -> Subscription:
    """创建新订阅"""
    # 检查是否已存在相同的邮箱订阅
    existing = get_subscription_by_email(db, subscription.email)
    if existing:
        # 如果已存在但已被取消订阅，则重新激活
        if not existing.is_active:
            existing.is_active = True
            existing.is_verified = False  # 需要重新验证
            existing.verification_token = str(uuid.uuid4())
            existing.subscribed_at = func.now()
            existing.unsubscribed_at = None
            db.commit()
            db.refresh(existing)
            return existing
        else:
            # 如果已经是活跃订阅，直接返回
            return existing
    
    # 创建新的订阅记录
    verification_token = str(uuid.uuid4())
    db_subscription = Subscription(
        **subscription.model_dump(),
        verification_token=verification_token
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription


def update_subscription(db: Session, subscription_id: UUID, **kwargs) -> Optional[Subscription]:
    """更新订阅信息"""
    db_subscription = get_subscription(db, subscription_id)
    if db_subscription:
        for field, value in kwargs.items():
            setattr(db_subscription, field, value)
        db.commit()
        db.refresh(db_subscription)
    return db_subscription


def delete_subscription(db: Session, subscription_id: UUID) -> bool:
    """删除订阅（硬删除）"""
    db_subscription = get_subscription(db, subscription_id)
    if db_subscription:
        db.delete(db_subscription)
        db.commit()
        return True
    return False


def deactivate_subscription(db: Session, subscription_id: UUID) -> bool:
    """取消订阅（软删除，设置为非活跃）"""
    db_subscription = get_subscription(db, subscription_id)
    if db_subscription and db_subscription.is_active:
        db_subscription.is_active = False
        db_subscription.unsubscribed_at = func.now()
        db.commit()
        db.refresh(db_subscription)
        return True
    return False


def deactivate_subscription_by_email(db: Session, email: str) -> bool:
    """通过邮箱取消订阅"""
    db_subscription = get_subscription_by_email(db, email)
    if db_subscription and db_subscription.is_active:
        db_subscription.is_active = False
        db_subscription.unsubscribed_at = func.now()
        db.commit()
        db.refresh(db_subscription)
        return True
    return False


def verify_subscription(db: Session, token: str) -> bool:
    """验证订阅（通过验证令牌）"""
    db_subscription = db.query(Subscription).filter(
        Subscription.verification_token == token
    ).first()
    
    if db_subscription and not db_subscription.is_verified:
        db_subscription.is_verified = True
        db_subscription.verified_at = func.now()
        db.commit()
        db.refresh(db_subscription)
        return True
    return False


def get_active_subscriptions(db: Session, skip: int = 0, limit: int = 100) -> List[Subscription]:
    """获取所有活跃的订阅"""
    return (
        db.query(Subscription)
        .filter(Subscription.is_active == True, Subscription.is_verified == True)
        .offset(skip).limit(limit)
        .all()
    )


def get_unverified_subscriptions(db: Session, skip: int = 0, limit: int = 100) -> List[Subscription]:
    """获取未验证的订阅"""
    return (
        db.query(Subscription)
        .filter(Subscription.is_active == True, Subscription.is_verified == False)
        .offset(skip).limit(limit)
        .all()
    )


def get_subscribers_count(db: Session) -> int:
    """获取订阅者总数"""
    return db.query(Subscription).count()
