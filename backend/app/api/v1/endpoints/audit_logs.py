from typing import Any, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_superuser
from app import crud
from app.models.user import User
from app.schemas.audit_log import AuditLogWithUser

router = APIRouter()


@router.get("/", response_model=List[AuditLogWithUser])
def read_audit_logs(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    user_id: str = Query(None, description="Filter by user ID"),
    action: str = Query(None, description="Filter by action type"),
    resource_type: str = Query(None, description="Filter by resource type"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)  # Only superusers can view audit logs
) -> Any:
    """
    Retrieve audit logs with optional filters.
    """
    from uuid import UUID
    user_uuid = UUID(user_id) if user_id else None
    
    audit_logs = crud.get_audit_logs(
        db,
        skip=skip,
        limit=limit,
        user_id=user_uuid,
        action=action,
        resource_type=resource_type
    )
    
    return audit_logs


@router.get("/user/{user_id}", response_model=List[AuditLogWithUser])
def read_audit_logs_by_user(
    user_id: str,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)  # Only superusers can view audit logs
) -> Any:
    """
    Retrieve audit logs for a specific user.
    """
    from uuid import UUID
    user_uuid = UUID(user_id)
    
    audit_logs = crud.get_audit_logs_by_user(
        db,
        user_id=user_uuid,
        skip=skip,
        limit=limit
    )
    
    return audit_logs


@router.get("/action/{action}", response_model=List[AuditLogWithUser])
def read_audit_logs_by_action(
    action: str,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)  # Only superusers can view audit logs
) -> Any:
    """
    Retrieve audit logs for a specific action type.
    """
    audit_logs = crud.get_audit_logs_by_action(
        db,
        action=action,
        skip=skip,
        limit=limit
    )
    
    return audit_logs