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
    
    return query.order_by(Article.created_at.desc()).offset(skip).limit(limit).all()


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