---
trigger: always_on
---

# Backend Development Guidelines - My Awesome Blog

## Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Database**: PostgreSQL (production), SQLite (development)
- **ORM**: SQLAlchemy 2.0 with async support
- **Validation**: Pydantic v2
- **Authentication**: JWT (python-jose, passlib)
- **Migrations**: Alembic
- **Testing**: pytest
- **Logging**: loguru

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # Application entry point
│   ├── core/                  # Core functionality
│   │   ├── config.py          # Configuration settings
│   │   ├── database.py        # Database connection
│   │   ├── dependencies.py     # Dependency injection
│   │   ├── exception_handler.py # Global exception handling
│   │   └── security.py       # Security utilities
│   ├── api/
│   │   └── v1/
│   │       ├── router.py       # API router aggregation
│   │       └── endpoints/     # API endpoints
│   ├── models/                # SQLAlchemy models
│   ├── schemas/               # Pydantic schemas
│   ├── crud/                 # CRUD operations
│   ├── services/              # Business logic services
│   ├── utils/                # Utility functions
│   │   ├── logger.py         # Logging configuration
│   │   ├── middleware.py     # Custom middleware
│   │   └── pagination.py     # Pagination utilities
│   └── tests/                # Test files
├── alembic/                  # Database migrations
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
├── requirements.txt           # Production dependencies
└── requirements-test.txt      # Test dependencies
```

## FastAPI Patterns

### Basic Endpoint Structure

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.article import Article, ArticleCreate
from app import crud

router = APIRouter()

@router.post("/", response_model=Article, status_code=status.HTTP_201_CREATED)
def create_article(
    *,
    db: Session = Depends(get_db),
    article_in: ArticleCreate,
) -> Article:
    """
    Create new article
    """
    article = crud.create_article(db, article=article_in)
    return article
```

### Dependency Injection Pattern

```python
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@router.get("/users/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
```

### Error Handling Pattern

```python
from fastapi import HTTPException, status
from app.utils.logger import app_logger

def get_article(db: Session, article_id: int):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        app_logger.warning(f"Attempt to access non-existent article ID: {article_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    return article
```

### Pagination Pattern

```python
from fastapi import Query
from typing import Optional

@router.get("/", response_model=List[Article])
def list_articles(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
) -> List[Article]:
    articles = crud.get_multi(db, skip=skip, limit=limit)
    return articles
```

## SQLAlchemy/ORM Patterns

### Model Definition

```python
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Foreign keys
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    author = relationship("User", back_populates="articles")
    comments = relationship("Comment", back_populates="article", cascade="all, delete-orphan")
```

### Relationship Patterns

```python
# In User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    
    # Relationships
    articles = relationship("Article", back_populates="author")
    comments = relationship("Comment", back_populates="author")
```

### CRUD Operations

```python
from typing import List, Optional
from sqlalchemy.orm import Session

def get_article(db: Session, article_id: int) -> Optional[Article]:
    return db.query(Article).filter(Article.id == article_id).first()

def get_article_by_slug(db: Session, slug: str) -> Optional[Article]:
    return db.query(Article).filter(Article.slug == slug).first()

def get_articles(
    db: Session, skip: int = 0, limit: int = 100
) -> List[Article]:
    return db.query(Article).offset(skip).limit(limit).all()

def create_article(db: Session, article: ArticleCreate) -> Article:
    db_article = Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def update_article(
    db: Session, db_article: Article, article_in: ArticleUpdate
) -> Article:
    for field, value in article_in.dict(exclude_unset=True).items():
        setattr(db_article, field, value)
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def delete_article(db: Session, article_id: int) -> Article:
    article = db.query(Article).filter(Article.id == article_id).first()
    if article:
        db.delete(article)
        db.commit()
    return article
```

## Pydantic Schema Patterns

### Base Schema

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class ArticleBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    excerpt: Optional[str] = Field(None, max_length=500)
    is_published: bool = False
```

### Create Schema

```python
class ArticleCreate(ArticleBase):
    slug: Optional[str] = None
    category_id: Optional[int] = None
    tags: Optional[List[int]] = []
```

### Update Schema

```python
class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    excerpt: Optional[str] = Field(None, max_length=500)
    is_published: Optional[bool] = None
    category_id: Optional[int] = None
    tags: Optional[List[int]] = None
```

### Response Schema

```python
class ArticleInDBBase(ArticleBase):
    id: int
    slug: Optional[str]
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class Article(ArticleInDBBase):
    author: Optional[UserSimple]
    category: Optional[CategorySimple]
    tags: List[TagSimple] = []
    comment_count: int = 0
```

## Database Patterns

### Connection Management

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.DEBUG
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Query Optimization

```python
from sqlalchemy.orm import joinedload, selectinload

def get_articles_with_author(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(Article)
        .options(
            joinedload(Article.author),
            selectinload(Article.comments)
        )
        .offset(skip)
        .limit(limit)
        .all()
    )
