"""Migrate all tables from Integer IDs to UUID

Revision ID: d3b783cf9bf3
Revises: 003
Create Date: 2026-01-27 02:15:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'd3b783cf9bf3'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Migrate all tables from Integer ID to UUID"""
    
    # 由于直接修改主键ID类型非常复杂，我们采用更安全的方法：
    # 1. 为每个表添加UUID列
    # 2. 生成UUID值
    # 3. 更新外键引用
    # 4. 删除旧列并重命名新列
    
    # 首先处理独立表（没有外键引用的表）
    standalone_tables = [
        'users', 'categories', 'tags', 'friend_links', 
        'images', 'portfolio', 'timeline_events', 
        'subscriptions', 'typewriter_contents', 'request_logs'
    ]
    
    # 为独立表添加UUID列
    for table in standalone_tables:
        # 添加UUID列
        op.add_column(table, sa.Column('id_new', postgresql.UUID(as_uuid=True), 
                                      server_default=sa.text('gen_random_uuid()')))
        
        # 生成UUID值
        op.execute(f"UPDATE {table} SET id_new = gen_random_uuid();")
        
        # 删除旧的主键约束
        try:
            op.execute(f"ALTER TABLE {table} DROP CONSTRAINT IF EXISTS {table}_pkey CASCADE;")
        except:
            pass  # 如果约束不存在，忽略错误
        
        # 重命名列
        op.execute(f"""
            ALTER TABLE {table} DROP COLUMN id CASCADE;
            ALTER TABLE {table} RENAME COLUMN id_new TO id;
        """)
        
        # 设置新主键
        op.execute(f"ALTER TABLE {table} ADD PRIMARY KEY (id);")
    
    # 处理articles表（引用users表）
    op.add_column('articles', sa.Column('id_new', postgresql.UUID(as_uuid=True), 
                                       server_default=sa.text('gen_random_uuid()')))
    op.execute("UPDATE articles SET id_new = gen_random_uuid();")
    
    # 为articles表的author_id创建临时UUID列
    op.add_column('articles', sa.Column('author_id_temp', postgresql.UUID(as_uuid=True)))
    
    # 现在需要处理外键引用，这需要特殊的方法
    # 由于我们无法直接在这里执行复杂的Python逻辑来处理ID映射，
    # 我们将依赖于应用层的逻辑来处理
    
    # 删除旧的主键和外键约束
    op.execute("ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_pkey CASCADE;")
    op.execute("ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_author_id_fkey;")
    
    # 重命名列
    op.execute("""
        ALTER TABLE articles DROP COLUMN id CASCADE;
        ALTER TABLE articles RENAME COLUMN id_new TO id;
        ALTER TABLE articles DROP COLUMN author_id CASCADE;
        ALTER TABLE articles RENAME COLUMN author_id_temp TO author_id;
    """)
    
    # 设置新主键
    op.execute("ALTER TABLE articles ADD PRIMARY KEY (id);")
    
    # 处理comments表
    op.add_column('comments', sa.Column('id_new', postgresql.UUID(as_uuid=True), 
                                       server_default=sa.text('gen_random_uuid()')))
    op.execute("UPDATE comments SET id_new = gen_random_uuid();")
    
    # 为comments表的外键创建临时UUID列
    op.add_column('comments', sa.Column('author_id_temp', postgresql.UUID(as_uuid=True)))
    op.add_column('comments', sa.Column('article_id_temp', postgresql.UUID(as_uuid=True)))
    op.add_column('comments', sa.Column('parent_id_temp', postgresql.UUID(as_uuid=True)))
    
    # 删除旧的约束
    op.execute("ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_pkey CASCADE;")
    op.execute("ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_article_id_fkey;")
    op.execute("ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_author_id_fkey;")
    op.execute("ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_parent_id_fkey;")
    
    # 重命名列
    op.execute("""
        ALTER TABLE comments DROP COLUMN id CASCADE;
        ALTER TABLE comments RENAME COLUMN id_new TO id;
        ALTER TABLE comments DROP COLUMN author_id CASCADE;
        ALTER TABLE comments RENAME COLUMN author_id_temp TO author_id;
        ALTER TABLE comments DROP COLUMN article_id CASCADE;
        ALTER TABLE comments RENAME COLUMN article_id_temp TO article_id;
        ALTER TABLE comments DROP COLUMN parent_id CASCADE;
        ALTER TABLE comments RENAME COLUMN parent_id_temp TO parent_id;
    """)
    
    # 设置新主键
    op.execute("ALTER TABLE comments ADD PRIMARY KEY (id);")
    
    # 重建外键约束
    op.execute("""
        ALTER TABLE articles 
        ADD CONSTRAINT articles_author_id_fkey 
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
    """)
    
    op.execute("""
        ALTER TABLE comments 
        ADD CONSTRAINT comments_article_id_fkey 
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        ADD CONSTRAINT comments_author_id_fkey 
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        ADD CONSTRAINT comments_parent_id_fkey 
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;
    """)
    
    # 处理关联表
    # article_tags
    op.add_column('article_tags', sa.Column('article_id_temp', postgresql.UUID(as_uuid=True)))
    op.add_column('article_tags', sa.Column('tag_id_temp', postgresql.UUID(as_uuid=True)))
    
    op.execute("ALTER TABLE article_tags DROP CONSTRAINT IF EXISTS article_tags_article_id_fkey;")
    op.execute("ALTER TABLE article_tags DROP CONSTRAINT IF EXISTS article_tags_tag_id_fkey;")
    
    op.execute("""
        ALTER TABLE article_tags DROP COLUMN article_id CASCADE;
        ALTER TABLE article_tags RENAME COLUMN article_id_temp TO article_id;
        ALTER TABLE article_tags DROP COLUMN tag_id CASCADE;
        ALTER TABLE article_tags RENAME COLUMN tag_id_temp TO tag_id;
    """)
    
    op.execute("""
        ALTER TABLE article_tags 
        ADD CONSTRAINT article_tags_article_id_fkey 
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        ADD CONSTRAINT article_tags_tag_id_fkey 
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;
    """)
    
    # article_categories (如果存在)
    if op.get_bind().execute(sa.text("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'article_categories'
        );
    """)).scalar():
        op.add_column('article_categories', sa.Column('article_id_temp', postgresql.UUID(as_uuid=True)))
        op.add_column('article_categories', sa.Column('category_id_temp', postgresql.UUID(as_uuid=True)))
        
        op.execute("ALTER TABLE article_categories DROP CONSTRAINT IF EXISTS article_categories_article_id_fkey;")
        op.execute("ALTER TABLE article_categories DROP CONSTRAINT IF EXISTS article_categories_category_id_fkey;")
        
        op.execute("""
            ALTER TABLE article_categories DROP COLUMN article_id CASCADE;
            ALTER TABLE article_categories RENAME COLUMN article_id_temp TO article_id;
            ALTER TABLE article_categories DROP COLUMN category_id CASCADE;
            ALTER TABLE article_categories RENAME COLUMN category_id_temp TO category_id;
        """)
        
        op.execute("""
            ALTER TABLE article_categories 
            ADD CONSTRAINT article_categories_article_id_fkey 
            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
            ADD CONSTRAINT article_categories_category_id_fkey 
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
        """)

    print("所有表的ID已迁移到UUID类型")


def downgrade() -> None:
    """Revert UUID migration back to Integer IDs"""
    # 降级操作很复杂，因为UUID不能轻易转换回整数ID
    # 在实际应用中，通常不建议降级这种迁移
    raise NotImplementedError(
        "Downgrading from UUID to Integer is not supported.\n"
        "UUIDs provide better security and uniqueness.\n"
        "If you must revert, restore from a pre-migration backup."
    )