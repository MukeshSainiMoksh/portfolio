"""
Admin Media Management Routes
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
import os
import uuid
from pathlib import Path

from core.database import get_db
from core.security import get_current_admin_user
from core.config import settings
from admin.schemas.media import MediaFileResponse, MediaFileCreate
from admin.services.media_service import MediaService

router = APIRouter()

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    'image': {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'},
    'document': {'.pdf', '.doc', '.docx', '.txt'},
    'video': {'.mp4', '.avi', '.mov', '.wmv'},
}

def get_file_type(filename: str) -> str:
    """Determine file type based on extension"""
    ext = Path(filename).suffix.lower()
    for file_type, extensions in ALLOWED_EXTENSIONS.items():
        if ext in extensions:
            return file_type
    return 'other'


@router.get("/files", response_model=List[MediaFileResponse])
async def get_media_files(
    file_type: str = None,
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
    
    # Validate file size
    if file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
        )
    
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    all_allowed = set()
    for extensions in ALLOWED_EXTENSIONS.values():
        all_allowed.update(extensions)
    
    if file_ext not in all_allowed:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(all_allowed)}"
        )
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{file_ext}"
    file_path = Path(settings.UPLOAD_DIR) / filename
    
    # Ensure upload directory exists
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Create database record
        media_service = MediaService(db)
        media_data = MediaFileCreate(
            filename=file.filename,
            file_path=str(file_path),
            file_url=f"/uploads/{filename}",
            file_type=get_file_type(file.filename),
            file_size=file.size,
            mime_type=file.content_type,
            alt_text=alt_text,
            description=description
        )
        
        return await media_service.create_media_file(media_data)
        
    except Exception as e:
        # Clean up file if database operation fails
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


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
    
    # Delete physical file
    try:
        file_path = Path(media_file.file_path)
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        # Log error but don't fail the request
        print(f"Warning: Could not delete physical file {media_file.file_path}: {e}")
    
    return {"message": "Media file deleted successfully"}


@router.post("/bulk-upload", response_model=List[MediaFileResponse])
async def bulk_upload_files(
    files: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Upload multiple files at once"""
    
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed per bulk upload")
    
    uploaded_files = []
    failed_files = []
    
    for file in files:
        try:
            # Validate file size
            if file.size > settings.MAX_FILE_SIZE:
                failed_files.append(f"{file.filename}: File too large")
                continue
            
            # Validate file extension
            file_ext = Path(file.filename).suffix.lower()
            all_allowed = set()
            for extensions in ALLOWED_EXTENSIONS.values():
                all_allowed.update(extensions)
            
            if file_ext not in all_allowed:
                failed_files.append(f"{file.filename}: File type not allowed")
                continue
            
            # Generate unique filename
            file_id = str(uuid.uuid4())
            filename = f"{file_id}{file_ext}"
            file_path = Path(settings.UPLOAD_DIR) / filename
            
            # Save file
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Create database record
            media_service = MediaService(db)
            media_data = MediaFileCreate(
                filename=file.filename,
                file_path=str(file_path),
                file_url=f"/uploads/{filename}",
                file_type=get_file_type(file.filename),
                file_size=file.size,
                mime_type=file.content_type,
                alt_text="",
                description=""
            )
            
            uploaded_file = await media_service.create_media_file(media_data)
            uploaded_files.append(uploaded_file)
            
        except Exception as e:
            failed_files.append(f"{file.filename}: {str(e)}")
    
    if failed_files:
        # Return partial success with error details
        return {
            "uploaded": uploaded_files,
            "failed": failed_files,
            "message": f"Uploaded {len(uploaded_files)} files, {len(failed_files)} failed"
        }
    
    return uploaded_files