from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.schemas.error import ErrorResponse, create_error_response, ErrorCode
from app.utils.logger import app_logger
from app.utils.validation import handle_validation_error
from pydantic import ValidationError
from typing import Union
from app.core.config import settings
import traceback
import uuid


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    通用异常处理器
    生产环境不暴露详细错误信息，只记录到日志
    """
    # 生成唯一的错误ID以便追踪
    error_id = str(uuid.uuid4())

    # 根据 DEBUG 模式决定日志详细程度
    if settings.DEBUG:
        # 开发环境：记录完整堆栈
        app_logger.error(
            f"Error ID: {error_id} | Unhandled exception: {exc}\n"
            f"Path: {request.url} | Method: {request.method} | Client: {request.client.host if request.client else 'Unknown'}\n"
            f"Traceback: {traceback.format_exc()}"
        )
    else:
        # 生产环境：只记录摘要信息
        app_logger.error(
            f"Error ID: {error_id} | Exception: {type(exc).__name__}: {str(exc)[:200]} | "
            f"Path: {request.url} | Client: {request.client.host if request.client else 'Unknown'}"
        )

    # 根据错误类型提供不同的响应
    if isinstance(exc, ValidationError):
        # Pydantic验证错误
        return handle_validation_error(exc, f"验证失败 [ID: {error_id}]")
    elif isinstance(exc, IntegrityError):
        # 数据库完整性错误（如重复键等）
        app_logger.warning(f"Integrity error: {exc}")
        error_response = create_error_response(
            error_code=ErrorCode.DUPLICATE_RESOURCE,
            message=f"资源已存在或违反唯一约束 [ID: {error_id}]",
            details={
                "path": str(request.url),
                "method": request.method,
                "error_id": error_id
            }
        )
        return JSONResponse(status_code=409, content=error_response.model_dump())
    else:
        # 一般服务器错误
        error_response = create_error_response(
            error_code=ErrorCode.SERVER_ERROR,
            message=f"服务器内部错误，请联系管理员并提供错误ID: {error_id}",
            details={
                "path": str(request.url),
                "method": request.method,
                "error_id": error_id
            }
        )

        return JSONResponse(
            status_code=500,
            content=error_response.model_dump()
        )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """
    HTTP异常处理器
    """
    # 生成唯一的错误ID以便追踪
    error_id = str(uuid.uuid4())

    # 映射HTTP状态码到错误代码
    error_code_map = {
        400: ErrorCode.INVALID_INPUT,
        401: ErrorCode.UNAUTHORIZED,
        403: ErrorCode.FORBIDDEN,
        404: ErrorCode.RESOURCE_NOT_FOUND,
        409: ErrorCode.DUPLICATE_RESOURCE,
        422: ErrorCode.VALIDATION_ERROR
    }

    error_code = error_code_map.get(exc.status_code, ErrorCode.GENERAL_ERROR)

    app_logger.warning(f"Error ID: {error_id} | HTTP exception: {exc.status_code} - {exc.detail}")

    error_response = create_error_response(
        error_code=error_code,
        message=f"{exc.detail} [ID: {error_id}]",
        details={
            "path": str(request.url),
            "method": request.method,
            "error_id": error_id
        }
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump()
    )


async def validation_exception_handler(request: Request, exc: ValidationError) -> JSONResponse:
    """
    Pydantic验证异常处理器
    """
    error_id = str(uuid.uuid4())

    app_logger.warning(f"Error ID: {error_id} | Validation error: {exc}")

    return handle_validation_error(exc, f"输入验证失败 [ID: {error_id}]")


def add_exception_handlers(app):
    """
    为FastAPI应用添加异常处理器
    """
    app.add_exception_handler(Exception, general_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)  # 处理Starlette的HTTP异常
    app.add_exception_handler(ValidationError, validation_exception_handler)  # 处理Pydantic验证异常