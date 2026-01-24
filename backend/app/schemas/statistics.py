from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class WebsiteStatistics(BaseModel):
    """网站统计数据"""
    total_articles: int
    published_articles: int
    draft_articles: int
    total_users: int
    total_categories: int
    total_tags: int
    total_views: int
    total_comments: int
    subscribers_count: int
    online_users: int
    active_today: int
    created_at: datetime

    class Config:
        from_attributes = True


class ArticleStatistics(BaseModel):
    """文章统计数据"""
    article_id: int
    title: str
    view_count: int
    comment_count: int
    likes_count: int
    share_count: int
    reading_time: int  # 预计阅读时间（分钟）
    created_at: datetime

    class Config:
        from_attributes = True


class StatisticsResponse(BaseModel):
    """统计数据响应"""
    website: WebsiteStatistics
    articles: list[ArticleStatistics]

    class Config:
        from_attributes = True