"""
Blog and Contact Models
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base


class Blog(Base):
    __tablename__ = "blogs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False, index=True)
    slug = Column(String(350), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    
    tags = Column(String(500), nullable=True)  # Comma-separated
    image_url = Column(String(500), nullable=True)
    author = Column(String(200), default="Mukesh Kumar Saini")
    
    views = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationship with comments
    comments = relationship("Comment", back_populates="blog", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Blog(id={self.id}, title='{self.title}')>"


class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    blog_id = Column(Integer, ForeignKey("blogs.id"), nullable=False)
    name = Column(String(200), nullable=False)
    email = Column(String(255), nullable=True)
    comment = Column(Text, nullable=False)
    
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship with blog
    blog = relationship("Blog", back_populates="comments")
    
    def __repr__(self):
        return f"<Comment(id={self.id}, blog_id={self.blog_id}, name='{self.name}')>"


class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(300), nullable=True)
    message = Column(Text, nullable=False)
    
    is_read = Column(Boolean, default=False)
    is_replied = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Contact(id={self.id}, name='{self.name}', email='{self.email}')>"