"""
数据库UUID迁移脚本 - 最终版本
此脚本将数据库中所有表的ID列从INTEGER类型迁移到UUID类型
"""

import uuid
from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_to_uuid():
    # 创建数据库引擎
    engine = create_engine(settings.DATABASE_URL)
    
    # 检查数据库中实际存在的表
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name != 'alembic_version';  -- 排除alembic版本表
        """))
        actual_tables = [row[0] for row in result.fetchall()]
    
    print(f"数据库中实际存在的表: {actual_tables}")
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("开始数据库UUID迁移...")
            
            # 第一步：删除所有外键约束
            print("正在删除所有外键约束...")
            
            # 删除所有可能的外键约束
            foreign_key_constraints = [
                # comments表的外键
                "comments_article_id_fkey", "comments_author_id_fkey", "comments_parent_id_fkey",
                # articles表的外键
                "articles_author_id_fkey", "articles_featured_image_id_fkey",
                # images表的外键
                "images_uploaded_by_fkey",  # 假设images表有引用users的外键
                # article_categories表的外键
                "article_categories_article_id_fkey", "article_categories_category_id_fkey",
                # article_tags表的外键
                "article_tags_article_id_fkey", "article_tags_tag_id_fkey",
                # 其他可能的外键
                "article_categories_article_id_fkey", "article_categories_category_id_fkey",
                "article_tags_article_id_fkey", "article_tags_tag_id_fkey",
            ]
            
            for constraint in foreign_key_constraints:
                try:
                    conn.execute(text(f"""
                        ALTER TABLE information_schema.table_constraints 
                        DROP CONSTRAINT IF EXISTS {constraint};
                    """))
                except:
                    # 如果约束不存在，忽略错误
                    try:
                        conn.execute(text(f"""
                            ALTER TABLE ONLY (
                                SELECT table_name FROM information_schema.constraint_column_usage 
                                WHERE constraint_name = '{constraint}' LIMIT 1
                            ) DROP CONSTRAINT IF EXISTS {constraint};
                        """))
                    except:
                        # 尝试另一种方式
                        tables_with_constraints = ['comments', 'articles', 'images', 'article_categories', 'article_tags']
                        for table in tables_with_constraints:
                            try:
                                conn.execute(text(f"""
                                    ALTER TABLE {table} DROP CONSTRAINT IF EXISTS {constraint};
                                """))
                            except:
                                pass
            
            # 更通用的删除外键约束方法
            result = conn.execute(text("""
                SELECT 
                    tc.table_name, 
                    tc.constraint_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_schema = 'public';
            """))
            
            for row in result.fetchall():
                table_name, constraint_name = row
                print(f"删除外键约束: {table_name}.{constraint_name}")
                try:
                    conn.execute(text(f"""
                        ALTER TABLE {table_name} DROP CONSTRAINT {constraint_name};
                    """))
                except:
                    pass  # 忽略错误
            
            # 第二步：为每张表添加UUID列并生成UUID值
            tables_to_process = ['users', 'articles', 'comments', 'categories', 'tags', 
                               'friend_links', 'images', 'portfolio', 'timeline_events', 
                               'subscriptions', 'request_logs', 'article_tags']
            
            id_mappings = {}
            for table_name in tables_to_process:
                if table_name not in actual_tables:
                    continue
                    
                print(f"正在处理表 {table_name}...")
                
                # 检查表中是否有id列
                result = conn.execute(text("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_schema = 'public' 
                        AND table_name = :table_name
                        AND column_name = 'id'
                    );
                """), {"table_name": table_name})
                
                if not result.scalar():
                    print(f"表 {table_name} 没有id列，跳过...")
                    continue
                
                # 添加新的UUID列
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    ADD COLUMN id_uuid UUID;
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
            
            # 第三步：更新外键列的值
            print("正在更新外键列的值...")
            
            # 更新articles表的author_id
            if 'articles' in id_mappings and 'users' in id_mappings:
                for old_id, new_uuid in id_mappings['users'].items():
                    conn.execute(text("""
                        UPDATE articles 
                        SET author_id = :new_uuid 
                        WHERE author_id = :old_id;
                    """), {"new_uuid": new_uuid, "old_id": old_id})
            
            # 更新comments表的外键
            if 'comments' in id_mappings:
                # 更新author_id
                if 'users' in id_mappings:
                    for old_id, new_uuid in id_mappings['users'].items():
                        conn.execute(text("""
                            UPDATE comments 
                            SET author_id = :new_uuid 
                            WHERE author_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
                
                # 更新article_id
                if 'articles' in id_mappings:
                    for old_id, new_uuid in id_mappings['articles'].items():
                        conn.execute(text("""
                            UPDATE comments 
                            SET article_id = :new_uuid 
                            WHERE article_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
                
                # 更新parent_id
                if 'comments' in id_mappings:
                    for old_id, new_uuid in id_mappings['comments'].items():
                        conn.execute(text("""
                            UPDATE comments 
                            SET parent_id = :new_uuid 
                            WHERE parent_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
            
            # 更新article_tags表的外键
            if 'article_tags' in id_mappings:
                # 更新article_id
                if 'articles' in id_mappings:
                    for old_id, new_uuid in id_mappings['articles'].items():
                        conn.execute(text("""
                            UPDATE article_tags 
                            SET article_id = :new_uuid 
                            WHERE article_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
                
                # 更新tag_id
                if 'tags' in id_mappings:
                    for old_id, new_uuid in id_mappings['tags'].items():
                        conn.execute(text("""
                            UPDATE article_tags 
                            SET tag_id = :new_uuid 
                            WHERE tag_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
            
            # 第四步：重命名ID列
            print("正在重命名ID列...")
            
            for table_name in tables_to_process:
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
                    ADD PRIMARY KEY (id);
                """))
                
                # 设置ID列默认值为新生成的UUID
                conn.execute(text(f"""
                    ALTER TABLE {table_name} 
                    ALTER COLUMN id SET DEFAULT gen_random_uuid();
                """))
            
            trans.commit()
            print("数据库UUID迁移完成！")
            print("注意：外键约束需要手动重建，因为它们依赖于特定的表结构。")
            
        except Exception as e:
            print(f"迁移过程中发生错误: {str(e)}")
            trans.rollback()
            raise

if __name__ == "__main__":
    migrate_to_uuid()