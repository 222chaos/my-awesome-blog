from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None  # user id
    username: Optional[str] = None
    exp: Optional[int] = None  # expiration timestamp


class LoginRequest(BaseModel):
    username: str
    password: str