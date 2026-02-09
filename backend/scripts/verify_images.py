import sys
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
sys.path.insert(0, backend_dir)

from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

def verify_images():
    with engine.connect() as conn:
        # 统计图片数量
        result = conn.execute(text("SELECT COUNT(*) FROM images"))
        image_count = result.fetchone()[0]
        print(f"总图片数: {image_count}")
        
        # 统计相册图片关联数
        result = conn.execute(text("SELECT COUNT(*) FROM portfolio_images"))
        portfolio_image_count = result.fetchone()[0]
        print(f"相册-图片关联数: {portfolio_image_count}")
        
        # 统计相册数量
        result = conn.execute(text("SELECT COUNT(*) FROM portfolios"))
        portfolio_count = result.fetchone()[0]
        print(f"相册数: {portfolio_count}")
        
        # 查看每个相册的图片数
        print("\n每个相册的图片数:")
        result = conn.execute(text("""
            SELECT p.title, COUNT(pi.id) as image_count
            FROM portfolios p
            LEFT JOIN portfolio_images pi ON p.id = pi.portfolio_id
            GROUP BY p.id, p.title
            ORDER BY image_count DESC
        """))
        for row in result.fetchall():
            print(f"  - {row[0]}: {row[1]} 张图片")
        
        # 查看前5张图片
        print("\n前5张图片:")
        result = conn.execute(text("""
            SELECT i.file_path, i.caption, p.title as album_title
            FROM images i
            JOIN portfolio_images pi ON i.id = pi.image_id
            JOIN portfolios p ON pi.portfolio_id = p.id
            LIMIT 5
        """))
        for row in result.fetchall():
            print(f"  - {row[2]}: {row[1]}")
            print(f"    URL: {row[0]}")

if __name__ == "__main__":
    verify_images()
