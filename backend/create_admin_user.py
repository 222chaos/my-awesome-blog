#!/usr/bin/env python
"""
创建管理员用户的脚本
"""

import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.core.security import pwd_context
from app.models.user import User
from app.core.config import settings


def create_tables():
    """创建所有表"""
    print("正在创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成!")


def create_admin_user():
    """创建管理员用户"""
    print("正在创建管理员用户...")
    
    # 首先创建表
    create_tables()
    
    # 创建数据库会话
    db = SessionLocal()
    
    try:
        # 检查管理员用户是否已存在
        admin_user = db.query(User).filter(User.username == "admin").first()
        
        if admin_user:
            print("警告: 管理员用户 'admin' 已存在")
            print(f"用户名: {admin_user.username}")
            print(f"超级用户权限: {admin_user.is_superuser}")
            return
        
        # 使用明确的bcrypt后端
        password = "admin123"
        
        # 尝试直接使用pwd_context进行哈希
        try:
            # 先确保后端已加载
            from passlib.registry import register_crypt_handler
            from passlib.handlers.bcrypt import bcrypt
            register_crypt_handler(bcrypt)
            
            hashed_password = pwd_context.hash(password)
        except Exception as e:
            print(f"密码哈希失败: {e}")
            # 重新创建CryptContext实例
            from passlib.context import CryptContext
            bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            hashed_password = bcrypt_context.hash(password)
        
        admin_user = User(
            username="admin",
            email="admin@example.com",  # 默认邮箱，您可以稍后修改
            hashed_password=hashed_password,
            full_name="Admin User",
            is_active=True,
            is_superuser=True,  # 设置为超级用户
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
        
        print("成功创建管理员用户!")
        print(f"用户名: {admin_user.username}")
        print(f"密码: admin123")
        print(f"超级用户权限: {admin_user.is_superuser}")
        print(f"用户ID: {admin_user.id}")
        
    except Exception as e:
        print(f"创建管理员用户时发生错误: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_admin_user()