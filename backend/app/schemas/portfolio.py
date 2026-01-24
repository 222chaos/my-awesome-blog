from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class PortfolioBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[List[str]] = []  # 使用JSON格式存储技术栈
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = 'completed'  # completed, in_progress, planned
    is_featured: Optional[bool] = False
    sort_order: Optional[int] = 0


class PortfolioCreate(PortfolioBase):
    title: str
    slug: str


class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class PortfolioInDBBase(PortfolioBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Portfolio(PortfolioInDBBase):
    pass