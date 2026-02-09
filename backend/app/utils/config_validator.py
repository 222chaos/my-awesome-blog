"""环境配置验证工具"""

import os
import sys
from typing import List
from app.core.config import settings
from app.utils.logger import app_logger


def validate_environment() -> List[str]:
    """
    验证环境配置，返回错误列表
    """
    errors = []
    
    # 检查必要的环境变量
    required_vars = [
        'DATABASE_URL',
        'SECRET_KEY',
    ]
    
    for var in required_vars:
        value = getattr(settings, var, None)
        if not value:
            errors.append(f"Missing required environment variable: {var}")
        elif var == 'SECRET_KEY' and value == "0000000000000000000000000000000000000000000000000000000000000000":
            errors.append(f"Using default SECRET_KEY. Please set a secure SECRET_KEY in environment variables.")
    
    # 检查数据库URL格式
    if settings.DATABASE_URL and not settings.DATABASE_URL.startswith(('postgresql://', 'sqlite://')):
        errors.append("DATABASE_URL must start with 'postgresql://' or 'sqlite://'")
    
    # 检查Redis配置
    if not settings.REDIS_HOST:
        errors.append("REDIS_HOST is not set")
    
    # 检查敏感信息不应在开发环境中硬编码
    if settings.DEBUG:
        if '123456' in settings.DATABASE_URL:
            errors.append("Using default database password in DEBUG mode. Change this for production.")
    
    return errors


def validate_production_settings() -> List[str]:
    """
    验证生产环境设置，返回警告列表
    """
    warnings = []
    
    if settings.DEBUG:
        warnings.append("DEBUG mode is enabled. This should be disabled in production.")
    
    if settings.SECRET_KEY == "0000000000000000000000000000000000000000000000000000000000000000":
        warnings.append("Using default SECRET_KEY in production is insecure.")
    
    if "localhost" in settings.BACKEND_CORS_ORIGINS or "*" in settings.BACKEND_CORS_ORIGINS:
        warnings.append("CORS settings allow localhost or wildcard origins. Restrict these in production.")
    
    if not settings.EMAIL_ENABLED:
        warnings.append("Email functionality is disabled. Enable this for production notifications.")
    
    return warnings


def check_system_resources() -> List[str]:
    """
    检查系统资源，返回警告列表
    """
    import psutil
    import platform
    warnings = []

    # 检查内存使用情况
    memory = psutil.virtual_memory()
    if memory.percent > 80:
        warnings.append(f"High memory usage: {memory.percent}%")

    # 检查磁盘空间 - 处理跨平台路径
    try:
        if platform.system() == 'Windows':
            # Windows使用当前驱动器
            disk = psutil.disk_usage(os.getenv('SystemDrive', 'C:\\'))
        else:
            # Unix-like系统使用根目录
            disk = psutil.disk_usage('/')
        disk_percent = (disk.used / disk.total) * 100
        if disk_percent > 80:
            warnings.append(f"High disk usage: {disk_percent:.1f}%")
    except Exception:
        # 如果检查磁盘空间失败，忽略这个检查
        pass

    # 检查CPU使用情况
    cpu_percent = psutil.cpu_percent(interval=1)
    if cpu_percent > 80:
        warnings.append(f"High CPU usage: {cpu_percent}%")

    return warnings


def validate_and_log_config():
    """
    验证配置并在启动时记录重要信息
    """
    # 验证环境配置
    errors = validate_environment()
    if errors:
        for error in errors:
            app_logger.error(f"Configuration error: {error}")
        # 如果有严重错误，可以选择退出
        # sys.exit(1)  # 取消注释以在配置错误时退出
    
    # 检查生产环境设置
    if not settings.DEBUG:  # 只在生产环境中检查
        prod_warnings = validate_production_settings()
        for warning in prod_warnings:
            app_logger.warning(f"Production configuration warning: {warning}")
    
    # 检查系统资源
    resource_warnings = check_system_resources()
    for warning in resource_warnings:
        app_logger.warning(f"Resource warning: {warning}")
    
    # 记录重要的配置信息
    app_logger.info(f"Application started with configuration:")
    app_logger.info(f"- App Name: {settings.APP_NAME}")
    app_logger.info(f"- App Version: {settings.APP_VERSION}")
    app_logger.info(f"- Debug Mode: {settings.DEBUG}")
    app_logger.info(f"- Database: {'PostgreSQL' if 'postgresql' in settings.DATABASE_URL.lower() else 'SQLite'}")
    app_logger.info(f"- CORS Origins: {settings.BACKEND_CORS_ORIGINS}")
    app_logger.info(f"- Redis Host: {settings.REDIS_HOST}")
    app_logger.info(f"- Email Enabled: {settings.EMAIL_ENABLED}")
    
    if settings.EMAIL_ENABLED:
        app_logger.info(f"- SMTP Host: {settings.SMTP_HOST}")
        app_logger.info(f"- From Email: {settings.SMTP_FROM}")


if __name__ == "__main__":
    # 当直接运行此脚本时，执行配置验证
    validate_and_log_config()