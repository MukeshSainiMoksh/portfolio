"""
Content Models for Portfolio Data
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base


class ProfileContent(Base):
    __tablename__ = "profile_content"
    __table_args__ = (
        UniqueConstraint("section", "field_name", name="uq_profile_section_field"),
    )

    id = Column(Integer, primary_key=True, index=True)
    section = Column(String(100), nullable=False, index=True)  # hero, about, contact
    field_name = Column(String(100), nullable=False)
    field_value = Column(Text, nullable=True)
    field_type = Column(String(50), default="text")  # text, textarea, email, url, image, file
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<ProfileContent(section='{self.section}', field='{self.field_name}')>"


class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False, index=True)
    skill_name = Column(String(100), nullable=False)
    skill_level = Column(Integer, default=80)  # 1-100 percentage
    icon_class = Column(String(100), nullable=True)
    display_order = Column(Integer, default=0)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Skill(category='{self.category}', name='{self.skill_name}')>"


class Experience(Base):
    __tablename__ = "experience"
    
    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(200), nullable=False)
    company = Column(String(200), nullable=False)
    location = Column(String(200), nullable=True)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=True)
    is_current = Column(Boolean, default=False)
    
    description = Column(Text, nullable=True)
    responsibilities = Column(JSON, nullable=True)  # Array of strings
    achievements = Column(JSON, nullable=True)  # Array of strings
    technologies = Column(Text, nullable=True)  # Comma-separated
    
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Experience(title='{self.job_title}', company='{self.company}')>"


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    tagline = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)
    role = Column(String(100), nullable=True)
    duration = Column(String(100), nullable=True)
    
    technologies = Column(JSON, nullable=True)  # Array of strings
    features = Column(JSON, nullable=True)  # Array of strings
    
    live_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    icon_class = Column(String(100), nullable=True)
    project_tag = Column(String(100), nullable=True)
    
    is_featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Project(title='{self.title}')>"


class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String(300), nullable=False)
    institution = Column(String(300), nullable=False)
    location = Column(String(200), nullable=True)
    year = Column(String(50), nullable=True)
    grade = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    
    type = Column(String(50), default="degree")  # degree, certification, course
    icon_class = Column(String(100), nullable=True)
    display_order = Column(Integer, default=0)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Education(degree='{self.degree}', institution='{self.institution}')>"