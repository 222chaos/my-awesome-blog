"""速率限制中间件和配置"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI, Request, HTTPException
from app.core.config import settings
from app.utils.logger import app_logger


# 创建限速器实例
limiter = Limiter(
    key_func=get_remote_address,  # 使用IP地址作为限速键
    default_limits=["1000 per hour"]  # 默认限制：每小时1000次请求
)


async def _rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """处理速率限制超出异常"""
    return HTTPException(
        status_code=429,
        detail="请求过于频繁，请稍后再试"
    )


def add_rate_limit_middleware(app: FastAPI):
    """为应用添加速率限制中间件"""
    # 注册限速器
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    
    # 添加自定义中间件来记录限速事件
    @app.middleware("http")
    async def rate_limit_middleware(request: Request, call_next):
        # 记录请求信息
        client_ip = get_remote_address(request)
        path = request.url.path
        method = request.method
        
        app_logger.info(f"Rate limit check for IP: {client_ip}, Path: {path}, Method: {method}")
        
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            app_logger.error(f"Rate limit middleware error: {str(e)}")
            raise


def get_rate_limit_for_endpoint(endpoint_name: str) -> str:
    """
    根据端点名称获取相应的速率限制
    """
    # 定义不同端点的速率限制策略
    rate_limits = {
        "login": "5 per minute",  # 登录接口限制较严格
        "register": "3 per minute",  # 注册接口限制较严格
        "forgot_password": "3 per minute",  # 忘记密码接口限制较严格
        "reset_password": "3 per minute",  # 重置密码接口限制较严格
        "contact": "10 per hour",  # 联系我们接口限制
        "comment": "10 per hour",  # 评论接口限制
        "article_create": "20 per hour",  # 文章创建接口限制
        "default": "100 per hour"  # 默认限制
    }
    
    return rate_limits.get(endpoint_name, rate_limits["default"])


# 预定义的速率限制装饰器
login_rate_limit = limiter.limit(get_rate_limit_for_endpoint("login"))
register_rate_limit = limiter.limit(get_rate_limit_for_endpoint("register"))
article_read_rate_limit = limiter.limit(get_rate_limit_for_endpoint("default"))
article_create_rate_limit = limiter.limit(get_rate_limit_for_endpoint("article_create"))
comment_rate_limit = limiter.limit(get_rate_limit_for_endpoint("comment"))