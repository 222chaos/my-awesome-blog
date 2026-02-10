"""
LLM Provider 工厂类
根据配置创建对应的LLM提供商实例
"""

from typing import Optional, Dict, Type
from app.core.config import settings
from app.utils.logger import app_logger
from .base import LLMProvider


class LLMProviderFactory:
    """
    LLM提供商工厂类
    负责创建和管理LLM提供商实例
    """

    _providers: Dict[str, Type[LLMProvider]] = {}
    _instances: Dict[str, LLMProvider] = {}

    @classmethod
    def register(cls, provider_name: str, provider_class: Type[LLMProvider]):
        """
        注册LLM提供商

        Args:
            provider_name: 提供商名称
            provider_class: 提供商类
        """
        cls._providers[provider_name.lower()] = provider_class
        app_logger.info(f"Registered LLM provider: {provider_name}")

    @classmethod
    def create(cls, provider_name: str) -> Optional[LLMProvider]:
        """
        创建LLM提供商实例

        Args:
            provider_name: 提供商名称

        Returns:
            LLMProvider: LLM提供商实例
        """
        provider_key = provider_name.lower()

        if provider_key not in cls._providers:
            app_logger.error(f"Unknown LLM provider: {provider_name}")
            return None

        if provider_key in cls._instances:
            return cls._instances[provider_key]

        provider_class = cls._providers[provider_key]
        api_key, base_url, model = cls._get_provider_config(provider_key)

        if not api_key:
            app_logger.warning(f"API key not set for provider: {provider_name}")
            return None

        instance = provider_class(api_key=api_key, base_url=base_url, model=model)
        cls._instances[provider_key] = instance
        app_logger.info(f"Created LLM provider instance: {provider_name}")
        return instance

    @classmethod
    def _get_provider_config(cls, provider_name: str) -> tuple:
        """
        根据提供商名称获取配置

        Args:
            provider_name: 提供商名称

        Returns:
            tuple: (api_key, base_url, model)
        """
        configs = {
            'deepseek': (
                settings.DEEPSEEK_API_KEY,
                settings.DEEPSEEK_BASE_URL,
                settings.DEEPSEEK_MODEL
            ),
            'glm': (
                settings.GLM_API_KEY,
                settings.GLM_BASE_URL,
                settings.GLM_MODEL
            ),
            'qwen': (
                settings.QWEN_API_KEY,
                settings.QWEN_BASE_URL,
                settings.QWEN_MODEL
            ),
        }
        return configs.get(provider_name, ('', '', ''))

    @classmethod
    def get_default_provider(cls) -> Optional[LLMProvider]:
        """
        获取默认的LLM提供商

        Returns:
            LLMProvider: 默认LLM提供商实例
        """
        default_model = settings.LLM_DEFAULT_MODEL.lower()

        if 'deepseek' in default_model:
            return cls.create('deepseek')
        elif 'glm' in default_model:
            return cls.create('glm')
        elif 'qwen' in default_model:
            return cls.create('qwen')
        else:
            return cls.create(default_model)

    @classmethod
    def list_providers(cls) -> list:
        """
        获取所有已注册的提供商列表

        Returns:
            list: 提供商名称列表
        """
        return list(cls._providers.keys())

    @classmethod
    def clear_instances(cls):
        """
        清除所有缓存的实例
        """
        cls._instances.clear()
        app_logger.info("Cleared all LLM provider instances")


def get_llm_provider(provider_name: Optional[str] = None) -> Optional[LLMProvider]:
    """
    便捷函数：获取LLM提供商实例

    Args:
        provider_name: 提供商名称，不指定则使用默认

    Returns:
        LLMProvider: LLM提供商实例
    """
    if provider_name is None:
        return LLMProviderFactory.get_default_provider()
    return LLMProviderFactory.create(provider_name)
