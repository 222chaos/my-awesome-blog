"""
Tenant Schemas
租户管理相关的请求和响应 Schema
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class TenantBase(BaseModel):
    """
    租户基础 Schema
    """
    name: str = Field(..., min_length=1, max_length=100, description="租户名称")
    slug: str = Field(..., min_length=1, max_length=50, description="租户标识")
    description: Optional[str] = Field(None, max_length=500, description="描述")
    max_users: int = Field(default=100, ge=1, description="最大用户数")
    max_conversations: int = Field(default=1000, ge=1, description="最大对话数")
    max_storage_mb: int = Field(default=1024, ge=100, description="最大存储空间（MB）")


class TenantCreate(TenantBase):
    """
    创建租户 Schema
    """
    pass


class TenantUpdate(BaseModel):
    """
    更新租户 Schema
    """
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None
    max_users: Optional[int] = Field(None, ge=1)
    max_conversations: Optional[int] = Field(None, ge=1)
    max_storage_mb: Optional[int] = Field(None, ge=100)


class TenantInDBBase(TenantBase):
    """
    数据库中的租户基础 Schema
    """
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class Tenant(TenantInDBBase):
    """
    完整租户 Schema
    """
    user_count: int = 0
    conversation_count: int = 0
    storage_used_mb: float = 0.0


class TenantListResponse(BaseModel):
    """
    租户列表响应
    """
    tenants: List[Tenant]
    total: int
    page: int
    page_size: int


class TenantUsageStats(BaseModel):
    """
    租户使用统计
    """
    tenant_id: str
    user_count: int
    conversation_count: int
    message_count: int
    memory_count: int
    storage_used_mb: float
    storage_percentage: float


class TenantConfig(BaseModel):
    """
    租户配置
    """
    tenant_id: str
    config: dict
