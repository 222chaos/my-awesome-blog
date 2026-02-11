"""add_llm_tables

Revision ID: 009
Revises: 008
Create Date: 2026-02-11 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '009'
down_revision = '008'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create tenants table
    op.create_table(
        'tenants',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=50), nullable=False),
        sa.Column('description', sa.String(length=500)),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('max_users', sa.Integer(), nullable=True),
        sa.Column('max_conversations', sa.Integer(), nullable=True),
        sa.Column('max_storage_mb', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for tenants
    op.create_index(op.f('idx_tenant_status'), 'tenants', ['is_active'])
    op.create_index(op.f('idx_tenant_created'), 'tenants', ['created_at'])
    op.create_index(op.f('ix_tenants_id'), 'tenants', ['id'])
    op.create_index(op.f('ix_tenants_name'), 'tenants', ['name'], unique=True)
    op.create_index(op.f('ix_tenants_slug'), 'tenants', ['slug'], unique=True)
    
    # Create default tenant for existing users
    op.execute("""
        INSERT INTO tenants (id, name, slug, description, is_active, max_users, max_conversations, max_storage_mb)
        VALUES (
            '00000000-0000-0000-0000-000000000001',
            'Default Tenant',
            'default',
            'Default tenant for existing users',
            true,
            1000,
            10000,
            10240
        )
    """)
    
    # Add tenant_id to users table as nullable first
    op.add_column('users', sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=True))
    
    # Update existing users to have default tenant
    op.execute("""
        UPDATE users SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL
    """)
    
    # Now make tenant_id NOT NULL
    op.alter_column('users', 'tenant_id', nullable=False)
    
    op.create_foreign_key('fk_users_tenant', 'users', 'tenants', ['tenant_id'], ['id'], ondelete='CASCADE')
    op.create_index(op.f('idx_user_tenant'), 'users', ['tenant_id'])
    
    # Create prompts table
    op.create_table(
        'prompts',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('version', sa.String(length=20), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('variables', sa.JSON(), nullable=True),
        sa.Column('description', sa.String(length=500)),
        sa.Column('category', sa.String(length=50)),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_system', sa.Boolean(), nullable=True),
        sa.Column('ab_test_group', sa.String(length=20)),
        sa.Column('ab_test_percentage', sa.Integer(), nullable=True),
        sa.Column('usage_count', sa.Integer(), nullable=True),
        sa.Column('success_rate', sa.Integer(), nullable=True),
        sa.Column('total_interactions', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for prompts
    op.create_index(op.f('idx_prompt_tenant'), 'prompts', ['tenant_id'])
    op.create_index(op.f('idx_prompt_name'), 'prompts', ['name'])
    op.create_index(op.f('idx_prompt_version'), 'prompts', ['version'])
    op.create_index(op.f('idx_prompt_active'), 'prompts', ['is_active'])
    op.create_index(op.f('idx_prompt_ab_test'), 'prompts', ['ab_test_group'])
    op.create_index(op.f('idx_prompt_created'), 'prompts', ['created_at'])
    op.create_index(op.f('ix_prompts_id'), 'prompts', ['id'])
    
    # Create foreign key for prompts
    op.create_foreign_key('fk_prompts_tenant', 'prompts', 'tenants', ['tenant_id'], ['id'], ondelete='CASCADE')
    
    # Create conversations table
    op.create_table(
        'conversations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('prompt_id', postgresql.UUID(as_uuid=True)),
        sa.Column('model', sa.String(length=100), nullable=False),
        sa.Column('total_messages', sa.Integer(), nullable=True),
        sa.Column('total_tokens', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for conversations
    op.create_index(op.f('idx_conversation_tenant'), 'conversations', ['tenant_id'])
    op.create_index(op.f('idx_conversation_user'), 'conversations', ['user_id'])
    op.create_index(op.f('idx_conversation_status'), 'conversations', ['status'])
    op.create_index(op.f('idx_conversation_created'), 'conversations', ['created_at'])
    op.create_index(op.f('ix_conversations_id'), 'conversations', ['id'])
    
    # Create foreign keys for conversations
    op.create_foreign_key('fk_conversations_tenant', 'conversations', 'tenants', ['tenant_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_conversations_user', 'conversations', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_conversations_prompt', 'conversations', 'prompts', ['prompt_id'], ['id'], ondelete='SET NULL')
    
    # Create conversation_messages table
    op.create_table(
        'conversation_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('conversation_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('tokens', sa.Integer(), nullable=True),
        sa.Column('model', sa.String(length=100)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for conversation_messages
    op.create_index(op.f('idx_conv_msg_conversation'), 'conversation_messages', ['conversation_id'])
    op.create_index(op.f('idx_conv_msg_created'), 'conversation_messages', ['created_at'])
    op.create_index(op.f('ix_conversation_messages_id'), 'conversation_messages', ['id'])
    
    # Create foreign key for conversation_messages
    op.create_foreign_key('fk_conv_msg_conversation', 'conversation_messages', 'conversations', ['conversation_id'], ['id'], ondelete='CASCADE')
    
    # Create memories table
    op.create_table(
        'memories',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('memory_type', sa.String(length=50), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('embedding', sa.Text()),
        sa.Column('importance', sa.Float(), nullable=True),
        sa.Column('access_count', sa.Integer(), nullable=True),
        sa.Column('expires_at', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for memories
    op.create_index(op.f('idx_memory_tenant'), 'memories', ['tenant_id'])
    op.create_index(op.f('idx_memory_user'), 'memories', ['user_id'])
    op.create_index(op.f('idx_memory_type'), 'memories', ['memory_type'])
    op.create_index(op.f('idx_memory_importance'), 'memories', ['importance'])
    op.create_index(op.f('idx_memory_expires'), 'memories', ['expires_at'])
    op.create_index(op.f('ix_memories_id'), 'memories', ['id'])
    
    # Create foreign keys for memories
    op.create_foreign_key('fk_memories_tenant', 'memories', 'tenants', ['tenant_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_memories_user', 'memories', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    
    # Create context_history table
    op.create_table(
        'context_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('conversation_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('message_count', sa.Integer(), nullable=True),
        sa.Column('total_tokens', sa.Integer(), nullable=True),
        sa.Column('summary', sa.Text()),
        sa.Column('key_points', sa.Text()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for context_history
    op.create_index(op.f('idx_ctx_conversation'), 'context_history', ['conversation_id'])
    op.create_index(op.f('idx_ctx_created'), 'context_history', ['created_at'])
    op.create_index(op.f('ix_context_history_id'), 'context_history', ['id'])
    
    # Create foreign key for context_history
    op.create_foreign_key('fk_ctx_conversation', 'context_history', 'conversations', ['conversation_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    # Drop context_history table
    op.drop_index(op.f('ix_context_history_id'), table_name='context_history')
    op.drop_index(op.f('idx_ctx_created'), table_name='context_history')
    op.drop_index(op.f('idx_ctx_conversation'), table_name='context_history')
    op.drop_constraint('fk_ctx_conversation', 'context_history', type_='foreignkey')
    op.drop_table('context_history')
    
    # Drop memories table
    op.drop_index(op.f('ix_memories_id'), table_name='memories')
    op.drop_index(op.f('idx_memory_expires'), table_name='memories')
    op.drop_index(op.f('idx_memory_importance'), table_name='memories')
    op.drop_index(op.f('idx_memory_type'), table_name='memories')
    op.drop_index(op.f('idx_memory_user'), table_name='memories')
    op.drop_index(op.f('idx_memory_tenant'), table_name='memories')
    op.drop_constraint('fk_memories_user', 'memories', type_='foreignkey')
    op.drop_constraint('fk_memories_tenant', 'memories', type_='foreignkey')
    op.drop_table('memories')
    
    # Drop conversation_messages table
    op.drop_index(op.f('ix_conversation_messages_id'), table_name='conversation_messages')
    op.drop_index(op.f('idx_conv_msg_created'), table_name='conversation_messages')
    op.drop_index(op.f('idx_conv_msg_conversation'), table_name='conversation_messages')
    op.drop_constraint('fk_conv_msg_conversation', 'conversation_messages', type_='foreignkey')
    op.drop_table('conversation_messages')
    
    # Drop conversations table
    op.drop_index(op.f('ix_conversations_id'), table_name='conversations')
    op.drop_index(op.f('idx_conversation_created'), table_name='conversations')
    op.drop_index(op.f('idx_conversation_status'), table_name='conversations')
    op.drop_index(op.f('idx_conversation_user'), table_name='conversations')
    op.drop_index(op.f('idx_conversation_tenant'), table_name='conversations')
    op.drop_constraint('fk_conversations_prompt', 'conversations', type_='foreignkey')
    op.drop_constraint('fk_conversations_user', 'conversations', type_='foreignkey')
    op.drop_constraint('fk_conversations_tenant', 'conversations', type_='foreignkey')
    op.drop_table('conversations')
    
    # Drop prompts table
    op.drop_index(op.f('ix_prompts_id'), table_name='prompts')
    op.drop_index(op.f('idx_prompt_created'), table_name='prompts')
    op.drop_index(op.f('idx_prompt_ab_test'), table_name='prompts')
    op.drop_index(op.f('idx_prompt_active'), table_name='prompts')
    op.drop_index(op.f('idx_prompt_version'), table_name='prompts')
    op.drop_index(op.f('idx_prompt_name'), table_name='prompts')
    op.drop_index(op.f('idx_prompt_tenant'), table_name='prompts')
    op.drop_constraint('fk_prompts_tenant', 'prompts', type_='foreignkey')
    op.drop_table('prompts')
    
    # Drop tenant_id from users table
    op.drop_index(op.f('idx_user_tenant'), table_name='users')
    op.drop_constraint('fk_users_tenant', 'users', type_='foreignkey')
    op.drop_column('users', 'tenant_id')
    
    # Drop tenants table
    op.drop_index(op.f('ix_tenants_slug'), table_name='tenants')
    op.drop_index(op.f('ix_tenants_name'), table_name='tenants')
    op.drop_index(op.f('ix_tenants_id'), table_name='tenants')
    op.drop_index(op.f('idx_tenant_created'), table_name='tenants')
    op.drop_index(op.f('idx_tenant_status'), table_name='tenants')
    op.drop_table('tenants')
