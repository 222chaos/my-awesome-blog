from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app import crud
from app.schemas.user import User, UserCreate, UserUpdate

router = APIRouter()


@router.get("/", response_model=List[User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve users
    """
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=User)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Create new user (admin only)
    """
    # Check if user exists
    user = crud.get_user_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username already exists",
        )

    user = crud.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    user = crud.create_user(db, user=user_in)
    return user


@router.get("/{user_id}", response_model=User)
def read_user_by_id(
    user_id: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific user by id
    """
    from uuid import UUID
    user_uuid = UUID(user_id)
    user = crud.get_user(db, user_id=user_uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.put("/{user_id}", response_model=User)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: str,
    user_in: UserUpdate
) -> Any:
    """
    Update a user
    """
    from uuid import UUID
    user_uuid = UUID(user_id)
    user = crud.get_user(db, user_id=user_uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user = crud.update_user(db, user_id=user_uuid, user_update=user_in)
    return user


@router.delete("/{user_id}", response_model=dict)
def delete_user(
    *,
    db: Session = Depends(get_db),
    user_id: str
) -> Any:
    """
    Delete a user
    """
    from uuid import UUID
    user_uuid = UUID(user_id)
    deleted = crud.delete_user(db, user_id=user_uuid)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {"message": "User deleted successfully"}