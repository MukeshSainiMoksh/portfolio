"""
Admin Certification Routes
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_admin_user
from admin.schemas.certifications import CertificationCreate, CertificationUpdate, CertificationResponse
from admin.services.certification_service import CertificationService

router = APIRouter()


@router.get("/", response_model=List[CertificationResponse])
async def get_certifications(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_admin_user)):
    return await CertificationService(db).get_all()


@router.post("/", response_model=CertificationResponse)
async def create_certification(data: CertificationCreate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_admin_user)):
    return await CertificationService(db).create(data)


@router.put("/{cert_id}", response_model=CertificationResponse)
async def update_certification(cert_id: int, data: CertificationUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_admin_user)):
    obj = await CertificationService(db).update(cert_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Certification not found")
    return obj


@router.delete("/{cert_id}")
async def delete_certification(cert_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_admin_user)):
    success = await CertificationService(db).delete(cert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Certification not found")
    return {"message": "Deleted"}
