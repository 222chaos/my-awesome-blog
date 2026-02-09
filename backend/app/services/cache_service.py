import redis.asyncio as redis
import json
import pickle
from typing import Any, Optional, Union, Dict, List
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

    async def mget(self, keys: List[str]) -> List[Optional[Any]]:
        """
        批量获取多个缓存值
        :param keys: 键列表
        :return: 值列表
        """
        try:
            values = await self.redis.mget(keys)
            result = []
            for value in values:
                if value is not None:
                    result.append(pickle.loads(value))
                else:
                    result.append(None)
            return result
        except Exception as e:
            app_logger.error(f"Failed to get multiple cache values: {e}")
            return [None] * len(keys)

    async def mset(self, mapping: Dict[str, Any], expire: Optional[int] = 3600) -> bool:
        """
        批量设置多个缓存值
        :param mapping: 键值对映射
        :param expire: 过期时间（秒）
        :return: 是否设置成功
        """
        try:
            serialized_mapping = {}
            for key, value in mapping.items():
                serialized_mapping[key] = pickle.dumps(value)

            # 先执行批量设置
            result = await self.redis.mset(serialized_mapping)

            # 然后为每个键单独设置过期时间
            for key in mapping.keys():
                await self.redis.expire(key, expire)

            return result is not None
        except Exception as e:
            app_logger.error(f"Failed to set multiple cache values: {e}")
            return False

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

    async def delete_pattern(self, pattern: str, batch_size: int = 100) -> int:
        """
        根据模式删除多个缓存键（使用SCAN渐进式删除，避免KEYS命令阻塞Redis）
        :param pattern: 键模式，例如 "user:*" 或 "article:*"
        :param batch_size: 每批扫描的键数量，默认100
        :return: 删除的键的数量
        """
        try:
            deleted_count = 0
            cursor = 0

            # 使用SCAN渐进式扫描，避免KEYS命令阻塞Redis服务器
            while True:
                cursor, keys = await self.redis.scan(
                    cursor=cursor,
                    match=pattern,
                    count=batch_size
                )

                if keys:
                    # 批量删除当前批次的键
                    deleted_count += await self.redis.delete(*keys)

                # cursor为0表示扫描完成
                if cursor == 0:
                    break

            return deleted_count
        except Exception as e:
            app_logger.error(f"Failed to delete cache by pattern: {e}")
            return 0

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

    async def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """
        原子性地增加缓存值
        :param key: 键
        :param amount: 增加的数量
        :return: 新的值
        """
        try:
            result = await self.redis.incrby(key, amount)
            return result
        except Exception as e:
            app_logger.error(f"Failed to increment cache value: {e}")
            return None

    async def decrement(self, key: str, amount: int = 1) -> Optional[int]:
        """
        原子性地减少缓存值
        :param key: 键
        :param amount: 减少的数量
        :return: 新的值
        """
        try:
            result = await self.redis.decrby(key, amount)
            return result
        except Exception as e:
            app_logger.error(f"Failed to decrement cache value: {e}")
            return None

    async def set_with_compression(self, key: str, value: Any, expire: Optional[int] = 3600) -> bool:
        """
        设置缓存值，对于大对象自动压缩
        :param key: 键
        :param value: 值
        :param expire: 过期时间（秒）
        :return: 是否设置成功
        """
        try:
            import zlib
            serialized_value = pickle.dumps(value)

            # 如果序列化后的数据大于1KB，则进行压缩
            if len(serialized_value) > 1024:
                compressed_value = zlib.compress(serialized_value)
                # 在值前面加上标识表示这是压缩过的数据
                stored_value = b'COMPRESSED:' + compressed_value
            else:
                stored_value = serialized_value

            result = await self.redis.set(key, stored_value, ex=expire)
            return result is not None
        except Exception as e:
            app_logger.error(f"Failed to set compressed cache: {e}")
            return False

    async def get_with_decompression(self, key: str) -> Optional[Any]:
        """
        获取缓存值，自动解压压缩过的数据
        :param key: 键
        :return: 缓存的值，如果不存在则返回None
        """
        try:
            value = await self.redis.get(key)
            if value is not None:
                # 检查是否是压缩过的数据
                if value.startswith(b'COMPRESSED:'):
                    import zlib
                    compressed_data = value[11:]  # 移除 'COMPRESSED:' 前缀
                    decompressed_data = zlib.decompress(compressed_data)
                    return pickle.loads(decompressed_data)
                else:
                    return pickle.loads(value)
            return None
        except Exception as e:
            app_logger.error(f"Failed to get decompressed cache: {e}")
            return None


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


async def cache_get_or_set_compressed(
    key: str,
    fetch_func,
    expire: Optional[int] = 3600,
    *args,
    **kwargs
) -> Any:
    """
    获取缓存值，如果不存在则调用fetch_func获取并存储到缓存（带压缩）
    :param key: 缓存键
    :param fetch_func: 获取数据的函数
    :param expire: 过期时间（秒）
    :param args: 传递给fetch_func的位置参数
    :param kwargs: 传递给fetch_func的关键字参数
    :return: 数据
    """
    # 尝试从缓存获取
    cached_value = await cache_service.get_with_decompression(key)
    if cached_value is not None:
        return cached_value

    # 如果缓存不存在，调用fetch_func获取数据
    value = await fetch_func(*args, **kwargs)

    # 存储到缓存（带压缩）
    await cache_service.set_with_compression(key, value, expire)

    return value