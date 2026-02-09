"""API响应缓存优化工具"""

from typing import Any, Optional, List, Dict
from app.services.cache_service import cache_service
from app.utils.logger import app_logger
import hashlib
import json
from functools import wraps
from fastapi import Request


def build_cache_key(prefix: str, params: Dict[str, Any]) -> str:
    """
    构建缓存键，将参数哈希以避免键过长
    """
    # 排序参数以确保相同的参数产生相同的键
    sorted_params = sorted(params.items())
    params_str = json.dumps(sorted_params, sort_keys=True, default=str)
    params_hash = hashlib.md5(params_str.encode()).hexdigest()
    return f"{prefix}:{params_hash}"


def cache_api_response(cache_prefix: str, ttl: int = 3600):
    """
    装饰器：为API端点添加响应缓存
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 提取request对象和查询参数
            request = None
            query_params = {}
            
            # 从参数中找到request对象和查询参数
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            
            # 构建查询参数字典
            if request:
                query_params.update(dict(request.query_params))
            
            # 也包括函数的其他参数
            for k, v in kwargs.items():
                if k not in ['db', 'current_user', 'request']:  # 排除特定参数
                    query_params[k] = v
            
            # 构建缓存键
            cache_key = build_cache_key(cache_prefix, query_params)
            
            # 尝试从缓存获取
            cached_result = await cache_service.get(cache_key)
            if cached_result is not None:
                app_logger.info(f"Cache hit for key: {cache_key}")
                return cached_result
            
            # 执行原始函数
            result = await func(*args, **kwargs)
            
            # 存储到缓存
            await cache_service.set(cache_key, result, expire=ttl)
            app_logger.info(f"Cache set for key: {cache_key}")
            
            return result
        return wrapper
    return decorator


def invalidate_cache_pattern(pattern: str):
    """
    根据模式清除缓存
    """
    async def clear_cache():
        deleted_count = await cache_service.delete_pattern(pattern)
        app_logger.info(f"Cleared {deleted_count} cache entries matching pattern: {pattern}")
        return deleted_count
    return clear_cache


def cache_user_specific(cache_prefix: str, ttl: int = 1800):
    """
    为需要用户特定缓存的API端点添加装饰器
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 提取request对象和用户信息
            request = None
            current_user = None
            
            for arg in args:
                if hasattr(arg, 'username'):  # 假设这是User对象
                    current_user = arg
                elif isinstance(arg, Request):
                    request = arg
            
            # 如果没有当前用户，回退到普通缓存
            if current_user is None:
                return await func(*args, **kwargs)
            
            # 构建用户特定的查询参数
            query_params = {}
            if request:
                query_params.update(dict(request.query_params))
            
            for k, v in kwargs.items():
                if k not in ['db', 'current_user', 'request']:
                    query_params[k] = v
            
            # 在缓存键中包含用户ID
            query_params['user_id'] = str(current_user.id) if hasattr(current_user, 'id') else 'anonymous'
            
            # 构建缓存键
            cache_key = build_cache_key(cache_prefix, query_params)
            
            # 尝试从缓存获取
            cached_result = await cache_service.get(cache_key)
            if cached_result is not None:
                app_logger.info(f"User-specific cache hit for key: {cache_key}")
                return cached_result
            
            # 执行原始函数
            result = await func(*args, **kwargs)
            
            # 存储到缓存
            await cache_service.set(cache_key, result, expire=ttl)
            app_logger.info(f"User-specific cache set for key: {cache_key}")
            
            return result
        return wrapper
    return decorator


async def get_cached_user_permissions(user_id: str) -> List[str]:
    """
    获取缓存的用户权限
    """
    cache_key = f"user_permissions:{user_id}"
    permissions = await cache_service.get(cache_key)
    
    if permissions is None:
        # 这里应该从数据库获取用户权限
        # 模拟获取权限的逻辑
        permissions = []  # 实际应用中应从数据库获取
        await cache_service.set(cache_key, permissions, expire=1800)  # 缓存30分钟
    
    return permissions


async def invalidate_user_cache(user_id: str):
    """
    清除特定用户的缓存
    """
    # 清除用户相关的所有缓存
    await cache_service.delete_pattern(f"article:*:user:{user_id}")
    await cache_service.delete_pattern(f"user:{user_id}*")
    await cache_service.delete(f"user_permissions:{user_id}")
    app_logger.info(f"Cleared cache for user: {user_id}")


async def batch_get_from_cache(keys: List[str]) -> List[Optional[Any]]:
    """
    批量从缓存获取数据
    """
    return await cache_service.mget(keys)


async def batch_set_to_cache(mapping: Dict[str, Any], expire: int = 3600) -> bool:
    """
    批量设置缓存数据
    """
    return await cache_service.mset(mapping, expire)