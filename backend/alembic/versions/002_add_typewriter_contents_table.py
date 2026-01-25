"""Add typewriter_contents table for dynamic text display

Revision ID: 002
Revises: 
Create Date: 2026-01-26 03:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create typewriter_contents table
    op.create_table(
        'typewriter_contents',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('text', sa.String(length=500), nullable=False),
        sa.Column('priority', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create indexes
    op.create_index(op.f('ix_typewriter_contents_id'), 'typewriter_contents', ['id'], unique=False)
    op.create_index(op.f('ix_typewriter_contents_priority'), 'typewriter_contents', ['priority'], unique=False)
    op.create_index(op.f('ix_typewriter_contents_is_active'), 'typewriter_contents', ['is_active'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_typewriter_contents_is_active'), table_name='typewriter_contents')
    op.drop_index(op.f('ix_typewriter_contents_priority'), table_name='typewriter_contents')
    op.drop_index(op.f('ix_typewriter_contents_id'), table_name='typewriter_contents')

    # Drop table
    op.drop_table('typewriter_contents')
