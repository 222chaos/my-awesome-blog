"""
数据库UUID迁移脚本
此脚本将数据库中所有表的ID列从INTEGER类型迁移到UUID类型
"""

import uuid
from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.core.config import settings

def migrate_to_uuid():
    # 创建数据库引擎
    engine = create_engine(settings.DATABASE_URL)
    
    # 需要迁移的表列表
    tables_to_migrate = [
        'users', 'articles', 'comments', 'categories', 'tags', 
        'article_categories', 'article_tags', 'friend_links', 
        'images', 'portfolio', 'timeline_events', 'subscriptions', 
        'typewriter_contents', 'request_logs'
    ]
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # 为每个表添加新的UUID列
            for table_name in tables_to_migrate:
                print(f"正在处理表 {table_name}...")
                
                # 检查表是否存在
                result = conn.execute(text("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_name = :table_name
                    );
                """), {"table_name": table_name})
                
                if not result.scalar():
                    print(f"表 {table_name} 不存在，跳过...")
                    continue
                
                # 添加新的UUID列
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    ADD COLUMN id_new UUID;
                """))
                
                # 为新列生成UUID值（基于旧的整数ID）
                result = conn.execute(text(f"""
                    SELECT id FROM {table_name};
                """))
                
                rows = result.fetchall()
                for row in rows:
                    old_id = row[0]
                    new_uuid = str(uuid.uuid4())
                    
                    # 更新新列的值
                    conn.execute(text(f"""
                        UPDATE {table_name} 
                        SET id_new = :new_uuid 
                        WHERE id = :old_id;
                    """), {"new_uuid": new_uuid, "old_id": old_id})
                
                # 删除原来的ID列
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    DROP COLUMN id CASCADE;
                """))
                
                # 重命名新列
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    RENAME COLUMN id_new TO id;
                """))
                
                # 设置为主键
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    ADD PRIMARY KEY (id);
                """))
                
                # 为需要的表更新外键引用
                if table_name == 'articles':
                    # 更新外键引用
                    conn.execute(text("""
                        ALTER TABLE article_categories 
                        DROP CONSTRAINT IF EXISTS article_categories_article_id_fkey;
                        
                        ALTER TABLE article_tags 
                        DROP CONSTRAINT IF EXISTS article_tags_article_id_fkey;
                        
                        ALTER TABLE comments 
                        DROP CONSTRAINT IF EXISTS comments_article_id_fkey;
                    """))
                    
                    # 重新创建外键
                    conn.execute(text("""
                        ALTER TABLE article_categories 
                        ADD CONSTRAINT article_categories_article_id_fkey 
                        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;
                        
                        ALTER TABLE article_tags 
                        ADD CONSTRAINT article_tags_article_id_fkey 
                        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;
                        
                        ALTER TABLE comments 
                        ADD CONSTRAINT comments_article_id_fkey 
                        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;
                    """))
                
                elif table_name == 'users':
                    # 更新外键引用
                    conn.execute(text("""
                        ALTER TABLE articles 
                        DROP CONSTRAINT IF EXISTS articles_author_id_fkey;
                        
                        ALTER TABLE comments 
                        DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
                    """))
                    
                    # 重新创建外键
                    conn.execute(text("""
                        ALTER TABLE articles 
                        ADD CONSTRAINT articles_author_id_fkey 
                        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
                        
                        ALTER TABLE comments 
                        ADD CONSTRAINT comments_author_id_fkey 
                        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
                    """))
                
                print(f"表 {table_name} 迁移完成")
            
            trans.commit()
            print("所有表的ID列已成功迁移到UUID类型！")
            
        except Exception as e:
            print(f"迁移过程中发生错误: {str(e)}")
            trans.rollback()
            raise

if __name__ == "__main__":
    migrate_to_uuid()