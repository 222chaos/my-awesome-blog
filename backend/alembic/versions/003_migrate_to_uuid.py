"""Migrate all tables from Integer IDs to UUID

Revision ID: 003
Revises: 002
Create Date: 2026-01-27 09:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from typing import Union, Sequence

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


# List of all tables with their ID columns
TABLES_WITH_ID = [
    'users', 'articles', 'categories', 'tags', 'comments',
    'friend_links', 'images', 'image_variants', 'portfolios',
    'timeline_events', 'subscriptions', 'typewriter_contents', 'request_logs'
]

# Tables with foreign keys that need to be updated
FOREIGN_KEY_MAPPINGS = {
    'articles': ['author_id', 'featured_image_id'],
    'comments': ['article_id', 'author_id', 'parent_id'],
    'images': [],  # referenced by article
    'image_variants': ['image_id'],
    'request_logs': ['user_id'],
}

# Association tables
ASSOCIATION_TABLES = ['article_categories', 'article_tags']

def upgrade() -> None:
    """Migrate all tables from Integer ID to UUID"""

    # Step 1: Add UUID columns to all tables
    for table in TABLES_WITH_ID:
        op.add_column(table, sa.Column('id_uuid', postgresql.UUID(as_uuid=True), nullable=True))
        op.execute(f"UPDATE {table} SET id_uuid = gen_random_uuid()")
        op.alter_column(table, 'id_uuid', nullable=False)

    # Step 2: Handle foreign keys by adding new UUID FK columns
    for table, fk_columns in FOREIGN_KEY_MAPPINGS.items():
        for fk_col in fk_columns:
            op.add_column(table, sa.Column(f'{fk_col}_uuid', postgresql.UUID(as_uuid=True), nullable=True))

    # Step 3: Update association tables
    for table in ASSOCIATION_TABLES:
        if table == 'article_categories':
            op.add_column('article_categories', sa.Column('article_id_uuid', postgresql.UUID(as_uuid=True), nullable=True))
            op.add_column('article_categories', sa.Column('category_id_uuid', postgresql.UUID(as_uuid=True), nullable=True))
            op.execute("""
                UPDATE article_categories ac
                SET article_id_uuid = a.id_uuid,
                    category_id_uuid = c.id_uuid
                FROM articles a, categories c
                WHERE ac.article_id = a.id AND ac.category_id = c.id
            """)
            op.alter_column('article_categories', 'article_id_uuid', nullable=False)
            op.alter_column('article_categories', 'category_id_uuid', nullable=False)

        elif table == 'article_tags':
            op.add_column('article_tags', sa.Column('article_id_uuid', postgresql.UUID(as_uuid=True), nullable=True))
            op.add_column('article_tags', sa.Column('tag_id_uuid', postgresql.UUID(as_uuid=True), nullable=True))
            op.execute("""
                UPDATE article_tags at
                SET article_id_uuid = a.id_uuid,
                    tag_id_uuid = t.id_uuid
                FROM articles a, tags t
                WHERE at.article_id = a.id AND at.tag_id = t.id
            """)
            op.alter_column('article_tags', 'article_id_uuid', nullable=False)
            op.alter_column('article_tags', 'tag_id_uuid', nullable=False)

    # Step 4: Update foreign key data in main tables
    # articles: author_id -> users.id, featured_image_id -> images.id
    op.execute("""
        UPDATE articles a
        SET author_id_uuid = u.id_uuid,
            featured_image_id_uuid = i.id_uuid
        FROM users u
        LEFT JOIN images i ON a.featured_image_id = i.id
        WHERE a.author_id = u.id
    """)

    # comments: article_id -> articles.id, author_id -> users.id, parent_id -> comments.id
    op.execute("""
        UPDATE comments c
        SET article_id_uuid = a.id_uuid,
            author_id_uuid = u.id_uuid,
            parent_id_uuid = p.id_uuid
        FROM articles a, users u
        LEFT JOIN comments p ON c.parent_id = p.id
        WHERE c.article_id = a.id AND c.author_id = u.id
    """)

    # image_variants: image_id -> images.id
    op.execute("""
        UPDATE image_variants iv
        SET image_id_uuid = i.id_uuid
        FROM images i
        WHERE iv.image_id = i.id
    """)

    # request_logs: user_id -> users.id
    op.execute("""
        UPDATE request_logs rl
        SET user_id_uuid = u.id_uuid
        FROM users u
        WHERE rl.user_id = u.id
    """)

    # Step 5: Drop and recreate primary keys and foreign keys
    # Drop old primary keys
    for table in TABLES_WITH_ID:
        op.execute(f"ALTER TABLE {table} DROP CONSTRAINT {table}_pkey")

    # Drop old foreign keys
    op.execute("ALTER TABLE articles DROP CONSTRAINT articles_author_id_fkey")
    op.execute("ALTER TABLE articles DROP CONSTRAINT articles_featured_image_id_fkey")
    op.execute("ALTER TABLE comments DROP CONSTRAINT comments_article_id_fkey")
    op.execute("ALTER TABLE comments DROP CONSTRAINT comments_author_id_fkey")
    op.execute("ALTER TABLE comments DROP CONSTRAINT comments_parent_id_fkey")
    op.execute("ALTER TABLE image_variants DROP CONSTRAINT image_variants_image_id_fkey")
    op.execute("ALTER TABLE request_logs DROP CONSTRAINT request_logs_user_id_fkey")

    # Drop association table constraints
    op.execute("ALTER TABLE article_categories DROP CONSTRAINT article_categories_article_id_fkey")
    op.execute("ALTER TABLE article_categories DROP CONSTRAINT article_categories_category_id_fkey")
    op.execute("ALTER TABLE article_categories DROP CONSTRAINT article_categories_pkey")
    op.execute("ALTER TABLE article_tags DROP CONSTRAINT article_tags_article_id_fkey")
    op.execute("ALTER TABLE article_tags DROP CONSTRAINT article_tags_tag_id_fkey")
    op.execute("ALTER TABLE article_tags DROP CONSTRAINT article_tags_pkey")

    # Step 6: Rename UUID columns to original names
    for table in TABLES_WITH_ID:
        op.execute(f"ALTER TABLE {table} RENAME COLUMN id TO id_old")
        op.execute(f"ALTER TABLE {table} RENAME COLUMN id_uuid TO id")

    for table, fk_columns in FOREIGN_KEY_MAPPINGS.items():
        for fk_col in fk_columns:
            if fk_col:  # Skip empty entries
                op.execute(f"ALTER TABLE {table} RENAME COLUMN {fk_col} TO {fk_col}_old")
                op.execute(f"ALTER TABLE {table} RENAME COLUMN {fk_col}_uuid TO {fk_col}")

    # Rename association table columns
    op.execute("ALTER TABLE article_categories RENAME COLUMN article_id TO article_id_old")
    op.execute("ALTER TABLE article_categories RENAME COLUMN article_id_uuid TO article_id")
    op.execute("ALTER TABLE article_categories RENAME COLUMN category_id TO category_id_old")
    op.execute("ALTER TABLE article_categories RENAME COLUMN category_id_uuid TO category_id")

    op.execute("ALTER TABLE article_tags RENAME COLUMN article_id TO article_id_old")
    op.execute("ALTER TABLE article_tags RENAME COLUMN article_id_uuid TO article_id")
    op.execute("ALTER TABLE article_tags RENAME COLUMN tag_id TO tag_id_old")
    op.execute("ALTER TABLE article_tags RENAME COLUMN tag_id_uuid TO tag_id")

    # Step 7: Recreate primary keys with UUID
    for table in TABLES_WITH_ID:
        op.execute(f"ALTER TABLE {table} ADD PRIMARY KEY (id)")

    # Recreate association table primary keys
    op.execute("ALTER TABLE article_categories ADD PRIMARY KEY (article_id, category_id)")
    op.execute("ALTER TABLE article_tags ADD PRIMARY KEY (article_id, tag_id)")

    # Step 8: Recreate foreign keys with UUID
    op.execute("ALTER TABLE articles ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE")
    op.execute("ALTER TABLE articles ADD CONSTRAINT articles_featured_image_id_fkey FOREIGN KEY (featured_image_id) REFERENCES images(id)")
    op.execute("ALTER TABLE comments ADD CONSTRAINT comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE")
    op.execute("ALTER TABLE comments ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE")
    op.execute("ALTER TABLE comments ADD CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE")
    op.execute("ALTER TABLE image_variants ADD CONSTRAINT image_variants_image_id_fkey FOREIGN KEY (image_id) REFERENCES images(id)")
    op.execute("ALTER TABLE request_logs ADD CONSTRAINT request_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)")
    op.execute("ALTER TABLE article_categories ADD CONSTRAINT article_categories_article_id_fkey FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE")
    op.execute("ALTER TABLE article_categories ADD CONSTRAINT article_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE")
    op.execute("ALTER TABLE article_tags ADD CONSTRAINT article_tags_article_id_fkey FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE")
    op.execute("ALTER TABLE article_tags ADD CONSTRAINT article_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE")

    # Step 9: Drop old integer columns
    for table in TABLES_WITH_ID:
        op.execute(f"ALTER TABLE {table} DROP COLUMN id_old")

    for table, fk_columns in FOREIGN_KEY_MAPPINGS.items():
        for fk_col in fk_columns:
            if fk_col:
                op.execute(f"ALTER TABLE {table} DROP COLUMN {fk_col}_old")

    # Drop old association table columns
    op.execute("ALTER TABLE article_categories DROP COLUMN article_id_old")
    op.execute("ALTER TABLE article_categories DROP COLUMN category_id_old")
    op.execute("ALTER TABLE article_tags DROP COLUMN article_id_old")
    op.execute("ALTER TABLE article_tags DROP COLUMN tag_id_old")


def downgrade() -> None:
    """Revert UUID migration back to Integer IDs"""

    # This is a complex downgrade - we'd need to recreate integer IDs
    # For simplicity, we'll note that downgrading is not recommended
    # as UUIDs are globally unique and we can't guarantee new integer IDs

    raise NotImplementedError(
        "Downgrading from UUID to Integer is not supported.\n"
        "UUIDs provide better security and uniqueness.\n"
        "If you must revert, restore from a pre-migration backup."
    )
