"""
Media and File Upload Models
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, BigInteger
from sqlalchemy.sql import func
from core.database import Base


class MediaFile(Base):
    __tablename__ = "media_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)           # UUID-based stored filename
    original_name = Column(String(255), nullable=False)      # Original user filename
    file_path = Column(String(500), nullable=False)          # Filesystem path
    file_url = Column(String(500), nullable=False)           # Public URL e.g. /uploads/uuid.jpg
    file_type = Column(String(100), nullable=False)          # Category: image/document/video
    mime_type = Column(String(100), nullable=True)           # MIME type e.g. image/jpeg
    file_size = Column(BigInteger, nullable=False)           # Size in bytes

    alt_text = Column(String(500), nullable=True)
    description = Column(String(500), nullable=True)
    usage_context = Column(String(200), nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<MediaFile(filename='{self.filename}', type='{self.file_type}')>"
