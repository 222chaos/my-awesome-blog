import sys
import os
# 添加backend目录到Python路径，以便可以直接运行此文件
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings
from app.utils.logger import app_logger
from app.utils.middleware import RequestLoggingMiddleware
from app.core.exception_handler import add_exception_handlers
from app.services.cache_service import cache_service

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add custom middleware for request logging
app.add_middleware(RequestLoggingMiddleware)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Add exception handlers
add_exception_handlers(app)


@app.on_event("startup")
async def startup_event():
    app_logger.info("Connecting to Redis...")
    await cache_service.connect()
    app_logger.info("Application startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    app_logger.info("Closing Redis connection...")
    await cache_service.close()
    app_logger.info("Application shutdown complete")

# Health check endpoint
@app.get("/health")
async def health_check():
    app_logger.info("Health check endpoint accessed")
    return {"status": "healthy", "service": settings.APP_NAME}


@app.get("/")
async def root():
    app_logger.info("Root endpoint accessed")
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "openapi": "/api/v1/openapi.json"
    }


# 如果直接运行此文件，则启动服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8989,
        reload=False,
        workers=1
    )