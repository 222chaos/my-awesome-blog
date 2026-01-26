"""
管理员用户创建脚本 - 简化版本
用于创建超级管理员用户
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import pwd_context
from sqlalchemy import create_engine
from app.core.config import settings


def create_admin_user():
    """创建管理员用户"""
    print("正在创建管理员用户...")
    
    # 创建数据库会话
    db: Session = SessionLocal()
    
    try:
        # 检查是否已存在管理员用户
        admin_user = db.query(User).filter(User.username == "admin").first()
        if admin_user:
            print(f"管理员用户已存在: {admin_user.username}")
            return True
        
        # 创建密码哈希（确保不超过72字节限制）
        password = "admin123"
        if len(password.encode('utf-8')) > 72:
            password = password.encode('utf-8')[:71].decode('utf-8', errors='ignore')
        
        hashed_password = pwd_context.hash(password)
        
        # 创建管理员用户
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=hashed_password,
            full_name="Administrator",
            is_active=True,
            is_superuser=True
        )
        
        # 添加到数据库
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"管理员用户创建成功！")
        print(f"用户名: {admin_user.username}")
        print(f"邮箱: {admin_user.email}")
        print(f"用户ID: {admin_user.id}")
        print("请在生产环境中立即更改默认密码！")
        
        return True
        
    except Exception as e:
        print(f"创建管理员用户时出错: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()


def main():
    """主函数"""
    print("="*50)
    print("My Awesome Blog - 管理员用户创建脚本")
    print("="*50)
    
    success = create_admin_user()
    
    print("="*50)
    if success:
        print("管理员用户创建完成！")
        print("您可以使用以下凭据登录管理后台：")
        print("  用户名: admin")
        print("  密码: admin123")
        print("请在生产环境中立即更改密码！")
    else:
        print("管理员用户创建失败！")
    print("="*50)
    
    return success


if __name__ == "__main__":
    success = main()
    if success:
        sys.exit(0)
    else:
        sys.exit(1)