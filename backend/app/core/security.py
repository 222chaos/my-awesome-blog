from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Truncate password if it exceeds bcrypt's 72-byte limit
    # Convert to bytes to properly measure length considering multi-byte characters
    if len(plain_password.encode('utf-8')) > 72:
        # Truncate to 71 bytes to stay under the limit, preserving UTF-8 encoding
        truncated = plain_password.encode('utf-8')[:71].decode('utf-8', errors='ignore')
        return pwd_context.verify(truncated, hashed_password)
    return pwd_context.verify(plain_password, hashed_password)