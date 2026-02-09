from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app import crud
from app.schemas.portfolio import PortfolioItem

router = APIRouter()


@router.get("/", response_model=List[dict])
def read_albums(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve albums (transformed from portfolio items for frontend compatibility)
    Returns data in Album format expected by frontend
    """
    portfolios = crud.get_portfolios(db, skip=skip, limit=limit, is_featured=None)
    
    albums = []
    for portfolio in portfolios:
        album = {
            "id": str(portfolio.id),
            "title": portfolio.title,
            "description": portfolio.description or "",
            "coverImage": portfolio.cover_image or "/assets/placeholder.jpg",
            "date": portfolio.created_at.strftime("%Y-%m-%d") if portfolio.created_at else "",
            "featured": portfolio.is_featured or False,
            "images": 12,
            "slug": portfolio.slug,
            "technologies": portfolio.technologies or [],
            "startDate": portfolio.start_date.strftime("%Y-%m-%d") if portfolio.start_date else None,
            "endDate": portfolio.end_date.strftime("%Y-%m-%d") if portfolio.end_date else None,
            "status": portfolio.status or "completed",
            "sortOrder": portfolio.sort_order or 0
        }
        albums.append(album)
    
    return albums


@router.get("/{album_id}", response_model=dict)
def read_album_by_id(
    album_id: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific album by id
    """
    from uuid import UUID
    try:
        album_uuid = UUID(album_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid album ID format",
        )
    
    portfolio = crud.get_portfolio(db, portfolio_id=album_uuid)
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Album not found",
        )
    
    album = {
        "id": str(portfolio.id),
        "title": portfolio.title,
        "description": portfolio.description or "",
        "coverImage": portfolio.cover_image or "/assets/placeholder.jpg",
        "date": portfolio.created_at.strftime("%Y-%m-%d") if portfolio.created_at else "",
        "featured": portfolio.is_featured or False,
        "images": 12,
        "slug": portfolio.slug,
        "technologies": portfolio.technologies or [],
        "startDate": portfolio.start_date.strftime("%Y-%m-%d") if portfolio.start_date else None,
        "endDate": portfolio.end_date.strftime("%Y-%m-%d") if portfolio.end_date else None,
        "status": portfolio.status or "completed",
        "sortOrder": portfolio.sort_order or 0
    }
    
    return album


@router.get("/featured/list", response_model=List[dict])
def read_featured_albums(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get featured albums
    """
    portfolios = crud.get_portfolios(db, skip=skip, limit=limit, is_featured=True)
    
    albums = []
    for portfolio in portfolios:
        album = {
            "id": str(portfolio.id),
            "title": portfolio.title,
            "description": portfolio.description or "",
            "coverImage": portfolio.cover_image or "/assets/placeholder.jpg",
            "date": portfolio.created_at.strftime("%Y-%m-%d") if portfolio.created_at else "",
            "featured": portfolio.is_featured or False,
            "images": 12,
            "slug": portfolio.slug,
            "technologies": portfolio.technologies or [],
            "startDate": portfolio.start_date.strftime("%Y-%m-%d") if portfolio.start_date else None,
            "endDate": portfolio.end_date.strftime("%Y-%m-%d") if portfolio.end_date else None,
            "status": portfolio.status or "completed",
            "sortOrder": portfolio.sort_order or 0
        }
        albums.append(album)
    
    return albums


@router.get("/{album_id}/images", response_model=List[dict])
def read_album_images(
    album_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get images for a specific album
    """
    from uuid import UUID
    try:
        album_uuid = UUID(album_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid album ID format",
        )
    
    portfolio = crud.get_portfolio(db, portfolio_id=album_uuid)
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Album not found",
        )
    
    # Return portfolio images as album images
    # If portfolio has images in a related table, fetch them
    images = []
    if hasattr(portfolio, 'images') and portfolio.images:
        for idx, img in enumerate(portfolio.images[skip:skip+limit]):
            images.append({
                "id": str(img.id) if hasattr(img, 'id') else f"{album_id}_{idx}",
                "url": img.url if hasattr(img, 'url') else img,
                "caption": img.caption if hasattr(img, 'caption') else None,
                "sortOrder": img.sort_order if hasattr(img, 'sort_order') else idx,
            })
    else:
        # Fallback: return the cover image as a single image
        images = [{
            "id": f"{album_id}_0",
            "url": portfolio.cover_image or "/assets/placeholder.jpg",
            "caption": portfolio.title,
            "sortOrder": 0,
        }]
    
    return images
