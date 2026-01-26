"""
数据库初始化脚本
用于创建数据库表结构和初始化数据
"""

import sys
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.core.database import engine
from app.models import Base
from sqlalchemy import text
import psycopg2
from urllib.parse import urlparse


def parse_database_url(database_url):
    """解析数据库URL"""
    parsed = urlparse(database_url)
    return {
        'host': parsed.hostname,
        'port': parsed.port,
        'user': parsed.username,
        'password': parsed.password,
        'dbname': parsed.path[1:]  # 移除开头的 '/'
    }


def create_database_if_not_exists():
    """创建数据库（如果不存在）"""
    print("正在检查数据库是否存在...")
    
    from app.core.config import settings
    db_config = parse_database_url(settings.DATABASE_URL)
    
    # 连接postgres数据库以创建新数据库
    try:
        # 先连接到postgres默认数据库
        conn = psycopg2.connect(
            host=db_config['host'],
            port=db_config['port'],
            user=db_config['user'],
            password=db_config['password'],
            database='postgres'  # 连接到默认的postgres数据库
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # 检查目标数据库是否存在
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_config['dbname'],))
        exists = cursor.fetchone()
        
        if not exists:
            print(f"数据库 {db_config['dbname']} 不存在，正在创建...")
            cursor.execute(f"CREATE DATABASE {db_config['dbname']}")
            print(f"数据库 {db_config['dbname']} 创建成功！")
        else:
            print(f"数据库 {db_config['dbname']} 已存在。")
        
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"数据库操作出错: {e}")
        return False


def initialize_tables():
    """初始化数据表"""
    print("正在初始化数据表...")
    
    try:
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        print("数据表初始化完成！")
        return True
    except Exception as e:
        print(f"初始化数据表时出错: {e}")
        return False


def create_sample_data():
    """创建示例数据"""
    print("正在创建示例数据...")
    
    try:
        from sqlalchemy.orm import sessionmaker
        from app.core.database import get_db
        from app import crud
        from app.schemas.user import UserCreate
        from app.schemas.category import CategoryCreate
        from app.schemas.tag import TagCreate
        
        # 获取数据库会话
        db_gen = get_db()
        db = next(db_gen)
        
        try:
            # 创建管理员用户（如果不存在）
            admin_user = crud.get_user_by_username(db, username="admin")
            if not admin_user:
                admin_data = UserCreate(
                    username="admin",
                    email="admin@example.com",
                    password="admin123",
                    full_name="Admin User",
                    is_active=True,
                    is_superuser=True
                )
                admin_user = crud.create_user(db, admin_data)
                print("管理员用户创建成功！")
            else:
                print("管理员用户已存在，跳过创建。")
            
            # 创建示例分类（如果不存在）
            sample_categories = ["开发", "设计", "运维", "安全"]
            for cat_name in sample_categories:
                existing_cat = crud.get_category_by_name(db, name=cat_name)
                if not existing_cat:
                    category_data = CategoryCreate(
                        name=cat_name,
                        slug=cat_name.lower(),
                        description=f"{cat_name}相关的文章分类"
                    )
                    crud.create_category(db, category_data)
                    print(f"分类 '{cat_name}' 创建成功！")
            
            # 创建示例标签（如果不存在）
            sample_tags = ["Python", "FastAPI", "PostgreSQL", "Docker", "React"]
            for tag_name in sample_tags:
                existing_tag = crud.get_tag_by_name(db, name=tag_name)
                if not existing_tag:
                    tag_data = TagCreate(
                        name=tag_name,
                        slug=tag_name.lower(),
                        description=f"关于{tag_name}的标签"
                    )
                    crud.create_tag(db, tag_data)
                    print(f"标签 '{tag_name}' 创建成功！")
            
        finally:
            # 确保关闭数据库会话
            next(db_gen, None)  # 耗尽生成器以触发finally块
        
        print("示例数据创建完成！")
        return True
        
    except Exception as e:
        print(f"创建示例数据时出错: {e}")
        return False


def main():
    """主函数"""
    print("=" * 60)
    print("My Awesome Blog - 数据库初始化脚本")
    print("=" * 60)
    
    # 1. 创建数据库（如果不存在）
    if not create_database_if_not_exists():
        print("数据库创建失败，程序退出。")
        return False
    
    # 2. 初始化数据表
    if not initialize_tables():
        print("数据表初始化失败，程序退出。")
        return False
    
    # 3. 创建示例数据
    if not create_sample_data():
        print("示例数据创建失败，但不影响数据库初始化。")
    
    print("=" * 60)
    print("数据库初始化完成！")
    print("请检查您的数据库连接设置是否正确。")
    print("默认管理员账号: admin / admin123")
    print("=" * 60)
    
    return True


if __name__ == "__main__":
    success = main()
    if success:
        print("\n数据库初始化成功！")
        exit(0)
    else:
        print("\n数据库初始化失败！")
        exit(1)