"""
Application Configuration
"""

from pathlib import Path
from typing import List

from pydantic import model_validator
from pydantic_settings import BaseSettings

# backend project root (directory containing main.py)
BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Application settings — variable names match .env exactly"""

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/portfolio_db"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DATABASE_NAME: str = "portfolio_db"

    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS — stored as JSON array in .env:
    # ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001"]
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    # File Upload — absolute path so it doesn't depend on the working directory
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB

    # Storage backend — "local" writes to UPLOAD_DIR, "s3" writes to any
    # S3-compatible bucket (Cloudflare R2, Backblaze B2, AWS S3).
    #
    # Managed hosts without a mounted volume have an ephemeral filesystem:
    # every deploy wipes UPLOAD_DIR, so uploaded resumes and certificate
    # badges vanish. Use "s3" anywhere the disk is not guaranteed.
    STORAGE_BACKEND: str = "local"
    S3_BUCKET: str = ""
    S3_ENDPOINT_URL: str = ""        # R2: https://<account-id>.r2.cloudflarestorage.com
    S3_ACCESS_KEY_ID: str = ""
    S3_SECRET_ACCESS_KEY: str = ""
    S3_REGION: str = "auto"          # R2 ignores the region but boto3 wants one
    S3_PREFIX: str = ""              # optional folder inside the bucket
    S3_PUBLIC_BASE_URL: str = ""     # public read URL: r2.dev domain or your CDN

    # Admin seed user
    ADMIN_EMAIL: str = "admin@portfolio.com"
    ADMIN_PASSWORD: str = "admin123"

    # Email (Gmail SMTP)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    NOTIFY_EMAIL: str = "codermsaini@gmail.com"

    # AI Chatbot (OpenAI)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    @model_validator(mode="after")
    def check_storage_config(self):
        """Fail at boot, not at the first upload, if s3 is half-configured."""
        if self.STORAGE_BACKEND not in ("local", "s3"):
            raise ValueError(
                f'STORAGE_BACKEND must be "local" or "s3", got "{self.STORAGE_BACKEND}"'
            )
        if self.STORAGE_BACKEND == "s3":
            missing = [
                name
                for name in (
                    "S3_BUCKET",
                    "S3_ENDPOINT_URL",
                    "S3_ACCESS_KEY_ID",
                    "S3_SECRET_ACCESS_KEY",
                    "S3_PUBLIC_BASE_URL",
                )
                if not getattr(self, name)
            ]
            if missing:
                raise ValueError(
                    "STORAGE_BACKEND=s3 requires: " + ", ".join(missing)
                )
        return self

    @model_validator(mode="after")
    def check_production_safety(self):
        """Refuse to boot in production with development defaults."""
        if self.ENVIRONMENT == "production":
            problems = []
            if "change-this" in self.SECRET_KEY or len(self.SECRET_KEY) < 32:
                problems.append("SECRET_KEY must be a strong value (32+ chars)")
            if self.ADMIN_PASSWORD == "admin123":
                problems.append("ADMIN_PASSWORD must not be the default")
            if self.DEBUG:
                problems.append("DEBUG must be False")
            if self.STORAGE_BACKEND == "local":
                # Not fatal — a VPS with a real disk is a legitimate setup —
                # but it is the single most common way to lose uploads.
                import logging

                logging.getLogger("portfolio.config").warning(
                    "STORAGE_BACKEND=local in production: uploads are lost on "
                    "redeploy unless UPLOAD_DIR is a persistent volume."
                )
            if problems:
                raise ValueError("Unsafe production config: " + "; ".join(problems))
        return self

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
