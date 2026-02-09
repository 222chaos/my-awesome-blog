import sys
import os
from datetime import date, datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.portfolio import Portfolio
from app.core.config import settings

# 创建数据库引擎
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_test_albums():
    db = SessionLocal()
    
    try:
        # 检查是否已有数据
        existing_albums = db.query(Portfolio).count()
        if existing_albums > 0:
            print(f"数据库中已有 {existing_albums} 个相册，跳过创建测试数据")
            return
        
        # 创建测试相册数据
        test_albums = [
            Portfolio(
                title="城市夜景",
                slug="city-night-views",
                description="现代都市的夜晚美景摄影集，记录城市夜晚的璀璨灯光与独特魅力",
                cover_image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/city-night",
                github_url="https://github.com/example/city-night",
                technologies='["photography", "night", "urban"]',
                start_date=date(2023, 10, 1),
                end_date=date(2023, 10, 31),
                status="completed",
                is_featured=True,
                sort_order=1
            ),
            Portfolio(
                title="自然风光",
                slug="nature-landscapes",
                description="壮丽的自然景观摄影，探索大自然的鬼斧神工与绝美风光",
                cover_image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/nature",
                github_url="https://github.com/example/nature",
                technologies='["photography", "nature", "landscape"]',
                start_date=date(2023, 9, 1),
                end_date=date(2023, 9, 30),
                status="completed",
                is_featured=False,
                sort_order=2
            ),
            Portfolio(
                title="人物肖像",
                slug="portrait-photography",
                description="专业人像摄影作品，捕捉人物的神韵与情感表达",
                cover_image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/portrait",
                github_url="https://github.com/example/portrait",
                technologies='["photography", "portrait", "people"]',
                start_date=date(2023, 8, 1),
                end_date=date(2023, 8, 31),
                status="completed",
                is_featured=True,
                sort_order=3
            ),
            Portfolio(
                title="旅行记忆",
                slug="travel-memories",
                description="世界旅行中的美好瞬间，记录不同文化的独特魅力",
                cover_image="https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/travel",
                github_url="https://github.com/example/travel",
                technologies='["photography", "travel", "culture"]',
                start_date=date(2023, 7, 1),
                end_date=date(2023, 7, 31),
                status="completed",
                is_featured=False,
                sort_order=4
            ),
            Portfolio(
                title="动物世界",
                slug="wildlife-photography",
                description="野生动物的精彩瞬间，展现自然生命的活力与美丽",
                cover_image="https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/wildlife",
                github_url="https://github.com/example/wildlife",
                technologies='["photography", "wildlife", "animals"]',
                start_date=date(2023, 6, 1),
                end_date=date(2023, 6, 30),
                status="completed",
                is_featured=True,
                sort_order=5
            ),
            Portfolio(
                title="美食摄影",
                slug="food-photography",
                description="精致美食的视觉盛宴，记录各地的美食文化",
                cover_image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/food",
                github_url="https://github.com/example/food",
                technologies='["photography", "food", "culture"]',
                start_date=date(2023, 5, 1),
                end_date=date(2023, 5, 31),
                status="completed",
                is_featured=False,
                sort_order=6
            )
        ]
        
        # 批量插入数据
        db.add_all(test_albums)
        db.commit()
        
        print(f"成功创建 {len(test_albums)} 个测试相册")
        print("相册列表：")
        for album in test_albums:
            print(f"  - {album.title} (featured: {album.is_featured})")
        
    except Exception as e:
        print(f"创建测试数据失败: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_albums()