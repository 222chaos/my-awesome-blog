#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
数据库配置更新脚本 - 更新数据库连接参数并验证
"""

import os
import sys
import re
from urllib.parse import quote

# 设置 UTF-8 环境以避免编码问题
os.environ['PYTHONUTF8'] = '1'
os.environ['PYTHONIOENCODING'] = 'UTF-8'

import psycopg2


def parse_database_url(url):
    """解析 DATABASE_URL"""
    pattern = r'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)'
    match = re.match(pattern, url)
    if match:
        return {
            'user': match.group(1),
            'password': match.group(2),
            'host': match.group(3),
            'port': int(match.group(4)),
            'database': match.group(5)
        }
    return None


def build_database_url(config):
    """构建 DATABASE_URL"""
    return f"postgresql://{config['user']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}"


def read_env_file():
    """读取 .env 文件"""
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    env_vars = {}

    if not os.path.exists(env_path):
        print("[WARN] .env 文件不存在，使用默认配置")
        return env_vars

    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key.strip()] = value.strip()

    return env_vars


def write_env_file(env_vars):
    """写入 .env 文件"""
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')

    with open(env_path, 'w', encoding='utf-8') as f:
        for key, value in env_vars.items():
            f.write(f"{key}={value}\n")

    print(f"  [OK] .env 文件已更新")


def verify_connection(config):
    """验证数据库连接"""
    try:
        conn = psycopg2.connect(
            host=config['host'],
            port=config['port'],
            database=config['database'],
            user=config['user'],
            password=config['password'],
            client_encoding='UTF8',
            connect_timeout=5
        )
        print("  [OK] 数据库连接验证成功")
        conn.close()
        return True
    except Exception as e:
        print(f"  [ERROR] 数据库连接验证失败: {e}")
        return False


def main():
    """主函数"""
    print("=" * 60)
    print("My Awesome Blog - 数据库配置更新工具")
    print("=" * 60)

    # 读取当前配置
    env_vars = read_env_file()

    if 'DATABASE_URL' in env_vars:
        print(f"\n当前配置:")
        print(f"  DATABASE_URL: {env_vars['DATABASE_URL']}")
        current_config = parse_database_url(env_vars['DATABASE_URL'])
    else:
        print("\n当前配置: 未设置 DATABASE_URL")
        current_config = None

    # 交互式更新配置
    print("\n请输入新的配置（留空保持当前值）:")

    if current_config:
        new_host = input(f"主机 [{current_config['host']}]: ").strip() or current_config['host']
        new_port = input(f"端口 [{current_config['port']}]: ").strip() or str(current_config['port'])
        new_database = input(f"数据库 [{current_config['database']}]: ").strip() or current_config['database']
        new_user = input(f"用户名 [{current_config['user']}]: ").strip() or current_config['user']
        new_password = input(f"密码 [****]: ").strip()

        if not new_password:
            new_password = current_config['password']
    else:
        new_host = input("主机 [localhost]: ").strip() or 'localhost'
        new_port = input("端口 [5432]: ").strip() or '5432'
        new_database = input("数据库 [my_awesome_blog]: ").strip() or 'my_awesome_blog'
        new_user = input("用户名 [postgres]: ").strip() or 'postgres'
        new_password = input("密码 [123456]: ").strip() or '123456'

    new_config = {
        'host': new_host,
        'port': int(new_port),
        'database': new_database,
        'user': new_user,
        'password': new_password
    }

    # 显示新配置
    print("\n新配置:")
    print(f"  主机: {new_config['host']}")
    print(f"  端口: {new_config['port']}")
    print(f"  数据库: {new_config['database']}")
    print(f"  用户名: {new_config['user']}")
    print(f"  密码: {'*' * len(new_config['password'])}")

    # 确认更新
    confirm = input("\n是否确认更新配置? (y/n): ").strip().lower()
    if confirm != 'y':
        print("\n已取消配置更新")
        return

    # 验证连接
    print("\n正在验证数据库连接...")
    if not verify_connection(new_config):
        print("\n[ERROR] 无法连接到数据库，请检查配置")
        sys.exit(1)

    # 更新 .env 文件
    env_vars['DATABASE_URL'] = build_database_url(new_config)
    write_env_file(env_vars)

    print("\n" + "=" * 60)
    print("[OK] 配置更新成功!")
    print("=" * 60)
    print("\n下一步:")
    print("  - 可以运行后端服务了")
    print("  - 或者运行数据库初始化脚本: python scripts/windows_init_db.py")
    print("=" * 60)


if __name__ == "__main__":
    main()
