from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate
from app.services.cache_service import cache_service, cache_get_or_set
from app.utils.pagination import CursorPaginationParams, CursorPaginationResult, paginate_with_cursor
from sqlalchemy import text


def get_article(db: Session, article_id: UUID) -> Optional[Article]:
    return db.query(Article).filter(Article.id == article_id).first()


async def get_article_async(db: Session, article_id: UUID) -> Optional[Article]:
    """异步获取文章，带缓存功能"""
    cache_key = f"article:{article_id}"
    cached_article = await cache_service.get(cache_key)
    
    if cached_article is not None:
        return cached_article
    
    from sqlalchemy.orm import joinedload
    article = (
        db.query(Article)
        .options(joinedload(Article.author))
        .options(joinedload(Article.categories))
        .options(joinedload(Article.tags))
        .filter(Article.id == article_id)
        .first()
    )
    if article:
        await cache_service.set(cache_key, article, expire=3600)  # Cache for 1 hour
    
    return article


def get_article_with_relationships(db: Session, article_id: UUID) -> Optional[Article]:
    from sqlalchemy.orm import joinedload
    return (
        db.query(Article)
        .options(joinedload(Article.author))
        .options(joinedload(Article.categories))
        .options(joinedload(Article.tags))
        .filter(Article.id == article_id)
        .first()
    )


def get_article_by_slug(db: Session, slug: str) -> Optional[Article]:
    return db.query(Article).filter(Article.slug == slug).first()


def get_article_by_slug_with_relationships(db: Session, slug: str) -> Optional[Article]:
    from sqlalchemy.orm import joinedload
    return (
        db.query(Article)
        .options(joinedload(Article.author))
        .options(joinedload(Article.categories))
        .options(joinedload(Article.tags))
        .filter(Article.slug == slug)
        .first()
    )


async def get_article_by_slug_with_relationships_async(db: Session, slug: str) -> Optional[Article]:
    """异步获取文章，带缓存和关系数据"""
    cache_key = f"article:slug:{slug}"
    cached_article = await cache_service.get(cache_key)
    
    if cached_article is not None:
        return cached_article
    
    from sqlalchemy.orm import joinedload
    article = (
        db.query(Article)
        .options(joinedload(Article.author))
        .options(joinedload(Article.categories))
        .options(joinedload(Article.tags))
        .filter(Article.slug == slug)
        .first()
    )
    
    if article:
        await cache_service.set(cache_key, article, expire=3600)  # Cache for 1 hour
    
    return article


def get_articles(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    published_only: bool = True,
    author_id: Optional[UUID] = None,
    search: Optional[str] = None,
    order_by_views: bool = False,
    category_id: Optional[UUID] = None,
    tag_id: Optional[UUID] = None,
):
    query = db.query(Article)
    
    if published_only:
        query = query.filter(Article.is_published == True)
    
    if author_id is not None:
        query = query.filter(Article.author_id == author_id)
    
    if search:
        search_filter = or_(
            Article.title.ilike(f"%{search}%"),
            Article.content.ilike(f"%{search}%"),
            Article.excerpt.ilike(f"%{search}%"),
        )
        query = query.filter(search_filter)
    
    # Filter by category if provided
    if category_id is not None:
        from app.models.article_category import ArticleCategory
        query = query.join(ArticleCategory).filter(ArticleCategory.category_id == category_id)
    
    # Filter by tag if provided
    if tag_id is not None:
        from app.models.article_tag import ArticleTag
        query = query.join(ArticleTag).filter(ArticleTag.tag_id == tag_id)
    
    # Order by views or by creation date
    if order_by_views:
        query = query.order_by(Article.view_count.desc(), Article.created_at.desc())
    else:
        query = query.order_by(Article.created_at.desc())
    
    return query.offset(skip).limit(limit).all()


def create_article(db: Session, article: ArticleCreate, author_id: UUID) -> Article:
    from app.models.tag import Tag
    from app.models.category import Category
    from app.models.article_tag import ArticleTag
    from app.models.article_category import ArticleCategory

    db_article = Article(
        **article.model_dump(exclude={'tags', 'category_id'}),
        author_id=author_id,
    )

    # Set published_at if article is published
    if article.is_published:
        db_article.published_at = datetime.now(timezone.utc)  # type: ignore

    db.add(db_article)
    db.flush()  # Get the ID without committing

    # Associate category
    if article.category_id:
        category = db.query(Category).filter(Category.id == article.category_id).first()
        if category:
            article_category = ArticleCategory(
                article_id=db_article.id,
                category_id=category.id,
                is_primary=True
            )
            db.add(article_category)

    # Associate tags
    if article.tags:
        for tag_id in article.tags:
            tag = db.query(Tag).filter(Tag.id == tag_id).first()
            if tag:
                article_tag = ArticleTag(article_id=db_article.id, tag_id=tag.id)
                db.add(article_tag)

    db.commit()
    db.refresh(db_article)
    return db_article


