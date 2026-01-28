from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


# Base schema
class AuditLogBase(BaseModel):
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    old_values: Optional[str] = None  # JSON string
    new_values: Optional[str] = None  # JSON string
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


# Schema for creating audit logs
class AuditLogCreate(AuditLogBase):
    user_id: Optional[UUID] = None


# Schema for updating audit logs (typically not needed for audit logs)
class AuditLogUpdate(BaseModel):
    pass


# Schema for response with additional fields
class AuditLogInDBBase(AuditLogBase):
    id: UUID
    user_id: Optional[UUID] = None
    timestamp: datetime

    class Config:
        from_attributes = True


# Main response schema
class AuditLog(AuditLogInDBBase):
    pass


# Schema with user relationship
class AuditLogWithUser(AuditLog):
    # Avoid circular import by using string reference
    user: Optional["User"] = None


# Import User here to avoid circular import
from app.schemas.user import User
AuditLogWithUser.update_forward_refs()