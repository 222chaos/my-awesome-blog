from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.core.security import pwd_context
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def get_password_hash(password: str) -> str:
    # Truncate password if it exceeds bcrypt's 72-byte limit
    # Convert to bytes to properly measure length considering multi-byte characters
    if len(password.encode('utf-8')) > 72:
        # Truncate to 71 bytes to stay under the limit, preserving UTF-8 encoding
        truncated = password.encode('utf-8')[:71].decode('utf-8', errors='ignore')
        return pwd_context.hash(truncated)
    return pwd_context.hash(password)


def get_user(db: Session, user_id: UUID) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        avatar=user.avatar,
        bio=user.bio,
        website=user.website,
        twitter=user.twitter,
        github=user.github,
        linkedin=user.linkedin,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: UUID, user_update: UserUpdate) -> Optional[User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Handle password update
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: UUID) -> bool:
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True


from app.core.security import verify_password

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, str(user.hashed_password)):
        return None
    return user