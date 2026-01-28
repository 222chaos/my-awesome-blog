from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.logs.audit_log import AuditLog
from app.schemas.audit_log import AuditLogCreate
import json


def create_audit_log(
    db: Session,
    user_id: Optional[UUID],
    action: str,
    resource_type: str,
    resource_id: Optional[str],
    old_values: Optional[dict] = None,
    new_values: Optional[dict] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> AuditLog:
    """
    创建审计日志记录
    """
    # 序列化字典为JSON字符串
    old_values_json = json.dumps(old_values) if old_values else None
    new_values_json = json.dumps(new_values) if new_values else None

    db_audit_log = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        old_values=old_values_json,
        new_values=new_values_json,
        ip_address=ip_address,
        user_agent=user_agent
    )

    db.add(db_audit_log)
    db.commit()
    db.refresh(db_audit_log)
    return db_audit_log


def get_audit_log(db: Session, audit_log_id: UUID) -> Optional[AuditLog]:
    """
    获取单个审计日志记录
    """
    return db.query(AuditLog).filter(AuditLog.id == audit_log_id).first()


def get_audit_logs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[UUID] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None
):
    """
    获取审计日志列表
    """
    query = db.query(AuditLog)

    if user_id:
        query = query.filter(AuditLog.user_id == user_id)

    if action:
        query = query.filter(AuditLog.action == action)

    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)

    return query.order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()


def get_audit_logs_by_user(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    """
    获取特定用户的审计日志
    """
    return (
        db.query(AuditLog)
        .filter(AuditLog.user_id == user_id)
        .order_by(AuditLog.timestamp.desc())
        .offset(skip).limit(limit)
        .all()
    )


def get_audit_logs_by_action(db: Session, action: str, skip: int = 0, limit: int = 100):
    """
    获取特定操作类型的审计日志
    """
    return (
        db.query(AuditLog)
        .filter(AuditLog.action == action)
        .order_by(AuditLog.timestamp.desc())
        .offset(skip).limit(limit)
        .all()
    )