```

### Transaction Pattern

```python
from sqlalchemy.exc import SQLAlchemyError

def create_article_with_tags(db: Session, article_in: ArticleCreate):
    try:
        db_article = Article(**article_in.dict(exclude={'tags'}))
        db.add(db_article)
        db.flush()  # Get the ID without committing
        
        # Add tags
        if article_in.tags:
            for tag_id in article_in.tags:
                article_tag = ArticleTag(article_id=db_article.id, tag_id=tag_id)
                db.add(article_tag)
        
        db.commit()
        db.refresh(db_article)
        return db_article
    except SQLAlchemyError as e:
        db.rollback()
        app_logger.error(f"Error creating article: {e}")
        raise
```

## Security Patterns

### Password Hashing

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

### JWT Token Creation

```python
from jose import JWTError, jwt
from datetime import datetime, timedelta

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
```

### Authentication Dependency

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = crud.user.get(db, id=user_id)
    if user is None:
        raise credentials_exception
    return user
```

## Testing Patterns

### Test Configuration

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, engine, Base

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
```

### Endpoint Tests

```python
def test_create_article(client: TestClient, db: Session):
    # Create test user
    user = User(username="testuser", email="test@example.com", hashed_password="hash")
    db.add(user)
    db.commit()
    
    # Login to get token
    login_response = client.post("/api/v1/auth/login", data={
        "username": "testuser",
        "password": "testpass"
    })
    token = login_response.json()["access_token"]
    
    # Create article
    article_data = {
        "title": "Test Article",
        "content": "Test content",
        "is_published": True
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/v1/articles/", json=article_data, headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Article"
```

### CRUD Tests

```python
@pytest.mark.asyncio
async def test_create_article(db: Session):
    article_in = ArticleCreate(
        title="Test Article",
        content="Test content",
        author_id=1
    )
    article = crud.create_article(db, article=article_in)
    
    assert article.title == "Test Article"
    assert article.id is not None
    assert article.is_published is False

def test_get_article(db: Session):
    article_in = ArticleCreate(
        title="Test Article",
        content="Test content",
        author_id=1
    )
    created_article = crud.create_article(db, article=article_in)
    
    retrieved_article = crud.get_article(db, created_article.id)
    
    assert retrieved_article.id == created_article.id
    assert retrieved_article.title == "Test Article"
```

## Error Handling

### Custom Exception Classes

```python
class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, 404)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, 401)

class ForbiddenException(AppException):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(message, 403)
```

### Global Exception Handler

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )
```

## Logging

### Loguru Configuration

```python
from loguru import logger
import sys

def setup_logging():
    logger.remove()
    
    # Console logging
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level="INFO"
    )
    
    # File logging
    logger.add(
        "logs/app_{time:YYYY-MM-DD}.log",
        rotation="00:00",
        retention="30 days",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level="DEBUG"
    )

app_logger = logger
```

### Usage

```python
from app.utils.logger import app_logger

@app.post("/articles/")
def create_article(article_in: ArticleCreate, db: Session = Depends(get_db)):
    app_logger.info(f"Creating article: {article_in.title}")
    try:
        article = crud.create_article(db, article=article_in)
        app_logger.success(f"Article created with ID: {article.id}")
        return article
    except Exception as e:
        app_logger.error(f"Error creating article: {e}")
        raise
```

## File Naming Conventions

- Python modules: `snake_case.py` (e.g., `article.py`, `user.py`)
- Test files: `test_*.py` (e.g., `test_auth.py`, `test_articles.py`)
- API endpoints: `snake_case.py` in `endpoints/` directory
- Model files: `snake_case.py` matching entity names (e.g., `article.py`, `user.py`)
- Schema files: `snake_case.py` matching entity names (e.g., `article.py`, `user.py`)
- CRUD files: `snake_case.py` matching entity names (e.g., `article.py`, `user.py`)

## Best Practices

### Performance
- Use database indexes for frequently queried columns
- Implement pagination for list endpoints
- Use async/await for I/O operations
- Cache frequently accessed data
- Optimize database queries with proper joins and eager loading
- Use connection pooling

### Security
- Never log sensitive data (passwords, tokens)
- Validate all inputs with Pydantic schemas
- Use parameterized queries (SQLAlchemy handles this)
- Implement rate limiting
- Keep dependencies updated
- Use environment variables for secrets

### Code Quality
- Follow PEP 8 style guide
- Use type hints consistently
- Write descriptive docstrings
- Keep functions small and focused
- Use meaningful variable names
- Write tests for critical functionality
- Keep code DRY (Don't Repeat Yourself)

### API Design
- Use RESTful conventions
- Provide clear error messages
- Include proper HTTP status codes
- Version your API (e.g., /api/v1/)
- Document endpoints with docstrings
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
