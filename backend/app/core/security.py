from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from app.core.config import settings


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
        try:
            return bcrypt.checkpw(truncated.encode('utf-8'), hashed_password.encode('utf-8'))
        except ValueError:
            # If truncation still causes an issue, return False
            return False
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except ValueError:
        # If verification fails due to password length, return False
        return False


def get_password_hash(password: str) -> str:
    # Truncate password if it exceeds bcrypt's 72-byte limit
    # Convert to bytes to properly measure length considering multi-byte characters
    if len(password.encode('utf-8')) > 72:
        # Truncate to 71 bytes to stay under the limit, preserving UTF-8 encoding
        truncated = password.encode('utf-8')[:71].decode('utf-8', errors='ignore')
        return bcrypt.hashpw(truncated.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')