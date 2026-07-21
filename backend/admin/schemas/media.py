"""
Admin Media Management Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MediaFileCreate(BaseModel):
    filename: str = Field(..., description="Original filename from user")
    file_path: str = Field(..., description="Filesystem path")
    file_url: str = Field(..., description="Public URL e.g. /uploads/uuid.jpg")
    file_type: str = Field(..., description="File category: image/document/video")
    file_size: int = Field(..., description="File size in bytes")
    mime_type: Optional[str] = Field(None, description="MIME type")
    alt_text: Optional[str] = Field(None)
    description: Optional[str] = Field(None)


class MediaFileUpdate(BaseModel):
    alt_text: Optional[str] = None
    description: Optional[str] = None


class MediaFileResponse(BaseModel):
    id: int
    filename: str           # UUID-based stored filename
    original_name: str      # Original user filename
    file_url: str           # Public URL
    file_type: str
    mime_type: Optional[str] = None
    file_size: int
    alt_text: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
