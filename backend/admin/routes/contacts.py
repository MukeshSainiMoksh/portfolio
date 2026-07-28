"""
Admin Contact Inbox Routes
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_admin_user
from admin.schemas.contacts import (
    ContactMessageResponse,
    ContactMessageUpdate,
    UnreadCountResponse,
)
from admin.services.contact_service import AdminContactService

router = APIRouter()


@router.get("/", response_model=List[ContactMessageResponse])
async def get_messages(
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user),
):
    """List contact form messages, newest first"""
    return await AdminContactService(db).get_messages(unread_only)


@router.get("/unread-count", response_model=UnreadCountResponse)
async def get_unread_count(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user),
):
    """Unread/total counts — for the sidebar badge"""
    return await AdminContactService(db).get_counts()


@router.patch("/{message_id}", response_model=ContactMessageResponse)
async def update_message(
    message_id: int,
    data: ContactMessageUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user),
):
    """Mark a message read/unread or replied"""
    message = await AdminContactService(db).update_message(message_id, data)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message


@router.delete("/{message_id}")
async def delete_message(
    message_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user),
):
    """Delete a message"""
    if not await AdminContactService(db).delete_message(message_id):
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Deleted successfully"}
