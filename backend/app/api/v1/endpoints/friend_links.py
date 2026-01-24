from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.friend_link import FriendLink, FriendLinkCreate, FriendLinkUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[FriendLink])
def read_friend_links(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve friend links
    """
    friend_links = crud.get_friend_links(
        db, 
        skip=skip, 
        limit=limit, 
        is_active=is_active
    )
    return friend_links


@router.post("/", response_model=FriendLink)
def create_friend_link(
    *,
    db: Session = Depends(get_db),
    friend_link_in: FriendLinkCreate,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Create new friend link
    """
    friend_link = crud.create_friend_link(db, friend_link=friend_link_in)
    return friend_link


@router.get("/{friend_link_id}", response_model=FriendLink)
def read_friend_link_by_id(
    friend_link_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific friend link by id
    """
    friend_link = crud.get_friend_link(db, friend_link_id=friend_link_id)
    if not friend_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend link not found",
        )
    
    return friend_link


@router.put("/{friend_link_id}", response_model=FriendLink)
def update_friend_link(
    *,
    db: Session = Depends(get_db),
    friend_link_id: int,
    friend_link_in: FriendLinkUpdate,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Update a friend link
    """
    friend_link = crud.get_friend_link(db, friend_link_id=friend_link_id)
    if not friend_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend link not found",
        )
    
    friend_link = crud.update_friend_link(db, friend_link_id=friend_link_id, friend_link_update=friend_link_in)
    return friend_link


@router.delete("/{friend_link_id}", response_model=dict)
def delete_friend_link(
    *,
    db: Session = Depends(get_db),
    friend_link_id: int,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Delete a friend link
    """
    friend_link = crud.get_friend_link(db, friend_link_id=friend_link_id)
    if not friend_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend link not found",
        )
    
    deleted = crud.delete_friend_link(db, friend_link_id=friend_link_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend link not found",
        )
    
    return {"message": "Friend link deleted successfully"}