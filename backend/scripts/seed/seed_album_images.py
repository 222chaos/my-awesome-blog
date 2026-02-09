import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
from datetime import date, datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.portfolio import Portfolio
from app.models.image import Image
from app.models.portfolio_image import PortfolioImage
from app.core.config import settings
from uuid import uuid4
import json

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_image_dimensions(width=1200, height=800):
    """返回图片尺寸"""
    return width, height


def seed_album_images():
    db = SessionLocal()
    
    try:
        print("开始为相册添加图片数据...")
        
        # 获取所有相册
        portfolios = db.query(Portfolio).all()
        portfolio_map = {p.slug: p for p in portfolios}
        
        print(f"找到 {len(portfolios)} 个相册")
        
        # 图片数据 - 每个相册6-10张图片
        album_images_data = {
            "city-night-views": [
                {"url": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80", "caption": "东京夜景"},
                {"url": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80", "caption": "香港维多利亚港"},
                {"url": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80", "caption": "上海天际线"},
                {"url": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80", "caption": "纽约夜景"},
                {"url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80", "caption": "城市光轨"},
                {"url": "https://images.unsplash.com/photo-1534067611371-baafff748a42?w=1200&q=80", "caption": "霓虹灯街头"},
                {"url": "https://images.unsplash.com/photo-1480506132488-4a3579a0395c?w=1200&q=80", "caption": "雨后城市"},
                {"url": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80", "caption": "现代都市夜景"}
            ],
            "nature-landscapes": [
                {"url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80", "caption": "阿尔卑斯山"},
                {"url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80", "caption": "草原日出"},
                {"url": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80", "caption": "湖光山色"},
                {"url": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80", "caption": "雪山日出"},
                {"url": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80", "caption": "绿色山谷"},
                {"url": "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80", "caption": "瀑布"},
                {"url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80", "caption": "森林小径"},
                {"url": "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80", "caption": "秋日森林"}
            ],
            "portrait-photography": [
                {"url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80", "caption": "优雅肖像"},
                {"url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80", "caption": "男士肖像"},
                {"url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80", "caption": "自然笑容"},
                {"url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80", "caption": "艺术肖像"},
                {"url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80", "caption": "侧影"},
                {"url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80", "caption": "经典肖像"},
                {"url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80", "caption": "时尚肖像"}
            ],
            "travel-memories": [
                {"url": "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200&q=80", "caption": "巴黎铁塔"},
                {"url": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80", "caption": "威尼斯水城"},
                {"url": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80", "caption": "伦敦街头"},
                {"url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80", "caption": "马尔代夫"},
                {"url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80", "caption": "京都古寺"},
                {"url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", "caption": "热带海滩"},
                {"url": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80", "caption": "意大利小镇"}
            ],
            "wildlife-photography": [
                {"url": "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1200&q=80", "caption": "狮子"},
                {"url": "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=1200&q=80", "caption": "斑马群"},
                {"url": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1200&q=80", "caption": "长颈鹿"},
                {"url": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80", "caption": "老虎"},
                {"url": "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200&q=80", "caption": "大象"},
                {"url": "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1200&q=80", "caption": "鸟类"},
                {"url": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200&q=80", "caption": "熊猫"}
            ],
            "food-photography": [
                {"url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80", "caption": "精致西餐"},
                {"url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80", "caption": "意大利面"},
                {"url": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=80", "caption": "披萨"},
                {"url": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80", "caption": "亚洲美食"},
                {"url": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1200&q=80", "caption": "日式料理"},
                {"url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80", "caption": "法式甜点"},
                {"url": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80", "caption": "新鲜水果"}
            ],
            "modern-architecture": [
                {"url": "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80", "caption": "现代建筑"},
                {"url": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80", "caption": "玻璃幕墙"},
                {"url": "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7f?w=1200&q=80", "caption": "几何美学"},
                {"url": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80", "caption": "城市天际线"},
                {"url": "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1200&q=80", "caption": "建筑细节"},
                {"url": "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=1200&q=80", "caption": "现代住宅"},
                {"url": "https://images.unsplash.com/photo-1485627941502-d2e6429a0a0e?w=1200&q=80", "caption": "室内设计"}
            ],
            "street-photography": [
                {"url": "https://images.unsplash.com/photo-1449824913929-65aa7a693af2?w=1200&q=80", "caption": "街头瞬间"},
                {"url": "https://images.unsplash.com/photo-15172453868874-e6032e351fb7?w=1200&q=80", "caption": "城市故事"},
                {"url": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80", "caption": "街角"},
                {"url": "https://images.unsplash.com/photo-1534067611371-baafff748a42?w=1200&q=80", "caption": "人文纪实"},
                {"url": "https://images.unsplash.com/photo-1542204165-65bf26472b9b3?w=1200&q=80", "caption": "街头艺术"},
                {"url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80", "caption": "城市生活"}
            ],
            "macro-photography": [
                {"url": "https://images.unsplash.com/photo-1515187029135-18ee2869d34b?w=1200&q=80", "caption": "花朵微距"},
                {"url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80", "caption": "昆虫"},
                {"url": "https://images.unsplash.com/photo-1515709762922-bb3f1c7365a6?w=1200&q=80", "caption": "水滴"},
                {"url": "https://images.unsplash.com/photo-1506452819137-0422416856b8?w=1200&q=80", "caption": "蝴蝶"},
                {"url": "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&q=80", "caption": "植物细节"},
                {"url": "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=1200&q=80", "caption": "微观世界"}
            ],
            "black-and-white": [
                {"url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80", "caption": "黑白经典"},
                {"url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", "caption": "山水"},
                {"url": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80", "caption": "人物"},
                {"url": "https://images.unsplash.com/photo-1480506132488-4a3579a0395c?w=1200&q=80", "caption": "建筑"},
                {"url": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80", "caption": "自然"},
                {"url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80", "caption": "城市"}
            ],
            "fashion-photography": [
                {"url": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80", "caption": "时尚前沿"},
                {"url": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80", "caption": "时装周"},
                {"url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80", "caption": "街头时尚"},
                {"url": "https://images.unsplash.com/photo-1529139574466-a302d2052574?w=1200&q=80", "caption": "杂志风格"},
                {"url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80", "caption": "服装展示"},
                {"url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80", "caption": "模特写真"}
            ],
            "sports-photography": [
                {"url": "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80", "caption": "激情运动"},
                {"url": "https://images.unsplash.com/photo-1461896836934- voices-1-2588?w=1200&q=80", "caption": "足球"},
                {"url": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80", "caption": "篮球"},
                {"url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80", "caption": "网球"},
                {"url": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=80", "caption": "游泳"},
                {"url": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80", "caption": "赛车"}
            ],
            "abstract-photography": [
                {"url": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=80", "caption": "抽象艺术"},
                {"url": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1200&q=80", "caption": "光影艺术"},
                {"url": "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80", "caption": "色彩"},
                {"url": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80", "caption": "几何"},
                {"url": "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&q=80", "caption": "抽象"},
                {"url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80", "caption": "纹理"}
            ],
            "aerial-photography": [
                {"url": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80", "caption": "上帝视角"},
                {"url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", "caption": "海岸线"},
                {"url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80", "caption": "雪山"},
                {"url": "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80", "caption": "城市俯瞰"},
                {"url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80", "caption": "自然景观"},
                {"url": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80", "caption": "农田"}
            ],
            "still-life": [
                {"url": "https://images.unsplash.com/photo-14935146554098-8e7c9195e3c4?w=1200&q=80", "caption": "静物诗意"},
                {"url": "https://images.unsplash.com/photo-1513519245088-0e12902e35a6e?w=1200&q=80", "caption": "花卉静物"},
                {"url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", "caption": "水果静物"},
                {"url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80", "caption": "器皿"},
                {"url": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80", "caption": "物品"},
                {"url": "https://images.unsplash.com/photo-1509316785289-e0f5438a0719?w=1200&q=80", "caption": "生活用品"}
            ],
            "underwater-photography": [
                {"url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80", "caption": "海底世界"},
                {"url": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80", "caption": "珊瑚"},
                {"url": "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1200&q=80", "caption": "热带鱼"},
                {"url": "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=1200&q=80", "caption": "海龟"},
                {"url": "https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=1200&q=80", "caption": "潜水"},
                {"url": "https://images.unsplash.com/photo-1515187029135-18ee2869d34b?w=1200&q=80", "caption": "海洋生物"}
            ],
            "flower-photography": [
                {"url": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80", "caption": "花开四季"},
                {"url": "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1200&q=80", "caption": "玫瑰"},
                {"url": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80", "caption": "郁金香"},
                {"url": "https://images.unsplash.com/photo-1513519245088-0e12902e35a6e?w=1200&q=80", "caption": "向日葵"},
                {"url": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80", "caption": "百合"},
                {"url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80", "caption": "樱花"}
            ],
            "minimalist-photography": [
                {"url": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80", "caption": "极简美学"},
                {"url": "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80", "caption": "简约"},
                {"url": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1200&q=80", "caption": "线条"},
                {"url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80", "caption": "空间"},
                {"url": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80", "caption": "构图"},
                {"url": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80", "caption": "纯净"}
            ],
            "astrophotography": [
                {"url": "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80", "caption": "星空奇观"},
                {"url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", "caption": "银河"},
                {"url": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80", "caption": "星轨"},
                {"url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80", "caption": "流星"},
                {"url": "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80", "caption": "月夜"},
                {"url": "https://images.unsplash.com/photo-1509316785289-e0f5438a0719?w=1200&q=80", "caption": "星空"}
            ],
            "urban-stories": [
                {"url": "https://images.unsplash.com/photo-15172453868874-e6032e351fb7?w=1200&q=80", "caption": "城市故事"},
                {"url": "https://images.unsplash.com/photo-1449824913929-65aa7a693af2?w=1200&q=80", "caption": "人文纪实"},
                {"url": "https://images.unsplash.com/photo-1534067611371-baafff748a42?w=1200&q=80", "caption": "街头生活"},
                {"url": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80", "caption": "城市人文"},
                {"url": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80", "caption": "都市生活"},
                {"url": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80", "caption": "城市百态"}
            ],
            "forest-photography": [
                {"url": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80", "caption": "森林秘境"},
                {"url": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80", "caption": "深林"},
                {"url": "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80", "caption": "秋日森林"},
                {"url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80", "caption": "林间"},
                {"url": "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80", "caption": "森林深处"},
                {"url": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80", "caption": "绿意森林"}
            ],
            "desert-photography": [
                {"url": "https://images.unsplash.com/photo-15093167852894-016f1b6b66ad?w=1200&q=80", "caption": "沙漠之魂"},
                {"url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80", "caption": "沙漠日出"},
                {"url": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80", "caption": "沙丘"},
                {"url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", "caption": "荒漠"},
                {"url": "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80", "caption": "沙漠日落"},
                {"url": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80", "caption": "沙漠孤寂"}
            ]
        }
        
        total_images_created = 0
        total_portfolio_images = 0
        
        # 遍历每个相册并添加图片
        for slug, images in album_images_data.items():
            if slug not in portfolio_map:
                print(f"警告: 找不到相册 {slug}，跳过")
                continue
            
            portfolio = portfolio_map[slug]
            print(f"\n处理相册: {portfolio.title} ({slug})")
            
            for idx, img_data in enumerate(images):
                width, height = get_image_dimensions()
                
                # 创建Image记录
                image = Image(
                    id=uuid4(),
                    original_filename=f"{slug}_{idx+1}.jpg",
                    file_path=img_data["url"],
                    file_size=1500000,
                    mime_type="image/jpeg",
                    width=width,
                    height=height,
                    alt_text=img_data["caption"],
                    caption=img_data["caption"],
                    is_optimized=True
                )
                db.add(image)
                db.flush()
                
                # 创建PortfolioImage关联
                portfolio_image = PortfolioImage(
                    id=uuid4(),
                    portfolio_id=portfolio.id,
                    image_id=image.id,
                    sort_order=idx,
                    is_cover=(idx == 0)
                )
                db.add(portfolio_image)
                
                total_images_created += 1
                total_portfolio_images += 1
            
            print(f"  添加了 {len(images)} 张图片")
        
        db.commit()
        
        print(f"\n" + "="*50)
        print(f"成功完成!")
        print(f"总共创建了 {total_images_created} 张图片记录")
        print(f"总共创建了 {total_portfolio_images} 个相册-图片关联")
        print(f"="*50)
        
    except Exception as e:
        print(f"错误: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_album_images()
