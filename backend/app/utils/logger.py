import sys
import os
from datetime import datetime
from loguru import logger
from app.core.config import settings
import json
import traceback
from typing import Any, Dict


def setup_logger():
    """Configure and setup the logger with custom format and rotation."""
    # Remove default logger
    logger.remove()

    # Create logs directory if it doesn't exist
    log_dir = settings.LOG_DIR
    os.makedirs(log_dir, exist_ok=True)

    # Add custom logger with file rotation
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    )

    # Console logger - 使用 enqueue=True 异步化
    logger.add(
        sys.stdout,
        format=log_format,
        level="INFO" if not settings.DEBUG else "DEBUG",
        colorize=True,
        filter=lambda record: record["extra"].get("exclude_from_console", False) is False,
        enqueue=True  # 异步处理，避免阻塞
    )

    # Standard application log with rotation - 使用 enqueue=True 异步化
    logger.add(
        f"{log_dir}/app_{datetime.now().strftime('%Y%m%d')}.log",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} | {message}",
        level="INFO",
        rotation="10 MB",
        retention="30 days",
        compression="zip",
        serialize=False,
        enqueue=True  # 异步处理，避免阻塞
    )

    # Security-related logs - 使用 enqueue=True 异步化
    logger.add(
        f"{log_dir}/security_{datetime.now().strftime('%Y%m%d')}.log",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {extra[user_id]} | {extra[ip_address]} | {message}",
        level="INFO",
        rotation="10 MB",
        retention="90 days",
        compression="zip",
        filter=lambda record: record["extra"].get("security", False),
        enqueue=True  # 异步处理，避免阻塞
    )

    # Performance logs - 使用 enqueue=True 异步化
    logger.add(
        f"{log_dir}/performance_{datetime.now().strftime('%Y%m%d')}.log",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {extra[endpoint]} | {extra[duration]}ms | {extra[request_id]}",
        level="INFO",
        rotation="10 MB",
        retention="30 days",
        compression="zip",
        filter=lambda record: record["extra"].get("performance", False),
        enqueue=True  # 异步处理，避免阻塞
    )

    # Error file logger for critical issues - 使用 enqueue=True 异步化
    logger.add(
        f"{log_dir}/errors_{datetime.now().strftime('%Y%m%d')}.log",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} | {message} | {extra[traceback]}",
        level="ERROR",
        rotation="10 MB",
        retention="90 days",
        compression="zip",
        filter=lambda record: record["extra"].get("has_traceback", False),
        enqueue=True  # 异步处理，避免阻塞
    )

    return logger


# Initialize the logger
app_logger = setup_logger()


def log_security_event(event_type: str, user_id: str = "anonymous", ip_address: str = "unknown", details: Dict[str, Any] = None):
    """
    记录安全相关事件
    """
    app_logger.bind(
        security=True,
        user_id=user_id,
        ip_address=ip_address,
        event_type=event_type
    ).info(f"SECURITY EVENT: {event_type} | User: {user_id} | IP: {ip_address} | Details: {details}")


def log_performance(endpoint: str, duration_ms: float, request_id: str = None, user_id: str = None):
    """
    记录性能指标
    """
    app_logger.bind(
        performance=True,
        endpoint=endpoint,
        duration=duration_ms,
        request_id=request_id,
        user_id=user_id
    ).info(f"PERFORMANCE: {endpoint} took {duration_ms}ms")


def log_api_call(endpoint: str, method: str, status_code: int, user_id: str = None, ip_address: str = None, duration_ms: float = None):
    """
    记录API调用
    """
    extra_info = {
        "endpoint": f"{method} {endpoint}",
        "status_code": status_code,
        "user_id": user_id or "anonymous",
        "ip_address": ip_address or "unknown"
    }

    if duration_ms is not None:
        extra_info["duration_ms"] = duration_ms

    app_logger.info(f"API CALL: {method} {endpoint} | Status: {status_code} | User: {user_id or 'anonymous'}", **extra_info)


def log_error_with_traceback(error: Exception, context: str = ""):
    """
    记录带有完整堆栈跟踪的错误
    """
    tb_str = traceback.format_exception(type(error), error, error.__traceback__)
    app_logger.bind(traceback="".join(tb_str), has_traceback=True).error(f"ERROR in {context}: {str(error)}")


# Convenience functions
def get_logger(name: str = None):
    """Get logger instance with optional name."""
    if name:
        return app_logger.bind(name=name)
    return app_logger


__all__ = ["app_logger", "get_logger", "log_security_event", "log_performance", "log_api_call", "log_error_with_traceback"]