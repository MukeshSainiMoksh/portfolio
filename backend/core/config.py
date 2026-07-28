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
            if problems:
                raise ValueError("Unsafe production config: " + "; ".join(problems))
        return self

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
