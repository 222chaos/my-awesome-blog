from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


# Base schema
class TypewriterContentBase(BaseModel):
    text: str
    priority: int = 0
    is_active: bool = True


# Create schema
class TypewriterContentCreate(TypewriterContentBase):
    pass


# Update schema
class TypewriterContentUpdate(BaseModel):
    text: Optional[str] = None
    priority: Optional[int] = None
    is_active: Optional[bool] = None


# Response schema
class TypewriterContentInDBBase(TypewriterContentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {'from_attributes': True}


class TypewriterContent(TypewriterContentInDBBase):
    pass


class TypewriterContentList(BaseModel):
    contents: List[TypewriterContent]
    total: int
