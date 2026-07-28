"""
Admin Site Assets Routes — resume (CV) and intro video.

Fixed, replaceable files served from /uploads/site/ so the public website
always points at a stable URL. Uploading again overwrites the previous file.
"""

import logging
from pathlib import Path
from typing import Optional

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel

from core.config import settings
from core.security import get_current_admin_user

logger = logging.getLogger("portfolio.assets")

router = APIRouter()

SITE_DIR = Path(settings.UPLOAD_DIR) / "site"

RESUME_NAME = "resume.pdf"
VIDEO_NAME = "intro-video.mp4"

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


def asset_info(filename: str) -> AssetInfo:
    path = SITE_DIR / filename
    if not path.exists():
        return AssetInfo(exists=False)
    stat = path.stat()
    return AssetInfo(
        exists=True,
        url=f"/uploads/site/{filename}?v={int(stat.st_mtime)}",
        size_bytes=stat.st_size,
        updated_at=stat.st_mtime,
    )


async def save_asset(
    file: UploadFile,
    target_name: str,
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

    SITE_DIR.mkdir(parents=True, exist_ok=True)
    tmp_path = SITE_DIR / f".{target_name}.tmp"
    final_path = SITE_DIR / target_name

    size = 0
    try:
        async with aiofiles.open(tmp_path, "wb") as out:
            while chunk := await file.read(CHUNK):
                size += len(chunk)
                if size > max_size:
                    raise HTTPException(
                        status_code=413,
                        detail=f"File too large. Maximum is {max_size // (1024*1024)}MB",
                    )
                await out.write(chunk)

        # atomic-ish replace so the public URL never serves a half-written file
        tmp_path.replace(final_path)
        logger.info("Site asset updated: %s (%d bytes)", target_name, size)
        return asset_info(target_name)

    except HTTPException:
        tmp_path.unlink(missing_ok=True)
        raise
    except Exception:
        logger.exception("Asset upload failed for %s", target_name)
        tmp_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail="Upload failed")


@router.get("/", response_model=AssetsStatus)
async def get_assets_status(current_user=Depends(get_current_admin_user)):
    """Current status of resume and intro video"""
    return AssetsStatus(
        resume=asset_info(RESUME_NAME),
        intro_video=asset_info(VIDEO_NAME),
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
