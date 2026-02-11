"""
LangChain LLM Adapter
将现有 LLM 提供商适配为 LangChain 兼容的 ChatModel
"""

from typing import Optional, List, Dict, Any, AsyncIterator
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage, SystemMessage
from langchain_core.outputs import ChatResult, ChatGeneration
from langchain_core.callbacks.manager import CallbackManagerForLLMRun
from langchain_core.callbacks.base import Callbacks
from pydantic import Field, PrivateAttr
from app.llm import get_llm_provider, LLMProvider, ChatCompletionRequest, ChatStreamChunk
from app.utils.logger import app_logger


class LangChainLLMAdapter(BaseChatModel):
    """
    LangChain 兼容的 LLM 适配器
    
    将现有自定义 LLM 提供商包装为 LangChain 的 BaseChatModel
    支持同步和异步调用、流式响应
    """
    
    provider_name: str = Field(..., description="提供商名称")
    _provider: Optional[LLMProvider] = PrivateAttr(default=None)
    
    class Config:
        arbitrary_types_allowed = True
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._provider = get_llm_provider(self.provider_name)
        if self._provider is None:
            app_logger.warning(f"LLM provider {self.provider_name} not configured")
    
    @property
    def _llm_type(self) -> str:
        return f"langchain-{self.provider_name}"
    
    @property
    def _identifying_params(self) -> Dict[str, Any]:
        return {
            "provider": self.provider_name,
            "model": self._provider.get_model_name() if self._provider else "",
        }
    
    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> ChatResult:
        """
        同步生成响应
        
        Args:
            messages: LangChain 消息列表
            stop: 停止词列表
            run_manager: 回调管理器
            **kwargs: 额外参数
        
        Returns:
            ChatResult: LangChain 聊天结果
        """
        import asyncio
        return asyncio.run(self._agenerate(messages, stop, run_manager, **kwargs))
    
    async def _agenerate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> ChatResult:
        """
        异步生成响应
        
        Args:
            messages: LangChain 消息列表
            stop: 停止词列表
            run_manager: 回调管理器
            **kwargs: 额外参数
        
        Returns:
            ChatResult: LangChain 聊天结果
        """
        if self._provider is None:
            raise ValueError(f"LLM provider {self.provider_name} is not configured")
        
        chat_messages = self._convert_langchain_messages(messages)
        
        chat_request = ChatCompletionRequest(
            messages=chat_messages,
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens"),
            top_p=kwargs.get("top_p", 1.0),
            stream=False,
        )
        
        response = await self._provider.chat(chat_request)
        
        ai_message = AIMessage(content=response.message.content)
        
        generation = ChatGeneration(
            message=ai_message,
            generation_info={
                "provider": self.provider_name,
                "model": response.model,
            }
        )
        
        if response.usage:
            generation.generation_info.update({
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            })
        
        return ChatResult(generations=[generation])
    
    def _convert_langchain_messages(self, messages: List[BaseMessage]) -> List[Any]:
        """
        将 LangChain 消息转换为 LLM 提供商消息格式
        """
        from app.llm.base import ChatMessage
        
        converted = []
        for msg in messages:
            if isinstance(msg, SystemMessage):
                converted.append(ChatMessage(role="system", content=msg.content))
            elif isinstance(msg, HumanMessage):
                converted.append(ChatMessage(role="user", content=msg.content))
            elif isinstance(msg, AIMessage):
                converted.append(ChatMessage(role="assistant", content=msg.content))
            else:
                converted.append(ChatMessage(role=msg.type, content=msg.content))
        return converted
    
    async def _astream(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> AsyncIterator[ChatResult]:
        """
        异步流式生成响应
        
        Args:
            messages: LangChain 消息列表
            stop: 停止词列表
            run_manager: 回调管理器
            **kwargs: 额外参数
        
        Yields:
            ChatResult: 包含增量内容的 ChatResult
        """
        if self._provider is None:
            raise ValueError(f"LLM provider {self.provider_name} is not configured")
        
        chat_messages = self._convert_langchain_messages(messages)
        
        chat_request = ChatCompletionRequest(
            messages=chat_messages,
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens"),
            top_p=kwargs.get("top_p", 1.0),
            stream=True,
        )
        
        accumulated_content = ""
        async for chunk in self._provider.stream_chat(chat_request):
            if chunk.content:
                accumulated_content += chunk.content
                ai_message = AIMessage(content=accumulated_content)
                generation = ChatGeneration(
                    message=ai_message,
                    generation_info={
                        "provider": self.provider_name,
                        "is_stream": True,
                    }
                )
                yield ChatResult(generations=[generation])
            
            if chunk.finish_reason:
                break
    
    @property
    def lc_secrets(self) -> Dict[str, str]:
        return {"api_key": "***"}


def create_langchain_provider(provider_name: str) -> Optional[LangChainLLMAdapter]:
    """
    创建 LangChain 兼容的 LLM 提供商
    
    Args:
        provider_name: 提供商名称
    
    Returns:
        LangChainLLMAdapter: LangChain 适配器实例
    """
    provider = get_llm_provider(provider_name)
    if provider is None:
        return None
    
    return LangChainLLMAdapter(
        provider_name=provider_name,
        model=provider.get_model_name(),
    )


def get_langchain_model(provider_name: Optional[str] = None) -> Optional[LangChainLLMAdapter]:
    """
    获取 LangChain 模型实例
    
    Args:
        provider_name: 提供商名称，不指定则使用默认
    
    Returns:
        LangChainLLMAdapter: LangChain 适配器实例
    """
    if provider_name is None:
        from app.core.config import settings
        provider_name = settings.LLM_DEFAULT_MODEL.lower()
        if "deepseek" in provider_name:
            provider_name = "deepseek"
        elif "glm" in provider_name:
            provider_name = "glm"
        elif "qwen" in provider_name:
            provider_name = "qwen"
    
    return create_langchain_provider(provider_name)
