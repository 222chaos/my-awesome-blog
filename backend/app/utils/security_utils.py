"""安全相关的实用工具函数"""

import secrets
import string
from typing import Optional


def generate_secret_key(length: int = 32) -> str:
    """
    生成安全的随机密钥
    
    Args:
        length: 密钥长度，默认32位
        
    Returns:
        生成的安全密钥字符串
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_secure_password(length: int = 16) -> str:
    """
    生成安全密码
    
    Args:
        length: 密码长度，默认16位
        
    Returns:
        生成的安全密码
    """
    alphabet = (
        string.ascii_letters 
        + string.digits 
        + "!@#$%^&*()_+-=[]{}|;:,.<>?"
    )
    while True:
        password = ''.join(secrets.choice(alphabet) for _ in range(length))
        # 确保密码包含至少一个小写字母、大写字母和数字
        if (any(c.islower() for c in password)
                and any(c.isupper() for c in password)
                and any(c.isdigit() for c in password)):
            return password


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
    
    return True, None


if __name__ == "__main__":
    # 当作为脚本运行时，生成一个新的密钥
    print("Generated SECRET_KEY:", generate_secret_key(64))
    print("Generated secure password:", generate_secure_password())