"""
LangChain Core Module
LangChain 核心模块，提供与现有 LLM 提供商的适配器
"""

from .llm_adapter import (
    LangChainLLMAdapter,
    create_langchain_provider,
    get_langchain_model
)

__all__ = [
    'LangChainLLMAdapter',
    'create_langchain_provider',
    'get_langchain_model',
]
