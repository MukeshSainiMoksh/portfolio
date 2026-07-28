"""
Database Configuration and Connection
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import MetaData
from .config import settings


def _get_async_url(url: str) -> str:
    """Ensure the URL uses the asyncpg driver."""
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url  # already postgresql+asyncpg:// or other


# Create async engine
engine = create_async_engine(
    _get_async_url(settings.DATABASE_URL),
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,   # detect dead connections before using them
    pool_size=5,
    max_overflow=10,
    pool_recycle=1800,    # recycle before typical network/PG idle timeouts
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Base class for all database models"""
    metadata = MetaData()


async def get_db() -> AsyncSession:
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


async def create_tables():
    """Create all database tables"""
    async with engine.begin() as conn:
        from models import user, content, media, blog  # noqa: ensure models are registered
        await conn.run_sync(Base.metadata.create_all)
