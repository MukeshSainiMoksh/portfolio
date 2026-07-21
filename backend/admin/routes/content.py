"""
Admin Content Management Routes
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_admin_user
from admin.schemas.content import (
    ProfileContentResponse, ProfileContentCreate, ProfileContentUpdate,
    SkillResponse, SkillCreate, SkillUpdate,
    ExperienceResponse, ExperienceCreate, ExperienceUpdate,
    ProjectResponse, ProjectCreate, ProjectUpdate,
    EducationResponse, EducationCreate, EducationUpdate
)
from admin.services.content_service import ContentService

router = APIRouter()


# Profile Content Routes
@router.get("/profile", response_model=List[ProfileContentResponse])
async def get_profile_content(
    section: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get profile content by section"""
    content_service = ContentService(db)
    return await content_service.get_profile_content(section)


@router.post("/profile", response_model=ProfileContentResponse)
async def create_profile_content(
    content_data: ProfileContentCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create new profile content"""
    content_service = ContentService(db)
    return await content_service.create_profile_content(content_data)


@router.put("/profile/{content_id}", response_model=ProfileContentResponse)
async def update_profile_content(
    content_id: int,
    content_data: ProfileContentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update profile content"""
    content_service = ContentService(db)
    content = await content_service.update_profile_content(content_id, content_data)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content


@router.delete("/profile/{content_id}")
async def delete_profile_content(
    content_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete profile content"""
    content_service = ContentService(db)
    success = await content_service.delete_profile_content(content_id)
    if not success:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"message": "Content deleted successfully"}


# Skills Routes
@router.get("/skills", response_model=List[SkillResponse])
async def get_skills(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all skills or by category"""
    content_service = ContentService(db)
    return await content_service.get_skills(category)


@router.post("/skills", response_model=SkillResponse)
async def create_skill(
    skill_data: SkillCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create new skill"""
    content_service = ContentService(db)
    return await content_service.create_skill(skill_data)


@router.put("/skills/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    skill_data: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update skill"""
    content_service = ContentService(db)
    skill = await content_service.update_skill(skill_id, skill_data)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill


@router.delete("/skills/{skill_id}")
async def delete_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete skill"""
    content_service = ContentService(db)
    success = await content_service.delete_skill(skill_id)
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"message": "Skill deleted successfully"}


# Experience Routes
@router.get("/experience", response_model=List[ExperienceResponse])
async def get_experience(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all experience entries"""
    content_service = ContentService(db)
    return await content_service.get_experience()


@router.post("/experience", response_model=ExperienceResponse)
async def create_experience(
    experience_data: ExperienceCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create new experience entry"""
    content_service = ContentService(db)
    return await content_service.create_experience(experience_data)


@router.put("/experience/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: int,
    experience_data: ExperienceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update experience entry"""
    content_service = ContentService(db)
    experience = await content_service.update_experience(experience_id, experience_data)
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return experience


@router.delete("/experience/{experience_id}")
async def delete_experience(
    experience_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete experience entry"""
    content_service = ContentService(db)
    success = await content_service.delete_experience(experience_id)
    if not success:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience deleted successfully"}


# Projects Routes
@router.get("/projects", response_model=List[ProjectResponse])
async def get_projects(
    featured_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all projects or featured only"""
    content_service = ContentService(db)
    return await content_service.get_projects(featured_only)


@router.post("/projects", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create new project"""
    content_service = ContentService(db)
    return await content_service.create_project(project_data)


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update project"""
    content_service = ContentService(db)
    project = await content_service.update_project(project_id, project_data)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete project"""
    content_service = ContentService(db)
    success = await content_service.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}


# Education Routes
@router.get("/education", response_model=List[EducationResponse])
async def get_education(
    education_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all education entries or by type"""
    content_service = ContentService(db)
    return await content_service.get_education(education_type)


@router.post("/education", response_model=EducationResponse)
async def create_education(
    education_data: EducationCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create new education entry"""
    content_service = ContentService(db)
    return await content_service.create_education(education_data)


@router.put("/education/{education_id}", response_model=EducationResponse)
async def update_education(
    education_id: int,
    education_data: EducationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update education entry"""
    content_service = ContentService(db)
    education = await content_service.update_education(education_id, education_data)
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    return education


@router.delete("/education/{education_id}")
async def delete_education(
    education_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete education entry"""
    content_service = ContentService(db)
    success = await content_service.delete_education(education_id)
    if not success:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"message": "Education deleted successfully"}