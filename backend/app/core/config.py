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
    STATIC_FILES_DIR: str = "static"
    
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
    BACKEND_CORS_ORIGINS: List[str] = ["*","http://localhost:3000", "http://localhost:8000", "http://localhost:8989", "http://localhost:3001"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )
    
    def validate_required_fields(self) -> None:
        """Validate that required fields are properly set."""
        if not self.SECRET_KEY or self.SECRET_KEY == "your-super-secret-key-change-this-in-production":
            if self.DEBUG:
                print("WARNING: Using default SECRET_KEY. Change this for production!")
            else:
                raise ValueError(
                    "SECRET_KEY must be set to a strong, random value in production. "
                    "Set a strong, random SECRET_KEY in your environment variables."
                )
        
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL must be set in environment variables.")
        
        if not self.REDIS_HOST:
            raise ValueError("REDIS_HOST must be set in environment variables.")
        
        if not self.SMTP_HOST and self.EMAIL_ENABLED:
            print("WARNING: SMTP_HOST is not set but EMAIL_ENABLED is True. Email functionality will be disabled.")
        
        if not self.SMTP_USERNAME or not self.SMTP_PASSWORD:
            if self.EMAIL_ENABLED:
                print("WARNING: SMTP credentials are not set. Email functionality will be disabled.")

    # Add these new fields to the Settings class
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM: Optional[str] = None
    EMAIL_ENABLED: bool = False
    FRONTEND_URL: str = "http://localhost:3000"


settings = Settings()
settings.validate_required_fields()