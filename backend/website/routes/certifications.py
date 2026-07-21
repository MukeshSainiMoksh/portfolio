"""
Public Website Certification Routes
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from admin.services.certification_service import CertificationService
from admin.schemas.certifications import CertificationResponse

router = APIRouter()


@router.get("/", response_model=List[CertificationResponse])
async def get_certifications(db: AsyncSession = Depends(get_db)):
    return await CertificationService(db).get_active()
