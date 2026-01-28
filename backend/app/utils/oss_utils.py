"""
OSS工具函数模块
提供常用的OSS操作辅助函数
"""

import os
import mimetypes
from typing import Optional, Dict, Any
from pathlib import Path
from urllib.parse import urlparse

from app.services.oss_service import oss_service
from app.utils.logger import app_logger


def get_file_info(file_path: str) -> Dict[str, Any]:
    """
    获取文件信息
    :param file_path: 本地文件路径
    :return: 包含文件信息的字典
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    stat = os.stat(file_path)
    mime_type, _ = mimetypes.guess_type(file_path)
    
    return {
        'size': stat.st_size,
        'mime_type': mime_type or 'application/octet-stream',
        'extension': Path(file_path).suffix.lower(),
        'name': os.path.basename(file_path)
    }


def validate_file_type(file_path: str, allowed_extensions: list) -> bool:
    """
    验证文件类型是否允许
    :param file_path: 文件路径
    :param allowed_extensions: 允许的扩展名列表，例如 ['.jpg', '.png']
    :return: 是否允许
    """
    file_ext = Path(file_path).suffix.lower()
    return file_ext in allowed_extensions


def upload_local_file_to_oss(local_file_path: str, oss_folder: str = "uploads", oss_filename: Optional[str] = None) -> Optional[str]:
    """
    上传本地文件到OSS
    :param local_file_path: 本地文件路径
    :param oss_folder: OSS中的文件夹路径
    :param oss_filename: 自定义的OSS文件名，如果不提供则使用本地文件名
    :return: 上传成功后的文件URL，失败则返回None
    """
    try:
        # 获取文件信息
        file_info = get_file_info(local_file_path)
        
        # 读取文件内容
        with open(local_file_path, 'rb') as f:
            file_data = f.read()
        
        # 使用自定义文件名或原文件名
        filename = oss_filename or file_info['name']
        
        # 上传到OSS
        file_url = oss_service.upload_file(
            file_data=file_data,
            file_name=filename,
            folder=oss_folder
        )
        
        if file_url:
            app_logger.info(f"Successfully uploaded {local_file_path} to OSS: {file_url}")
        else:
            app_logger.error(f"Failed to upload {local_file_path} to OSS")
        
        return file_url
        
    except Exception as e:
        app_logger.error(f"Error uploading {local_file_path} to OSS: {str(e)}")
        return None


def construct_oss_file_path(bucket_domain: str, object_key: str) -> str:
    """
    构造OSS文件的完整URL
    :param bucket_domain: Bucket域名
    :param object_key: 对象键（文件路径）
    :return: 完整的URL
    """
    return f"https://{bucket_domain}/{object_key}"


def parse_oss_url(oss_url: str) -> Dict[str, str]:
    """
    解析OSS URL，提取bucket和object key
    :param oss_url: OSS文件URL
    :return: 包含bucket和object key的字典
    """
    parsed_url = urlparse(oss_url)
    hostname_parts = parsed_url.hostname.split('.', 1)
    bucket_name = hostname_parts[0]
    object_key = parsed_url.path.lstrip('/')
    
    return {
        'bucket': bucket_name,
        'object_key': object_key,
        'domain': parsed_url.hostname
    }


def is_valid_oss_url(url: str) -> bool:
    """
    验证是否为有效的OSS URL
    :param url: 待验证的URL
    :return: 是否有效
    """
    try:
        parsed = urlparse(url)
        # 检查是否为OSS域名
        if 'aliyuncs.com' in parsed.hostname:
            return True
        return False
    except Exception:
        return False