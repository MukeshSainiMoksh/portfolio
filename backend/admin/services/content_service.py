"""
Content Service for Admin Operations
"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete

from models.content import ProfileContent, Skill, Experience, Project, Education
from admin.schemas.content import (
    ProfileContentCreate, ProfileContentUpdate,
    SkillCreate, SkillUpdate,
    ExperienceCreate, ExperienceUpdate,
    ProjectCreate, ProjectUpdate,
    EducationCreate, EducationUpdate
)


class ContentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # Profile Content
    async def get_profile_content(self, section: Optional[str] = None) -> List[ProfileContent]:
        query = select(ProfileContent).where(ProfileContent.is_active == True)
        if section:
            query = query.where(ProfileContent.section == section)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_profile_content(self, data: ProfileContentCreate) -> ProfileContent:
        obj = ProfileContent(**data.model_dump())
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update_profile_content(self, content_id: int, data: ProfileContentUpdate) -> Optional[ProfileContent]:
        result = await self.db.execute(select(ProfileContent).where(ProfileContent.id == content_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete_profile_content(self, content_id: int) -> bool:
        result = await self.db.execute(select(ProfileContent).where(ProfileContent.id == content_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return False
        await self.db.delete(obj)
        await self.db.commit()
        return True

    # Skills
    async def get_skills(self, category: Optional[str] = None) -> List[Skill]:
        query = select(Skill).where(Skill.is_active == True).order_by(Skill.display_order)
        if category:
            query = query.where(Skill.category == category)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_skill(self, data: SkillCreate) -> Skill:
        obj = Skill(**data.model_dump())
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update_skill(self, skill_id: int, data: SkillUpdate) -> Optional[Skill]:
        result = await self.db.execute(select(Skill).where(Skill.id == skill_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete_skill(self, skill_id: int) -> bool:
        result = await self.db.execute(select(Skill).where(Skill.id == skill_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return False
        await self.db.delete(obj)
        await self.db.commit()
        return True

    # Experience
    async def get_experience(self) -> List[Experience]:
        result = await self.db.execute(
            select(Experience).where(Experience.is_active == True).order_by(Experience.display_order)
        )
        return result.scalars().all()

    async def create_experience(self, data: ExperienceCreate) -> Experience:
        obj = Experience(**data.model_dump())
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update_experience(self, experience_id: int, data: ExperienceUpdate) -> Optional[Experience]:
        result = await self.db.execute(select(Experience).where(Experience.id == experience_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete_experience(self, experience_id: int) -> bool:
        result = await self.db.execute(select(Experience).where(Experience.id == experience_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return False
        await self.db.delete(obj)
        await self.db.commit()
        return True

    # Projects
    async def get_projects(self, featured_only: bool = False) -> List[Project]:
        query = select(Project).where(Project.is_active == True).order_by(Project.display_order)
        if featured_only:
            query = query.where(Project.is_featured == True)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_project(self, data: ProjectCreate) -> Project:
        obj = Project(**data.model_dump())
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update_project(self, project_id: int, data: ProjectUpdate) -> Optional[Project]:
        result = await self.db.execute(select(Project).where(Project.id == project_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete_project(self, project_id: int) -> bool:
        result = await self.db.execute(select(Project).where(Project.id == project_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return False
        await self.db.delete(obj)
        await self.db.commit()
        return True

    # Education
    async def get_education(self, education_type: Optional[str] = None) -> List[Education]:
        query = select(Education).where(Education.is_active == True).order_by(Education.display_order)
        if education_type:
            query = query.where(Education.type == education_type)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_education(self, data: EducationCreate) -> Education:
        obj = Education(**data.model_dump())
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update_education(self, education_id: int, data: EducationUpdate) -> Optional[Education]:
        result = await self.db.execute(select(Education).where(Education.id == education_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def delete_education(self, education_id: int) -> bool:
        result = await self.db.execute(select(Education).where(Education.id == education_id))
        obj = result.scalar_one_or_none()
        if not obj:
            return False
        await self.db.delete(obj)
        await self.db.commit()
        return True
