#!/usr/bin/env python
"""
Windows专用数据库初始化脚本
此脚本用于在Windows环境下初始化PostgreSQL数据库，避免字符编码问题
"""

import os
import sys
import bcrypt
import psycopg2
from psycopg2.extras import RealDictCursor
from urllib.parse import urlparse

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings


def get_db_connection():
    """获取数据库连接"""
    # 正确解析PostgreSQL URL，保留查询参数但用于连接设置
    parsed = urlparse(settings.DATABASE_URL)
    
    conn = psycopg2.connect(
        host=parsed.hostname or 'localhost',
        port=parsed.port or 5432,
        database=parsed.path[1:],  # 移除开头的 '/'
        user=parsed.username,
        password=parsed.password,
        client_encoding='UTF8'  # 显式设置客户端编码
    )
    return conn


def init_database():
    """初始化数据库，创建所有表"""
    print("正在初始化数据库...")
    
    # SQL DDL语句定义所有需要的表
    table_definitions = [
        """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            is_active BOOLEAN DEFAULT TRUE,
            is_superuser BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            avatar VARCHAR(500),
            bio TEXT,
            website VARCHAR(200),
            twitter VARCHAR(100),
            github VARCHAR(100),
            linkedin VARCHAR(100)
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS tags (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            slug VARCHAR(50) UNIQUE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            excerpt TEXT,
            slug VARCHAR(200) UNIQUE NOT NULL,
            is_published BOOLEAN DEFAULT FALSE,
            published_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS article_tags (
            article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
            tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
            PRIMARY KEY (article_id, tag_id)
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            is_approved BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
            author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS friend_links (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            url VARCHAR(500) NOT NULL,
            description TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS images (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            filepath VARCHAR(500) NOT NULL,
            file_size INTEGER,
            mime_type VARCHAR(100),
            alt_text VARCHAR(255),
            upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            uploaded_by INTEGER REFERENCES users(id)
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS portfolio (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            project_url VARCHAR(500),
            github_url VARCHAR(500),
            image_url VARCHAR(500),
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS timeline_events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            event_date DATE NOT NULL,
            event_type VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS subscriptions (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            unsubscribed_at TIMESTAMP WITH TIME ZONE
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS request_logs (
            id SERIAL PRIMARY KEY,
            endpoint VARCHAR(500) NOT NULL,
            method VARCHAR(10) NOT NULL,
            ip_address INET,
            user_agent TEXT,
            response_time FLOAT,
            status_code INTEGER,
            timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """
    ]
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 创建所有表
        for i, table_sql in enumerate(table_definitions):
            cursor.execute(table_sql)
            print(f"  ✓ 表 {(i+1)} 创建/验证成功")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("✓ 数据库表结构创建成功")
        return True
        
    except Exception as e:
        print(f"✗ 数据库初始化失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def create_admin_user():
    """创建初始管理员用户"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # 检查管理员用户是否已存在
        cursor.execute("SELECT * FROM users WHERE username = %s;", ("admin",))
        admin_user = cursor.fetchone()
        
        if admin_user:
            print("⚠️  管理员用户已存在，跳过创建")
            print(f"   用户名: {admin_user['username']}")
            print(f"   超级用户权限: {admin_user['is_superuser']}")
            cursor.close()
            conn.close()
            return
        
        # 创建新的管理员用户
        password = "admin123"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        insert_sql = """
            INSERT INTO users (
                username, email, hashed_password, full_name, is_active, 
                is_superuser, avatar, bio, website, twitter, github, linkedin
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            ) RETURNING id;
        """
        
        cursor.execute(insert_sql, (
            "admin", "admin@example.com", hashed_password, "Admin User", 
            True, True, None, "Administrator account", None, None, None, None
        ))
        
        result = cursor.fetchone()
        if result:
            user_id = result['id']
        conn.commit()
        cursor.close()
        conn.close()
        
        print("✓ 管理员用户创建成功")
        print(f"   用户名: admin")
        print(f"   密码: admin123")
        print(f"   超级用户权限: True")
        
    except Exception as e:
        print(f"✗ 创建管理员用户失败: {str(e)}")
        import traceback
        traceback.print_exc()


def main():
    """主函数"""
    print("=" * 50)
    print("My Awesome Blog - Windows专用数据库初始化脚本")
    print("=" * 50)
    
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