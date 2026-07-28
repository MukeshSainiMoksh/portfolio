"""
Admin Contact Inbox Service
"""

from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.blog import Contact
from admin.schemas.contacts import ContactMessageUpdate


class AdminContactService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_messages(self, unread_only: bool = False) -> List[Contact]:
        query = select(Contact).order_by(Contact.created_at.desc())
        if unread_only:
            query = query.where(Contact.is_read == False)  # noqa: E712
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_message(self, message_id: int) -> Optional[Contact]:
        result = await self.db.execute(select(Contact).where(Contact.id == message_id))
        return result.scalar_one_or_none()

    async def update_message(self, message_id: int, data: ContactMessageUpdate) -> Optional[Contact]:
        message = await self.get_message(message_id)
        if not message:
            return None
        if data.is_read is not None:
            message.is_read = data.is_read
        if data.is_replied is not None:
            message.is_replied = data.is_replied
        await self.db.commit()
        await self.db.refresh(message)
        return message

    async def delete_message(self, message_id: int) -> bool:
        message = await self.get_message(message_id)
        if not message:
            return False
        await self.db.delete(message)
        await self.db.commit()
        return True

    async def get_counts(self) -> dict:
        total = (await self.db.execute(select(func.count(Contact.id)))).scalar() or 0
        unread = (
            await self.db.execute(
                select(func.count(Contact.id)).where(Contact.is_read == False)  # noqa: E712
            )
        ).scalar() or 0
        return {"unread": unread, "total": total}
