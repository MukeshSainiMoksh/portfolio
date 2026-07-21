"""
Certification Service
"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.certification import Certification
from admin.schemas.certifications import CertificationCreate, CertificationUpdate


class CertificationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[Certification]:
        result = await self.db.execute(
            select(Certification).order_by(Certification.display_order)
        )
        return result.scalars().all()

    async def get_active(self) -> List[Certification]:
        result = await self.db.execute(
            select(Certification).where(Certification.is_active == True).order_by(Certification.display_order)
        )
        return result.scalars().all()

    async def get_by_id(self, cert_id: int) -> Optional[Certification]:
        result = await self.db.execute(select(Certification).where(Certification.id == cert_id))
        return result.scalar_one_or_none()

    async def create(self, data: CertificationCreate) -> Certification:
        obj = Certification(**data.model_dump())
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update(self, cert_id: int, data: CertificationUpdate) -> Optional[Certification]:
        obj = await self.get_by_id(cert_id)
        if not obj:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(obj, key, value)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete(self, cert_id: int) -> bool:
        obj = await self.get_by_id(cert_id)
        if not obj:
            return False
        await self.db.delete(obj)
        await self.db.commit()
        return True
