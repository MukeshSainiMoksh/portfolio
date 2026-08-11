"""
FastAPI Portfolio Backend
Main application entry point
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.database import engine, create_tables, get_db
from core.storage import get_storage

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger("portfolio")
from admin.routes import auth as admin_auth
from admin.routes import content as admin_content
from admin.routes import media as admin_media
from admin.routes import certifications as admin_certifications
from admin.routes import contacts as admin_contacts
from admin.routes import assets as admin_assets
from website.routes import assets as website_assets
from website.routes import content as website_content
from website.routes import contact as website_contact
from website.routes import certifications as website_certifications
from website.routes import chat as website_chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    await create_tables()
    yield
    # Shutdown
    pass


# Create FastAPI application
# Interactive docs are only exposed in DEBUG — hidden in production
app = FastAPI(
    title="Portfolio API",
    description="Modern portfolio website backend with admin management",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
)

# CORS Configuration
# DEBUG: any origin allowed (Flutter web dev server uses random ports, LAN devices etc.)
# Production: strict allowlist from ALLOWED_ORIGINS
if settings.DEBUG:
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=".*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Compress larger JSON responses (portfolio payload etc.)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    if settings.ENVIRONMENT == "production":
        response.headers.setdefault(
            "Strict-Transport-Security", "max-age=63072000; includeSubDomains"
        )
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Last-resort handler: log the traceback, return a clean 500."""
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

# Static files for uploads — only when this process owns the files. With an
# S3/R2 backend the bucket serves them directly, and mounting a local
# directory here would shadow those URLs with 404s.
_storage = get_storage()
if _storage.serves_static_locally:
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
    admin_contacts.router,
    prefix="/api/admin/contacts",
    tags=["Admin Contact Inbox"]
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

app.include_router(
    website_chat.router,
    prefix="/api/website/chat",
    tags=["Website AI Chat"]
)

app.include_router(
    admin_assets.router,
    prefix="/api/admin/assets",
    tags=["Admin Site Assets"]
)

app.include_router(
    website_assets.router,
    prefix="/api/website/assets",
    tags=["Website Site Assets"]
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
async def health_check(db: AsyncSession = Depends(get_db)):
    """Detailed health check — actually pings the database"""
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        logger.exception("Health check: database unreachable")
        db_status = "disconnected"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
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