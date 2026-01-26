"""
数据库初始化脚本
用于创建数据库和初始化数据表
"""

import os
import sys
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.core.config import settings
from app.core.database import engine
from app.models import *
from sqlalchemy import create_engine, text
import psycopg2
from psycopg2 import sql


def create_database_if_not_exists():
    """创建数据库（如果不存在）"""
    print("正在检查数据库是否存在...")
    
    # 从DATABASE_URL解析数据库连接信息
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        # 解析URL: postgresql://user:password@host:port/dbname
        parts = db_url.replace("postgresql://", "").split("/")
        db_name = parts[-1]
        user_pass_host_port = parts[0]
        
        user_pass, host_port = user_pass_host_port.split("@")
        host, port = host_port.split(":")
        user, password = user_pass.split(":")
        
        # 连接postgres数据库以创建新数据库
        try:
            conn = psycopg2.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                database="postgres"  # 连接到默认的postgres数据库
            )
            conn.autocommit = True  # 创建数据库需要autocommit
            cursor = conn.cursor()
            
            # 检查数据库是否已存在
            cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_name,))
            exists = cursor.fetchone()
            
            if not exists:
                print(f"数据库 {db_name} 不存在，正在创建...")
                cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))
                print(f"数据库 {db_name} 创建成功！")
            else:
                print(f"数据库 {db_name} 已存在。")
                
            cursor.close()
            conn.close()
            
        except psycopg2.Error as e:
            print(f"创建数据库时出错: {e}")
            return False
    
    return True


def initialize_database():
    """初始化数据库表结构"""
    print("正在初始化数据库表结构...")
    
    try:
        # 创建所有表
        from app.models import Base
        Base.metadata.create_all(bind=engine)
        print("数据库表结构初始化完成！")
        return True
    except Exception as e:
        print(f"初始化数据库表结构时出错: {e}")
        return False


def run_migrations():
    """运行数据库迁移"""
    print("正在运行数据库迁移...")
    
    try:
        from alembic.config import Config
        from alembic import command
        
        # 设置alembic配置
        alembic_cfg = Config("alembic.ini")
        
        # 运行迁移到最新版本
        command.upgrade(alembic_cfg, "head")
        print("数据库迁移完成！")
        return True
    except Exception as e:
        print(f"运行数据库迁移时出错: {e}")
        return False


def create_admin_user():
    """创建管理员用户"""
    print("正在创建管理员用户...")
    
    try:
        from sqlalchemy.orm import sessionmaker
        from app import crud
        from app.schemas.user import UserCreate
        from app.core.database import SessionLocal
        
        db = SessionLocal()
        
        # 检查是否已存在管理员用户
        admin_user = crud.get_user_by_username(db, username="admin")
        if admin_user:
            print("管理员用户已存在，跳过创建。")
            db.close()
            return True
        
        # 创建管理员用户
        admin_data = UserCreate(
            username="admin",
            email="admin@example.com",
            password="admin123",  # 建议在生产环境中使用更强的密码
            full_name="Administrator",
            is_active=True,
            is_superuser=True
        )
        
        admin_user = crud.create_user(db, admin_data)
        print(f"管理员用户创建成功！用户名: {admin_user.username}")
        
        db.close()
        return True
    except Exception as e:
        print(f"创建管理员用户时出错: {e}")
        return False


def main():
    """主函数"""
    print("=" * 50)
    print("My Awesome Blog 数据库初始化脚本")
    print("=" * 50)
    
    # 1. 创建数据库（如果不存在）
    if not create_database_if_not_exists():
        print("数据库创建失败，程序退出。")
        return False
    
    # 2. 初始化数据库表结构
    if not initialize_database():
        print("数据库表结构初始化失败，程序退出。")
        return False
    
    # 3. 运行数据库迁移
    if not run_migrations():
        print("数据库迁移失败，程序退出。")
        return False
    
    # 4. 创建管理员用户
    if not create_admin_user():
        print("管理员用户创建失败，但不影响其他功能。")
    
    print("=" * 50)
    print("数据库初始化完成！")
    print("数据库连接: ", settings.DATABASE_URL)
    print("管理员用户: admin / admin123")
    print("=" * 50)
    
    return True


if __name__ == "__main__":
    success = main()
    if success:
        print("\n数据库初始化成功！")
        sys.exit(0)
    else:
        print("\n数据库初始化失败！")
        sys.exit(1)