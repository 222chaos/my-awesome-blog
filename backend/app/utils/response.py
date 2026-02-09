"""
统一API响应模型
提供一致的API响应格式，提升前端开发效率和用户体验
"""

from typing import Generic, TypeVar, Optional, List, Any
from pydantic import BaseModel, Field
from datetime import datetime

# 泛型类型变量
T = TypeVar('T')


class ResponseModel(BaseModel, Generic[T]):
    """
    统一的API响应模型

    使用示例:
        # 成功响应
        ResponseModel[data=User](success=True, message="User created", data=user_obj)

        # 列表响应
        ResponseModel[List[Article]](success=True, message="Articles retrieved", data=[article1, article2])

        # 无数据响应
        ResponseModel[None](success=True, message="Operation completed", data=None)
    """
    success: bool = Field(..., description="请求是否成功")
    message: str = Field(..., description="响应消息")
    data: Optional[T] = Field(None, description="响应数据")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="响应时间戳")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "操作成功",
                "data": {},
                "timestamp": "2026-01-01T00:00:00.000Z"
            }
        }


class PaginatedResponseModel(BaseModel, Generic[T]):
    """
    分页响应模型

    使用示例:
        PaginatedResponseModel[Article](
            success=True,
            message="Articles retrieved",
            data=[article1, article2],
            total=100,
            page=1,
            page_size=20,
            total_pages=5
        )
    """
    success: bool = Field(..., description="请求是否成功")
    message: str = Field(..., description="响应消息")
    data: List[T] = Field(..., description="数据列表")
    total: int = Field(..., description="总记录数")
    page: int = Field(..., description="当前页码")
    page_size: int = Field(..., description="每页记录数")
    total_pages: int = Field(..., description="总页数")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="响应时间戳")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "数据获取成功",
                "data": [],
                "total": 100,
                "page": 1,
                "page_size": 20,
                "total_pages": 5,
                "timestamp": "2026-01-01T00:00:00.000Z"
            }
        }


class ErrorResponseModel(BaseModel):
    """
    错误响应模型

    使用示例:
        ErrorResponseModel(
            success=False,
            error_code="VALIDATION_ERROR",
            message="Validation failed",
            details={"field": "email", "error": "Invalid email format"}
        )
    """
    success: bool = Field(default=False, description="请求是否成功")
    error_code: str = Field(..., description="错误代码")
    message: str = Field(..., description="错误消息")
    details: Optional[dict] = Field(None, description="错误详情")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="响应时间戳")

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error_code": "VALIDATION_ERROR",
                "message": "请求参数验证失败",
                "details": {
                    "field": "email",
                    "error": "Invalid email format"
                },
                "timestamp": "2026-01-01T00:00:00.000Z"
            }
        }


# 便捷函数：创建成功响应
def success_response(
    data: Any = None,
    message: str = "操作成功"
) -> ResponseModel:
    """
    创建成功响应

    Args:
        data: 响应数据
        message: 响应消息

    Returns:
        ResponseModel实例
    """
    return ResponseModel(success=True, message=message, data=data)


def success_list_response(
    data: List[Any],
    total: int,
    page: int = 1,
    page_size: int = 20,
    message: str = "数据获取成功"
) -> PaginatedResponseModel:
    """
    创建分页成功响应

    Args:
        data: 数据列表
        total: 总记录数
        page: 当前页码
        page_size: 每页记录数
        message: 响应消息

    Returns:
        PaginatedResponseModel实例
    """
    total_pages = (total + page_size - 1) // page_size
    return PaginatedResponseModel(
        success=True,
        message=message,
        data=data,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


def error_response(
    error_code: str,
    message: str,
    details: Optional[dict] = None
) -> ErrorResponseModel:
    """
    创建错误响应

    Args:
        error_code: 错误代码
        message: 错误消息
        details: 错误详情

    Returns:
        ErrorResponseModel实例
    """
    return ErrorResponseModel(
        success=False,
        error_code=error_code,
        message=message,
        details=details
    )


def validation_error_response(
    details: dict,
    message: str = "请求参数验证失败"
) -> ErrorResponseModel:
    """
    创建验证错误响应

    Args:
        details: 验证错误详情
        message: 错误消息

    Returns:
        ErrorResponseModel实例
    """
    return ErrorResponseModel(
        success=False,
        error_code="VALIDATION_ERROR",
        message=message,
        details=details
    )


def not_found_response(
    resource_type: str = "资源",
    resource_id: Any = None
) -> ErrorResponseModel:
    """
    创建未找到响应

    Args:
        resource_type: 资源类型（如"用户"、"文章"）
        resource_id: 资源ID

    Returns:
        ErrorResponseModel实例
    """
    message = f"{resource_type}不存在"
    if resource_id:
        message = f"{resource_type} '{resource_id}' 不存在"
    return ErrorResponseModel(
        success=False,
        error_code="NOT_FOUND",
        message=message,
        details={"resource_type": resource_type, "resource_id": str(resource_id) if resource_id else None}
    )


def unauthorized_response(
    message: str = "未授权访问"
) -> ErrorResponseModel:
    """
    创建未授权响应

    Args:
        message: 错误消息

    Returns:
        ErrorResponseModel实例
    """
    return ErrorResponseModel(
        success=False,
        error_code="UNAUTHORIZED",
        message=message
    )


def forbidden_response(
    message: str = "权限不足"
) -> ErrorResponseModel:
    """
    创建禁止访问响应

    Args:
        message: 错误消息

    Returns:
        ErrorResponseModel实例
    """
    return ErrorResponseModel(
        success=False,
        error_code="FORBIDDEN",
        message=message
    )


def server_error_response(
    message: str = "服务器内部错误"
) -> ErrorResponseModel:
    """
    创建服务器错误响应

    Args:
        message: 错误消息

    Returns:
        ErrorResponseModel实例
    """
    return ErrorResponseModel(
        success=False,
        error_code="SERVER_ERROR",
        message=message
    )


__all__ = [
    "ResponseModel",
    "PaginatedResponseModel",
    "ErrorResponseModel",
    "success_response",
    "success_list_response",
    "error_response",
    "validation_error_response",
    "not_found_response",
    "unauthorized_response",
    "forbidden_response",
    "server_error_response"
]
