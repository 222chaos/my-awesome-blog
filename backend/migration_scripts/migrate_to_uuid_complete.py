"""
数据库UUID迁移脚本 - 完整版本
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
    
    # 定义表的依赖关系，确保先迁移被引用的表
    table_dependencies = {
        'users': [],  # 被其他表引用
        'articles': ['users'],  # 引用users
        'categories': [],  # 独立表
        'tags': [],  # 独立表
        'comments': ['users', 'articles'],  # 引用users和articles
        'friend_links': [],  # 独立表
        'images': [],  # 独立表
        'portfolio': [],  # 独立表
        'timeline_events': [],  # 独立表
        'subscriptions': [],  # 独立表
        'request_logs': [],  # 独立表
        'article_tags': ['articles', 'tags'],  # 引用articles和tags
        'article_categories': ['articles', 'categories']  # 引用articles和categories
    }
    
    # 只实存在的表
    existing_tables = [table for table in table_dependencies.keys() if table in actual_tables]
    
    # 按依赖关系排序
    ordered_tables = []
    processed = set()
    
    # 首先添加没有依赖的表
    for table in existing_tables:
        if not table_dependencies[table] and table not in processed:
            ordered_tables.append(table)
            processed.add(table)
    
    # 然后添加有依赖的表
    for table in existing_tables:
        if table not in processed:
            ordered_tables.append(table)
            processed.add(table)
    
    print(f"将要处理的表（按顺序）: {ordered_tables}")
    
    # 存储ID映射以便更新外键
    id_mappings = {}
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("开始数据库UUID迁移...")
            
            # 第一步：为每张表添加UUID列并生成UUID值
            for table_name in ordered_tables:
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
            
            # 第二步：更新外键列的数据类型为UUID
            print("正在更新外键列的数据类型...")
            
            # 更新articles表的author_id列
            if 'articles' in actual_tables:
                conn.execute(text("""
                    ALTER TABLE articles 
                    ADD COLUMN author_id_uuid UUID;
                """))
                
                # 获取映射并更新author_id_uuid列
                if 'users' in id_mappings:
                    for old_id, new_uuid in id_mappings['users'].items():
                        conn.execute(text("""
                            UPDATE articles 
                            SET author_id_uuid = :new_uuid 
                            WHERE author_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
            
            # 更新comments表的外键列
            if 'comments' in actual_tables:
                # 更新author_id
                conn.execute(text("""
                    ALTER TABLE comments 
                    ADD COLUMN author_id_uuid UUID;
                """))
                
                if 'users' in id_mappings:
                    for old_id, new_uuid in id_mappings['users'].items():
                        conn.execute(text("""
                            UPDATE comments 
                            SET author_id_uuid = :new_uuid 
                            WHERE author_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
                
                # 更新article_id
                conn.execute(text("""
                    ALTER TABLE comments 
                    ADD COLUMN article_id_uuid UUID;
                """))
                
                if 'articles' in id_mappings:
                    for old_id, new_uuid in id_mappings['articles'].items():
                        conn.execute(text("""
                            UPDATE comments 
                            SET article_id_uuid = :new_uuid 
                            WHERE article_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
                
                # 更新parent_id
                conn.execute(text("""
                    ALTER TABLE comments 
                    ADD COLUMN parent_id_uuid UUID;
                """))
                
                if 'comments' in id_mappings:
                    for old_id, new_uuid in id_mappings['comments'].items():
                        conn.execute(text("""
                            UPDATE comments 
                            SET parent_id_uuid = :new_uuid 
                            WHERE parent_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
            
            # 更新article_categories表的外键列（如果存在）
            if 'article_categories' in actual_tables:
                # 更新article_id
                conn.execute(text("""
                    ALTER TABLE article_categories 
                    ADD COLUMN article_id_uuid UUID;
                """))
                
                if 'articles' in id_mappings:
                    for old_id, new_uuid in id_mappings['articles'].items():
                        conn.execute(text("""
                            UPDATE article_categories 
                            SET article_id_uuid = :new_uuid 
                            WHERE article_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
                
                # 更新category_id
                conn.execute(text("""
                    ALTER TABLE article_categories 
                    ADD COLUMN category_id_uuid UUID;
                """))
                
                if 'categories' in id_mappings:
                    for old_id, new_uuid in id_mappings['categories'].items():
                        conn.execute(text("""
                            UPDATE article_categories 
                            SET category_id_uuid = :new_uuid 
                            WHERE category_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
            
            # 更新article_tags表的外键列
            if 'article_tags' in actual_tables:
                # 更新article_id
                conn.execute(text("""
                    ALTER TABLE article_tags 
                    ADD COLUMN article_id_uuid UUID;
                """))
                
                if 'articles' in id_mappings:
                    for old_id, new_uuid in id_mappings['articles'].items():
                        conn.execute(text("""
                            UPDATE article_tags 
                            SET article_id_uuid = :new_uuid 
                            WHERE article_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
                
                # 更新tag_id
                conn.execute(text("""
                    ALTER TABLE article_tags 
                    ADD COLUMN tag_id_uuid UUID;
                """))
                
                if 'tags' in id_mappings:
                    for old_id, new_uuid in id_mappings['tags'].items():
                        conn.execute(text("""
                            UPDATE article_tags 
                            SET tag_id_uuid = :new_uuid 
                            WHERE tag_id = :old_id;
                        """), {"new_uuid": new_uuid, "old_id": old_id})
            
            # 第三步：删除旧的外键约束
            print("正在删除旧的外键约束...")
            
            # 删除comments表的外键
            conn.execute(text("""
                ALTER TABLE comments 
                DROP CONSTRAINT IF EXISTS comments_article_id_fkey;
                
                ALTER TABLE comments 
                DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
                
                ALTER TABLE comments 
                DROP CONSTRAINT IF EXISTS comments_parent_id_fkey;
            """))
            
            # 删除article_categories表的外键（如果存在）
            if 'article_categories' in actual_tables:
                conn.execute(text("""
                    ALTER TABLE article_categories 
                    DROP CONSTRAINT IF EXISTS article_categories_article_id_fkey;
                    
                    ALTER TABLE article_categories 
                    DROP CONSTRAINT IF EXISTS article_categories_category_id_fkey;
                """))
            
            # 删除article_tags表的外键
            conn.execute(text("""
                ALTER TABLE article_tags 
                DROP CONSTRAINT IF EXISTS article_tags_article_id_fkey;
                
                ALTER TABLE article_tags 
                DROP CONSTRAINT IF EXISTS article_tags_tag_id_fkey;
            """))
            
            # 删除articles表的外键
            conn.execute(text("""
                ALTER TABLE articles 
                DROP CONSTRAINT IF EXISTS articles_author_id_fkey;
            """))
            
            # 第四步：重命名列和更新约束
            for table_name in ordered_tables:
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
            
            # 第五步：更新外键列名
            print("正在更新外键列名...")
            
            # 更新articles表的author_id
            if 'articles' in actual_tables:
                conn.execute(text("""
                    ALTER TABLE articles 
                    DROP COLUMN author_id CASCADE;
                    
                    ALTER TABLE articles 
                    RENAME COLUMN author_id_uuid TO author_id;
                """))
            
            # 更新comments表的外键
            if 'comments' in actual_tables:
                conn.execute(text("""
                    ALTER TABLE comments 
                    DROP COLUMN author_id CASCADE;
                    
                    ALTER TABLE comments 
                    RENAME COLUMN author_id_uuid TO author_id;
                    
                    ALTER TABLE comments 
                    DROP COLUMN article_id CASCADE;
                    
                    ALTER TABLE comments 
                    RENAME COLUMN article_id_uuid TO article_id;
                    
                    ALTER TABLE comments 
                    DROP COLUMN parent_id CASCADE;
                    
                    ALTER TABLE comments 
                    RENAME COLUMN parent_id_uuid TO parent_id;
                """))
            
            # 更新article_categories表的外键（如果存在）
            if 'article_categories' in actual_tables:
                conn.execute(text("""
                    ALTER TABLE article_categories 
                    DROP COLUMN article_id CASCADE;
                    
                    ALTER TABLE article_categories 
                    RENAME COLUMN article_id_uuid TO article_id;
                    
                    ALTER TABLE article_categories 
                    DROP COLUMN category_id CASCADE;
                    
                    ALTER TABLE article_categories 
                    RENAME COLUMN category_id_uuid TO category_id;
                """))
            
            # 更新article_tags表的外键
            if 'article_tags' in actual_tables:
                conn.execute(text("""
                    ALTER TABLE article_tags 
                    DROP COLUMN article_id CASCADE;
                    
                    ALTER TABLE article_tags 
                    RENAME COLUMN article_id_uuid TO article_id;
                    
                    ALTER TABLE article_tags 
                    DROP COLUMN tag_id CASCADE;
                    
                    ALTER TABLE article_tags 
                    RENAME COLUMN tag_id_uuid TO tag_id;
                """))
            
            # 第六步：重建外键约束
            print("正在重建外键约束...")
            
            # 重建comments表的外键
            conn.execute(text("""
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
            
            # 重建article_categories表的外键（如果表存在）
            if 'article_categories' in actual_tables:
                conn.execute(text("""
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
                ADD CONSTRAINT article_tags_article_id_fkey 
                FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;
                
                ALTER TABLE article_tags 
                ADD CONSTRAINT article_tags_tag_id_fkey 
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;
            """))
            
            # 重建articles表的外键
            conn.execute(text("""
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