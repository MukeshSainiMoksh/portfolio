"""
Website Contact API Routes
"""

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.email import send_contact_notification
from website.schemas.contact import ContactFormData, ContactResponse
from website.services.contact_service import ContactService

router = APIRouter()


@router.post("/submit", response_model=ContactResponse)
async def submit_contact_form(
    contact_data: ContactFormData,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Submit contact form"""
    contact_service = ContactService(db)

    try:
        contact = await contact_service.create_contact_submission(contact_data)

        background_tasks.add_task(
            send_contact_notification,
            name=contact_data.name,
            email=contact_data.email,
            subject=contact_data.subject,
            message=contact_data.message,
        )

        return ContactResponse(
            success=True,
            message="Thank you for your message! I'll get back to you soon.",
            contact_id=contact.id
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to submit contact form. Please try again later."
        )


@router.get("/health")
async def contact_health_check():
    """Contact API health check"""
    return {"status": "healthy", "service": "contact"}