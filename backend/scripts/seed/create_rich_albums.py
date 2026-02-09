import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
from datetime import date, datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.portfolio import Portfolio
from app.core.config import settings
import json
import random

# 创建数据库引擎
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_rich_albums():
    db = SessionLocal()
    
    try:
        # 检查是否已有数据
        existing_albums = db.query(Portfolio).count()
        if existing_albums > 0:
            print(f"数据库中已有 {existing_albums} 个相册，将追加新的相册数据")
        else:
            print("数据库为空，开始创建相册数据")
        
        # 丰富的相册数据
        rich_albums = [
            # 建筑摄影
            Portfolio(
                title="现代建筑之美",
                slug="modern-architecture",
                description="探索当代建筑的几何美学与空间设计，记录城市天际线的壮丽景观",
                cover_image="https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/architecture",
                github_url="https://github.com/example/architecture",
                technologies=json.dumps(["architecture", "urban", "design", "modern"]),
                start_date=date(2023, 11, 1),
                end_date=date(2023, 11, 30),
                status="completed",
                is_featured=True,
                sort_order=7
            ),
            
            # 街头摄影
            Portfolio(
                title="街头瞬间",
                slug="street-photography",
                description="捕捉城市街头的真实生活瞬间，记录人文与城市的交融",
                cover_image="https://images.unsplash.com/photo-1449824913929-65aa7a693af2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/street",
                github_url="https://github.com/example/street",
                technologies=json.dumps(["street", "candid", "urban", "people"]),
                start_date=date(2023, 10, 15),
                end_date=date(2023, 10, 20),
                status="completed",
                is_featured=True,
                sort_order=8
            ),
            
            # 微距摄影
            Portfolio(
                title="微观世界",
                slug="macro-photography",
                description="探索肉眼难以察觉的微观世界，展现自然的精致细节",
                cover_image="https://images.unsplash.com/photo-1515187029135-18ee2869d34b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/macro",
                github_url="https://github.com/example/macro",
                technologies=json.dumps(["macro", "nature", "close-up", "detail"]),
                start_date=date(2023, 9, 10),
                end_date=date(2023, 9, 15),
                status="completed",
                is_featured=False,
                sort_order=9
            ),
            
            # 黑白摄影
            Portfolio(
                title="黑白经典",
                slug="black-and-white",
                description="永恒的黑白美学，通过光影对比展现世界本质",
                cover_image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/bw",
                github_url="https://github.com/example/bw",
                technologies=json.dumps(["black-white", "classic", "artistic", "monochrome"]),
                start_date=date(2023, 8, 5),
                end_date=date(2023, 8, 25),
                status="completed",
                is_featured=True,
                sort_order=10
            ),
            
            # 时尚摄影
            Portfolio(
                title="时尚前沿",
                slug="fashion-photography",
                description="记录时尚界的最新趋势，展现个性与风格的融合",
                cover_image="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/fashion",
                github_url="https://github.com/example/fashion",
                technologies=json.dumps(["fashion", "editorial", "style", "trend"]),
                start_date=date(2023, 7, 20),
                end_date=date(2023, 7, 28),
                status="completed",
                is_featured=False,
                sort_order=11
            ),
            
            # 运动摄影
            Portfolio(
                title="激情运动",
                slug="sports-photography",
                description="定格赛场上的精彩瞬间，记录运动的力量与美感",
                cover_image="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/sports",
                github_url="https://github.com/example/sports",
                technologies=json.dumps(["sports", "action", "dynamic", "competition"]),
                start_date=date(2023, 6, 1),
                end_date=date(2023, 6, 30),
                status="completed",
                is_featured=True,
                sort_order=12
            ),
            
            # 抽象摄影
            Portfolio(
                title="抽象艺术",
                slug="abstract-photography",
                description="打破传统摄影界限，探索光影与形式的无限可能",
                cover_image="https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/abstract",
                github_url="https://github.com/example/abstract",
                technologies=json.dumps(["abstract", "artistic", "creative", "experimental"]),
                start_date=date(2023, 5, 10),
                end_date=date(2023, 5, 20),
                status="completed",
                is_featured=False,
                sort_order=13
            ),
            
            # 航空摄影
            Portfolio(
                title="上帝视角",
                slug="aerial-photography",
                description="从高空俯瞰大地，展现地理地貌的震撼美",
                cover_image="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/aerial",
                github_url="https://github.com/example/aerial",
                technologies=json.dumps(["aerial", "drone", "landscape", "geography"]),
                start_date=date(2023, 4, 15),
                end_date=date(2023, 4, 25),
                status="completed",
                is_featured=True,
                sort_order=14
            ),
            
            # 静物摄影
            Portfolio(
                title="静物诗意",
                slug="still-life",
                description="通过精心布置的静物，展现日常物品的艺术之美",
                cover_image="https://images.unsplash.com/photo-14935146554098-8e7c9195e3c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/still-life",
                github_url="https://github.com/example/still-life",
                technologies=json.dumps(["still-life", "artistic", "composition", "minimal"]),
                start_date=date(2023, 3, 1),
                end_date=date(2023, 3, 15),
                status="completed",
                is_featured=False,
                sort_order=15
            ),
            
            # 水下摄影
            Portfolio(
                title="海底世界",
                slug="underwater-photography",
                description="探索神秘的海底世界，记录海洋生物的绚烂色彩",
                cover_image="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/underwater",
                github_url="https://github.com/example/underwater",
                technologies=json.dumps(["underwater", "marine", "scuba", "ocean"]),
                start_date=date(2023, 2, 10),
                end_date=date(2023, 2, 20),
                status="completed",
                is_featured=True,
                sort_order=16
            ),
            
            # 花卉摄影
            Portfolio(
                title="花开四季",
                slug="flower-photography",
                description="记录四季花卉的绽放瞬间，展现大自然的色彩诗篇",
                cover_image="https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/flowers",
                github_url="https://github.com/example/flowers",
                technologies=json.dumps(["flowers", "nature", "botanical", "macro"]),
                start_date=date(2023, 1, 5),
                end_date=date(2023, 1, 25),
                status="completed",
                is_featured=False,
                sort_order=17
            ),
            
            # 极简主义
            Portfolio(
                title="极简美学",
                slug="minimalist-photography",
                description="用最少的元素表达最多的意境，探索简约的力量",
                cover_image="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/minimal",
                github_url="https://github.com/example/minimal",
                technologies=json.dumps(["minimal", "simple", "clean", "aesthetic"]),
                start_date=date(2022, 12, 10),
                end_date=date(2022, 12, 20),
                status="completed",
                is_featured=True,
                sort_order=18
            ),
            
            # 星空摄影
            Portfolio(
                title="星空奇观",
                slug="astrophotography",
                description="追逐星辰大海，记录宇宙的壮丽与神秘",
                cover_image="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/stars",
                github_url="https://github.com/example/stars",
                technologies=json.dumps(["stars", "night", "long-exposure", "cosmos"]),
                start_date=date(2022, 11, 1),
                end_date=date(2022, 11, 30),
                status="completed",
                is_featured=False,
                sort_order=19
            ),
            
            # 城市人文
            Portfolio(
                title="城市故事",
                slug="urban-stories",
                description="记录城市中的人文故事，展现都市生活的多元面貌",
                cover_image="https://images.unsplash.com/photo-15172453868874-e6032e351fb7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/urban",
                github_url="https://github.com/example/urban-stories",
                technologies=json.dumps(["urban", "people", "lifestyle", "documentary"]),
                start_date=date(2022, 10, 15),
                end_date=date(2022, 10, 25),
                status="completed",
                is_featured=True,
                sort_order=20
            ),
            
            # 森林摄影
            Portfolio(
                title="森林秘境",
                slug="forest-photography",
                description="探索神秘森林，记录自然生态的原始美",
                cover_image="https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/forest",
                github_url="https://github.com/example/forest",
                technologies=json.dumps(["forest", "nature", "wilderness", "trees"]),
                start_date=date(2022, 9, 1),
                end_date=date(2022, 9, 30),
                status="completed",
                is_featured=False,
                sort_order=21
            ),
            
            # 沙漠风光
            Portfolio(
                title="沙漠之魂",
                slug="desert-photography",
                description="穿越广阔沙漠，感受荒漠的孤寂与壮美",
                cover_image="https://images.unsplash.com/photo-15093167852894-016f1b6b66ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                demo_url="https://example.com/desert",
                github_url="https://github.com/example/desert",
                technologies=json.dumps(["desert", "landscape", "sunset", "sand"]),
                start_date=date(2022, 8, 10),
                end_date=date(2022, 8, 25),
                status="completed",
                is_featured=False,
                sort_order=22
            )
        ]
        
        # 批量插入数据
        db.add_all(rich_albums)
        db.commit()
        
        # 统计精选相册数量
        featured_count = sum(1 for album in rich_albums if album.is_featured)
        
        print(f"成功创建 {len(rich_albums)} 个丰富相册")
        print(f"其中 {featured_count} 个为精选相册")
        print("\n相册分类统计：")
        
        # 按类型统计
        categories = {}
        for album in rich_albums:
            techs = json.loads(album.technologies or '[]')
            for tech in techs[:2]:  # 只取前两个标签
                categories[tech] = categories.get(tech, 0) + 1
        
        for category, count in sorted(categories.items(), key=lambda x: x[1], reverse=True)[:8]:
            print(f"  - {category}: {count}")
        
        print("\n精选相册列表：")
        for album in rich_albums:
            if album.is_featured:
                print(f"  ★ {album.title} ({album.slug})")
        
    except Exception as e:
        print(f"创建测试数据失败: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_rich_albums()