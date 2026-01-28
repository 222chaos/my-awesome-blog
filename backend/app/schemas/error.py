from pydantic import BaseModel
from typing import Optional, Dict, Any
from enum import Enum


class ErrorCode(str, Enum):
    """定义标准错误代码"""
    GENERAL_ERROR = "GENERAL_ERROR"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE"
    INVALID_INPUT = "INVALID_INPUT"
    SERVER_ERROR = "SERVER_ERROR"


class ErrorResponse(BaseModel):
    """标准错误响应模型"""
    success: bool = False
    error: str
    error_code: ErrorCode
    message: str
    details: Optional[Dict[str, Any]] = None

    class Config:
        use_enum_values = True


def create_error_response(
    error_code: ErrorCode,
    message: str,
    details: Optional[Dict[str, Any]] = None
) -> ErrorResponse:
    """创建错误响应的辅助函数"""
    return ErrorResponse(
        error=error_code.value,
        error_code=error_code,
        message=message,
        details=details
    )