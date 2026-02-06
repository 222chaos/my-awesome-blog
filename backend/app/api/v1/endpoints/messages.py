from typing import Any, List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.message import (
    Message, MessageCreate, MessageUpdate,
    MessageWithAuthor, MessageWithReplies
)
from app.models.user import User
from uuid import UUID

router = APIRouter()


@router.get("/", response_model=List[MessageWithAuthor])
def read_messages(
    skip: int = 0,
    limit: int = 100,
    danmaku_only: bool = Query(False, description="Only return danmaku messages"),
    author_id: Optional[str] = Query(None, description="Filter by author ID"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve messages
    """
    if author_id:
        author_uuid = UUID(author_id)
        messages = crud.get_messages_by_author(
            db,
            author_id=author_uuid,
            skip=skip,
            limit=limit,
            with_relationships=True
        )
    else:
        messages = crud.get_messages(
            db,
            skip=skip,
            limit=limit,
            danmaku_only=danmaku_only,
            with_relationships=True
        )
    return messages


@router.get("/danmaku", response_model=List[MessageWithAuthor])
def read_danmaku_messages(
    limit: int = Query(50, ge=1, le=100, description="Number of danmaku messages to return"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get random danmaku messages for display
    """
    messages = crud.get_danmaku_messages(
        db,
        limit=limit,
        with_relationships=True
    )
    return messages


@router.post("/", response_model=Message)
def create_message(
    *,
    db: Session = Depends(get_db),
    message_in: MessageCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new message
    """
    # Set user level based on some logic (simplified here)
    message = crud.create_message(
        db,
        message=message_in,
        author_id=current_user.id  # type: ignore
    )
    return message


@router.get("/trending", response_model=List[MessageWithAuthor])
def read_trending_messages(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get trending messages (most liked)
    """
    try:
        messages = crud.get_trending_messages(
            db,
            limit=limit,
            with_relationships=True
        )
        return messages
    except Exception as e:
        from app.utils.logger import app_logger
        app_logger.error(f"Error getting trending messages: {e}")
        raise


@router.get("/stats/activity", response_model=List[Dict[str, Any]])
def read_message_activity(
    days: int = Query(7, ge=1, le=30),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get message activity statistics for the last N days
    """
    try:
        stats = crud.get_message_activity(
            db,
            days=days
        )
        return stats
    except Exception as e:
        from app.utils.logger import app_logger
        app_logger.error(f"Error getting message activity: {e}")
        raise


@router.get("/{message_id}", response_model=MessageWithAuthor)
def read_message_by_id(
    message_id: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific message by id
    """
    try:
        message_uuid = UUID(message_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = crud.get_message(db, message_id=message_uuid, with_relationships=True)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    return message


@router.get("/{message_id}/replies", response_model=List[MessageWithAuthor])
def read_message_replies(
    message_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get replies to a message
    """
    try:
        message_uuid = UUID(message_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = crud.get_message(db, message_id=message_uuid)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    replies = crud.get_replies(
        db,
        message_id=message_uuid,
        skip=skip,
        limit=limit,
        with_relationships=True
    )
    return replies


@router.put("/{message_id}", response_model=Message)
def update_message(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    message_in: MessageUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update a message
    """
    try:
        message_uuid = UUID(message_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = crud.get_message(db, message_id=message_uuid)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    # Check permission: only author or superuser can update
    if message.author_id != current_user.id and not current_user.is_superuser:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this message",
        )
    
    message = crud.update_message(db, message_id=message_uuid, message_update=message_in)
    return message


@router.delete("/{message_id}", response_model=dict)
def delete_message(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Delete a message (soft delete)
    """
    try:
        message_uuid = UUID(message_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = crud.get_message(db, message_id=message_uuid)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    # Check permission: only author or superuser can delete
    if message.author_id != current_user.id and not current_user.is_superuser:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this message",
        )
    
    deleted = crud.delete_message(db, message_id=message_uuid)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    return {"message": "Message deleted successfully"}


@router.post("/{message_id}/like", response_model=Message)
def like_message(
    message_id: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Like a message
    """
    try:
        message_uuid = UUID(message_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = crud.like_message(db, message_id=message_uuid)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    return message


@router.post("/{message_id}/unlike", response_model=Message)
def unlike_message(
    message_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Unlike a message (requires authentication)
    """
    try:
        message_uuid = UUID(message_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = crud.unlike_message(db, message_id=message_uuid)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    return message


@router.delete("/{message_id}/hard", response_model=dict)
def hard_delete_message(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Hard delete a message (admin only)
    """
    try:
        message_uuid = UUID(message_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = crud.get_message(db, message_id=message_uuid)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    deleted = crud.hard_delete_message(db, message_id=message_uuid)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    return {"message": "Message permanently deleted"}
