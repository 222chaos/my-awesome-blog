"""
数据库UUID迁移脚本 - 安全版本
此脚本将数据库中所有表的ID列从INTEGER类型迁移到UUID类型
"""

import uuid
from sqlalchemy import create_engine, text, MetaData, Table
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.core.config import settings
import json

def migrate_to_uuid():
    # 创建数据库引擎
    engine = create_engine(settings.DATABASE_URL)
    
    # 需要迁移的表列表，按依赖关系排序
    tables_to_migrate = [
        'users', 
        'categories', 
        'tags', 
        'articles', 
        'comments', 
        'friend_links', 
        'images', 
        'portfolio', 
        'timeline_events', 
        'subscriptions', 
        'typewriter_contents',
        'article_categories', 
        'article_tags', 
        'request_logs'
    ]
    
    # 存储ID映射以便更新外键
    id_mappings = {}
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("开始数据库UUID迁移...")
            
            # 第一步：为每张表添加UUID列并生成UUID值
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
                    ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
                """))
                
                # 获取旧ID到新UUID的映射
                result = conn.execute(text(f"""
                    SELECT id FROM {table_name};
                """))
                
                rows = result.fetchall()
                id_mapping = {}
                for row in rows:
                    old_id = row[0]
                    # 生成新的UUID
                    new_uuid = str(uuid.uuid4())
                    id_mapping[old_id] = new_uuid
                    
                    # 更新UUID列
                    conn.execute(text(f"""
                        UPDATE {table_name} 
                        SET id_uuid = :new_uuid 
                        WHERE id = :old_id;
                    """), {"new_uuid": new_uuid, "old_id": old_id})
                
                id_mappings[table_name] = id_mapping
                print(f"表 {table_name} UUID生成完成")
            
            # 第二步：处理外键引用
            print("正在更新外键引用...")
            
            # 更新articles表的author_id
            if 'articles' in id_mappings and 'users' in id_mappings:
                for old_author_id, new_author_uuid in id_mappings['users'].items():
                    conn.execute(text("""
                        UPDATE articles 
                        SET author_id = :new_uuid 
                        WHERE author_id = :old_id;
                    """), {"new_uuid": new_author_uuid, "old_id": old_author_id})
            
            # 更新comments表的外键
            if 'comments' in id_mappings:
                # 更新author_id
                if 'users' in id_mappings:
                    for old_author_id, new_author_uuid in id_mappings['users'].items():
                        conn.execute(text("""
                            UPDATE comments 
                            SET author_id = :new_uuid 
                            WHERE author_id = :old_id;
                        """), {"new_uuid": new_author_uuid, "old_id": old_author_id})
                
                # 更新article_id
                if 'articles' in id_mappings:
                    for old_article_id, new_article_uuid in id_mappings['articles'].items():
                        conn.execute(text("""
                            UPDATE comments 
                            SET article_id = :new_uuid 
                            WHERE article_id = :old_id;
                        """), {"new_uuid": new_article_uuid, "old_id": old_article_id})
                
                # 更新parent_id
                for old_comment_id, new_comment_uuid in id_mappings['comments'].items():
                    conn.execute(text("""
                        UPDATE comments 
                        SET parent_id = :new_uuid 
                        WHERE parent_id = :old_id;
                    """), {"new_uuid": new_comment_uuid, "old_id": old_comment_id})
            
            # 更新article_categories表的外键
            if 'article_categories' in id_mappings:
                # 更新article_id
                if 'articles' in id_mappings:
                    for old_article_id, new_article_uuid in id_mappings['articles'].items():
                        conn.execute(text("""
                            UPDATE article_categories 
                            SET article_id = :new_uuid 
                            WHERE article_id = :old_id;
                        """), {"new_uuid": new_article_uuid, "old_id": old_article_id})
                
                # 更新category_id
                if 'categories' in id_mappings:
                    for old_category_id, new_category_uuid in id_mappings['categories'].items():
                        conn.execute(text("""
                            UPDATE article_categories 
                            SET category_id = :new_uuid 
                            WHERE category_id = :old_id;
                        """), {"new_uuid": new_category_uuid, "old_id": old_category_id})
            
            # 更新article_tags表的外键
            if 'article_tags' in id_mappings:
                # 更新article_id
                if 'articles' in id_mappings:
                    for old_article_id, new_article_uuid in id_mappings['articles'].items():
                        conn.execute(text("""
                            UPDATE article_tags 
                            SET article_id = :new_uuid 
                            WHERE article_id = :old_id;
                        """), {"new_uuid": new_article_uuid, "old_id": old_article_id})
                
                # 更新tag_id
                if 'tags' in id_mappings:
                    for old_tag_id, new_tag_uuid in id_mappings['tags'].items():
                        conn.execute(text("""
                            UPDATE article_tags 
                            SET tag_id = :new_uuid 
                            WHERE tag_id = :old_id;
                        """), {"new_uuid": new_tag_uuid, "old_id": old_tag_id})
            
            # 第三步：重命名列和更新约束
            for table_name in tables_to_migrate:
                if table_name not in id_mappings:
                    continue
                
                print(f"正在更新表 {table_name} 的列结构...")
                
                # 重命名原ID列为临时列
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    RENAME COLUMN id TO id_old;
                """))
                
                # 重命名UUID列
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    RENAME COLUMN id_uuid TO id;
                """))
                
                # 设置新ID列为主键
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    DROP CONSTRAINT IF EXISTS {table_name}_pkey;
                    
                    ALTER TABLE {table_name} 
                    ADD PRIMARY KEY (id);
                """))
                
                # 设置ID列默认值为新生成的UUID
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    ALTER COLUMN id SET DEFAULT gen_random_uuid();
                """))
            
            # 第四步：更新外键约束
            print("正在重建外键约束...")
            
            # 重建comments表的外键
            conn.execute(text("""
                ALTER TABLE comments 
                DROP CONSTRAINT IF EXISTS comments_article_id_fkey;
                
                ALTER TABLE comments 
                DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
                
                ALTER TABLE comments 
                DROP CONSTRAINT IF EXISTS comments_parent_id_fkey;
                
                ALTER TABLE comments 
                ADD CONSTRAINT comments_article_id_fkey 
                FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;
                
                ALTER TABLE comments 
                ADD CONSTRAINT comments_author_id_fkey 
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
                
                ALTER TABLE comments 
                ADD CONSTRAINT comments_parent_id_fkey 
                FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;
            """))
            
            # 重建article_categories表的外键
            conn.execute(text("""
                ALTER TABLE article_categories 
                DROP CONSTRAINT IF EXISTS article_categories_article_id_fkey;
                
                ALTER TABLE article_categories 
                DROP CONSTRAINT IF EXISTS article_categories_category_id_fkey;
                
                ALTER TABLE article_categories 
                ADD CONSTRAINT article_categories_article_id_fkey 
                FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;
                
                ALTER TABLE article_categories 
                ADD CONSTRAINT article_categories_category_id_fkey 
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
            """))
            
            # 重建article_tags表的外键
            conn.execute(text("""
                ALTER TABLE article_tags 
                DROP CONSTRAINT IF EXISTS article_tags_article_id_fkey;
                
                ALTER TABLE article_tags 
                DROP CONSTRAINT IF EXISTS article_tags_tag_id_fkey;
                
                ALTER TABLE article_tags 
                ADD CONSTRAINT article_tags_article_id_fkey 
                FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;
                
                ALTER TABLE article_tags 
                ADD CONSTRAINT article_tags_tag_id_fkey 
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;
            """))
            
            # 重建articles表的外键
            conn.execute(text("""
                ALTER TABLE articles 
                DROP CONSTRAINT IF EXISTS articles_author_id_fkey;
                
                ALTER TABLE articles 
                ADD CONSTRAINT articles_author_id_fkey 
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
            """))
            
            trans.commit()
            print("所有表的ID列已成功迁移到UUID类型！")
            print("迁移完成，数据库现在使用UUID作为主键。")
            
        except Exception as e:
            print(f"迁移过程中发生错误: {str(e)}")
            trans.rollback()
            raise

if __name__ == "__main__":
    migrate_to_uuid()