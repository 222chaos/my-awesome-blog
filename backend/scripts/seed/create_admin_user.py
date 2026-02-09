"""创建管理员用户脚本"""

import asyncio
import os
import sys
from pathlib import Path

# 添加项目根目录到Python路径
sys.path.insert(0, str(Path(__file__).parent))

import dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.core.database import Base
from app.models.user import User
from app.core.security import get_password_hash
from app.utils.logger import app_logger
from uuid import UUID


async def create_admin_user():
    """创建管理员用户"""
    # 加载环境变量
    dotenv.load_dotenv(dotenv_path=Path(__file__).parent / ".env")
    
    # 创建异步引擎，将数据库URL中的psycopg2驱动替换为asyncpg
    async_db_url = settings.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://')
    async_engine = create_async_engine(async_db_url)
        
    # 创建会话
    async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)
        
    # 创建数据库表
    async with async_session() as session:
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    
    async with async_session() as session:
        # 检查是否已存在管理员用户
        result = await session.execute(
            User.__table__.select().where(User.is_superuser == True)
        )
        admin_users = result.scalars().all()
        
        if admin_users:
            print("管理员用户已存在，跳过创建")
            return
        
        # 如果没有管理员用户，则创建一个
        
        # 创建管理员用户
        admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
        
        hashed_password = await get_password_hash(admin_password)
        
        admin_user = User(
            email=admin_email,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=True,
            full_name="Admin User"
        )
        
        session.add(admin_user)
        await session.commit()
        await session.refresh(admin_user)
        
        print(f"管理员用户创建成功:")
        print(f"邮箱: {admin_email}")
        print(f"密码: {admin_password}")
        print(f"ID: {admin_user.id}")


if __name__ == "__main__":
    asyncio.run(create_admin_user())