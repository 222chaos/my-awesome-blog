"""
My Awesome Blog - 简化版数据库初始化脚本

此脚本执行最基本的数据库初始化操作：
1. 创建所有数据表
2. 创建管理员用户
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.core.database import engine, SessionLocal
from app.models import Base
from app import crud
from app.schemas.user import UserCreate


def create_tables():
    """创建所有数据表"""
    print("[INFO] 正在创建数据表...")
    
    try:
        Base.metadata.create_all(bind=engine)
        print("[SUCCESS] 数据表创建完成！")
        return True
    except Exception as e:
        print(f"[ERROR] 创建数据表失败: {e}")
        return False


def create_admin_user():
    """创建管理员用户"""
    print("[INFO] 正在创建管理员用户...")
    
    try:
        db = SessionLocal()
        
        # 检查是否已存在管理员用户
        admin_user = crud.get_user_by_username(db, username="admin")
        if admin_user:
            print("[INFO] 管理员用户已存在，跳过创建。")
            db.close()
            return True
        
        # 创建管理员用户
        admin_data = UserCreate(
            username="admin",
            email="admin@example.com",
            password="admin123",  # 请在生产环境中使用更强的密码
            full_name="Administrator",
            is_active=True,
            is_superuser=True
        )
        
        admin_user = crud.create_user(db, admin_data)
        print(f"[SUCCESS] 管理员用户创建成功！用户名: {admin_user.username}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"[ERROR] 创建管理员用户失败: {e}")
        return False


def main():
    """主函数"""
    print("="*50)
    print("My Awesome Blog - 简化版数据库初始化")
    print("="*50)
    
    # 创建数据表
    if not create_tables():
        print("[ERROR] 数据库初始化失败！")
        return False
    
    # 创建管理员用户
    if not create_admin_user():
        print("[WARNING] 管理员用户创建失败，但不影响其他功能。")
    
    print("="*50)
    print("[SUCCESS] 数据库初始化完成！")
    print("重要信息:")
    print("- 数据库表结构已创建")
    print("- 管理员用户已创建 (用户名: admin, 密码: admin123)")
    print("提示: 请在生产环境中修改默认密码。")
    print("="*50)
    
    return True


if __name__ == "__main__":
    success = main()
    if success:
        print("\n[INFO] 初始化成功完成！")
        sys.exit(0)
    else:
        print("\n[ERROR] 初始化失败！")
        sys.exit(1)