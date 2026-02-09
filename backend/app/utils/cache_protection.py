"""
缓存防护工具
提供缓存穿透、缓存击穿、缓存雪崩的防护机制
"""
import asyncio
import hashlib
import time
from typing import Any, Optional, Callable, Set
from functools import wraps

from app.services.cache_service import cache_service
from app.utils.logger import app_logger


class CacheProtection:
    """
    缓存防护类
    
    提供以下防护机制：
    1. 缓存穿透防护：使用布隆过滤器和空值缓存
    2. 缓存击穿防护：使用互斥锁
    3. 缓存雪崩防护：使用随机过期时间
    """
    
    # 布隆过滤器（简单的内存实现，生产环境建议使用 RedisBloom）
    _bloom_filter: Set[str] = set()
    
    # 互斥锁字典（用于防止缓存击穿）
    _locks: dict = {}
    _lock_lock = asyncio.Lock()
    
    @classmethod
    async def get_with_penetration_protection(
        cls,
        key: str,
        fetch_func: Callable,
        expire: int = 3600,
        null_expire: int = 60,  # 空值缓存时间（短一些）
        use_bloom_filter: bool = True,
        *args,
        **kwargs
    ) -> Any:
        """
        获取缓存值，带缓存穿透防护
        
        防护策略：
        1. 布隆过滤器：快速判断 key 是否可能存在
        2. 空值缓存：缓存查询结果为 None 的情况
        
        Args:
            key: 缓存键
            fetch_func: 从数据库获取数据的函数
            expire: 正常缓存过期时间（秒）
            null_expire: 空值缓存过期时间（秒）
            use_bloom_filter: 是否使用布隆过滤器
            
        Returns:
            缓存值或 None
        """
        # 1. 检查布隆过滤器（快速判断 key 是否可能存在）
        if use_bloom_filter and not cls._bloom_filter_check(key):
            app_logger.debug(f"Bloom filter rejected key: {key}")
            return None
        
        # 2. 检查正常缓存
        cached_value = await cache_service.get(key)
        if cached_value is not None:
            return cached_value
        
        # 3. 检查空值缓存（防止缓存穿透）
        null_key = f"null:{key}"
        if await cache_service.exists(null_key):
            app_logger.debug(f"Null cache hit for key: {key}")
            return None
        
        # 4. 查询数据库
        try:
            value = await fetch_func(*args, **kwargs)
            
            if value is not None:
                # 5a. 缓存正常值
                await cache_service.set(key, value, expire=expire)
                # 添加到布隆过滤器
                if use_bloom_filter:
                    cls._bloom_filter_add(key)
            else:
                # 5b. 缓存空值，短时间过期（防止缓存穿透）
                await cache_service.set(null_key, "1", expire=null_expire)
                app_logger.debug(f"Cached null value for key: {key}")
            
            return value
            
        except Exception as e:
            app_logger.error(f"Error fetching data for cache key {key}: {str(e)}")
            raise
    
    @classmethod
    async def get_with_breakdown_protection(
        cls,
        key: str,
        fetch_func: Callable,
        expire: int = 3600,
        lock_timeout: int = 10,  # 锁超时时间（秒）
        *args,
        **kwargs
    ) -> Any:
        """
        获取缓存值，带缓存击穿防护（使用互斥锁）
        
        当缓存失效时，只有一个请求去查询数据库，其他请求等待
        
        Args:
            key: 缓存键
            fetch_func: 从数据库获取数据的函数
            expire: 缓存过期时间（秒）
            lock_timeout: 互斥锁超时时间（秒）
            
        Returns:
            缓存值或 None
        """
        # 1. 检查缓存
        cached_value = await cache_service.get(key)
        if cached_value is not None:
            return cached_value
        
        # 2. 获取互斥锁
        lock_key = f"lock:{key}"
        
        async with cls._lock_lock:
            if key not in cls._locks:
                cls._locks[key] = asyncio.Lock()
            lock = cls._locks[key]
        
        try:
            # 尝试获取锁（非阻塞）
            if lock.locked():
                # 如果锁已被占用，等待一段时间后重试
                await asyncio.sleep(0.1)
                # 再次检查缓存（可能其他线程已经设置）
                cached_value = await cache_service.get(key)
                if cached_value is not None:
                    return cached_value
            
            # 获取锁
            async with lock:
                # 双重检查
                cached_value = await cache_service.get(key)
                if cached_value is not None:
                    return cached_value
                
                # 查询数据库
                value = await fetch_func(*args, **kwargs)
                
                if value is not None:
                    await cache_service.set(key, value, expire=expire)
                
                return value
                
        except Exception as e:
            app_logger.error(f"Error in breakdown protection for key {key}: {str(e)}")
            raise
        finally:
            # 清理锁（可选，根据具体需求）
            pass
    
    @classmethod
    async def get_with_full_protection(
        cls,
        key: str,
        fetch_func: Callable,
        expire: int = 3600,
        null_expire: int = 60,
        lock_timeout: int = 10,
        jitter: bool = True,  # 是否添加随机抖动防止雪崩
        *args,
        **kwargs
    ) -> Any:
        """
        获取缓存值，带完整防护（穿透 + 击穿 + 雪崩）
        
        Args:
            key: 缓存键
            fetch_func: 从数据库获取数据的函数
            expire: 缓存过期时间（秒）
            null_expire: 空值缓存过期时间（秒）
            lock_timeout: 互斥锁超时时间（秒）
            jitter: 是否添加随机抖动到过期时间
            
        Returns:
            缓存值或 None
        """
        # 1. 添加随机抖动防止缓存雪崩
        if jitter:
            import random
            actual_expire = expire + random.randint(0, expire // 10)  # 添加 0-10% 的随机时间
        else:
            actual_expire = expire
        
        # 2. 检查空值缓存
        null_key = f"null:{key}"
        if await cache_service.exists(null_key):
            return None
        
        # 3. 使用击穿防护获取数据
        return await cls.get_with_breakdown_protection(
            key=key,
            fetch_func=fetch_func,
            expire=actual_expire,
            lock_timeout=lock_timeout,
            *args,
            **kwargs
        )
    
    @classmethod
    def _bloom_filter_check(cls, key: str) -> bool:
        """
        检查 key 是否可能在布隆过滤器中
        
        注意：这是一个简化的内存实现，
        生产环境建议使用 RedisBloom 模块
        """
        # 简单的哈希检查
        hash_val = hashlib.md5(key.encode()).hexdigest()
        return hash_val in cls._bloom_filter
    
    @classmethod
    def _bloom_filter_add(cls, key: str):
        """添加 key 到布隆过滤器"""
        hash_val = hashlib.md5(key.encode()).hexdigest()
        cls._bloom_filter.add(hash_val)
    
    @classmethod
    async def invalidate_cache(cls, key: str, include_null: bool = True):
        """
        使缓存失效
        
        Args:
            key: 缓存键
            include_null: 是否同时删除空值缓存
        """
        await cache_service.delete(key)
        
        if include_null:
            null_key = f"null:{key}"
            await cache_service.delete(null_key)
    
    @classmethod
    async def warm_up_cache(
        cls,
        keys: list,
        fetch_func: Callable,
        expire: int = 3600,
        batch_size: int = 100
    ):
        """
        缓存预热
        
        系统启动时预加载热点数据到缓存
        
        Args:
            keys: 需要预热的 key 列表
            fetch_func: 获取数据的函数
            expire: 缓存过期时间（秒）
            batch_size: 批处理大小
        """
        app_logger.info(f"Starting cache warm-up for {len(keys)} keys")
        
        for i in range(0, len(keys), batch_size):
            batch = keys[i:i + batch_size]
            
            tasks = []
            for key in batch:
                task = cls.get_with_full_protection(
                    key=key,
                    fetch_func=fetch_func,
                    expire=expire,
                    jitter=True
                )
                tasks.append(task)
            
            await asyncio.gather(*tasks, return_exceptions=True)
            
            app_logger.info(f"Warmed up {min(i + batch_size, len(keys))}/{len(keys)} keys")
        
        app_logger.info("Cache warm-up completed")


# 便捷函数

async def cache_get_or_set_protected(
    key: str,
    fetch_func: Callable,
    expire: int = 3600,
    *args,
    **kwargs
) -> Any:
    """
    带完整防护的缓存获取/设置函数
    
    使用示例：
        article = await cache_get_or_set_protected(
            key=f"article:{article_id}",
            fetch_func=get_article_from_db,
            expire=3600,
            article_id=article_id
        )
    """
    return await CacheProtection.get_with_full_protection(
        key=key,
        fetch_func=fetch_func,
        expire=expire,
        *args,
        **kwargs
    )


def cached_with_protection(expire: int = 3600, key_prefix: str = ""):
    """
    装饰器：为函数添加完整缓存防护
    
    使用示例：
        @cached_with_protection(expire=3600, key_prefix="article")
        async def get_article(db: Session, article_id: UUID):
            return db.query(Article).filter(Article.id == article_id).first()
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 生成缓存 key
            cache_key = f"{key_prefix}:{func.__name__}"
            
            # 添加参数到 key
            if args:
                cache_key += ":" + ":".join(str(arg) for arg in args if not hasattr(arg, '__class__') or arg.__class__.__name__ == 'Session')
            if kwargs:
                cache_key += ":" + ":".join(f"{k}={v}" for k, v in sorted(kwargs.items()) if k != 'db')
            
            # 生成缓存 key 的哈希（避免 key 过长）
            cache_key = hashlib.md5(cache_key.encode()).hexdigest()
            
            async def fetch():
                return await func(*args, **kwargs) if asyncio.iscoroutinefunction(func) else func(*args, **kwargs)
            
            return await CacheProtection.get_with_full_protection(
                key=cache_key,
                fetch_func=fetch,
                expire=expire
            )
        
        return wrapper
    return decorator
