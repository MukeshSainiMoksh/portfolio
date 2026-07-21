"""
Contact Form Schemas
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class ContactFormData(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str


class ContactResponse(BaseModel):
    success: bool
    message: str
    contact_id: Optional[int] = None
