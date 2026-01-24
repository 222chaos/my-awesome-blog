import sys
from datetime import datetime
from loguru import logger
from app.core.config import settings


def setup_logger():
    """Configure and setup the logger with custom format and rotation."""
    # Remove default logger
    logger.remove()
    
    # Add custom logger with file rotation
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    )
    
    # Console logger
    logger.add(
        sys.stdout,
        format=log_format,
        level="INFO" if not settings.DEBUG else "DEBUG",
        colorize=True,
    )
    
    # File logger with rotation
    logger.add(
        f"logs/app_{datetime.now().strftime('%Y%m%d')}.log",
        format=log_format,
        level="INFO",
        rotation="10 MB",
        retention="10 days",
        compression="zip"
    )
    
    # Error file logger for critical issues
    logger.add(
        f"logs/errors_{datetime.now().strftime('%Y%m%d')}.log",
        format=log_format,
        level="ERROR",
        rotation="10 MB",
        retention="30 days",
        compression="zip"
    )
    
    return logger


# Initialize the logger
app_logger = setup_logger()


# Convenience functions
def get_logger(name: str = None):
    """Get logger instance with optional name."""
    if name:
        return app_logger.bind(name=name)
    return app_logger


# Create logs directory if it doesn't exist
import os
os.makedirs("logs", exist_ok=True)


__all__ = ["app_logger", "get_logger"]