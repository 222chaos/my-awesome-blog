"""add_indexes_for_optimized_queries

Revision ID: 004
Revises: d3b783cf9bf3
Create Date: 2026-01-28 23:44:24.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '004'
down_revision = 'd3b783cf9bf3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add indexes for commonly queried fields in articles table
    op.create_index(op.f('ix_articles_is_published'), 'articles', ['is_published'])
    op.create_index(op.f('ix_articles_published_at'), 'articles', ['published_at'])
    op.create_index(op.f('ix_articles_view_count'), 'articles', ['view_count'])
    op.create_index(op.f('ix_articles_created_at'), 'articles', ['created_at'])
    op.create_index(op.f('ix_articles_is_featured'), 'articles', ['is_featured'])
    op.create_index(op.f('ix_articles_is_pinned'), 'articles', ['is_pinned'])
    
    # Add index for author_id which is frequently used for filtering
    op.create_index(op.f('ix_articles_author_id'), 'articles', ['author_id'])
    
    # Add indexes for user table
    op.create_index(op.f('ix_users_full_name'), 'users', ['full_name'])
    op.create_index(op.f('ix_users_is_active'), 'users', ['is_active'])
    op.create_index(op.f('ix_users_is_superuser'), 'users', ['is_superuser'])
    op.create_index(op.f('ix_users_created_at'), 'users', ['created_at'])
    
    # Add indexes for comment table
    op.create_index(op.f('ix_comments_is_approved'), 'comments', ['is_approved'])
    op.create_index(op.f('ix_comments_created_at'), 'comments', ['created_at'])
    
    # Add indexes for category and tag tables
    op.create_index(op.f('ix_categories_name'), 'categories', ['name'])
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'])
    op.create_index(op.f('ix_tags_name'), 'tags', ['name'])
    op.create_index(op.f('ix_tags_slug'), 'tags', ['slug'])


def downgrade() -> None:
    # Drop indexes in reverse order
    op.drop_index(op.f('ix_tags_slug'), table_name='tags')
    op.drop_index(op.f('ix_tags_name'), table_name='tags')
    op.drop_index(op.f('ix_categories_slug'), table_name='categories')
    op.drop_index(op.f('ix_categories_name'), table_name='categories')
    op.drop_index(op.f('ix_comments_created_at'), table_name='comments')
    op.drop_index(op.f('ix_comments_is_approved'), table_name='comments')
    op.drop_index(op.f('ix_users_created_at'), table_name='users')
    op.drop_index(op.f('ix_users_is_superuser'), table_name='users')
    op.drop_index(op.f('ix_users_is_active'), table_name='users')
    op.drop_index(op.f('ix_users_full_name'), table_name='users')
    op.drop_index(op.f('ix_articles_author_id'), table_name='articles')
    op.drop_index(op.f('ix_articles_is_pinned'), table_name='articles')
    op.drop_index(op.f('ix_articles_is_featured'), table_name='articles')
    op.drop_index(op.f('ix_articles_created_at'), table_name='articles')
    op.drop_index(op.f('ix_articles_view_count'), table_name='articles')
    op.drop_index(op.f('ix_articles_published_at'), table_name='articles')
    op.drop_index(op.f('ix_articles_is_published'), table_name='articles')