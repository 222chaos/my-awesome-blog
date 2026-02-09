"""API文档增强工具"""

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from typing import Dict, Any


def enhance_openapi(app: FastAPI) -> Dict[str, Any]:
    """
    增强API文档，添加额外的元数据和描述
    """
    if app.openapi_schema:
        return app.openapi_schema

    # 生成默认的OpenAPI模式
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        openapi_version=app.openapi_version,
        description=app.description,
        terms_of_service=app.terms_of_service,
        contact=app.contact,
        license_info=app.license_info,
        routes=app.routes,
        tags=app.openapi_tags,
        servers=app.servers,
    )

    # 添加额外的服务器信息
    openapi_schema["servers"] = [
        {
            "url": "https://api.myawesomeblog.com",
            "description": "Production server"
        },
        {
            "url": "https://staging-api.myawesomeblog.com",
            "description": "Staging server"
        },
        {
            "url": "http://localhost:8000",
            "description": "Development server"
        }
    ]

    # 为所有路径添加额外的描述和标签
    for path, methods in openapi_schema["paths"].items():
        for method, details in methods.items():
            # 添加安全要求说明
            details["security"] = [
                {
                    "OAuth2PasswordBearer": []
                }
            ]
            
            # 添加性能和缓存说明
            details["x-performance-tips"] = "This endpoint is optimized with caching and connection pooling."
            details["x-cache-info"] = "Response is cached for 30 minutes for authenticated users."

    # 添加全局安全定义
    if "components" not in openapi_schema:
        openapi_schema["components"] = {}

    if "securitySchemes" not in openapi_schema["components"]:
        openapi_schema["components"]["securitySchemes"] = {}

    openapi_schema["components"]["securitySchemes"]["OAuth2PasswordBearer"] = {
        "type": "oauth2",
        "flows": {
            "password": {
                "tokenUrl": "/api/v1/auth/login",
                "scopes": {
                    "read:users": "Read user information",
                    "write:users": "Modify user information",
                    "read:articles": "Read articles",
                    "write:articles": "Write articles"
                }
            }
        }
    }

    # 添加扩展信息
    openapi_schema["info"]["x-logo"] = {
        "url": "https://myawesomeblog.com/logo.png"
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema


def customize_openapi(app: FastAPI):
    """
    自定义API文档
    """
    def custom_openapi():
        return enhance_openapi(app)
    
    app.openapi = custom_openapi