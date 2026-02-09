"""输入验证工具函数"""

from typing import Optional
from pydantic import ValidationError
from fastapi import HTTPException, status
import re


def validate_email(email: str) -> bool:
    """
    验证邮箱格式
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password_strength(password: str, min_length: int = 8) -> tuple[bool, Optional[str]]:
    """
    验证密码强度
    
    Args:
        password: 待验证的密码
        min_length: 最小长度要求
        
    Returns:
        (是否有效, 错误信息)
    """
    if len(password) < min_length:
        return False, f"密码长度至少需要{min_length}个字符"
    
    if not any(c.islower() for c in password):
        return False, "密码必须包含至少一个小写字母"
    
    if not any(c.isupper() for c in password):
        return False, "密码必须包含至少一个大写字母"
    
    if not any(c.isdigit() for c in password):
        return False, "密码必须包含至少一个数字"
    
    # 检查是否包含特殊字符
    special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if not any(c in special_chars for c in password):
        return False, f"密码必须包含至少一个特殊字符 ({special_chars})"
    
    return True, None


def validate_username(username: str) -> tuple[bool, Optional[str]]:
    """
    验证用户名格式
    
    Args:
        username: 待验证的用户名
        
    Returns:
        (是否有效, 错误信息)
    """
    if len(username) < 3:
        return False, "用户名长度至少需要3个字符"
    
    if len(username) > 50:
        return False, "用户名长度不能超过50个字符"
    
    # 用户名只能包含字母、数字、下划线和连字符
    pattern = r'^[a-zA-Z0-9_-]+$'
    if not re.match(pattern, username):
        return False, "用户名只能包含字母、数字、下划线和连字符"
    
    return True, None


def validate_slug(slug: str) -> tuple[bool, Optional[str]]:
    """
    验证slug格式
    
    Args:
        slug: 待验证的slug
        
    Returns:
        (是否有效, 错误信息)
    """
    if len(slug) < 3:
        return False, "Slug长度至少需要3个字符"
    
    if len(slug) > 200:
        return False, "Slug长度不能超过200个字符"
    
    # Slug只能包含字母、数字、连字符和下划线
    pattern = r'^[a-z0-9_-]+$'
    if not re.match(pattern, slug):
        return False, "Slug只能包含小写字母、数字、连字符和下划线"
    
    return True, None


def validate_url(url: str) -> bool:
    """
    验证URL格式
    """
    pattern = r'^https?://(?:[-\w.])+(?:\:[0-9]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$'
    return re.match(pattern, url) is not None


def handle_validation_error(exc: ValidationError, detail: str = "输入验证失败"):
    """
    处理验证错误
    """
    errors = []
    for error in exc.errors():
        field = ".".join(error['loc']) if isinstance(error['loc'], tuple) else str(error['loc'])
        msg = error['msg']
        errors.append(f"字段 '{field}' {msg}")
    
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=f"{detail}: {'; '.join(errors)}"
    )


def sanitize_input(text: str, max_length: int = 1000) -> str:
    """
    清理输入文本，移除潜在的恶意内容
    """
    if text is None:
        return ""
    
    # 截断超长文本
    if len(text) > max_length:
        text = text[:max_length]
    
    # 移除潜在的HTML标签（简单版本，实际应用中可能需要更复杂的清理）
    import html
    text = html.escape(text)
    
    # 移除控制字符
    text = "".join(ch for ch in text if ord(ch) >= 32 or ord(ch) in (9, 10, 13))
    
    return text


def validate_content_length(content: str, min_length: int = 1, max_length: int = 10000) -> tuple[bool, Optional[str]]:
    """
    验证内容长度
    
    Args:
        content: 待验证的内容
        min_length: 最小长度
        max_length: 最大长度
        
    Returns:
        (是否有效, 错误信息)
    """
    if len(content) < min_length:
        return False, f"内容长度至少需要{min_length}个字符"
    
    if len(content) > max_length:
        return False, f"内容长度不能超过{max_length}个字符"
    
    return True, None


def validate_integer_range(value: int, min_val: int, max_val: int) -> tuple[bool, Optional[str]]:
    """
    验证整数值范围
    
    Args:
        value: 待验证的整数
        min_val: 最小值
        max_val: 最大值
        
    Returns:
        (是否有效, 错误信息)
    """
    if value < min_val:
        return False, f"值不能小于{min_val}"
    
    if value > max_val:
        return False, f"值不能大于{max_val}"
    
    return True, None