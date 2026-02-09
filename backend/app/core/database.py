import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Create SQLAlchemy engine with optimized connection pooling and encoding fix
# Support both PostgreSQL and SQLite
if settings.DATABASE_URL.startswith('postgresql://'):
    # PostgreSQL specific settings
    import psycopg2
    os.environ['PGCLIENTENCODING'] = 'UTF8'
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    psycopg2.extensions.register_type(psycopg2.extensions.UNICODE)
    
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        echo=settings.DEBUG,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_recycle=settings.DATABASE_POOL_RECYCLE,
        pool_timeout=settings.DATABASE_POOL_TIMEOUT,
        pool_reset_on_return='commit',
        connect_args={
            "connect_timeout": 10,
            "options": "-c client_encoding=UTF8",
            "application_name": "MyAwesomeBlog"
        }
    )
else:
    # SQLite settings (for development/testing)
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False} if 'sqlite' in settings.DATABASE_URL else {}
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