from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.article import Article, ArticleCreate, ArticleUpdate, ArticleWithAuthor
from app.models.user import User
from uuid import UUID
from app.services.cache_service import cache_service
from app.utils.pagination import CursorPaginationParams

router = APIRouter()


@router.get("/", response_model=List[ArticleWithAuthor])
def read_articles(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = Query(True, description="Only return published articles"),
    author_id: Optional[str] = Query(None, description="Filter by author ID"),
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    tag_id: Optional[str] = Query(None, description="Filter by tag ID"),
    search: Optional[str] = Query(None, description="Search in title and content"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve articles
    """
    from uuid import UUID
    author_uuid = UUID(author_id) if author_id else None
    category_uuid = UUID(category_id) if category_id else None
    tag_uuid = UUID(tag_id) if tag_id else None

    articles = crud.get_articles_with_categories_and_tags(
        db,
        skip=skip,
        limit=limit,
        published_only=published_only,
        category_id=category_uuid,
        tag_id=tag_uuid,
        author_id=author_uuid,
        search=search
    )
    return articles


@router.post("/", response_model=Article)
async def create_article(
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
    
    # Clear related caches
    from app.services.cache_service import cache_service
    await cache_service.delete(f"article:slug:{article_in.slug}")
    
    return article


@router.get("/featured", response_model=List[ArticleWithAuthor])
def read_featured_articles(
    limit: int = Query(10, ge=1, le=50, description="Number of featured articles to return"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get featured/pinned articles
    """
    articles = crud.get_featured_articles(db, limit=limit)
    return articles


@router.get("/popular", response_model=List[ArticleWithAuthor])
def read_popular_articles(
    limit: int = Query(10, ge=1, le=50, description="Number of popular articles to return"),
    days: int = Query(30, ge=1, description="Number of days to consider for popularity calculation"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get popular articles based on views in recent days
    """
    articles = crud.get_articles_with_categories_and_tags(
        db,
        skip=0,
        limit=limit,
        published_only=True,
        order_by_views=True
    )
    return articles


@router.get("/search", response_model=List[ArticleWithAuthor])
def search_articles(
    q: str = Query(..., min_length=1, max_length=100, description="Search query"),
    category_slug: Optional[str] = Query(None, description="Filter by category slug"),
    tag_slug: Optional[str] = Query(None, description="Filter by tag slug"),
    author_id: Optional[str] = Query(None, description="Filter by author ID"),
    published_only: bool = Query(True, description="Only return published articles"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Search articles by query string with optional filters
    """
    # Get category_id if category_slug is provided
    category_id = None
    if category_slug:
        category = crud.get_category_by_slug(db, category_slug)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        category_id = category.id

    # Get tag_id if tag_slug is provided
    tag_id = None
    if tag_slug:
        tag = crud.get_tag_by_slug(db, tag_slug)
        if not tag:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag not found",
            )
        tag_id = tag.id

    from uuid import UUID
    author_uuid = UUID(author_id) if author_id else None

    articles = crud.get_articles_with_categories_and_tags(
        db,
        skip=skip,
        limit=limit,
        published_only=published_only,
        author_id=author_uuid,
        search=q,
        category_id=category_id,
        tag_id=tag_id
    )

    return articles


@router.get("/slug/{slug}", response_model=ArticleWithAuthor)
async def read_article_by_slug(
    slug: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific article by slug
    """
    article = await crud.get_article_by_slug_with_relationships_async(db, slug=slug)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )

    # Increment view count
    await crud.increment_view_count(db, article_id=article.id)  # type: ignore

    return article


@router.get("/related/{article_id}", response_model=List[ArticleWithAuthor])
async def read_related_articles(
    article_id: str,
    limit: int = Query(5, ge=1, le=20, description="Number of related articles to return"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get articles related to a specific article
    """
    article_uuid = UUID(article_id)
    article = await crud.get_article_async(db, article_id=article_uuid)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )

    related_articles = crud.get_related_articles(db, article_id=article_uuid, limit=limit)
    return related_articles


@router.get("/{article_id}", response_model=ArticleWithAuthor)
async def read_article_by_id(
    article_id: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific article by id
    """
    article_uuid = UUID(article_id)
    article = await crud.get_article_async(db, article_id=article_uuid)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )

    # Increment view count
    await crud.increment_view_count(db, article_id=article_uuid)

    return article


@router.put("/{article_id}", response_model=Article)
async def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update an article
    """
    article_uuid = UUID(article_id)
    article = await crud.update_article(db, article_id=article_uuid, article_update=article_update)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Clear related caches
    await cache_service.delete(f"article:{article_id}")
    if hasattr(article_update, 'slug') and article_update.slug:
        await cache_service.delete(f"article:slug:{article_update.slug}")
    
    return article


@router.delete("/{article_id}", response_model=dict)
async def delete_article(
    article_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)  # Only superusers can delete
) -> Any:
    """
    Delete an article
    """
    article_uuid = UUID(article_id)
    success = await crud.delete_article(db, article_id=article_uuid)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Clear related caches
    await cache_service.delete(f"article:{article_id}")
    
    return {"message": "Article deleted successfully"}


@router.get("/cursor-paginated", response_model=dict)
async def read_articles_cursor_paginated(
    cursor: Optional[str] = Query(None, description="Cursor for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Number of items per page"),
    published_only: bool = Query(True, description="Only return published articles"),
    author_id: Optional[str] = Query(None, description="Filter by author ID"),
    search: Optional[str] = Query(None, description="Search in title and content"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve articles with cursor-based pagination
    """
    from uuid import UUID
    
    # Parse parameters
    cursor_params = CursorPaginationParams(cursor=cursor, limit=limit)
    author_uuid = UUID(author_id) if author_id else None
    
    # Perform cursor-based pagination
    result = await crud.get_articles_with_cursor_pagination(
        db=db,
        cursor_params=cursor_params,
        published_only=published_only,
        author_id=author_uuid,
        search=search
    )
    
    return {
        "items": result.items,
        "next_cursor": result.next_cursor,
        "has_more": result.has_more
    }


@router.get("/search-fulltext", response_model=List[ArticleWithAuthor])
async def search_articles_fulltext(
    search_query: str = Query(..., min_length=1, max_length=100, description="Fulltext search query"),
    published_only: bool = Query(True, description="Only return published articles"),
    skip: int = 0,
    limit: int = Query(100, le=100, description="Max limit is 100"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Search articles using PostgreSQL fulltext search
    """
    articles = crud.search_articles_fulltext(
        db=db,
        search_query=search_query,
        published_only=published_only,
        skip=skip,
        limit=limit
    )
    
    return articles