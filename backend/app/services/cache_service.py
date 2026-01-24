import redis
import json
import logging
from typing import Optional, Any, Union
from app.core.config import settings


class CacheService:
    def __init__(self):
        try:
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                password=settings.REDIS_PASSWORD,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True
            )
            # 测试连接
            self.redis_client.ping()
            self.enabled = True
            logging.info("Redis缓存服务初始化成功")
        except Exception as e:
            logging.error(f"Redis连接失败: {e}")
            self.redis_client = None
            self.enabled = False

    def get(self, key: str) -> Optional[Any]:
        """
        从缓存获取数据
        """
        if not self.enabled:
            return None
            
        try:
            value = self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logging.error(f"从缓存获取数据失败 {key}: {e}")
            return None

    def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """
        设置缓存数据
        """
        if not self.enabled:
            return False
            
        try:
            serialized_value = json.dumps(value, default=str)
            result = self.redis_client.setex(
                key,
                expire,
                serialized_value
            )
            return result is not None
        except Exception as e:
            logging.error(f"设置缓存数据失败 {key}: {e}")
            return False

    def delete(self, key: str) -> bool:
        """
        删除缓存
        """
        if not self.enabled:
            return False
            
        try:
            result = self.redis_client.delete(key)
            return result > 0
        except Exception as e:
            logging.error(f"删除缓存失败 {key}: {e}")
            return False

    def invalidate_pattern(self, pattern: str) -> int:
        """
        删除匹配模式的所有缓存
        """
        if not self.enabled:
            return 0
            
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                result = self.redis_client.delete(*keys)
                return result
            return 0
        except Exception as e:
            logging.error(f"清除模式匹配的缓存失败 {pattern}: {e}")
            return 0

    def exists(self, key: str) -> bool:
        """
        检查缓存是否存在
        """
        if not self.enabled:
            return False
            
        try:
            return self.redis_client.exists(key) > 0
        except Exception as e:
            logging.error(f"检查缓存存在性失败 {key}: {e}")
            return False

    def expire(self, key: str, ttl: int) -> bool:
        """
        设置缓存过期时间
        """
        if not self.enabled:
            return False
            
        try:
            result = self.redis_client.expire(key, ttl)
            return result
        except Exception as e:
            logging.error(f"设置缓存过期时间失败 {key}: {e}")
            return False

    def hash_get(self, name: str, key: str) -> Optional[Any]:
        """
        从哈希缓存中获取数据
        """
        if not self.enabled:
            return None
            
        try:
            value = self.redis_client.hget(name, key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logging.error(f"从哈希缓存获取数据失败 {name}:{key}: {e}")
            return None

    def hash_set(self, name: str, key: str, value: Any, expire: Optional[int] = None) -> bool:
        """
        设置哈希缓存数据
        """
        if not self.enabled:
            return False
            
        try:
            serialized_value = json.dumps(value, default=str)
            result = self.redis_client.hset(name, key, serialized_value)
            
            # 如果设置了过期时间，单独设置
            if expire and result:
                self.redis_client.expire(name, expire)
                
            return result is not None
        except Exception as e:
            logging.error(f"设置哈希缓存数据失败 {name}:{key}: {e}")
            return False

    def hash_delete(self, name: str, *keys: str) -> int:
        """
        删除哈希缓存中的一个或多个字段
        """
        if not self.enabled:
            return 0
            
        try:
            result = self.redis_client.hdel(name, *keys)
            return result
        except Exception as e:
            logging.error(f"删除哈希缓存字段失败 {name}:{keys}: {e}")
            return 0

    def flush_all(self) -> bool:
        """
        清空所有缓存
        """
        if not self.enabled:
            return False
            
        try:
            self.redis_client.flushall()
            return True
        except Exception as e:
            logging.error(f"清空所有缓存失败: {e}")
            return False


# 缓存键前缀
CACHE_KEYS = {
    'statistics': 'stats:website',
    'categories': 'categories:list',
    'tags': 'tags:list',
    'popular_articles': 'articles:popular',
    'featured_articles': 'articles:featured',
    'recent_articles': 'articles:recent',
    'authors': 'authors:list',
    'article_detail': 'article:{id}',
    'category_articles': 'category:{id}:articles',
    'tag_articles': 'tag:{id}:articles',
    'author_articles': 'author:{id}:articles',
    'friend_links': 'friend_links:all',
    'featured_friend_links': 'friend_links:featured',
    'portfolios': 'portfolios:all',
    'featured_portfolios': 'portfolios:featured',
    'timeline_events': 'timeline:events',
    'active_subscriptions': 'subscriptions:active',
    'sitemap': 'sitemap:xml',
    'rss_feed': 'feed:rss'
}


# 全局缓存服务实例
cache_service = CacheService()