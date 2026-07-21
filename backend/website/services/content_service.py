"""
Public Website Content Service
"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.content import ProfileContent, Skill, Experience, Project, Education


class WebsiteContentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_profile_content(self, section: Optional[str] = None) -> List[ProfileContent]:
        query = select(ProfileContent).where(ProfileContent.is_active == True)
        if section:
            query = query.where(ProfileContent.section == section)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_skills(self, category: Optional[str] = None) -> List[Skill]:
        query = select(Skill).where(Skill.is_active == True).order_by(Skill.display_order)
        if category:
            query = query.where(Skill.category == category)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_experience(self) -> List[Experience]:
        result = await self.db.execute(
            select(Experience).where(Experience.is_active == True).order_by(Experience.display_order)
        )
        return result.scalars().all()

    async def get_projects(self, featured_only: bool = False) -> List[Project]:
        query = select(Project).where(Project.is_active == True).order_by(Project.display_order)
        if featured_only:
            query = query.where(Project.is_featured == True)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_education(self, education_type: Optional[str] = None) -> List[Education]:
        query = select(Education).where(Education.is_active == True).order_by(Education.display_order)
        if education_type:
            query = query.where(Education.type == education_type)
        result = await self.db.execute(query)
        return result.scalars().all()
