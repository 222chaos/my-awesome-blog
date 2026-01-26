#!/usr/bin/env python
"""
数据库完整设置脚本
此脚本依次执行数据库连接检查、迁移和初始化操作
"""

import subprocess
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings


def run_script(script_name):
    """运行指定的脚本"""
    script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), script_name)
    
    print(f"\n>>> 运行脚本: {script_name}")
    print("-" * 40)
    
    try:
        result = subprocess.run([
            sys.executable, script_path
        ], capture_output=True, text=True, cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        
        if result.returncode == 0:
            print(f"✓ {script_name} 执行成功")
            return True
        else:
            print(f"✗ {script_name} 执行失败")
            print("错误输出:")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"✗ 运行 {script_name} 时发生错误: {str(e)}")
        return False


def main():
    """主函数 - 完整的数据库设置流程"""
    print("=" * 60)
    print("My Awesome Blog - 数据库完整设置脚本")
    print("=" * 60)
    print(f"当前数据库配置: {settings.DATABASE_URL.split('@')[-1].split('/')[0]}")
    print("即将执行以下步骤:")
    print("1. 检查数据库连接")
    print("2. 运行数据库迁移")
    print("3. 初始化数据库表和管理员用户")
    print("=" * 60)
    
    # 确认执行
    response = input("是否继续? (y/N): ")
    if response.lower() not in ['y', 'yes']:
        print("操作已取消")
        return
    
    # 1. 检查数据库连接
    print("\n步骤 1: 检查数据库连接")
    if not run_script("check_db_connection.py"):
        print("\n✗ 数据库连接检查失败，终止操作")
        sys.exit(1)
    
    # 2. 运行数据库迁移
    print("\n步骤 2: 运行数据库迁移")
    if not run_script("run_migrations.py"):
        print("\n✗ 数据库迁移失败，终止操作")
        sys.exit(1)
    
    # 3. 初始化数据库
    print("\n步骤 3: 初始化数据库")
    if not run_script("init_db.py"):
        print("\n✗ 数据库初始化失败，终止操作")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("🎉 数据库完整设置成功!")
    print("\n设置摘要:")
    print("- 数据库连接检查: ✓")
    print("- 数据库结构迁移: ✓")
    print("- 管理员用户创建: ✓")
    print("\n下一步:")
    print("- 启动后端服务: python run_server.py")
    print("- 或使用 uvicorn: uvicorn app.main:app --reload")
    print("- 访问 API 文档: http://localhost:8989/docs")
    print("=" * 60)


if __name__ == "__main__":
    main()