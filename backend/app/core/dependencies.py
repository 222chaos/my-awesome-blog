from typing import Optional
from uuid import UUID
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
from app.core import security
from app.core.database import get_db
from app import crud
import app.models  # Import all models to ensure proper initialization
from app.models.user import User
from app.services.cache_service import cache_service
from app.utils.logger import app_logger

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # 检查令牌是否在黑名单中
    try:
        is_blacklisted = await cache_service.exists(f"blacklist:token:{token}")
        if is_blacklisted:
            app_logger.warning(f"Attempt to use blacklisted token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        # 如果缓存服务出错，记录但不阻止认证（降级处理）
        app_logger.error(f"Error checking token blacklist: {str(e)}")
    
    try:
        payload = security.verify_token(token)
        if payload is None:
            raise credentials_exception
        
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user(db, user_id=UUID(user_id))
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


async def get_current_superuser(
    current_user: User = Depends(get_current_active_user)
) -> User:
    if not current_user.is_superuser:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user