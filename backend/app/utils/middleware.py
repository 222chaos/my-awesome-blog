import uuid
import time
from typing import Callable
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from loguru import logger
import traceback


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging requests with request ID tracking."""
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Generate a unique request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Log request start
        start_time = time.time()
        logger.info(f"Request ID: {request_id} | {request.method} {request.url.path}")
        
        try:
            # Process the request
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log successful response
            logger.info(
                f"Request ID: {request_id} | "
                f"Status: {response.status_code} | "
                f"Duration: {process_time:.4f}s | "
                f"Path: {request.url.path}"
            )
            
            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
            
        except StarletteHTTPException as exc:
            # Handle HTTP exceptions
            process_time = time.time() - start_time
            logger.warning(
                f"Request ID: {request_id} | "
                f"HTTP Exception: {exc.status_code} | "
                f"Duration: {process_time:.4f}s | "
                f"Path: {request.url.path}"
            )
            
            return JSONResponse(
                status_code=exc.status_code,
                content={"detail": exc.detail},
                headers={"X-Request-ID": request_id}
            )
        
        except Exception as exc:
            # Handle unexpected exceptions
            process_time = time.time() - start_time
            logger.error(
                f"Request ID: {request_id} | "
                f"Unexpected Error: {str(exc)} | "
                f"Duration: {process_time:.4f}s | "
                f"Path: {request.url.path} | "
                f"Traceback: {traceback.format_exc()}"
            )
            
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal server error",
                    "request_id": request_id
                },
                headers={"X-Request-ID": request_id}
            )


class RequestIDFilter:
    """Filter to add request ID to log records."""
    
    def __init__(self):
        self.current_request_id = None

    def filter_record(self, record):
        """Add request ID to log record if available in request state."""
        # This would be used when integrating with the request context
        record['extra']['request_id'] = getattr(self, 'current_request_id', 'N/A')
        return True


def get_request_id(request: Request) -> str:
    """Helper function to get request ID from request state."""
    return getattr(request.state, 'request_id', 'unknown')


__all__ = ["RequestLoggingMiddleware", "get_request_id"]