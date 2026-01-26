"""
初始化打字机内容的脚本
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.crud.typewriter_content import create_typewriter_content, get_active_typewriter_contents
from app.schemas.typewriter_content import TypewriterContentCreate
from app.utils.logger import app_logger


def init_typewriter_contents():
    """初始化打字机内容"""
    db: Session = SessionLocal()

    try:
        # 检查是否已有数据
        existing = get_active_typewriter_contents(db)
        if existing:
            app_logger.info(f"已存在 {len(existing)} 条打字机内容，跳过初始化")
            return

        # 默认打字机内容
        default_contents = [
            {
                "text": "欢迎来到我的博客",
                "priority": 1,
                "is_active": True
            },
            {
                "text": "记录技术成长与生活点滴",
                "priority": 2,
                "is_active": True
            },
            {
                "text": "探索无限可能",
                "priority": 3,
                "is_active": True
            },
            {
                "text": "分享知识，传递价值",
                "priority": 4,
                "is_active": True
            }
        ]

        # 创建内容
        for content_data in default_contents:
            content_create = TypewriterContentCreate(**content_data)
            create_typewriter_content(db, content_create)
            app_logger.info(f"已创建打字机内容: {content_data['text']}")

        app_logger.info("打字机内容初始化完成！")

    except Exception as e:
        app_logger.error(f"初始化打字机内容时出错: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_typewriter_contents()
