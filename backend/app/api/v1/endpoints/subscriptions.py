from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.subscription import Subscription, SubscriptionCreate, SubscriptionUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[Subscription])
def read_subscriptions(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve subscriptions
    """
    subscriptions = crud.get_subscriptions(
        db, 
        skip=skip, 
        limit=limit, 
        is_active=is_active
    )
    return subscriptions


@router.post("/", response_model=Subscription)
def create_subscription(
    *,
    db: Session = Depends(get_db),
    subscription_in: SubscriptionCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new subscription
    """
    # Check if user is already subscribed with the same email
    existing_subscription = db.query(crud.Subscription).filter(
        crud.Subscription.email == subscription_in.email
    ).first()
    if existing_subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already subscribed",
        )
    
    subscription = crud.create_subscription(db, subscription=subscription_in)
    return subscription


@router.get("/{subscription_id}", response_model=Subscription)
def read_subscription_by_id(
    subscription_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific subscription by id
    """
    subscription = crud.get_subscription(db, subscription_id=subscription_id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )
    
    return subscription


@router.put("/{subscription_id}", response_model=Subscription)
def update_subscription(
    *,
    db: Session = Depends(get_db),
    subscription_id: int,
    subscription_in: SubscriptionUpdate,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Update a subscription
    """
    subscription = crud.get_subscription(db, subscription_id=subscription_id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )
    
    subscription = crud.update_subscription(
        db, 
        subscription_id=subscription_id, 
        subscription_update=subscription_in
    )
    return subscription


@router.delete("/{subscription_id}", response_model=dict)
def delete_subscription(
    *,
    db: Session = Depends(get_db),
    subscription_id: int,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Delete a subscription
    """
    subscription = crud.get_subscription(db, subscription_id=subscription_id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )
    
    deleted = crud.delete_subscription(db, subscription_id=subscription_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )
    
    return {"message": "Subscription deleted successfully"}


@router.get("/count", response_model=int)
def get_subscribers_count(
    db: Session = Depends(get_db)
) -> Any:
    """
    Get total number of subscribers
    """
    count = crud.get_subscribers_count(db)
    return count