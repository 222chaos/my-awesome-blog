"""
管理员用户创建脚本 - 直接SQL版本
用于直接在数据库中创建管理员用户
"""

import sys
import os
from pathlib import Path
import hashlib
import bcrypt

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import create_engine, text
from app.core.config import settings
import uuid


def create_admin_user_directly():
    """直接在数据库中创建管理员用户"""
    print("正在直接在数据库中创建管理员用户...")
    
    try:
        # 创建数据库引擎
        engine = create_engine(settings.DATABASE_URL)
        
        # 生成密码哈希（确保不超过72字节限制）
        password = "admin123"
        # 首先截断到72字节以内
        if len(password.encode('utf-8')) > 72:
            password = password.encode('utf-8')[:71].decode('utf-8', errors='ignore')
        
        # 创建密码哈希
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # 生成用户ID
        user_id = str(uuid.uuid4())
        
        with engine.connect() as conn:
            # 检查是否已存在管理员用户
            result = conn.execute(text("SELECT id FROM users WHERE username = 'admin'"))
            existing_user = result.fetchone()
            
            if existing_user:
                print("管理员用户已存在，跳过创建。")
                return True
            
            # 插入管理员用户
            insert_query = text("""
                INSERT INTO users (
                    id, username, email, hashed_password, full_name, 
                    is_active, is_superuser, created_at, updated_at
                ) VALUES (
                    :id, :username, :email, :hashed_password, :full_name,
                    :is_active, :is_superuser, NOW(), NOW()
                )
            """)
            
            conn.execute(insert_query, {
                'id': user_id,
                'username': 'admin',
                'email': 'admin@example.com',
                'hashed_password': hashed_password,
                'full_name': 'Administrator',
                'is_active': True,
                'is_superuser': True
            })
            
            conn.commit()
            
            print(f"管理员用户创建成功！")
            print(f"用户名: admin")
            print(f"密码: admin123")
            print(f"邮箱: admin@example.com")
            print("请在生产环境中立即更改默认密码！")
            
            return True
            
    except Exception as e:
        print(f"创建管理员用户时出错: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """主函数"""
    print("="*50)
    print("My Awesome Blog - 管理员用户创建脚本 (直接SQL)")
    print("="*50)
    
    success = create_admin_user_directly()
    
    print("="*50)
    if success:
        print("管理员用户创建完成！")
        print("请使用以下凭据登录管理后台：")
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