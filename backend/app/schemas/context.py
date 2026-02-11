"""
Context Schemas
上下文管理相关的请求和响应 Schema
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ContextSummary(BaseModel):
    """
    上下文摘要
    """
    id: str
    conversation_id: str
    message_count: int
    total_tokens: int
    summary: Optional[str] = None
    key_points: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ContextWindow(BaseModel):
    """
    上下文窗口
    """
    conversation_id: str
    messages: List[Dict[str, Any]]
    total_tokens: int
    max_tokens: int
    is_truncated: bool = False
    
    class Config:
        from_attributes = True


class ContextConfig(BaseModel):
    """
    上下文配置
    """
    max_tokens: int = Field(default=4096, ge=512, le=128000, description="最大 Token 数")
    max_messages: int = Field(default=50, ge=1, le=200, description="最大消息数")
    auto_summarize: bool = Field(default=True, description="是否自动摘要")
    summarize_threshold: int = Field(default=3000, ge=1000, description="摘要触发阈值")
    keep_last_messages: int = Field(default=10, ge=0, le=50, description="保留最后 N 条消息")


class ContextRequest(BaseModel):
    """
    上下文请求
    """
    conversation_id: str
    config: Optional[ContextConfig] = None


class ContextResponse(BaseModel):
    """
    上下文响应
    """
    window: ContextWindow
    summaries: List[ContextSummary]
    metadata: Dict[str, Any] = Field(default_factory=dict)


class KeyPointExtraction(BaseModel):
    """
    关键点提取
    """
    content: str
    key_points: List[str]
    topics: List[str]
    sentiment: Optional[str] = None


class ContextSummaryRequest(BaseModel):
    """
    上下文摘要请求
    """
    conversation_id: str
    force: bool = Field(default=False, description="是否强制重新摘要")


class ContextSummaryResponse(BaseModel):
    """
    上下文摘要响应
    """
    summary: str
    key_points: List[str]
    message_count: int
    token_count: int
    created_at: datetime
