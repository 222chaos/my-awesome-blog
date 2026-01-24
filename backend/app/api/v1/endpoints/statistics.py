from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.statistics import WebsiteStatistics, ArticleStatistics, StatisticsResponse
from app.services.statistics_service import StatisticsService
from app.models.user import User

router = APIRouter()


@router.get("/website", response_model=WebsiteStatistics)
def get_website_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get website statistics
    """
    stats = StatisticsService.get_website_statistics(db)
    return stats


@router.get("/articles/popular", response_model=list[ArticleStatistics])
def get_popular_articles_statistics(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get popular articles statistics
    """
    stats = StatisticsService.get_popular_articles(db, limit=limit)
    return stats


@router.get("/growth", response_model=dict)
def get_growth_statistics(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get growth statistics for the last N days
    """
    stats = StatisticsService.get_growth_statistics(db, days=days)
    return stats


@router.get("/content", response_model=dict)
def get_content_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get content statistics
    """
    stats = StatisticsService.get_content_statistics(db)
    return stats


@router.get("/overview", response_model=StatisticsResponse)
def get_statistics_overview(
    article_limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get comprehensive statistics overview
    """
    website_stats = StatisticsService.get_website_statistics(db)
    article_stats = StatisticsService.get_popular_articles(db, limit=article_limit)
    
    return StatisticsResponse(
        website=website_stats,
        articles=article_stats
    )