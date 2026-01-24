from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.timeline_event import TimelineEvent, TimelineEventCreate, TimelineEventUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[TimelineEvent])
def read_timeline_events(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve timeline events
    """
    timeline_events = crud.get_timeline_events(
        db, 
        skip=skip, 
        limit=limit, 
        is_active=is_active
    )
    return timeline_events


@router.post("/", response_model=TimelineEvent)
def create_timeline_event(
    *,
    db: Session = Depends(get_db),
    timeline_event_in: TimelineEventCreate,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Create new timeline event
    """
    timeline_event = crud.create_timeline_event(db, timeline_event=timeline_event_in)
    return timeline_event


@router.get("/{timeline_event_id}", response_model=TimelineEvent)
def read_timeline_event_by_id(
    timeline_event_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific timeline event by id
    """
    timeline_event = crud.get_timeline_event(db, timeline_event_id=timeline_event_id)
    if not timeline_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timeline event not found",
        )
    
    return timeline_event


@router.put("/{timeline_event_id}", response_model=TimelineEvent)
def update_timeline_event(
    *,
    db: Session = Depends(get_db),
    timeline_event_id: int,
    timeline_event_in: TimelineEventUpdate,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Update a timeline event
    """
    timeline_event = crud.get_timeline_event(db, timeline_event_id=timeline_event_id)
    if not timeline_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timeline event not found",
        )
    
    timeline_event = crud.update_timeline_event(
        db, 
        timeline_event_id=timeline_event_id, 
        timeline_event_update=timeline_event_in
    )
    return timeline_event


@router.delete("/{timeline_event_id}", response_model=dict)
def delete_timeline_event(
    *,
    db: Session = Depends(get_db),
    timeline_event_id: int,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Delete a timeline event
    """
    timeline_event = crud.get_timeline_event(db, timeline_event_id=timeline_event_id)
    if not timeline_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timeline event not found",
        )
    
    deleted = crud.delete_timeline_event(db, timeline_event_id=timeline_event_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timeline event not found",
        )
    
    return {"message": "Timeline event deleted successfully"}