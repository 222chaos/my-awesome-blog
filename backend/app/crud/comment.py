from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate


def get_comment(db: Session, comment_id: UUID, with_relationships: bool = False) -> Optional[Comment]:
    query = db.query(Comment)
    if with_relationships:
        from sqlalchemy.orm import joinedload
        query = query.options(joinedload(Comment.article)).options(joinedload(Comment.author))
    return query.filter(Comment.id == comment_id).first()


def get_comments_by_article(
    db: Session,
    article_id: UUID,
    skip: int = 0,
    limit: int = 100,
    approved_only: bool = True,
    with_relationships: bool = False,
):
    query = db.query(Comment).filter(Comment.article_id == article_id)

    if approved_only:
        query = query.filter(Comment.is_approved == True)

    # Get top-level comments (no parent) first
    query = query.filter(Comment.parent_id.is_(None))

    if with_relationships:
        from sqlalchemy.orm import joinedload
        query = query.options(joinedload(Comment.author))

    return query.order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()


def get_comments_by_author(
    db: Session,
    author_id: UUID,
    skip: int = 0,
    limit: int = 100,
    with_relationships: bool = False,
):
    query = db.query(Comment).filter(Comment.author_id == author_id)

    if with_relationships:
        from sqlalchemy.orm import joinedload
        query = query.options(joinedload(Comment.article))

    return query.order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()


def get_replies(db: Session, comment_id: UUID, skip: int = 0, limit: int = 100, with_relationships: bool = False):
    query = db.query(Comment).filter(Comment.parent_id == comment_id)

    if with_relationships:
        from sqlalchemy.orm import joinedload
        query = query.options(joinedload(Comment.author))

    return query.order_by(Comment.created_at.asc()).offset(skip).limit(limit).all()


def create_comment(db: Session, comment: CommentCreate, author_id: UUID) -> Comment:
    db_comment = Comment(
        **comment.model_dump(),
        author_id=author_id,
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


def update_comment(db: Session, comment_id: UUID, comment_update: CommentUpdate) -> Optional[Comment]:
    db_comment = get_comment(db, comment_id)
    if not db_comment:
        return None
    
    update_data = comment_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_comment, field, value)
    
    db.commit()
    db.refresh(db_comment)
    return db_comment


def delete_comment(db: Session, comment_id: UUID) -> bool:
    db_comment = get_comment(db, comment_id)
    if not db_comment:
        return False
    
    db.delete(db_comment)
    db.commit()
    return True


def approve_comment(db: Session, comment_id: UUID) -> Optional[Comment]:
    db_comment = get_comment(db, comment_id)
    if not db_comment:
        return None
    
    db_comment.is_approved = True  # type: ignore
    db.commit()
    db.refresh(db_comment)
    return db_comment