"""
Public-facing Content Schemas for Website
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ProfileContentPublic(BaseModel):
    section: str
    field_name: str
    field_value: Optional[str] = None
    field_type: str

    class Config:
        from_attributes = True


class SkillPublic(BaseModel):
    id: int
    category: str
    skill_name: str
    skill_level: int
    icon_class: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True


class ExperiencePublic(BaseModel):
    id: int
    job_title: str
    company: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    technologies: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True


class ProjectPublic(BaseModel):
    id: int
    title: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    technologies: Optional[List[str]] = None
    features: Optional[List[str]] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    icon_class: Optional[str] = None
    project_tag: Optional[str] = None
    is_featured: bool
    display_order: int

    class Config:
        from_attributes = True


class EducationPublic(BaseModel):
    id: int
    degree: str
    institution: str
    location: Optional[str] = None
    year: Optional[str] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    type: str
    icon_class: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True


class PortfolioData(BaseModel):
    profile: Dict[str, Any]
    skills: List[SkillPublic]
    experience: List[ExperiencePublic]
    projects: List[ProjectPublic]
    education: List[EducationPublic]
