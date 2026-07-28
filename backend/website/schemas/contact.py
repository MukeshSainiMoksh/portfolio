"""
Contact Form Schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class ContactFormData(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    subject: Optional[str] = Field(None, max_length=300)
    message: str = Field(min_length=1, max_length=5000)


class ContactResponse(BaseModel):
    success: bool
    message: str
    contact_id: Optional[int] = None
