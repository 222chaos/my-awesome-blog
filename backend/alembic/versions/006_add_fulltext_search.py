"""add_fulltext_search

Revision ID: 006
Revises: 005
Create Date: 2026-01-28 23:44:24.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = '006'
down_revision = '005'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create GIN index for full-text search on PostgreSQL
    # First, create a search_vector column for articles
    op.execute(
        "ALTER TABLE articles ADD COLUMN search_vector tsvector;"
    )
    
    # Create a trigger function to automatically update search_vector
    op.execute("""
        CREATE OR REPLACE FUNCTION articles_search_vector_update() 
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.search_vector := 
                SETWEIGHT(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
                SETWEIGHT(to_tsvector('english', COALESCE(NEW.content, '')), 'B') ||
                SETWEIGHT(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'C');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    
    # Create trigger to call the function before insert/update
    op.execute("""
        CREATE TRIGGER trig_articles_search_vector_update 
        BEFORE INSERT OR UPDATE ON articles
        FOR EACH ROW EXECUTE PROCEDURE articles_search_vector_update();
    """)
    
    # Update existing rows to populate search_vector
    op.execute("""
        UPDATE articles SET search_vector = 
            SETWEIGHT(to_tsvector('english', COALESCE(title, '')), 'A') ||
            SETWEIGHT(to_tsvector('english', COALESCE(content, '')), 'B') ||
            SETWEIGHT(to_tsvector('english', COALESCE(excerpt, '')), 'C');
    """)
    
    # Create GIN index on search_vector for fast full-text search
    op.execute("CREATE INDEX idx_articles_search_vector ON articles USING GIN(search_vector);")


def downgrade() -> None:
    # Drop the trigger
    op.execute("DROP TRIGGER IF EXISTS trig_articles_search_vector_update ON articles;")
    
    # Drop the function
    op.execute("DROP FUNCTION IF EXISTS articles_search_vector_update();")
    
    # Drop the index
    op.execute("DROP INDEX IF EXISTS idx_articles_search_vector;")
    
    # Drop the column
    op.execute("ALTER TABLE articles DROP COLUMN search_vector;")