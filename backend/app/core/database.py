import os
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Set environment variables to handle encoding on Windows
os.environ['PGCLIENTENCODING'] = 'UTF8'
os.environ['PYTHONIOENCODING'] = 'utf-8'

# Register Unicode adapter before creating engine
psycopg2.extensions.register_type(psycopg2.extensions.UNICODE)

# Create SQLAlchemy engine with optimized connection pooling and encoding fix
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.DEBUG,
    pool_size=5,
    max_overflow=10,
    pool_recycle=3600,
    pool_timeout=30,
    pool_reset_on_return='commit',
    connect_args={
        "connect_timeout": 10,
        "options": "-c client_encoding=UTF8",
        "application_name": "MyAwesomeBlog"
    }
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()