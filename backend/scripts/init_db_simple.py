"""
数据库初始化脚本
用于创建数据表和初始化基础数据
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# 设置环境变量以确保配置正确加载
os.environ.setdefault("DATABASE_URL", "postgresql://postgres:123456@localhost:5432/my_awesome_blog")

from app.core.database import engine
from app.core.database import Base
from sqlalchemy import text
from app.core.config import settings


def initialize_tables():
    """初始化数据表"""
    print("正在初始化数据表...")
    
    try:
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        print("[OK] 数据表初始化完成！")
        return True
    except Exception as e:
        print(f"[ERROR] 初始化数据表时出错: {e}")
        return False


def create_admin_user():
    """创建管理员用户"""
    print("正在创建管理员用户...")

    try:
        from sqlalchemy.orm import Session
        from app import crud
        from app.schemas.user import UserCreate
        from app.core.database import SessionLocal

        # 创建数据库会话
        db: Session = SessionLocal()

        try:
            # 检查是否已存在管理员用户
            try:
                admin_user = crud.get_user_by_username(db, username="admin")
                if admin_user:
                    print("[INFO] 管理员用户已存在，跳过创建。")
                    return True
            except:
                # 如果表不存在，跳过检查
                pass

            # 创建管理员用户
            admin_password = "admin123"[:72]  # 确保密码不超过72字节
            admin_data = UserCreate(
                username="admin",
                email="admin@example.com",
                password=admin_password,  # 建议在生产环境中使用更强的密码
                full_name="Administrator",
                is_active=True,
                is_superuser=True
            )

            admin_user = crud.create_user(db, admin_data)
            print(f"[OK] 管理员用户创建成功！用户名: {admin_user.username}")
            return True

        finally:
            db.close()

    except Exception as e:
        print(f"[ERROR] 创建管理员用户时出错: {e}")
        return False


def run_alembic_migrations():
    """运行Alembic迁移"""
    print("正在运行数据库迁移...")
    
    try:
        from alembic.config import Config
        from alembic import command
        
        # 设置alembic配置
        alembic_cfg = Config(str(project_root / "alembic.ini"))
        
        # 运行迁移到最新版本
        command.upgrade(alembic_cfg, "head")
        print("[OK] 数据库迁移完成！")
        return True
    except ImportError:
        print("[WARNING] Alembic未安装，跳过数据库迁移...")
        return True  # 不将此视为错误
    except Exception as e:
        print(f"[ERROR] 运行数据库迁移时出错: {e}")
        return False


def main():
    """主函数"""
    print("=" * 50)
    print("My Awesome Blog - 数据库初始化")
    print("=" * 50)
    print(f"数据库URL: {settings.DATABASE_URL}")
    print()
    
    # 1. 运行Alembic迁移（如果可用）
    if not run_alembic_migrations():
        print("数据库迁移失败，程序退出。")
        return False
    
    # 2. 初始化数据表
    if not initialize_tables():
        print("数据表初始化失败，程序退出。")
        return False
    
    # 3. 创建管理员用户
    if not create_admin_user():
        print("管理员用户创建失败，但不影响其他功能。")
    
    print()
    print("=" * 50)
    print("[OK] 数据库初始化完成！")
    print("管理员账号: admin / admin123")
    print("请在生产环境中修改默认密码。")
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