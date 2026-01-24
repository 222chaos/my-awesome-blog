from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.portfolio import PortfolioItem, PortfolioItemCreate, PortfolioItemUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[PortfolioItem])
def read_portfolio_items(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve portfolio items
    """
    portfolio_items = crud.get_portfolio_items(
        db, 
        skip=skip, 
        limit=limit, 
        is_active=is_active
    )
    return portfolio_items


@router.post("/", response_model=PortfolioItem)
def create_portfolio_item(
    *,
    db: Session = Depends(get_db),
    portfolio_item_in: PortfolioItemCreate,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Create new portfolio item
    """
    portfolio_item = crud.create_portfolio_item(db, portfolio_item=portfolio_item_in)
    return portfolio_item


@router.get("/{portfolio_item_id}", response_model=PortfolioItem)
def read_portfolio_item_by_id(
    portfolio_item_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific portfolio item by id
    """
    portfolio_item = crud.get_portfolio_item(db, portfolio_item_id=portfolio_item_id)
    if not portfolio_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found",
        )
    
    return portfolio_item


@router.put("/{portfolio_item_id}", response_model=PortfolioItem)
def update_portfolio_item(
    *,
    db: Session = Depends(get_db),
    portfolio_item_id: int,
    portfolio_item_in: PortfolioItemUpdate,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Update a portfolio item
    """
    portfolio_item = crud.get_portfolio_item(db, portfolio_item_id=portfolio_item_id)
    if not portfolio_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found",
        )
    
    portfolio_item = crud.update_portfolio_item(
        db, 
        portfolio_item_id=portfolio_item_id, 
        portfolio_item_update=portfolio_item_in
    )
    return portfolio_item


@router.delete("/{portfolio_item_id}", response_model=dict)
def delete_portfolio_item(
    *,
    db: Session = Depends(get_db),
    portfolio_item_id: int,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Delete a portfolio item
    """
    portfolio_item = crud.get_portfolio_item(db, portfolio_item_id=portfolio_item_id)
    if not portfolio_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found",
        )
    
    deleted = crud.delete_portfolio_item(db, portfolio_item_id=portfolio_item_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found",
        )
    
    return {"message": "Portfolio item deleted successfully"}