async def update_article(db: Session, article_id: UUID, article_update: ArticleUpdate) -> Optional[Article]:
    db_article = get_article(db, article_id)
    if not db_article:
        return None
    
    update_data = article_update.model_dump(exclude_unset=True)
    
    # Handle publish status change
    if "is_published" in update_data:
        is_published = update_data["is_published"]
        if is_published and not db_article.is_published:  # type: ignore
            update_data["published_at"] = datetime.now(timezone.utc)
        elif not is_published and db_article.is_published:  # type: ignore
            update_data["published_at"] = None
    
    for field, value in update_data.items():
        setattr(db_article, field, value)
    
    db.commit()
    db.refresh(db_article)
    
    # Update cache
    cache_key = f"article:{article_id}"
    await cache_service.set(cache_key, db_article, expire=3600)  # Cache for 1 hour
    
    # Also update by slug cache if slug was changed
    if hasattr(article_update, 'slug') and article_update.slug:
        slug_cache_key = f"article:slug:{article_update.slug}"
        await cache_service.set(slug_cache_key, db_article, expire=3600)
    
    return db_article


async def delete_article(db: Session, article_id: UUID) -> bool:
    db_article = get_article(db, article_id)
    if not db_article:
        return False
    
    db.delete(db_article)
    db.commit()
    
    # Delete cache entries
    cache_key = f"article:{article_id}"
    await cache_service.delete(cache_key)
    
    if db_article.slug:
        slug_cache_key = f"article:slug:{db_article.slug}"
        await cache_service.delete(slug_cache_key)
    
    return True


async def increment_view_count(db: Session, article_id: UUID) -> Optional[Article]:
    from sqlalchemy.orm import joinedload
    db_article = (
        db.query(Article)
        .options(joinedload(Article.author))
        .options(joinedload(Article.categories))
        .options(joinedload(Article.tags))
        .filter(Article.id == article_id)
        .first()
    )
    if not db_article:
        return None
    
    db_article.view_count = db_article.view_count + 1  # type: ignore
    db.commit()
    
    # 更新缓存
    cache_key = f"article:{article_id}"
    await cache_service.set(cache_key, db_article, expire=3600)  # Cache for 1 hour
    
    return db_article


def get_featured_articles(db: Session, limit: int = 10):
    """Get featured articles based on view count and publication date"""
    return (
        db.query(Article)
        .filter(Article.is_published == True)
        .order_by(Article.view_count.desc(), Article.created_at.desc())
        .limit(limit)
        .all()
    )


def get_related_articles(db: Session, article_id: UUID, limit: int = 5):
    """Get articles related to a specific article based on category or tags"""
    from app.models.article_category import ArticleCategory
    from app.models.article_tag import ArticleTag
    
    # Get the original article
    original_article = get_article(db, article_id)
    if not original_article:
        return []
    
    # Find articles in the same category
    related_by_category = []
    if original_article.article_categories and len(original_article.article_categories) > 0:
        category_id = original_article.article_categories[0].category_id
        related_by_category = (
            db.query(Article)
            .join(ArticleCategory)
            .filter(
                Article.id != article_id,
                Article.is_published == True,
                ArticleCategory.category_id == category_id
            )
            .order_by(Article.view_count.desc())
            .limit(limit)
            .all()
        )
    
    # If we don't have enough articles from the same category, get popular articles
    if len(related_by_category) < limit:
        remaining = limit - len(related_by_category)
        popular_articles = (
            db.query(Article)
            .filter(
                Article.id != article_id,
                Article.is_published == True,
                Article.id.notin_([a.id for a in related_by_category])
            )
            .order_by(Article.view_count.desc(), Article.created_at.desc())
            .limit(remaining)
            .all()
        )
        related_by_category.extend(popular_articles)
    
    return related_by_category


