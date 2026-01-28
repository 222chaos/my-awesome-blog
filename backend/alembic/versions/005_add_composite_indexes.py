"""add_composite_indexes

Revision ID: 005
Revises: 004
Create Date: 2026-01-28 23:44:24.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add composite indexes for common query patterns
    
    # Index for querying published articles ordered by date
    op.create_index(
        'ix_articles_published_created_at',
        'articles',
        ['is_published', 'created_at'],
        postgresql_where=sa.text("is_published = true")
    )
    
    # Index for querying published articles by author and date
    op.create_index(
        'ix_articles_author_published_created',
        'articles',
        ['author_id', 'is_published', 'created_at'],
        postgresql_where=sa.text("is_published = true")
    )
    
    # Index for querying published articles by category and date (requires article_categories join)
    op.create_index(
        'ix_articles_category_published_created',
        'articles',
        ['is_published', 'created_at'],
        postgresql_where=sa.text("is_published = true")
    )
    
    # Index for querying published articles by tag and date (requires article_tags join)
    op.create_index(
        'ix_articles_tag_published_created',
        'articles',
        ['is_published', 'created_at'],
        postgresql_where=sa.text("is_published = true")
    )
    
    # Index for querying popular articles (by view count and date)
    op.create_index(
        'ix_articles_published_viewcount_created',
        'articles',
        ['is_published', 'view_count', 'created_at'],
        postgresql_where=sa.text("is_published = true")
    )
    
    # Index for querying featured articles
    op.create_index(
        'ix_articles_featured_published_created',
        'articles',
        ['is_featured', 'is_published', 'created_at'],
        postgresql_where=sa.text("is_published = true AND is_featured = true")
    )


def downgrade() -> None:
    # Drop composite indexes
    op.drop_index('ix_articles_featured_published_created', table_name='articles')
    op.drop_index('ix_articles_published_viewcount_created', table_name='articles')
    op.drop_index('ix_articles_category_published_created', table_name='articles')
    op.drop_index('ix_articles_tag_published_created', table_name='articles')
    op.drop_index('ix_articles_author_published_created', table_name='articles')
    op.drop_index('ix_articles_published_created_at', table_name='articles')