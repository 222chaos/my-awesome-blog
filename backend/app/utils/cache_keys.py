"""
缓存键管理工具
统一管理所有缓存键的命名规范，避免缓存键混乱
"""

from typing import Optional
from uuid import UUID


class CacheKeys:
    """缓存键常量和生成函数"""

    # ==================== 用户相关 ====================
    @staticmethod
    def user(user_id: UUID) -> str:
        """用户信息缓存键"""
        return f"user:{user_id}"

    @staticmethod
    def user_by_email(email: str) -> str:
        """通过邮箱查询用户的缓存键"""
        return f"user:email:{email}"

    @staticmethod
    def user_by_username(username: str) -> str:
        """通过用户名查询用户的缓存键"""
        return f"user:username:{username}"

    @staticmethod
    def user_list(skip: int = 0, limit: int = 100, filters: str = "") -> str:
        """用户列表缓存键"""
        filter_str = f":{filters}" if filters else ""
        return f"user:list:{skip}:{limit}{filter_str}"

    # ==================== 文章相关 ====================
    @staticmethod
    def article(article_id: UUID) -> str:
        """文章信息缓存键"""
        return f"article:{article_id}"

    @staticmethod
    def article_null(article_id: UUID) -> str:
        """文章空值缓存键(用于缓存穿透防护)"""
        return f"article:null:{article_id}"

    @staticmethod
    def article_by_slug(slug: str) -> str:
        """通过slug查询文章的缓存键"""
        return f"article:slug:{slug}"

    @staticmethod
    def article_slug_null(slug: str) -> str:
        """通过slug查询文章的空值缓存键"""
        return f"article:slug:null:{slug}"

    @staticmethod
    def article_list(
        skip: int = 0,
        limit: int = 100,
        published_only: bool = True,
        author_id: Optional[UUID] = None,
        category_id: Optional[UUID] = None,
        tag_id: Optional[UUID] = None,
        search: Optional[str] = None
    ) -> str:
        """文章列表缓存键"""
        parts = [
            f"skip={skip}",
            f"limit={limit}",
            f"published={published_only}"
        ]
        if author_id:
            parts.append(f"author={author_id}")
        if category_id:
            parts.append(f"category={category_id}")
        if tag_id:
            parts.append(f"tag={tag_id}")
        if search:
            parts.append(f"search={search.lower()}")
        return f"article:list:{':'.join(parts)}"

    @staticmethod
    def article_featured(limit: int = 10) -> str:
        """精选文章列表缓存键"""
        return f"article:featured:{limit}"

    @staticmethod
    def article_popular(limit: int = 10, days: int = 30) -> str:
        """热门文章列表缓存键"""
        return f"article:popular:{limit}:{days}"

    @staticmethod
    def article_related(article_id: UUID, limit: int = 5) -> str:
        """相关文章列表缓存键"""
        return f"article:related:{article_id}:{limit}"

    @staticmethod
    def article_cursor(cursor: Optional[str], limit: int = 20, filters: str = "") -> str:
        """文章游标分页缓存键"""
        cursor_str = f"cursor={cursor}" if cursor else "cursor=None"
        return f"article:cursor:{cursor_str}:limit={limit}{filters}"

    @staticmethod
    def article_search_fulltext(query: str, skip: int = 0, limit: int = 100) -> str:
        """全文搜索文章缓存键"""
        return f"article:search:{query.lower()}:{skip}:{limit}"

    # ==================== 评论相关 ====================
    @staticmethod
    def comment(comment_id: UUID) -> str:
        """评论信息缓存键"""
        return f"comment:{comment_id}"

    @staticmethod
    def comment_list_by_article(
        article_id: UUID,
        skip: int = 0,
        limit: int = 100,
        approved_only: bool = True
    ) -> str:
        """文章评论列表缓存键"""
        return f"comment:article:{article_id}:skip={skip}:limit={limit}:approved={approved_only}"

    @staticmethod
    def comment_list_by_author(
        author_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> str:
        """用户评论列表缓存键"""
        return f"comment:author:{author_id}:skip={skip}:limit={limit}"

    @staticmethod
    def comment_replies(comment_id: UUID, skip: int = 0, limit: int = 100) -> str:
        """评论回复列表缓存键"""
        return f"comment:replies:{comment_id}:skip={skip}:limit={limit}"

    # ==================== 分类相关 ====================
    @staticmethod
    def category(category_id: UUID) -> str:
        """分类信息缓存键"""
        return f"category:{category_id}"

    @staticmethod
    def category_by_slug(slug: str) -> str:
        """通过slug查询分类的缓存键"""
        return f"category:slug:{slug}"

    @staticmethod
    def category_list(skip: int = 0, limit: int = 100) -> str:
        """分类列表缓存键"""
        return f"category:list:{skip}:{limit}"

    # ==================== 标签相关 ====================
    @staticmethod
    def tag(tag_id: UUID) -> str:
        """标签信息缓存键"""
        return f"tag:{tag_id}"

    @staticmethod
    def tag_by_slug(slug: str) -> str:
        """通过slug查询标签的缓存键"""
        return f"tag:slug:{slug}"

    @staticmethod
    def tag_list(skip: int = 0, limit: int = 100) -> str:
        """标签列表缓存键"""
        return f"tag:list:{skip}:{limit}"

    # ==================== 统计相关 ====================
    @staticmethod
    def stats_article_views(article_id: UUID) -> str:
        """文章浏览量缓存键"""
        return f"stats:article:views:{article_id}"

    @staticmethod
    def stats_user_articles_count(user_id: UUID) -> str:
        """用户文章数量缓存键"""
        return f"stats:user:articles:{user_id}"

    @staticmethod
    def stats_cache_hit_rate(func_name: str) -> str:
        """缓存命中率统计键"""
        return f"stats:cache:hit_rate:{func_name}"

    # ==================== 令牌黑名单相关 ====================
    @staticmethod
    def token_blacklist(token: str) -> str:
        """令牌黑名单缓存键"""
        return f"blacklist:token:{token}"

    # ==================== 速率限制相关 ====================
    @staticmethod
    def rate_limit(identifier: str, endpoint: str) -> str:
        """速率限制缓存键"""
        return f"ratelimit:{identifier}:{endpoint}"

    @staticmethod
    def rate_limit_login(ip_address: str) -> str:
        """登录速率限制缓存键"""
        return f"ratelimit:login:{ip_address}"

    @staticmethod
    def rate_limit_register(ip_address: str) -> str:
        """注册速率限制缓存键"""
        return f"ratelimit:register:{ip_address}"


# 缓存TTL常量（秒）
class CacheTTL:
    """缓存过期时间常量"""

    # 短期缓存（1分钟）
    VERY_SHORT = 60

    # 短期缓存（5分钟）
    SHORT = 300

    # 中期缓存（15分钟）
    MEDIUM = 900

    # 标准缓存（30分钟）
    STANDARD = 1800

    # 长期缓存（1小时）
    LONG = 3600

    # 超长期缓存（1天）
    VERY_LONG = 86400

    # 统计数据（5分钟）
    STATS = 300

    # 文章缓存（30分钟）
    ARTICLE = 1800

    # 用户缓存（15分钟）
    USER = 900

    # 评论缓存（15分钟）
    COMMENT = 900

    # 速率限制（60秒）
    RATE_LIMIT = 60

    # 令牌黑名单（根据令牌有效期动态设置）
    TOKEN_BLACKLIST = None  # None表示使用令牌的剩余有效期


__all__ = ["CacheKeys", "CacheTTL"]
