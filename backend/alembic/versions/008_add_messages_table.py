"""add_messages_table

Revision ID: 008
Revises: 007
Create Date: 2026-02-04 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '008'
down_revision = '007'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('color', sa.String(length=7), nullable=True),
        sa.Column('is_danmaku', sa.Boolean(), nullable=True),
        sa.Column('likes', sa.Integer(), nullable=True),
        sa.Column('level', sa.Integer(), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('author_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('parent_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['parent_id'], ['messages.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for better query performance
    op.create_index(op.f('ix_messages_id'), 'messages', ['id'])
    op.create_index(op.f('ix_messages_author_id'), 'messages', ['author_id'])
    op.create_index(op.f('ix_messages_parent_id'), 'messages', ['parent_id'])
    op.create_index(op.f('ix_messages_is_danmaku'), 'messages', ['is_danmaku'])
    op.create_index(op.f('ix_messages_is_deleted'), 'messages', ['is_deleted'])
    op.create_index(op.f('ix_messages_created_at'), 'messages', ['created_at'])


def downgrade() -> None:
    # Drop messages table
    op.drop_index(op.f('ix_messages_created_at'), table_name='messages')
    op.drop_index(op.f('ix_messages_is_deleted'), table_name='messages')
    op.drop_index(op.f('ix_messages_is_danmaku'), table_name='messages')
    op.drop_index(op.f('ix_messages_parent_id'), table_name='messages')
    op.drop_index(op.f('ix_messages_author_id'), table_name='messages')
    op.drop_index(op.f('ix_messages_id'), table_name='messages')
    op.drop_table('messages')
