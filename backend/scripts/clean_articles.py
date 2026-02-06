import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.article import Article
from app.models.article_tag import ArticleTag
from app.models.article_category import ArticleCategory
from app.utils.logger import app_logger

def clean_articles():
    db = SessionLocal()
    try:
        app_logger.info("删除所有文章关联...")
        db.query(ArticleTag).delete()
        db.query(ArticleCategory).delete()
        db.query(Article).delete()
        db.commit()
        app_logger.info("删除完成")
    except Exception as e:
        db.rollback()
        app_logger.error(f"删除失败: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    clean_articles()
