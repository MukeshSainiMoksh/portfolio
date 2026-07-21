"""
Certification Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CertificationCreate(BaseModel):
    name: str = Field(..., description="Certification name")
    issuer: str = Field(..., description="Issuing organization")
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    description: Optional[str] = None
    badge_url: Optional[str] = None
    display_order: int = 0


class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    description: Optional[str] = None
    badge_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class CertificationResponse(BaseModel):
    id: int
    name: str
    issuer: str
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    description: Optional[str] = None
    badge_url: Optional[str] = None
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
