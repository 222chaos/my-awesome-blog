import redis.asyncio as redis
import json
import pickle
from typing import Any, Optional, Union
from app.core.config import settings
from app.utils.logger import app_logger


class CacheService:
    """
    Redis缓存服务类
    """
    
    def __init__(self):
        self.redis = None
        
    async def connect(self):
        """
        连接到Redis服务器
        """
        try:
            self.redis = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                password=settings.REDIS_PASSWORD,
                db=settings.REDIS_DB,
                decode_responses=False,  # We'll handle serialization manually
                encoding="utf-8",
            )
            app_logger.info("Connected to Redis successfully")
        except Exception as e:
            app_logger.error(f"Failed to connect to Redis: {e}")
            raise
    
    async def close(self):
        """
        关闭Redis连接
        """
        if self.redis:
            await self.redis.aclose()
            
    async def set(
        self, 
        key: str, 
        value: Any, 
        expire: Optional[int] = 3600
    ) -> bool:
        """
        设置缓存值
        :param key: 键
        :param value: 值
        :param expire: 过期时间（秒）
        :return: 是否设置成功
        """
        try:
            # 序列化值
            serialized_value = pickle.dumps(value)
            result = await self.redis.set(key, serialized_value, ex=expire)
            return result is not None
        except Exception as e:
            app_logger.error(f"Failed to set cache: {e}")
            return False
    
    async def get(self, key: str) -> Optional[Any]:
        """
        获取缓存值
        :param key: 键
        :return: 缓存的值，如果不存在则返回None
        """
        try:
            value = await self.redis.get(key)
            if value is not None:
                # 反序列化值
                return pickle.loads(value)
            return None
        except Exception as e:
            app_logger.error(f"Failed to get cache: {e}")
            return None
    
    async def delete(self, key: str) -> bool:
        """
        删除缓存值
        :param key: 键
        :return: 是否删除成功
        """
        try:
            result = await self.redis.delete(key)
            return result > 0
        except Exception as e:
            app_logger.error(f"Failed to delete cache: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """
        检查缓存键是否存在
        :param key: 键
        :return: 是否存在
        """
        try:
            result = await self.redis.exists(key)
            return result > 0
        except Exception as e:
            app_logger.error(f"Failed to check cache existence: {e}")
            return False
    
    async def flush_all(self) -> bool:
        """
        清空所有缓存
        :return: 是否清空成功
        """
        try:
            await self.redis.flushall()
            return True
        except Exception as e:
            app_logger.error(f"Failed to flush cache: {e}")
            return False


# 全局缓存服务实例
cache_service = CacheService()


# 便捷函数
async def cache_get_or_set(
    key: str, 
    fetch_func, 
    expire: Optional[int] = 3600,
    *args, 
    **kwargs
) -> Any:
    """
    获取缓存值，如果不存在则调用fetch_func获取并存储到缓存
    :param key: 缓存键
    :param fetch_func: 获取数据的函数
    :param expire: 过期时间（秒）
    :param args: 传递给fetch_func的位置参数
    :param kwargs: 传递给fetch_func的关键字参数
    :return: 数据
    """
    # 尝试从缓存获取
    cached_value = await cache_service.get(key)
    if cached_value is not None:
        return cached_value
    
    # 如果缓存不存在，调用fetch_func获取数据
    value = await fetch_func(*args, **kwargs)
    
    # 存储到缓存
    await cache_service.set(key, value, expire)
    
    return value