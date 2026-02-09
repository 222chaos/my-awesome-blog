"""Add new tables for enhanced blog functionality

Revision ID: 001
Revises: 000
Create Date: 2026-01-25 06:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = '000'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create categories table
    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('slug', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('color', sa.String(length=7), nullable=True),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
        sa.UniqueConstraint('slug')
    )
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=False)
    op.create_index(op.f('ix_categories_sort_order'), 'categories', ['sort_order'], unique=False)

    # Create tags table
    op.create_table(
        'tags',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('slug', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('color', sa.String(length=7), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
        sa.UniqueConstraint('slug')
    )
    op.create_index(op.f('ix_tags_id'), 'tags', ['id'], unique=False)
    op.create_index(op.f('ix_tags_slug'), 'tags', ['slug'], unique=False)

    # Create article_categories table
    op.create_table(
        'article_categories',
        sa.Column('article_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=False),
        sa.Column('is_primary', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['article_id'], ['articles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('article_id', 'category_id')
    )
    op.create_index(op.f('ix_article_categories_article_id'), 'article_categories', ['article_id'], unique=False)
    op.create_index(op.f('ix_article_categories_category_id'), 'article_categories', ['category_id'], unique=False)

    # Create article_tags table
    op.create_table(
        'article_tags',
        sa.Column('article_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['article_id'], ['articles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('article_id', 'tag_id')
    )
    op.create_index(op.f('ix_article_tags_article_id'), 'article_tags', ['article_id'], unique=False)
    op.create_index(op.f('ix_article_tags_tag_id'), 'article_tags', ['tag_id'], unique=False)

    # Create friend_links table
    op.create_table(
        'friend_links',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('favicon', sa.String(length=500), nullable=True),
        sa.Column('avatar', sa.String(length=500), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_featured', sa.Boolean(), nullable=True),
        sa.Column('click_count', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_friend_links_id'), 'friend_links', ['id'], unique=False)
    op.create_index(op.f('ix_friend_links_sort_order'), 'friend_links', ['sort_order'], unique=False)

    # Create portfolios table
    op.create_table(
        'portfolios',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('cover_image', sa.String(length=500), nullable=True),
        sa.Column('demo_url', sa.String(length=500), nullable=True),
        sa.Column('github_url', sa.String(length=500), nullable=True),
        sa.Column('technologies', sa.Text(), nullable=True),  # Using Text column to store JSON
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('is_featured', sa.Boolean(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('slug')
    )
    op.create_index(op.f('ix_portfolios_id'), 'portfolios', ['id'], unique=False)
    op.create_index(op.f('ix_portfolios_slug'), 'portfolios', ['slug'], unique=False)
    op.create_index(op.f('ix_portfolios_sort_order'), 'portfolios', ['sort_order'], unique=False)

    # Create images table
    op.create_table(
        'images',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('original_filename', sa.String(length=255), nullable=False),
        sa.Column('file_path', sa.String(length=500), nullable=False),
        sa.Column('file_size', sa.BigInteger(), nullable=False),
        sa.Column('mime_type', sa.String(length=50), nullable=False),
        sa.Column('width', sa.Integer(), nullable=False),
        sa.Column('height', sa.Integer(), nullable=False),
        sa.Column('alt_text', sa.String(length=255), nullable=True),
        sa.Column('caption', sa.Text(), nullable=True),
        sa.Column('is_optimized', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    )
    op.create_index(op.f('ix_images_id'), 'images', ['id'], unique=False)
    op.create_index(op.f('ix_images_file_path'), 'images', ['file_path'], unique=False)

    # Create image_variants table
    op.create_table(
        'image_variants',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('image_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('variant_name', sa.String(length=50), nullable=False),
        sa.Column('file_path', sa.String(length=500), nullable=False),
        sa.Column('width', sa.Integer(), nullable=False),
        sa.Column('height', sa.Integer(), nullable=False),
        sa.Column('file_size', sa.BigInteger(), nullable=False),
        sa.Column('quality', sa.Integer(), nullable=False),
        sa.Column('format', sa.String(length=10), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['image_id'], ['images.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('image_id', 'variant_name', name='uq_image_variant')
    )
    op.create_index(op.f('ix_image_variants_id'), 'image_variants', ['id'], unique=False)
    op.create_index(op.f('ix_image_variants_image_id'), 'image_variants', ['image_id'], unique=False)
    op.create_index(op.f('ix_image_variants_variant_name'), 'image_variants', ['variant_name'], unique=False)

    # Create portfolio_images table (association table for portfolios and images)
    op.create_table(
        'portfolio_images',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('portfolio_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('image_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('sort_order', sa.Integer(), nullable=True),
        sa.Column('is_cover', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['image_id'], ['images.id'], ondelete='CASCADE'),
    )
    op.create_index(op.f('ix_portfolio_images_id'), 'portfolio_images', ['id'], unique=False)
    op.create_index(op.f('ix_portfolio_images_portfolio_id'), 'portfolio_images', ['portfolio_id'], unique=False)
    op.create_index(op.f('ix_portfolio_images_image_id'), 'portfolio_images', ['image_id'], unique=False)

    # Create timeline_events table
    op.create_table(
        'timeline_events',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('event_date', sa.Date(), nullable=False),
        sa.Column('event_type', sa.String(length=50), nullable=True),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('color', sa.String(length=7), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_timeline_events_id'), 'timeline_events', ['id'], unique=False)
    op.create_index(op.f('ix_timeline_events_event_date'), 'timeline_events', ['event_date'], unique=False, postgresql_ops={'event_date': 'DESC'})
    op.create_index(op.f('ix_timeline_events_sort_order'), 'timeline_events', ['sort_order'], unique=False)

    # Create subscriptions table
    op.create_table(
        'subscriptions',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True),
        sa.Column('verification_token', sa.String(length=100), nullable=True),
        sa.Column('subscribed_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('unsubscribed_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_subscriptions_id'), 'subscriptions', ['id'], unique=False)
    op.create_index(op.f('ix_subscriptions_email'), 'subscriptions', ['email'], unique=False)
    op.create_index(op.f('ix_subscriptions_is_active'), 'subscriptions', ['is_active'], unique=False)

    # Add featured_image_id column to articles table
    op.add_column('articles', sa.Column('featured_image_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.create_foreign_key('fk_articles_featured_image_id_images', 'articles', 'images', ['featured_image_id'], ['id'])


def downgrade() -> None:
    # Drop featured_image_id column from articles table
    op.drop_constraint('fk_articles_featured_image_id_images', 'articles', type_='foreignkey')
    op.drop_column('articles', 'featured_image_id')
    # Drop subscriptions table
    op.drop_index(op.f('ix_subscriptions_is_active'), table_name='subscriptions')
    op.drop_index(op.f('ix_subscriptions_email'), table_name='subscriptions')
    op.drop_index(op.f('ix_subscriptions_id'), table_name='subscriptions')
    op.drop_table('subscriptions')

    # Drop timeline_events table
    op.drop_index(op.f('ix_timeline_events_sort_order'), table_name='timeline_events')
    op.drop_index(op.f('ix_timeline_events_event_date'), table_name='timeline_events')
    op.drop_index(op.f('ix_timeline_events_id'), table_name='timeline_events')
    op.drop_table('timeline_events')

    # Drop portfolio_images table
    op.drop_index(op.f('ix_portfolio_images_image_id'), table_name='portfolio_images')
    op.drop_index(op.f('ix_portfolio_images_portfolio_id'), table_name='portfolio_images')
    op.drop_index(op.f('ix_portfolio_images_id'), table_name='portfolio_images')
    op.drop_table('portfolio_images')

    # Drop image_variants table
    op.drop_index(op.f('ix_image_variants_variant_name'), table_name='image_variants')
    op.drop_index(op.f('ix_image_variants_image_id'), table_name='image_variants')
    op.drop_index(op.f('ix_image_variants_id'), table_name='image_variants')
    op.drop_table('image_variants')

    # Drop images table
    op.drop_index(op.f('ix_images_file_path'), table_name='images')
    op.drop_index(op.f('ix_images_id'), table_name='images')
    op.drop_table('images')

    # Drop portfolios table
    op.drop_index(op.f('ix_portfolios_sort_order'), table_name='portfolios')
    op.drop_index(op.f('ix_portfolios_slug'), table_name='portfolios')
    op.drop_index(op.f('ix_portfolios_id'), table_name='portfolios')
    op.drop_table('portfolios')

    # Drop friend_links table
    op.drop_index(op.f('ix_friend_links_sort_order'), table_name='friend_links')
    op.drop_index(op.f('ix_friend_links_id'), table_name='friend_links')
    op.drop_table('friend_links')

    # Drop article_tags table
    op.drop_index(op.f('ix_article_tags_tag_id'), table_name='article_tags')
    op.drop_index(op.f('ix_article_tags_article_id'), table_name='article_tags')
    op.drop_table('article_tags')

    # Drop article_categories table
    op.drop_index(op.f('ix_article_categories_category_id'), table_name='article_categories')
    op.drop_index(op.f('ix_article_categories_article_id'), table_name='article_categories')
    op.drop_table('article_categories')

    # Drop tags table
    op.drop_index(op.f('ix_tags_slug'), table_name='tags')
    op.drop_index(op.f('ix_tags_id'), table_name='tags')
    op.drop_table('tags')

    # Drop categories table
    op.drop_index(op.f('ix_categories_sort_order'), table_name='categories')
    op.drop_index(op.f('ix_categories_slug'), table_name='categories')
    op.drop_index(op.f('ix_categories_id'), table_name='categories')
    op.drop_table('categories')