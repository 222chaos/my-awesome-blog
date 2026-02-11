"""
Memory Schemas
记忆管理相关的请求和响应 Schema
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class MemoryBase(BaseModel):
    """
    记忆基础 Schema
    """
    memory_type: str = Field(..., description="记忆类型: fact, preference, behavior, skill")
    content: str = Field(..., min_length=1, max_length=2000, description="记忆内容")
    importance: float = Field(default=0.5, ge=0.0, le=1.0, description="重要性评分")
    expires_at: Optional[datetime] = Field(None, description="过期时间")


class MemoryCreate(MemoryBase):
    """
    创建记忆 Schema
    """
    pass


class MemoryUpdate(BaseModel):
    """
    更新记忆 Schema
    """
    memory_type: Optional[str] = Field(None, description="记忆类型")
    content: Optional[str] = Field(None, min_length=1, max_length=2000)
    importance: Optional[float] = Field(None, ge=0.0, le=1.0)
    expires_at: Optional[datetime] = None


class MemoryInDBBase(MemoryBase):
    """
    数据库中的记忆基础 Schema
    """
    id: str
    tenant_id: str
    user_id: str
    access_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class Memory(MemoryInDBBase):
    """
    完整记忆 Schema
    """
    pass


class MemoryListResponse(BaseModel):
    """
    记忆列表响应
    """
    memories: List[Memory]
    total: int
    page: int
    page_size: int


class MemorySearchRequest(BaseModel):
    """
    记忆搜索请求
    """
    query: str = Field(..., min_length=1, description="搜索查询")
    memory_type: Optional[str] = Field(None, description="记忆类型筛选")
    min_importance: Optional[float] = Field(None, ge=0.0, le=1.0, description="最小重要性")
    top_k: int = Field(default=10, ge=1, le=50, description="返回数量")


class MemorySearchResponse(BaseModel):
    """
    记忆搜索响应
    """
    memories: List[Dict[str, Any]]
    query: str
    total: int


class MemoryStats(BaseModel):
    """
    记忆统计
    """
    total: int
    by_type: Dict[str, int]
    avg_importance: float
    total_access_count: int


class MemoryBatchCreate(BaseModel):
    """
    批量创建记忆
    """
    memories: List[MemoryCreate]
