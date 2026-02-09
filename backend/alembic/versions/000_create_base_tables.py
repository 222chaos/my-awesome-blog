"""Create base tables

Revision ID: 000
Revises: 
Create Date: 2026-01-25 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '000'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('username', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=100), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_superuser', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('avatar', sa.String(length=500), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('website', sa.String(length=200), nullable=True),
        sa.Column('twitter', sa.String(length=100), nullable=True),
        sa.Column('github', sa.String(length=100), nullable=True),
        sa.Column('linkedin', sa.String(length=100), nullable=True),
    )
    op.create_index('ix_users_username', 'users', ['username'], unique=True)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_full_name', 'users', ['full_name'], unique=False)
    op.create_index('ix_users_is_active', 'users', ['is_active'], unique=False)
    op.create_index('ix_users_is_superuser', 'users', ['is_superuser'], unique=False)
    op.create_index('ix_users_created_at', 'users', ['created_at'], unique=False)
    op.create_index('ix_users_website', 'users', ['website'], unique=False)
    op.create_index('ix_users_twitter', 'users', ['twitter'], unique=False)
    op.create_index('ix_users_github', 'users', ['github'], unique=False)
    op.create_index('ix_users_linkedin', 'users', ['linkedin'], unique=False)
    op.create_index('idx_user_active_created', 'users', ['is_active', 'created_at'], unique=False)
    op.create_index('idx_user_superuser', 'users', ['is_superuser'], unique=False)

    # Create articles table
    op.create_table(
        'articles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=200), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('excerpt', sa.String(length=500), nullable=True),
        sa.Column('cover_image', sa.String(length=255), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=True),
        sa.Column('published_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('view_count', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('read_time', sa.Integer(), nullable=True),
        sa.Column('is_featured', sa.Boolean(), nullable=True),
        sa.Column('is_pinned', sa.Boolean(), nullable=True),
        sa.Column('meta_title', sa.String(length=200), nullable=True),
        sa.Column('meta_description', sa.Text(), nullable=True),
        sa.Column('author_id', postgresql.UUID(as_uuid=True), nullable=False),
    )
    op.create_index('ix_articles_title', 'articles', ['title'], unique=False)
    op.create_index('ix_articles_slug', 'articles', ['slug'], unique=True)
    op.create_index('ix_articles_excerpt', 'articles', ['excerpt'], unique=False)
    op.create_index('ix_articles_is_published', 'articles', ['is_published'], unique=False)
    op.create_index('ix_articles_published_at', 'articles', ['published_at'], unique=False)
    op.create_index('ix_articles_view_count', 'articles', ['view_count'], unique=False)
    op.create_index('ix_articles_created_at', 'articles', ['created_at'], unique=False)
    op.create_index('ix_articles_read_time', 'articles', ['read_time'], unique=False)
    op.create_index('ix_articles_is_featured', 'articles', ['is_featured'], unique=False)
    op.create_index('ix_articles_is_pinned', 'articles', ['is_pinned'], unique=False)
    op.create_index('ix_articles_meta_description', 'articles', ['meta_description'], unique=False)
    op.create_index('ix_articles_author_id', 'articles', ['author_id'], unique=False)
    op.create_index('idx_article_published_created', 'articles', ['is_published', 'created_at'], unique=False)
    op.create_index('idx_article_author_published', 'articles', ['author_id', 'is_published'], unique=False)
    op.create_index('idx_article_published_featured', 'articles', ['is_published', 'is_featured', 'created_at'], unique=False)
    op.create_index('idx_article_published_pinned', 'articles', ['is_published', 'is_pinned', 'published_at'], unique=False)
    op.create_foreign_key('fk_articles_author_id_users', 'articles', 'users', ['author_id'], ['id'], ondelete='CASCADE')

    # Create comments table
    op.create_table(
        'comments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('article_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('author_id', postgresql.UUID(as_uuid=True), nullable=False),
    )
    op.create_index('ix_comments_article_id', 'comments', ['article_id'], unique=False)
    op.create_index('ix_comments_author_id', 'comments', ['author_id'], unique=False)
    op.create_foreign_key('fk_comments_article_id_articles', 'comments', 'articles', ['article_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_comments_author_id_users', 'comments', 'users', ['author_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    # Drop comments table
    op.drop_constraint('fk_comments_author_id_users', 'comments', type_='foreignkey')
    op.drop_constraint('fk_comments_article_id_articles', 'comments', type_='foreignkey')
    op.drop_index('ix_comments_author_id', table_name='comments')
    op.drop_index('ix_comments_article_id', table_name='comments')
    op.drop_table('comments')

    # Drop articles table
    op.drop_constraint('fk_articles_author_id_users', 'articles', type_='foreignkey')
    op.drop_constraint('fk_articles_featured_image_id_images', 'articles', type_='foreignkey')
    op.drop_index('idx_article_published_pinned', table_name='articles')
    op.drop_index('idx_article_published_featured', table_name='articles')
    op.drop_index('idx_article_author_published', table_name='articles')
    op.drop_index('idx_article_published_created', table_name='articles')
    op.drop_index('ix_articles_author_id', table_name='articles')
    op.drop_index('ix_articles_meta_description', table_name='articles')
    op.drop_index('ix_articles_is_pinned', table_name='articles')
    op.drop_index('ix_articles_is_featured', table_name='articles')
    op.drop_index('ix_articles_read_time', table_name='articles')
    op.drop_index('ix_articles_created_at', table_name='articles')
    op.drop_index('ix_articles_view_count', table_name='articles')
    op.drop_index('ix_articles_published_at', table_name='articles')
    op.drop_index('ix_articles_is_published', table_name='articles')
    op.drop_index('ix_articles_excerpt', table_name='articles')
    op.drop_index('ix_articles_slug', table_name='articles')
    op.drop_index('ix_articles_title', table_name='articles')
    op.drop_constraint('fk_articles_author_id_users', 'articles', type_='foreignkey')
    op.drop_table('articles')

    # Drop users table
    op.drop_index('idx_user_superuser', table_name='users')
    op.drop_index('idx_user_active_created', table_name='users')
    op.drop_index('ix_users_linkedin', table_name='users')
    op.drop_index('ix_users_github', table_name='users')
    op.drop_index('ix_users_twitter', table_name='users')
    op.drop_index('ix_users_website', table_name='users')
    op.drop_index('ix_users_created_at', table_name='users')
    op.drop_index('ix_users_is_superuser', table_name='users')
    op.drop_index('ix_users_is_active', table_name='users')
    op.drop_index('ix_users_full_name', table_name='users')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_username', table_name='users')
    op.drop_table('users')