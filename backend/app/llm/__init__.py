"""
LLM Module - 多大模型提供商支持
"""

from .base import LLMProvider, ChatMessage, ChatCompletionRequest, ChatCompletionResponse, Usage, ChatStreamChunk
from .provider_factory import LLMProviderFactory, get_llm_provider
from .deepseek_provider import DeepSeekProvider
from .glm_provider import GLMProvider
from .qwen_provider import QwenProvider


LLMProviderFactory.register('deepseek', DeepSeekProvider)
LLMProviderFactory.register('glm', GLMProvider)
LLMProviderFactory.register('qwen', QwenProvider)

__all__ = [
    'LLMProvider',
    'ChatMessage',
    'ChatCompletionRequest',
    'ChatCompletionResponse',
    'Usage',
    'ChatStreamChunk',
    'LLMProviderFactory',
    'get_llm_provider',
    'DeepSeekProvider',
    'GLMProvider',
    'QwenProvider',
]
