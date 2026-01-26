#!/usr/bin/env python
"""
数据库初始化脚本
用于创建所有必要的数据表
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).resolve().parent.parent  # 指向backend目录
sys.path.insert(0, str(project_root))

# 设置环境变量
os.environ.setdefault("DATABASE_URL", "postgresql://postgres:123456@localhost:5432/my_awesome_blog")

from app.core.database import engine
from app.models import Base


def initialize_database():
    """初始化数据库表结构"""
    print("开始初始化数据库表结构...")

    try:
        # 创建所有表
        print("正在创建数据表...")
        Base.metadata.create_all(bind=engine)
        print("[OK] 数据库表结构初始化完成！")
        return True
    except Exception as e:
        print(f"[ERROR] 初始化数据库表结构时出错: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """主函数"""
    print("="*50)
    print("My Awesome Blog - 数据库表结构初始化")
    print("="*50)

    success = initialize_database()

    print("="*50)
    if success:
        print("[OK] 数据库初始化成功！")
        print("接下来您可以运行 'alembic upgrade head' 应用所有迁移。")
    else:
        print("[ERROR] 数据库初始化失败！")
    print("="*50)

    return success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)