"""
LLM 抽象基类定义
"""

from abc import ABC, abstractmethod
from typing import List, Optional, AsyncIterator
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """
    聊天消息模型
    """
    role: str = Field(..., description="角色: system, user, assistant")
    content: str = Field(..., description="消息内容")

    class Config:
        from_attributes = True


class ChatCompletionRequest(BaseModel):
    """
    聊天补全请求模型
    """
    messages: List[ChatMessage] = Field(..., description="消息列表")
    model: Optional[str] = Field(default=None, description="模型名称，不指定则使用默认模型")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0, description="温度参数，控制随机性")
    max_tokens: Optional[int] = Field(default=None, description="最大生成token数")
    top_p: float = Field(default=1.0, ge=0.0, le=1.0, description="核采样参数")
    stream: bool = Field(default=False, description="是否启用流式响应")


class ChatCompletionResponse(BaseModel):
    """
    聊天补全响应模型
    """
    message: ChatMessage = Field(..., description="助手回复消息")
    model: str = Field(..., description="使用的模型名称")
    usage: Optional['Usage'] = Field(default=None, description="token使用情况")


class Usage(BaseModel):
    """
    Token使用情况
    """
    prompt_tokens: int = Field(..., description="提示词token数")
    completion_tokens: int = Field(..., description="补全token数")
    total_tokens: int = Field(..., description="总token数")


class ChatStreamChunk(BaseModel):
    """
    流式响应数据块
    """
    content: str = Field(..., description="增量内容")
    finish_reason: Optional[str] = Field(default=None, description="结束原因")


class LLMProvider(ABC):
    """
    LLM提供商抽象基类
    所有具体的LLM提供商都需要实现此接口
    """

    def __init__(self, api_key: str, base_url: str, model: str):
        self.api_key = api_key
        self.base_url = base_url
        self.model = model

    @abstractmethod
    async def chat(self, request: ChatCompletionRequest) -> ChatCompletionResponse:
        """
        同步聊天接口

        Args:
            request: 聊天请求

        Returns:
            ChatCompletionResponse: 聊天响应
        """
        pass

    @abstractmethod
    async def stream_chat(
        self,
        request: ChatCompletionRequest
    ) -> AsyncIterator[ChatStreamChunk]:
        """
        流式聊天接口

        Args:
            request: 聊天请求

        Yields:
            ChatStreamChunk: 流式响应数据块
        """
        pass

    @abstractmethod
    def get_model_name(self) -> str:
        """
        获取当前使用的模型名称

        Returns:
            str: 模型名称
        """
        pass

    @abstractmethod
    def get_provider_name(self) -> str:
        """
        获取提供商名称

        Returns:
            str: 提供商名称
        """
        pass
