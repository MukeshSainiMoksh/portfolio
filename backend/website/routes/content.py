"""
Website Content API Routes (Public)
"""

from time import monotonic
from typing import List, Optional

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from website.schemas.content import (
    ProfileContentPublic, SkillPublic, ExperiencePublic, 
    ProjectPublic, EducationPublic, PortfolioData
)
from website.services.content_service import WebsiteContentService

router = APIRouter()


@router.get("/profile", response_model=List[ProfileContentPublic])
async def get_profile_content(
    section: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get public profile content"""
    content_service = WebsiteContentService(db)
    return await content_service.get_profile_content(section)


@router.get("/skills", response_model=List[SkillPublic])
async def get_skills(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get public skills data"""
    content_service = WebsiteContentService(db)
    return await content_service.get_skills(category)


@router.get("/experience", response_model=List[ExperiencePublic])
async def get_experience(
    db: AsyncSession = Depends(get_db)
):
    """Get public experience data"""
    content_service = WebsiteContentService(db)
    return await content_service.get_experience()


@router.get("/projects", response_model=List[ProjectPublic])
async def get_projects(
    featured_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """Get public projects data"""
    content_service = WebsiteContentService(db)
    return await content_service.get_projects(featured_only)


@router.get("/education", response_model=List[EducationPublic])
async def get_education(
    education_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get public education data"""
    content_service = WebsiteContentService(db)
    return await content_service.get_education(education_type)


# In-memory TTL cache for the aggregated portfolio payload.
# Single-instance only; admin edits show up within CACHE_TTL seconds.
_portfolio_cache: dict = {}
PORTFOLIO_CACHE_TTL = 300  # 5 minutes


@router.get("/portfolio", response_model=PortfolioData)
async def get_portfolio_data(
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """Get complete portfolio data in one request"""
    response.headers["Cache-Control"] = f"public, max-age={PORTFOLIO_CACHE_TTL}"

    now = monotonic()
    if _portfolio_cache and now - _portfolio_cache["at"] < PORTFOLIO_CACHE_TTL:
        return _portfolio_cache["data"]

    content_service = WebsiteContentService(db)

    # NOTE: sequential on purpose — one AsyncSession can't run queries concurrently
    profile_content = await content_service.get_profile_content()
    skills = await content_service.get_skills()
    experience = await content_service.get_experience()
    projects = await content_service.get_projects()
    education = await content_service.get_education()
    
    # Organize profile content by section
    profile_sections = {}
    for content in profile_content:
        if content.section not in profile_sections:
            profile_sections[content.section] = {}
        profile_sections[content.section][content.field_name] = content.field_value
    
    data = PortfolioData(
        profile=profile_sections,
        skills=skills,
        experience=experience,
        projects=projects,
        education=education
    )
    _portfolio_cache.update(data=data, at=now)
    return data