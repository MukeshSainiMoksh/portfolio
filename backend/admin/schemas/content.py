"""
Admin Content Management Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


# Profile Content Schemas
class ProfileContentBase(BaseModel):
    section: str = Field(..., description="Content section (hero, about, contact)")
    field_name: str = Field(..., description="Field name")
    field_value: Optional[str] = Field(None, description="Field value")
    field_type: str = Field(default="text", description="Field type")
    is_active: bool = Field(default=True)


class ProfileContentCreate(ProfileContentBase):
    pass


class ProfileContentUpdate(BaseModel):
    section: Optional[str] = None
    field_name: Optional[str] = None
    field_value: Optional[str] = None
    field_type: Optional[str] = None
    is_active: Optional[bool] = None


class ProfileContentResponse(ProfileContentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Skill Schemas
class SkillBase(BaseModel):
    category: str = Field(..., description="Skill category")
    skill_name: str = Field(..., description="Skill name")
    skill_level: int = Field(default=80, ge=1, le=100, description="Skill level percentage (1-100)")
    icon_class: Optional[str] = Field(None, description="CSS icon class")
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    category: Optional[str] = None
    skill_name: Optional[str] = None
    skill_level: Optional[int] = Field(None, ge=1, le=100)
    icon_class: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class SkillResponse(SkillBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Experience Schemas
class ExperienceBase(BaseModel):
    job_title: str = Field(..., description="Job title")
    company: str = Field(..., description="Company name")
    location: Optional[str] = Field(None, description="Job location")
    start_date: str = Field(..., description="Start date")
    end_date: Optional[str] = Field(None, description="End date")
    is_current: bool = Field(default=False)
    description: Optional[str] = Field(None, description="Job description")
    responsibilities: Optional[List[str]] = Field(None, description="List of responsibilities")
    achievements: Optional[List[str]] = Field(None, description="List of achievements")
    technologies: Optional[str] = Field(None, description="Technologies used")
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    job_title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    technologies: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Project Schemas
class ProjectBase(BaseModel):
    title: str = Field(..., description="Project title")
    tagline: Optional[str] = Field(None, description="Project tagline")
    description: Optional[str] = Field(None, description="Project description")
    role: Optional[str] = Field(None, description="Your role in project")
    duration: Optional[str] = Field(None, description="Project duration")
    technologies: Optional[List[str]] = Field(None, description="Technologies used")
    features: Optional[List[str]] = Field(None, description="Key features")
    live_url: Optional[str] = Field(None, description="Live project URL")
    github_url: Optional[str] = Field(None, description="GitHub repository URL")
    image_url: Optional[str] = Field(None, description="Project image URL")
    icon_class: Optional[str] = Field(None, description="CSS icon class")
    project_tag: Optional[str] = Field(None, description="Project tag/category")
    is_featured: bool = Field(default=False)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
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
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Education Schemas
class EducationBase(BaseModel):
    degree: str = Field(..., description="Degree or certification name")
    institution: str = Field(..., description="Institution name")
    location: Optional[str] = Field(None, description="Institution location")
    year: Optional[str] = Field(None, description="Graduation year")
    grade: Optional[str] = Field(None, description="Grade or GPA")
    description: Optional[str] = Field(None, description="Additional description")
    type: str = Field(default="degree", description="Type: degree, certification, course")
    icon_class: Optional[str] = Field(None, description="CSS icon class")
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    location: Optional[str] = None
    year: Optional[str] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    icon_class: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class EducationResponse(EducationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True