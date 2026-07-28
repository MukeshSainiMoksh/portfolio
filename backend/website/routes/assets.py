"""
Public Site Assets — tells the website whether an uploaded resume/intro video
exists (with cache-busted URLs). Website falls back to bundled files if absent.
"""

from fastapi import APIRouter

from admin.routes.assets import RESUME_NAME, VIDEO_NAME, AssetsStatus, asset_info

router = APIRouter()


@router.get("/", response_model=AssetsStatus)
async def get_public_assets():
    """Public status of resume and intro video"""
    return AssetsStatus(
        resume=asset_info(RESUME_NAME),
        intro_video=asset_info(VIDEO_NAME),
    )
