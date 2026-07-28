"""
Admin Contact Inbox Schemas
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    is_read: bool
    is_replied: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ContactMessageUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_replied: Optional[bool] = None


class UnreadCountResponse(BaseModel):
    unread: int
    total: int
