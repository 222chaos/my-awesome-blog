from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate


def get_article(db: Session, article_id: int) -> Optional[Article]:
    return db.query(Article).filter(Article.id == article_id).first()


def get_article_by_slug(db: Session, slug: str) -> Optional[Article]:
    return db.query(Article).filter(Article.slug == slug).first()


def get_articles(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    published_only: bool = True,
    author_id: Optional[int] = None,
    search: Optional[str] = None,
    order_by_views: bool = False,
    category_id: Optional[int] = None,
    tag_id: Optional[int] = None,
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


def create_article(db: Session, article: ArticleCreate, author_id: int) -> Article:
    db_article = Article(
        **article.model_dump(),
        author_id=author_id,
    )
    
    # Set published_at if article is published
    if article.is_published:
        db_article.published_at = datetime.utcnow()  # type: ignore
    
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


def update_article(db: Session, article_id: int, article_update: ArticleUpdate) -> Optional[Article]:
    db_article = get_article(db, article_id)
    if not db_article:
        return None
    
    update_data = article_update.model_dump(exclude_unset=True)
    
    # Handle publish status change
    if "is_published" in update_data:
        is_published = update_data["is_published"]
        if is_published and not db_article.is_published:  # type: ignore
            update_data["published_at"] = datetime.utcnow()
        elif not is_published and db_article.is_published:  # type: ignore
            update_data["published_at"] = None
    
    for field, value in update_data.items():
        setattr(db_article, field, value)
    
    db.commit()
    db.refresh(db_article)
    return db_article


def delete_article(db: Session, article_id: int) -> bool:
    db_article = get_article(db, article_id)
    if not db_article:
        return False
    
    db.delete(db_article)
    db.commit()
    return True


def increment_view_count(db: Session, article_id: int) -> Optional[Article]:
    db_article = get_article(db, article_id)
    if not db_article:
        return None
    
    db_article.view_count = db_article.view_count + 1  # type: ignore
    db.commit()
    db.refresh(db_article)
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


def get_related_articles(db: Session, article_id: int, limit: int = 5):
    """Get articles related to a specific article based on category or tags"""
    from app.models.article_category import ArticleCategory
    from app.models.article_tag import ArticleTag
    
    # Get the original article
    original_article = get_article(db, article_id)
    if not original_article:
        return []
    
    # Find articles in the same category
    related_by_category = []
    if original_article.category_id:
        related_by_category = (
            db.query(Article)
            .join(ArticleCategory)
            .filter(
                Article.id != article_id,
                Article.is_published == True,
                ArticleCategory.category_id == original_article.category_id
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


def get_articles_with_categories_and_tags(db: Session, skip: int = 0, limit: int = 100, published_only: bool = True, category_id: int = None, tag_id: int = None):
    """Get articles with optimized query including joined relationships for categories and tags"""
    from app.models.article_category import ArticleCategory
    from app.models.article_tag import ArticleTag
    from app.models.category import Category
    from app.models.tag import Tag
    
    query = db.query(Article)
    
    if published_only:
        query = query.filter(Article.is_published == True)
    
    if category_id is not None:
        query = query.join(ArticleCategory).filter(ArticleCategory.category_id == category_id)
    
    if tag_id is not None:
        query = query.join(ArticleTag).filter(ArticleTag.tag_id == tag_id)
    
    return query.offset(skip).limit(limit).all()