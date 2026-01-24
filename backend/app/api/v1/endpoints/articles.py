from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.article import Article, ArticleCreate, ArticleUpdate, ArticleWithAuthor
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[ArticleWithAuthor])
def read_articles(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = Query(True, description="Only return published articles"),
    author_id: Optional[int] = Query(None, description="Filter by author ID"),
    search: Optional[str] = Query(None, description="Search in title and content"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve articles
    """
    articles = crud.get_articles(
        db, 
        skip=skip, 
        limit=limit, 
        published_only=published_only,
        author_id=author_id,
        search=search
    )
    return articles


@router.post("/", response_model=Article)
def create_article(
    *,
    db: Session = Depends(get_db),
    article_in: ArticleCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new article
    """
    # Check if slug already exists
    existing_article = crud.get_article_by_slug(db, slug=article_in.slug)
    if existing_article:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An article with this slug already exists",
        )
    
    article = crud.create_article(db, article=article_in, author_id=current_user.id)  # type: ignore
    return article


@router.get("/{article_id}", response_model=ArticleWithAuthor)
def read_article_by_id(
    article_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific article by id
    """
    article = crud.get_article(db, article_id=article_id)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Increment view count
    crud.increment_view_count(db, article_id=article_id)
    
    return article


@router.get("/slug/{slug}", response_model=ArticleWithAuthor)
def read_article_by_slug(
    slug: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific article by slug
    """
    article = crud.get_article_by_slug(db, slug=slug)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Increment view count
    crud.increment_view_count(db, article_id=article.id)  # type: ignore
    
    return article


@router.put("/{article_id}", response_model=Article)
def update_article(
    *,
    db: Session = Depends(get_db),
    article_id: int,
    article_in: ArticleUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update an article
    """
    article = crud.get_article(db, article_id=article_id)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Check permission: only author or superuser can update
    if article.author_id != current_user.id and not current_user.is_superuser:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this article",
        )
    
    # Check if slug is being updated and already exists
    if article_in.slug and article_in.slug != article.slug:
        existing_article = crud.get_article_by_slug(db, slug=article_in.slug)
        if existing_article:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An article with this slug already exists",
            )
    
    article = crud.update_article(db, article_id=article_id, article_update=article_in)
    return article


@router.delete("/{article_id}", response_model=dict)
def delete_article(
    *,
    db: Session = Depends(get_db),
    article_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Delete an article
    """
    article = crud.get_article(db, article_id=article_id)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Check permission: only author or superuser can delete
    if article.author_id != current_user.id and not current_user.is_superuser:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this article",
        )
    
    deleted = crud.delete_article(db, article_id=article_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    return {"message": "Article deleted successfully"}