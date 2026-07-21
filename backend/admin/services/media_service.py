"""
Media Service for Admin Operations
"""

from pathlib import Path
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.media import MediaFile
from admin.schemas.media import MediaFileCreate


class MediaService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_media_files(self, file_type: Optional[str] = None) -> List[MediaFile]:
        query = select(MediaFile).where(MediaFile.is_active == True).order_by(MediaFile.created_at.desc())
        if file_type:
            query = query.where(MediaFile.file_type == file_type)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_media_file(self, file_id: int) -> Optional[MediaFile]:
        result = await self.db.execute(
            select(MediaFile).where(MediaFile.id == file_id, MediaFile.is_active == True)
        )
        return result.scalar_one_or_none()

    async def create_media_file(self, data: MediaFileCreate) -> MediaFile:
        # data.filename = original name ("photo.jpg")
        # data.file_url = "/uploads/uuid.jpg" — extract stored filename from it
        stored_filename = Path(data.file_url).name

        obj = MediaFile(
            filename=stored_filename,
            original_name=data.filename,
            file_path=data.file_path,
            file_url=data.file_url,
            file_type=data.file_type,
            mime_type=data.mime_type,
            file_size=data.file_size,
            alt_text=data.alt_text,
            description=data.description,
        )
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update_media_file(self, file_id: int, alt_text: str, description: str) -> Optional[MediaFile]:
        result = await self.db.execute(select(MediaFile).where(MediaFile.id == file_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return None
        obj.alt_text = alt_text
        obj.description = description
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete_media_file(self, file_id: int) -> bool:
        result = await self.db.execute(select(MediaFile).where(MediaFile.id == file_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return False
        await self.db.delete(obj)
        await self.db.commit()
        return True
