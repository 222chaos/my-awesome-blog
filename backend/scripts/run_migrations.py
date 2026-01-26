#!/usr/bin/env python
"""
数据库迁移脚本
此脚本用于运行Alembic数据库迁移，同步数据库结构到最新版本
"""

import subprocess
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings


def run_migrations():
    """运行数据库迁移"""
    print("正在运行数据库迁移...")
    print(f"目标数据库: {settings.DATABASE_URL.split('@')[-1].split('/')[0]}")
    
    try:
        # 使用Alembic运行迁移
        result = subprocess.run([
            sys.executable.replace('\\', '/'), '-c',
            'import sys; from alembic.config import main; sys.argv = ["alembic", "upgrade", "head"]; main()'
        ], cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
        capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ 数据库迁移成功")
            if result.stdout:
                print("输出信息:")
                print(result.stdout)
            return True
        else:
            print("✗ 数据库迁移失败")
            print("错误信息:")
            print(result.stderr)
            return False
            
    except FileNotFoundError:
        # 如果subprocess方法失败，尝试直接调用alembic
        try:
            result = subprocess.run([
                'alembic', 'upgrade', 'head'
            ], cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✓ 数据库迁移成功")
                if result.stdout:
                    print("输出信息:")
                    print(result.stdout)
                return True
            else:
                print("✗ 数据库迁移失败")
                print("错误信息:")
                print(result.stderr)
                return False
        except Exception as e:
            print(f"✗ 无法运行数据库迁移: {str(e)}")
            print("请确保已安装alembic并在环境中可执行")
            return False
    except Exception as e:
        print(f"✗ 数据库迁移过程中发生错误: {str(e)}")
        return False


def main():
    """主函数"""
    print("=" * 50)
    print("My Awesome Blog - 数据库迁移脚本")
    print("=" * 50)
    
    success = run_migrations()
    
    print("=" * 50)
    if success:
        print("数据库迁移完成!")
        print("您的数据库现在是最新的结构。")
    else:
        print("数据库迁移失败!")
        print("请检查PostgreSQL服务是否正在运行，以及连接参数是否正确。")
        sys.exit(1)
    print("=" * 50)


if __name__ == "__main__":
    main()