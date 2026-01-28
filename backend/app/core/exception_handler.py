from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from app.schemas.error import ErrorResponse, create_error_response, ErrorCode
from app.utils.logger import app_logger
from typing import Union
import traceback


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    通用异常处理器
    """
    app_logger.error(f"Unhandled exception: {exc}\nTraceback: {traceback.format_exc()}")
    
    error_response = create_error_response(
        error_code=ErrorCode.SERVER_ERROR,
        message="服务器内部错误",
        details={
            "path": str(request.url),
            "method": request.method
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
    # 映射HTTP状态码到错误代码
    error_code_map = {
        400: ErrorCode.INVALID_INPUT,
        401: ErrorCode.UNAUTHORIZED,
        403: ErrorCode.FORBIDDEN,
        404: ErrorCode.RESOURCE_NOT_FOUND,
        422: ErrorCode.VALIDATION_ERROR
    }
    
    error_code = error_code_map.get(exc.status_code, ErrorCode.GENERAL_ERROR)
    
    app_logger.warning(f"HTTP exception: {exc.status_code} - {exc.detail}")
    
    error_response = create_error_response(
        error_code=error_code,
        message=exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump()
    )


def add_exception_handlers(app):
    """
    为FastAPI应用添加异常处理器
    """
    app.add_exception_handler(Exception, general_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)