def get_articles_with_categories_and_tags(db: Session, skip: int = 0, limit: int = 100, published_only: bool = True, category_id: UUID = None, tag_id: UUID = None, author_id: UUID = None, search: str = None):
    """Get articles with optimized query including joined relationships for categories and tags"""
    from sqlalchemy.orm import joinedload
    from app.models.article_category import ArticleCategory
    from app.models.article_tag import ArticleTag
    from app.models.category import Category
    from app.models.tag import Tag
    from sqlalchemy import or_

    query = db.query(Article).options(
        joinedload(Article.author),
        joinedload(Article.categories),
        joinedload(Article.tags)
    )

    if published_only:
        query = query.filter(Article.is_published == True)

    if author_id is not None:
        query = query.filter(Article.author_id == author_id)

    if category_id is not None:
        query = query.join(ArticleCategory).filter(ArticleCategory.category_id == category_id)

    if tag_id is not None:
        query = query.join(ArticleTag).filter(ArticleTag.tag_id == tag_id)

    if search:
        search_filter = or_(
            Article.title.ilike(f"%{search}%"),
            Article.content.ilike(f"%{search}%"),
            Article.excerpt.ilike(f"%{search}%"),
        )
        query = query.filter(search_filter)

    return query.offset(skip).limit(limit).all()


def get_popular_articles(db: Session, limit: int = 5, days: int = 30):
    """
    获取热门文章（基于浏览量和评论数）
    """
    from sqlalchemy import func, and_
    from datetime import datetime, timedelta
    from app.models.comment import Comment

    # 计算日期范围
    since_date = datetime.now(timezone.utc) - timedelta(days=days)

    # 查询热门文章（考虑浏览量和评论数）
    popular_articles = (
        db.query(Article)
        .join(Comment, Comment.article_id == Article.id, isouter=True)  # 左连接评论表
        .filter(and_(Article.is_published == True, Article.published_at >= since_date))
        .group_by(Article.id)  # 按文章分组
        .order_by(
            Article.view_count.desc(),  # 首先按浏览量降序
            func.count(Comment.id).desc(),  # 然后按评论数降序
            Article.published_at.desc()  # 最后按发布时间降序
        )
        .limit(limit)
        .all()
    )

    return popular_articles


async def get_articles_with_cursor_pagination(
    db: Session,
    cursor_params: CursorPaginationParams,
    published_only: bool = True,
    author_id: Optional[UUID] = None,
    search: Optional[str] = None,
    category_id: Optional[UUID] = None,
    tag_id: Optional[UUID] = None,
) -> CursorPaginationResult[Article]:
    """
    使用游标分页获取文章
    """
    from sqlalchemy import desc
    from sqlalchemy.orm import joinedload
    
    # 构建基础查询
    query = db.query(Article).options(
        joinedload(Article.author),
        joinedload(Article.categories),
        joinedload(Article.tags)
    )
    
    # 应用过滤条件
    if published_only:
        query = query.filter(Article.is_published == True)
    
    if author_id is not None:
        query = query.filter(Article.author_id == author_id)
    
    if search:
        search_filter = or_(
            Article.title.ilike(f"%{search}%"),
            Article.content.ilike(f"%{search}%"),
            Article.excerpt.ilike(f"%{search}%"),
        )
        query = query.filter(search_filter)
    
    # Filter by category if provided
    if category_id is not None:
        from app.models.article_category import ArticleCategory
        query = query.join(ArticleCategory).filter(ArticleCategory.category_id == category_id)
    
    # Filter by tag if provided
    if tag_id is not None:
        from app.models.article_tag import ArticleTag
        query = query.join(ArticleTag).filter(ArticleTag.tag_id == tag_id)
    
    # 按创建时间倒序排列
    query = query.order_by(desc(Article.created_at))
    
    # 使用游标分页函数
    result = paginate_with_cursor(
        query=query,
        cursor_params=cursor_params,
        sort_field=Article.created_at,
    )
    
    return result


def search_articles_fulltext(
    db: Session,
    search_query: str,
    published_only: bool = True,
    skip: int = 0,
    limit: int = 100,
) -> list[Article]:
    """
    使用PostgreSQL全文搜索功能搜索文章
    """
    # 构建全文搜索查询
    search_condition = text(
        "search_vector @@ plainto_tsquery('english', :search_term)"
    )
    
    query = db.query(Article).filter(search_condition.params(search_term=search_query))
    
    # 应用发布状态过滤
    if published_only:
        query = query.filter(Article.is_published == True)
    
    # 添加相关性排序
    rank_expression = text(
        "ts_rank(search_vector, plainto_tsquery('english', :search_term)) DESC"
    )
    query = query.order_by(rank_expression.params(search_term=search_query))
    
    # 应用分页
    query = query.offset(skip).limit(limit)
    
    return query.all()