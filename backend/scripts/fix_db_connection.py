#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
数据库修复脚本 - 自动创建缺失的数据库并初始化
"""

import os
import sys

# 设置 UTF-8 环境以避免编码问题
os.environ['PYTHONUTF8'] = '1'
os.environ['PYTHONIOENCODING'] = 'UTF-8'

import psycopg2
import bcrypt


def get_db_connection(database='postgres'):
    """获取数据库连接"""
    try:
        conn = psycopg2.connect(
            host='localhost',
            port=5432,
            database=database,
            user='postgres',
            password='123456',
            client_encoding='UTF8',
            application_name='MyAwesomeBlogFix'
        )
        return conn
    except Exception as e:
        print(f"[ERROR] 无法连接到数据库: {e}")
        return None


def create_database(database_name='my_awesome_blog'):
    """创建数据库"""
    print(f"\n正在创建数据库 '{database_name}'...")

    # 连接到默认的 postgres 数据库
    conn = get_db_connection('postgres')
    if not conn:
        return False

    try:
        conn.autocommit = True  # 创建数据库需要自动提交
        cursor = conn.cursor()

        # 检查数据库是否已存在
        cursor.execute("SELECT datname FROM pg_database WHERE datname = %s", (database_name,))
        if cursor.fetchone():
            print(f"  [WARN] 数据库 '{database_name}' 已存在，跳过创建")
            cursor.close()
            conn.close()
            return True

        # 创建数据库
        cursor.execute(f"CREATE DATABASE {database_name} ENCODING 'UTF8'")
        print(f"  [OK] 数据库 '{database_name}' 创建成功")

        cursor.close()
        conn.close()
        return True

    except Exception as e:
        print(f"  [ERROR] 创建数据库失败: {e}")
        conn.close()
        return False


def create_tables():
    """创建所有表"""
    print("\n正在创建表结构...")

    conn = get_db_connection('my_awesome_blog')
    if not conn:
        return False

    try:
        cursor = conn.cursor()

        # SQL DDL 语句定义所有需要的表
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

        # 创建所有表
        for i, table_sql in enumerate(table_definitions, 1):
            cursor.execute(table_sql)
            print(f"  [OK] 表 {i}/{len(table_definitions)} 创建/验证成功")

        conn.commit()
        cursor.close()
        conn.close()

        print("  [OK] 数据库表结构创建成功")
        return True

    except Exception as e:
        print(f"  [ERROR] 创建表失败: {e}")
        conn.close()
        return False


def create_admin_user():
    """创建初始管理员用户"""
    print("\n正在创建管理员用户...")

    conn = get_db_connection('my_awesome_blog')
    if not conn:
        return False

    try:
        cursor = conn.cursor()

        # 检查管理员用户是否已存在
        cursor.execute("SELECT * FROM users WHERE username = %s;", ("admin",))
        admin_user = cursor.fetchone()

        if admin_user:
            print("  [WARN] 管理员用户已存在，跳过创建")
            cursor.close()
            conn.close()
            return True

        # 创建新的管理员用户
        password = "admin123"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        insert_sql = """
            INSERT INTO users (
                username, email, hashed_password, full_name, is_active,
                is_superuser, avatar, bio, website, twitter, github, linkedin
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            );
        """

        cursor.execute(insert_sql, (
            "admin", "admin@example.com", hashed_password, "Admin User",
            True, True, None, "Administrator account", None, None, None, None
        ))

        conn.commit()
        cursor.close()
        conn.close()

        print("  [OK] 管理员用户创建成功")
        print(f"    用户名: admin")
        print(f"    密码: admin123")
        return True

    except Exception as e:
        print(f"  [ERROR] 创建管理员用户失败: {e}")
        conn.close()
        return False


def main():
    """主函数"""
    print("=" * 60)
    print("My Awesome Blog - 数据库修复脚本")
    print("=" * 60)

    # 步骤 1: 创建数据库
    if not create_database():
        print("\n[ERROR] 数据库创建失败，脚本终止")
        sys.exit(1)

    # 步骤 2: 创建表结构
    if not create_tables():
        print("\n[ERROR] 表结构创建失败，脚本终止")
        sys.exit(1)

    # 步骤 3: 创建管理员用户
    if not create_admin_user():
        print("\n[ERROR] 管理员用户创建失败，脚本终止")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("[OK] 数据库修复完成!")
    print("=" * 60)
    print("\n数据库信息:")
    print("  主机: localhost")
    print("  端口: 5432")
    print("  数据库: my_awesome_blog")
    print("  用户: postgres")
    print("\n管理员账号:")
    print("  用户名: admin")
    print("  密码: admin123")
    print("\n提示:")
    print("  - 现在可以运行后端服务了")
    print("  - 建议修改默认密码")
    print("=" * 60)


if __name__ == "__main__":
    main()
