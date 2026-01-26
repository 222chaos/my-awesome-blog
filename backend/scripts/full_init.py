"""
My Awesome Blog - 综合初始化脚本

此脚本执行以下操作：
1. 创建数据库表结构
2. 运行数据库迁移
3. 创建管理员用户
4. 初始化示例数据
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).resolve().parent.parent  # 指向backend目录
sys.path.insert(0, str(project_root))

# 设置环境变量
os.environ.setdefault("DATABASE_URL", "postgresql://postgres:123456@localhost:5432/my_awesome_blog")


def run_create_tables():
    """运行创建表结构脚本"""
    print("[RUNNING] 创建数据库表结构")
    
    try:
        # 导入并运行创建表的脚本
        from scripts.create_tables import main as create_tables_main
        success = create_tables_main()
        if success:
            print("[SUCCESS] 数据库表结构创建完成")
            return True
        else:
            print("[FAILED] 数据库表结构创建失败")
            return False
    except Exception as e:
        print(f"[FAILED] 创建数据库表结构时出错: {e}")
        return False


def run_migrations():
    """运行数据库迁移"""
    print("[RUNNING] 运行数据库迁移")
    
    try:
        from alembic.config import Config
        from alembic import command
        import os
        
        # 设置alembic配置文件路径
        alembic_cfg = Config(os.path.join(project_root, "alembic.ini"))
        command.upgrade(alembic_cfg, "head")
        print("[SUCCESS] 数据库迁移完成")
        return True
    except ImportError:
        print("[WARNING] Alembic未安装，跳过数据库迁移...")
        return True  # 不将此视为错误
    except Exception as e:
        print(f"[WARNING] 运行数据库迁移时出错: {e}")
        return False


def run_init_db():
    """运行数据库初始化"""
    print("[RUNNING] 初始化数据库数据")
    
    try:
        # 导入并运行初始化脚本
        from scripts.init_db_complete import main as init_db_main
        success = init_db_main()
        if success:
            print("[SUCCESS] 数据库数据初始化完成")
            return True
        else:
            print("[WARNING] 数据库数据初始化失败，但这可能不影响基本功能")
            return True  # 不将此视为致命错误
    except ImportError:
        # 如果init_db_complete不存在，尝试使用simple版本
        try:
            from scripts.init_db_simple import main as init_db_simple_main
            success = init_db_simple_main()
            if success:
                print("[SUCCESS] 数据库数据初始化完成")
                return True
            else:
                print("[WARNING] 数据库数据初始化失败，但这可能不影响基本功能")
                return True
        except ImportError:
            print("[WARNING] 未找到数据库初始化脚本，跳过数据初始化...")
            return True
    except Exception as e:
        print(f"[WARNING] 数据库初始化时出错: {e}")
        return True  # 不将此视为致命错误


def main():
    """主函数"""
    print("="*60)
    print("My Awesome Blog - 综合初始化脚本")
    print("="*60)
    print(f"项目根目录: {project_root}")
    print(f"数据库URL: {os.environ.get('DATABASE_URL', 'Not set')}")
    print()

    print("开始数据库初始化流程...")

    # 步骤1: 创建数据库表结构
    print("\n步骤 1: 创建数据库表结构")
    success1 = run_create_tables()

    if not success1:
        print("\n[ERROR] 数据库表结构创建失败，终止初始化。")
        return False

    # 步骤2: 运行数据库迁移
    print("\n步骤 2: 运行数据库迁移")
    success2 = run_migrations()

    if not success2:
        print("\n[WARNING] 数据库迁移失败，但这可能不影响基本功能。")

    # 步骤3: 初始化数据库数据
    print("\n步骤 3: 初始化数据库数据")
    success3 = run_init_db()

    if not success3:
        print("\n[WARNING] 数据库数据初始化失败，但这可能不影响基本功能。")

    print("\n" + "="*60)
    print("初始化流程完成！")
    print("以下是重要信息：")
    print("- 数据库表结构已创建")
    print("- 数据库迁移已应用（如果成功）")
    print("- 数据库数据已初始化（如果成功）")
    print("\n下一步操作：")
    print("1. 启动应用: uvicorn app.main:app --reload --port 8000")
    print("2. 访问API文档: http://localhost:8000/docs")
    print("3. 登录管理后台，开始使用My Awesome Blog")
    print("="*60)

    return True


if __name__ == "__main__":
    success = main()
    if success:
        print("\n[SUCCESS] 初始化完成！")
        sys.exit(0)
    else:
        print("\n[ERROR] 初始化失败！")
        sys.exit(1)