from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, field_serializer


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
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer('id')
    def serialize_id(self, value: UUID) -> str:
        return str(value)

    model_config = {'from_attributes': True}


class TypewriterContent(TypewriterContentInDBBase):
    pass


class TypewriterContentList(BaseModel):
    contents: List[TypewriterContent]
    total: int
