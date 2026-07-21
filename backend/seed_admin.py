"""
Seed script to create the initial admin user.
Run once after setting up the database:
    python seed_admin.py
"""

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select

from core.config import settings
from core.database import Base
from core.security import get_password_hash
from models.user import User
import models  # noqa: ensure all models are registered


async def seed():
    engine = create_async_engine(
        settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
        echo=False,
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_factory() as db:
        existing = await db.execute(select(User).where(User.email == settings.ADMIN_EMAIL))
        if existing.scalar_one_or_none():
            print(f"Admin user '{settings.ADMIN_EMAIL}' already exists.")
            await engine.dispose()
            return

        admin = User(
            email=settings.ADMIN_EMAIL,
            username="admin",
            full_name="Portfolio Admin",
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            is_active=True,
            is_admin=True,
            is_superuser=True,
        )
        db.add(admin)
        await db.commit()
        print(f"Admin user created: {settings.ADMIN_EMAIL}")
        print(f"Password: {settings.ADMIN_PASSWORD}")
        print("IMPORTANT: Change the password immediately after first login.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
