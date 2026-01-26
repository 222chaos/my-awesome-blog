#!/usr/bin/env python
"""
数据库初始化脚本
此脚本用于初始化PostgreSQL数据库，创建所有表结构并可选地创建初始管理员用户
"""

import asyncio
import sys
import os
import locale
from sqlalchemy import text
from sqlalchemy.orm import Session

# 强制设置环境变量解决Windows编码问题
os.environ['PYTHONIOENCODING'] = 'utf-8'
os.environ['PGCLIENTENCODING'] = 'UTF8'

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.crud.user import get_password_hash
from app.core.config import settings


def init_database():
    """初始化数据库，创建所有表"""
    print("正在初始化数据库...")
    print(f"数据库URL: {settings.DATABASE_URL.split('@')[-1].split('/')[0]}")
    
    try:
        # 为Windows环境特别设置编码
        import psycopg2.extensions
        psycopg2.extensions.register_type(psycopg2.extensions.UNICODE)
        
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        print("✓ 数据库表结构创建成功")
        
        return True
    except Exception as e:
        print(f"✗ 数据库初始化失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def create_admin_user():
    """创建初始管理员用户"""
    db = SessionLocal()
    
    try:
        # 检查管理员用户是否已存在
        admin_user = db.query(User).filter(User.username == "admin").first()
        
        if admin_user:
            print("⚠️  管理员用户已存在，跳过创建")
            print(f"   用户名: {admin_user.username}")
            print(f"   超级用户权限: {admin_user.is_superuser}")
            return
        
        # 创建新的管理员用户
        password = "admin123"
        try:
            hashed_password = get_password_hash(password)
        except Exception as e:
            print(f"密码哈希出错: {e}")
            # 使用bcrypt直接哈希
            import bcrypt
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=hashed_password,
            full_name="Admin User",
            is_active=True,
            is_superuser=True,
            avatar=None,
            bio="Administrator account",
            website=None,
            twitter=None,
            github=None,
            linkedin=None
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✓ 管理员用户创建成功")
        print(f"   用户名: {admin_user.username}")
        print(f"   密码: admin123")
        print(f"   超级用户权限: {admin_user.is_superuser}")
        
    except Exception as e:
        print(f"✗ 创建管理员用户失败: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


def main():
    """主函数"""
    print("=" * 50)
    print("My Awesome Blog - 数据库初始化脚本")
    print("=" * 50)
    
    # 设置locale以解决编码问题
    try:
        locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    except locale.Error:
        try:
            locale.setlocale(locale.LC_ALL, 'C.UTF-8')
        except locale.Error:
            print("警告: 无法设置UTF-8 locale，可能会有编码问题")
    
    # 初始化数据库
    if not init_database():
        print("数据库初始化失败，脚本终止")
        sys.exit(1)
    
    # 创建管理员用户
    create_admin_user()
    
    print("=" * 50)
    print("数据库初始化完成!")
    print("注意事项:")
    print("- 确保PostgreSQL服务正在运行")
    print("- 确保数据库'my_awesome_blog'已创建")
    print("- 确保用户'postgres'密码为'123456'")
    print("- 如需使用SQLite，请修改.env文件中的DATABASE_URL")
    print("=" * 50)


if __name__ == "__main__":
    main()