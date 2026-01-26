from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:123456@localhost:5432/my_awesome_blog"
    
    # Application
    APP_NAME: str = "My Awesome Blog"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    LOG_DIR: str = "logs"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000", "http://localhost:8989", "http://localhost:3001"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )
    
    def validate_secret_key(self) -> None:
        """Validate that SECRET_KEY is not the default value in production."""
        if not self.DEBUG and self.SECRET_KEY == "your-super-secret-key-change-this-in-production":
            raise ValueError(
                "SECRET_KEY must be changed from the default value in production. "
                "Set a strong, random SECRET_KEY in your environment variables."
            )


settings = Settings()
settings.validate_secret_key()