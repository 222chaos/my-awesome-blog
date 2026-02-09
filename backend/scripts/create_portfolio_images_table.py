import sys
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
sys.path.insert(0, backend_dir)

from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

def create_portfolio_images_table():
    with engine.connect() as conn:
        try:
            # 检查表是否已存在
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'portfolio_images'
                )
            """))
            table_exists = result.fetchone()[0]
            
            if table_exists:
                print("portfolio_images 表已存在，跳过创建")
                return
            
            # 创建 portfolio_images 表
            conn.execute(text("""
                CREATE TABLE portfolio_images (
                    id UUID PRIMARY KEY,
                    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
                    image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
                    sort_order INTEGER DEFAULT 0,
                    is_cover BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                    UNIQUE(portfolio_id, image_id)
                )
            """))
            
            # 创建索引
            conn.execute(text("CREATE INDEX ix_portfolio_images_id ON portfolio_images(id)"))
            conn.execute(text("CREATE INDEX ix_portfolio_images_portfolio_id ON portfolio_images(portfolio_id)"))
            conn.execute(text("CREATE INDEX ix_portfolio_images_image_id ON portfolio_images(image_id)"))
            
            # 提交事务
            conn.commit()
            
            print("成功创建 portfolio_images 表及其索引")
            
        except Exception as e:
            print(f"创建表时出错: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    create_portfolio_images_table()
