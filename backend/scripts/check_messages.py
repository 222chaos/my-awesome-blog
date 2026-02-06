import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.message import Message
from app.utils.logger import app_logger

def check_messages():
    db = SessionLocal()
    try:
        count = db.query(Message).count()
        app_logger.info(f"数据库中的留言总数: {count}")

        if count == 0:
            app_logger.warning("数据库中没有留言数据！")
        else:
            messages = db.query(Message).filter(Message.is_deleted == False).limit(5).all()
            for msg in messages:
                app_logger.info(f"留言: id={msg.id}, content={msg.content[:30]}, author_id={msg.author_id}")

    except Exception as e:
        app_logger.error(f"检查留言失败: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    check_messages()
