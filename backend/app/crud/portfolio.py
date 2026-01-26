from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.portfolio import Portfolio
from app.schemas.portfolio import PortfolioItemCreate as PortfolioCreate, PortfolioItemUpdate as PortfolioUpdate


def get_portfolio(db: Session, portfolio_id: UUID) -> Optional[Portfolio]:
    """获取单个项目组合"""
    return db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()


def get_portfolio_by_slug(db: Session, slug: str) -> Optional[Portfolio]:
    """通过slug获取项目组合"""
    return db.query(Portfolio).filter(Portfolio.slug == slug).first()


def get_portfolios(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    is_featured: Optional[bool] = None,
    status: Optional[str] = None
) -> List[Portfolio]:
    """获取项目组合列表"""
    query = db.query(Portfolio)
    
    if is_featured is not None:
        query = query.filter(Portfolio.is_featured == is_featured)
    
    if status is not None:
        query = query.filter(Portfolio.status == status)
    
    query = query.order_by(Portfolio.sort_order.asc(), Portfolio.created_at.desc())
    
    return query.offset(skip).limit(limit).all()


def get_featured_portfolios(db: Session, limit: int = 10) -> List[Portfolio]:
    """获取精选项目组合"""
    return (
        db.query(Portfolio)
        .filter(Portfolio.is_featured == True)
        .order_by(Portfolio.sort_order.asc())
        .limit(limit)
        .all()
    )


def get_portfolios_by_status(db: Session, status: str, skip: int = 0, limit: int = 100) -> List[Portfolio]:
    """根据状态获取项目组合"""
    return (
        db.query(Portfolio)
        .filter(Portfolio.status == status)
        .order_by(Portfolio.sort_order.asc())
        .offset(skip).limit(limit)
        .all()
    )


def create_portfolio(db: Session, portfolio: PortfolioCreate) -> Portfolio:
    """创建新项目组合"""
    # 将技术栈列表转换为字符串存储（如果是PostgreSQL可以使用JSON字段）
    technologies_str = None
    if portfolio.technologies:
        import json
        technologies_str = json.dumps(portfolio.technologies)
    
    portfolio_data = portfolio.model_dump()
    portfolio_data['technologies'] = technologies_str
    
    db_portfolio = Portfolio(**portfolio_data)
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio


def update_portfolio(
    db: Session, portfolio_id: UUID, portfolio_update: PortfolioUpdate
) -> Optional[Portfolio]:
    """更新项目组合"""
    db_portfolio = get_portfolio(db, portfolio_id)
    if db_portfolio:
        update_data = portfolio_update.model_dump(exclude_unset=True)
        
        # 处理技术栈字段
        if 'technologies' in update_data and update_data['technologies'] is not None:
            import json
            update_data['technologies'] = json.dumps(update_data['technologies'])
        
        for field, value in update_data.items():
            setattr(db_portfolio, field, value)
        db.commit()
        db.refresh(db_portfolio)
    return db_portfolio


def delete_portfolio(db: Session, portfolio_id: UUID) -> bool:
    """删除项目组合"""
    db_portfolio = get_portfolio(db, portfolio_id)
    if db_portfolio:
        db.delete(db_portfolio)
        db.commit()
        return True
    return False


def get_completed_portfolios(db: Session, skip: int = 0, limit: int = 100) -> List[Portfolio]:
    """获取已完成的项目组合"""
    return (
        db.query(Portfolio)
        .filter(Portfolio.status == 'completed')
        .order_by(Portfolio.sort_order.asc())
        .offset(skip).limit(limit)
        .all()
    )