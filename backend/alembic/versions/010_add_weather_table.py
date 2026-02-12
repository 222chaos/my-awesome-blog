"""add_weather_table

Revision ID: 010
Revises: 009
Create Date: 2026-02-12 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '010'
down_revision = '009'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'weather',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('province', sa.String(length=100), nullable=True),
        sa.Column('country', sa.String(length=100), nullable=True),
        sa.Column('weather', sa.String(length=50), nullable=False),
        sa.Column('weather_img', sa.String(length=200), nullable=True),
        sa.Column('temperature', sa.String(length=20), nullable=False),
        sa.Column('temp_min', sa.String(length=20), nullable=True),
        sa.Column('temp_max', sa.String(length=20), nullable=True),
        sa.Column('wind_direction', sa.String(length=50), nullable=True),
        sa.Column('wind_speed', sa.String(length=20), nullable=True),
        sa.Column('wind_meter', sa.String(length=20), nullable=True),
        sa.Column('humidity', sa.String(length=20), nullable=True),
        sa.Column('visibility', sa.String(length=20), nullable=True),
        sa.Column('pressure', sa.String(length=20), nullable=True),
        sa.Column('air_quality', sa.String(length=50), nullable=True),
        sa.Column('is_daytime', sa.Boolean(), server_default='true', nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_index('idx_weather_city', 'weather', ['city'])
    op.create_index('idx_weather_updated', 'weather', ['updated_at'])
    op.create_index('idx_weather_city_updated', 'weather', ['city', 'updated_at'])


def downgrade() -> None:
    op.drop_index('idx_weather_city_updated', 'weather')
    op.drop_index('idx_weather_updated', 'weather')
    op.drop_index('idx_weather_city', 'weather')
    op.drop_table('weather')
