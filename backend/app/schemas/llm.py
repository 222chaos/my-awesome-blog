"""
LLM API Schemas
用于 LLM 相关的请求和响应
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.llm.base import ChatMessage, Usage


class LLMMessage(BaseModel):
    """
    LLM 消息 Schema
    """
    role: str = Field(..., description="角色: system, user, assistant")
    content: str = Field(..., description="消息内容")

    class Config:
        from_attributes = True


class LLMChatRequest(BaseModel):
    """
    LLM 聊天请求 Schema
    """
    messages: List[LLMMessage] = Field(..., description="消息列表", min_length=1)
    provider: Optional[str] = Field(default=None, description="提供商: deepseek, glm, qwen")
    model: Optional[str] = Field(default=None, description="模型名称，不指定则使用默认模型")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0, description="温度参数，控制随机性")
    max_tokens: Optional[int] = Field(default=None, description="最大生成token数")
    top_p: float = Field(default=1.0, ge=0.0, le=1.0, description="核采样参数")

    class Config:
        from_attributes = True


class LLMMessageResponse(BaseModel):
    """
    LLM 消息响应 Schema
    """
    role: str = Field(..., description="角色")
    content: str = Field(..., description="消息内容")

    class Config:
        from_attributes = True


class LLMUsage(BaseModel):
    """
    Token 使用情况 Schema
    """
    prompt_tokens: int = Field(..., description="提示词token数")
    completion_tokens: int = Field(..., description="补全token数")
    total_tokens: int = Field(..., description="总token数")

    class Config:
        from_attributes = True


class LLMChatResponse(BaseModel):
    """
    LLM 聊天响应 Schema
    """
    message: LLMMessageResponse = Field(..., description="助手回复消息")
    model: str = Field(..., description="使用的模型名称")
    provider: str = Field(..., description="使用的提供商名称")
    usage: Optional[LLMUsage] = Field(default=None, description="token使用情况")

    class Config:
        from_attributes = True


class LLMModelInfo(BaseModel):
    """
    LLM 模型信息 Schema
    """
    provider: str = Field(..., description="提供商名称")
    name: str = Field(..., description="模型名称")
    display_name: str = Field(..., description="显示名称")
    is_available: bool = Field(..., description="是否可用")

    class Config:
        from_attributes = True


class LLMModelsResponse(BaseModel):
    """
    可用 LLM 模型列表响应 Schema
    """
    models: List[LLMModelInfo] = Field(..., description="可用模型列表")
    default_provider: str = Field(..., description="默认提供商")

    class Config:
        from_attributes = True
