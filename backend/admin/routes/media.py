"""
Admin Media Management Routes
"""

import logging
import uuid
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_admin_user
from core.config import settings
from core.storage import get_storage, spooled_copy
from admin.schemas.media import BulkUploadResponse, MediaFileResponse, MediaFileCreate
from admin.services.media_service import MediaService

logger = logging.getLogger("portfolio.media")

router = APIRouter()

# Allowed file extensions
# NOTE: .svg intentionally excluded — SVGs served from /uploads can contain
# scripts (stored XSS). Re-add only with sanitization or attachment headers.
ALLOWED_EXTENSIONS = {
    'image': {'.jpg', '.jpeg', '.png', '.gif', '.webp'},
    'document': {'.pdf', '.doc', '.docx', '.txt'},
    'video': {'.mp4', '.avi', '.mov', '.wmv'},
}

ALL_ALLOWED = {ext for exts in ALLOWED_EXTENSIONS.values() for ext in exts}

UPLOAD_CHUNK_SIZE = 1024 * 1024  # 1MB


def get_file_type(filename: str) -> str:
    """Determine file type based on extension"""
    ext = Path(filename).suffix.lower()
    for file_type, extensions in ALLOWED_EXTENSIONS.items():
        if ext in extensions:
            return file_type
    return 'other'


async def _save_upload(
    file: UploadFile,
    db: AsyncSession,
    alt_text: str = "",
    description: str = "",
) -> MediaFileResponse:
    """Validate, stream to disk, and create the DB record for one upload.

    Raises HTTPException on validation failure; cleans up the file on DB failure.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")

    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALL_ALLOWED:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(sorted(ALL_ALLOWED))}"
        )

    # client-declared size — quick reject; the real limit is enforced while streaming
    if file.size is not None and file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
        )

    key = f"{uuid.uuid4()}{file_ext}"
    storage = get_storage()

    # Buffer first so the size limit is enforced before anything is written to
    # the backend — a rejected upload must not leave a partial object behind.
    size = 0
    buffer = spooled_copy()
    try:
        while chunk := await file.read(UPLOAD_CHUNK_SIZE):
            size += len(chunk)
            if size > settings.MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
                )
            buffer.write(chunk)

        await storage.save(key, buffer, file.content_type)

        try:
            media_service = MediaService(db)
            media_data = MediaFileCreate(
                filename=file.filename,
                # file_path records the storage key; it is only used to locate
                # the object again on delete.
                file_path=key,
                file_url=storage.url(key),
                file_type=get_file_type(file.filename),
                file_size=size,
                mime_type=file.content_type,
                alt_text=alt_text,
                description=description,
            )
            return await media_service.create_media_file(media_data)
        except Exception:
            # DB write failed after the object landed — don't orphan it
            await storage.delete(key)
            raise

    except HTTPException:
        raise
    except Exception:
        logger.exception("Upload failed for %s", file.filename)
        raise HTTPException(status_code=500, detail="Upload failed")
    finally:
        buffer.close()


@router.get("/files", response_model=List[MediaFileResponse])
async def get_media_files(
    file_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all media files or by type"""
    media_service = MediaService(db)
    return await media_service.get_media_files(file_type)


@router.post("/upload", response_model=MediaFileResponse)
async def upload_file(
    file: UploadFile = File(...),
    alt_text: str = Form(""),
    description: str = Form(""),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Upload a new media file"""
    return await _save_upload(file, db, alt_text, description)


@router.get("/files/{file_id}", response_model=MediaFileResponse)
async def get_media_file(
    file_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get specific media file"""
    media_service = MediaService(db)
    media_file = await media_service.get_media_file(file_id)
    if not media_file:
        raise HTTPException(status_code=404, detail="Media file not found")
    return media_file


@router.put("/files/{file_id}", response_model=MediaFileResponse)
async def update_media_file(
    file_id: int,
    alt_text: str = Form(""),
    description: str = Form(""),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update media file metadata"""
    media_service = MediaService(db)
    media_file = await media_service.update_media_file(file_id, alt_text, description)
    if not media_file:
        raise HTTPException(status_code=404, detail="Media file not found")
    return media_file


@router.delete("/files/{file_id}")
async def delete_media_file(
    file_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete media file"""
    media_service = MediaService(db)

    # Get file info before deletion
    media_file = await media_service.get_media_file(file_id)
    if not media_file:
        raise HTTPException(status_code=404, detail="Media file not found")

    # Delete from database
    success = await media_service.delete_media_file(file_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete from database")

    # Remove the stored object. Records created before the storage layer hold
    # an absolute filesystem path rather than a key, so take the basename —
    # media keys are flat and that resolves both shapes.
    try:
        await get_storage().delete(Path(media_file.file_path).name)
    except Exception:
        logger.exception("Could not delete stored object for %s", media_file.file_path)

    return {"message": "Media file deleted successfully"}


@router.post("/bulk-upload", response_model=BulkUploadResponse)
async def bulk_upload_files(
    files: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Upload multiple files at once"""

    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed per bulk upload")

    uploaded_files: List[MediaFileResponse] = []
    failed_files: List[str] = []

    for file in files:
        try:
            uploaded_files.append(await _save_upload(file, db))
        except HTTPException as e:
            failed_files.append(f"{file.filename}: {e.detail}")
        except Exception:
            logger.exception("Bulk upload failed for %s", file.filename)
            failed_files.append(f"{file.filename}: internal error")

    return BulkUploadResponse(
        uploaded=uploaded_files,
        failed=failed_files,
        message=f"Uploaded {len(uploaded_files)} files, {len(failed_files)} failed",
    )
