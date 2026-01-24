from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.comment import Comment, CommentCreate, CommentUpdate, CommentWithAuthor
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[CommentWithAuthor])
def read_comments(
    skip: int = 0,
    limit: int = 100,
    article_id: Optional[int] = Query(None, description="Filter by article ID"),
    author_id: Optional[int] = Query(None, description="Filter by author ID"),
    approved_only: bool = Query(True, description="Only return approved comments"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve comments
    """
    if article_id:
        comments = crud.get_comments_by_article(
            db, 
            article_id=article_id,
            skip=skip,
            limit=limit,
            approved_only=approved_only
        )
    elif author_id:
        comments = crud.get_comments_by_author(
            db,
            author_id=author_id,
            skip=skip,
            limit=limit
        )
    else:
        # In a real implementation, you might want to limit this or require filters
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide either article_id or author_id filter",
        )
    
    return comments


@router.get("/{comment_id}", response_model=CommentWithAuthor)
def read_comment_by_id(
    comment_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific comment by id
    """
    comment = crud.get_comment(db, comment_id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )
    return comment


@router.get("/{comment_id}/replies", response_model=List[CommentWithAuthor])
def read_comment_replies(
    comment_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get replies to a comment
    """
    replies = crud.get_replies(db, comment_id=comment_id, skip=skip, limit=limit)
    return replies


@router.post("/", response_model=Comment)
def create_comment(
    *,
    db: Session = Depends(get_db),
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new comment
    """
    comment = crud.create_comment(db, comment=comment_in, author_id=current_user.id)  # type: ignore
    return comment


@router.put("/{comment_id}", response_model=Comment)
def update_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: int,
    comment_in: CommentUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update a comment
    """
    comment = crud.get_comment(db, comment_id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )
    
    # Check permission: only author or superuser can update
    if comment.author_id != current_user.id and not current_user.is_superuser:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this comment",
        )
    
    comment = crud.update_comment(db, comment_id=comment_id, comment_update=comment_in)
    return comment


@router.delete("/{comment_id}", response_model=dict)
def delete_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Delete a comment
    """
    comment = crud.get_comment(db, comment_id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )
    
    # Check permission: only author, article author, or superuser can delete
    if (comment.author_id != current_user.id and 
        comment.article.author_id != current_user.id and 
        not current_user.is_superuser):  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this comment",
        )
    
    deleted = crud.delete_comment(db, comment_id=comment_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )
    
    return {"message": "Comment deleted successfully"}


@router.post("/{comment_id}/approve", response_model=Comment)
def approve_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Approve a comment (admin or article author only)
    """
    # First get the comment to check permissions
    comment = crud.get_comment(db, comment_id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )
    
    # Check permission: only article author or superuser can approve
    if comment.article.author_id != current_user.id and not current_user.is_superuser:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to approve this comment",
        )
    
    # Now approve the comment
    comment = crud.approve_comment(db, comment_id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )
    
    return comment