"""
FastAPI Portfolio Backend
Main application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from core.config import settings
from core.database import engine, create_tables
from admin.routes import auth as admin_auth
from admin.routes import content as admin_content
from admin.routes import media as admin_media
from admin.routes import certifications as admin_certifications
from website.routes import content as website_content
from website.routes import contact as website_contact
from website.routes import certifications as website_certifications


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    await create_tables()
    yield
    # Shutdown
    pass


# Create FastAPI application
app = FastAPI(
    title="Portfolio API",
    description="Modern portfolio website backend with admin management",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# API Routes
app.include_router(
    admin_auth.router,
    prefix="/api/admin/auth",
    tags=["Admin Authentication"]
)

app.include_router(
    admin_content.router,
    prefix="/api/admin/content",
    tags=["Admin Content Management"]
)

app.include_router(
    admin_media.router,
    prefix="/api/admin/media",
    tags=["Admin Media Management"]
)

app.include_router(
    website_content.router,
    prefix="/api/website/content",
    tags=["Website Content"]
)

app.include_router(
    admin_certifications.router,
    prefix="/api/admin/certifications",
    tags=["Admin Certifications"]
)

app.include_router(
    website_contact.router,
    prefix="/api/website/contact",
    tags=["Website Contact"]
)

app.include_router(
    website_certifications.router,
    prefix="/api/website/certifications",
    tags=["Website Certifications"]
)


@app.get("/")
async def root():
    """API Health Check"""
    return {
        "message": "Portfolio API is running",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )