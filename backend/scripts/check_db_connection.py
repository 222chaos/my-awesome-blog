#!/usr/bin/env python
"""
数据库连接检查脚本
此脚本用于验证与PostgreSQL数据库的连接
"""

import sys
import os
from urllib.parse import urlparse

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings


def check_db_connection():
    """检查数据库连接"""
    print("正在检查数据库连接...")
    print(f"数据库URL: {settings.DATABASE_URL}")
    
    try:
        # 解析数据库URL以获取连接信息
        parsed = urlparse(settings.DATABASE_URL)
        print(f"数据库类型: {parsed.scheme}")
        print(f"主机: {parsed.hostname}")
        print(f"端口: {parsed.port}")
        print(f"数据库名: {parsed.path[1:]}")  # 移除开头的'/'
        print(f"用户名: {parsed.username}")
        
        # 根据数据库类型导入相应的库
        if parsed.scheme.lower().startswith('postgres'):
            import psycopg2
            from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
            
            # 连接到数据库
            conn = psycopg2.connect(
                host=parsed.hostname,
                port=parsed.port,
                database=parsed.path[1:],
                user=parsed.username,
                password=parsed.password
            )
            
            # 设置自动提交模式
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cur = conn.cursor()
            
            # 测试查询
            cur.execute('SELECT version();')
            db_version_row = cur.fetchone()
            if db_version_row:
                print(f"✓ PostgreSQL版本: {db_version_row[0]}")
            else:
                print("✓ PostgreSQL连接成功，但无法获取版本信息")
            
            # 检查数据库是否存在
            cur.execute("SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower(%s);", (parsed.path[1:],))
            db_exists = bool(cur.fetchone())
            if db_exists:
                print("✓ 数据库存在")
            else:
                print(f"✗ 数据库 '{parsed.path[1:]}' 不存在")
                
            cur.close()
            conn.close()
            
            print("✓ PostgreSQL连接测试成功")
            return True
            
        elif parsed.scheme.lower() == 'sqlite':
            import sqlite3
            # 处理SQLite连接
            db_path = parsed.path
            if db_path.startswith('/'):
                db_path = db_path[1:]  # 移除开头的'/'
                
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # 测试查询
            cursor.execute('SELECT sqlite_version();')
            db_version_row = cursor.fetchone()
            if db_version_row:
                print(f"✓ SQLite版本: {db_version_row[0]}")
            else:
                print("✓ SQLite连接成功，但无法获取版本信息")
            
            conn.close()
            print("✓ SQLite连接测试成功")
            return True
        else:
            print(f"✗ 不支持的数据库类型: {parsed.scheme}")
            return False
            
    except ImportError as e:
        print(f"✗ 缺少数据库驱动: {str(e)}")
        print("请安装相应驱动: pip install psycopg2-binary (PostgreSQL) 或 pip install pysqlite3")
        return False
    except Exception as e:
        print(f"✗ 数据库连接失败: {str(e)}")
        print("\n可能的原因:")
        print("- PostgreSQL服务未启动")
        print("- 数据库连接参数错误")
        print("- 防火墙阻止了连接")
        print("- 数据库不存在")
        print("- 用户名或密码错误")
        return False


def main():
    """主函数"""
    print("=" * 50)
    print("My Awesome Blog - 数据库连接检查脚本")
    print("=" * 50)
    
    success = check_db_connection()
    
    print("=" * 50)
    if success:
        print("数据库连接检查通过!")
        print("您可以继续进行数据库初始化或迁移操作。")
    else:
        print("数据库连接检查失败!")
        print("请确保PostgreSQL服务正在运行，且连接参数正确。")
        sys.exit(1)
    print("=" * 50)


if __name__ == "__main__":
    main()