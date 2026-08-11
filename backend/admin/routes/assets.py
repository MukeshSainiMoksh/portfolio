"""
Admin Site Assets Routes — resume (CV) and intro video.

Fixed, replaceable files served from /uploads/site/ so the public website
always points at a stable URL. Uploading again overwrites the previous file.
"""

import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel

from core.security import get_current_admin_user
from core.storage import get_storage, spooled_copy

logger = logging.getLogger("portfolio.assets")

router = APIRouter()

# Storage keys. Fixed names so the public URL is stable across replacements.
RESUME_NAME = "site/resume.pdf"
VIDEO_NAME = "site/intro-video.mp4"

RESUME_MAX = 10 * 1024 * 1024    # 10MB
VIDEO_MAX = 100 * 1024 * 1024    # 100MB

RESUME_EXTS = {".pdf"}
VIDEO_EXTS = {".mp4", ".webm", ".mov"}

CHUNK = 1024 * 1024


class AssetInfo(BaseModel):
    exists: bool
    url: Optional[str] = None      # public path with cache-bust version
    size_bytes: Optional[int] = None
    updated_at: Optional[float] = None


class AssetsStatus(BaseModel):
    resume: AssetInfo
    intro_video: AssetInfo


async def asset_info(key: str) -> AssetInfo:
    storage = get_storage()
    stored = await storage.stat(key)
    if stored is None:
        return AssetInfo(exists=False)
    # ?v= busts caches when the file is replaced under the same stable name
    return AssetInfo(
        exists=True,
        url=f"{storage.url(key)}?v={int(stored.modified_at)}",
        size_bytes=stored.size,
        updated_at=stored.modified_at,
    )


async def save_asset(
    file: UploadFile,
    key: str,
    allowed_exts: set,
    max_size: int,
) -> AssetInfo:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")

    ext = Path(file.filename).suffix.lower()
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed: {', '.join(sorted(allowed_exts))}",
        )

    # Buffer the whole upload before writing, so exceeding the limit never
    # leaves a truncated file at the stable public URL.
    size = 0
    buffer = spooled_copy()
    try:
        while chunk := await file.read(CHUNK):
            size += len(chunk)
            if size > max_size:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Maximum is {max_size // (1024*1024)}MB",
                )
            buffer.write(chunk)

        await get_storage().save(key, buffer, file.content_type)
        logger.info("Site asset updated: %s (%d bytes)", key, size)
        return await asset_info(key)

    except HTTPException:
        raise
    except Exception:
        logger.exception("Asset upload failed for %s", key)
        raise HTTPException(status_code=500, detail="Upload failed")
    finally:
        buffer.close()


@router.get("/", response_model=AssetsStatus)
async def get_assets_status(current_user=Depends(get_current_admin_user)):
    """Current status of resume and intro video"""
    return AssetsStatus(
        resume=await asset_info(RESUME_NAME),
        intro_video=await asset_info(VIDEO_NAME),
    )


@router.post("/resume", response_model=AssetInfo)
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_admin_user),
):
    """Upload/replace the resume (PDF, max 10MB)"""
    return await save_asset(file, RESUME_NAME, RESUME_EXTS, RESUME_MAX)


@router.post("/intro-video", response_model=AssetInfo)
async def upload_intro_video(
    file: UploadFile = File(...),
    current_user=Depends(get_current_admin_user),
):
    """Upload/replace the intro video (mp4/webm/mov, max 100MB)"""
    return await save_asset(file, VIDEO_NAME, VIDEO_EXTS, VIDEO_MAX)
