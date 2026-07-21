"""
Contact Service
"""

from sqlalchemy.ext.asyncio import AsyncSession

from models.blog import Contact
from website.schemas.contact import ContactFormData


class ContactService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_contact_submission(self, data: ContactFormData) -> Contact:
        contact = Contact(
            name=data.name,
            email=data.email,
            subject=data.subject,
            message=data.message,
        )
        self.db.add(contact)
        await self.db.commit()
        await self.db.refresh(contact)
        return contact
