"""
请求大小限制中间件
防止客户端发送超大请求体导致内存溢出
"""

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from typing import Callable
from app.core.config import settings
from app.utils.logger import app_logger


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """
    请求大小限制中间件
    检查Content-Length并拒绝超过MAX_CONTENT_LENGTH的请求
    """

    def __init__(
        self,
        app: ASGIApp,
        max_content_length: int = None,
        enforce_content_length: bool = True
    ):
        super().__init__(app)
        self.max_content_length = max_content_length or settings.MAX_CONTENT_LENGTH
        self.enforce_content_length = enforce_content_length

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # 检查Content-Length头
        content_length = request.headers.get("content-length")

        if content_length and self.enforce_content_length:
            try:
                content_length_int = int(content_length)
                if content_length_int > self.max_content_length:
                    app_logger.warning(
                        f"Request rejected: Content-Length {content_length_int} exceeds limit {self.max_content_length}. "
                        f"Path: {request.url.path}, Method: {request.method}, Client: {request.client.host if request.client else 'Unknown'}"
                    )
                    return JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content={
                            "detail": f"请求体过大，最大允许 {self.max_content_length // (1024 * 1024)} MB",
                            "error_code": "REQUEST_TOO_LARGE"
                        }
                    )
            except (ValueError, TypeError) as e:
                app_logger.warning(
                    f"Invalid Content-Length header: {content_length}. "
                    f"Path: {request.url.path}, Error: {str(e)}"
                )

        # 调用下一个中间件/路由处理器
        response = await call_next(request)

        return response


class RequestSizeEnforcerMiddleware(BaseHTTPMiddleware):
    """
    请求大小强制执行中间件
    对于没有Content-Length头的请求，在实际读取请求体时进行限制
    """

    def __init__(
        self,
        app: ASGIApp,
        max_content_length: int = None
    ):
        super().__init__(app)
        self.max_content_length = max_content_length or settings.MAX_CONTENT_LENGTH

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # 对于有请求体的请求，限制读取的大小
        if request.method in ("POST", "PUT", "PATCH"):
            try:
                # 读取请求体，但限制大小
                body = await request.body()
                body_size = len(body)

                if body_size > self.max_content_length:
                    app_logger.warning(
                        f"Request body too large: {body_size} bytes > {self.max_content_length} bytes. "
                        f"Path: {request.url.path}, Method: {request.method}, Client: {request.client.host if request.client else 'Unknown'}"
                    )
                    return JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content={
                            "detail": f"请求体过大，最大允许 {self.max_content_length // (1024 * 1024)} MB",
                            "error_code": "REQUEST_BODY_TOO_LARGE"
                        }
                    )
            except Exception as e:
                app_logger.error(f"Error reading request body: {str(e)}")
                # 如果读取失败，继续让后续处理程序处理
                pass

        response = await call_next(request)
        return response


# 便捷函数：创建默认的请求大小限制中间件
def create_request_size_limit_middleware(
    max_content_length: int = None,
    enforce_content_length: bool = True
) -> RequestSizeLimitMiddleware:
    """
    创建请求大小限制中间件

    Args:
        max_content_length: 最大内容长度（字节），如果为None则使用settings.MAX_CONTENT_LENGTH
        enforce_content_length: 是否强制执行Content-Length检查

    Returns:
        RequestSizeLimitMiddleware实例
    """
    return RequestSizeLimitMiddleware(
        max_content_length=max_content_length,
        enforce_content_length=enforce_content_length
    )


__all__ = [
    "RequestSizeLimitMiddleware",
    "RequestSizeEnforcerMiddleware",
    "create_request_size_limit_middleware"
]
