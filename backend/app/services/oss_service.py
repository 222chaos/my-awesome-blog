import asyncio
import uuid
from typing import Optional, List
from pathlib import Path

try:
    import oss2
    OSS2_AVAILABLE = True
except ImportError:
    OSS2_AVAILABLE = False

from app.core.config import settings
from app.utils.logger import app_logger


class OSSService:
    """
    阿里云OSS服务类
    """
    
    def __init__(self):
        self.access_key_id = settings.ALIBABA_CLOUD_ACCESS_KEY_ID
        self.access_key_secret = settings.ALIBABA_CLOUD_ACCESS_KEY_SECRET
        self.endpoint = settings.ALIBABA_CLOUD_OSS_ENDPOINT
        self.bucket_name = settings.ALIBABA_CLOUD_OSS_BUCKET_NAME
        self.cdn_domain = settings.ALIBABA_CLOUD_OSS_CDN_DOMAIN
        self.bucket = None

        # 检查oss2是否可用
        if not OSS2_AVAILABLE:
            app_logger.warning("oss2模块未安装，OSS功能将不可用")
            return

        # 初始化OSS认证和bucket对象
        auth = oss2.Auth(self.access_key_id, self.access_key_secret)
        self.bucket = oss2.Bucket(auth, self.endpoint, self.bucket_name)

        # 验证配置
        if not self.access_key_id or not self.access_key_secret:
            app_logger.warning("阿里云OSS凭证未配置，OSS功能将不可用")
    
    def upload_file(self, file_data: bytes, file_name: str, folder: str = "uploads") -> Optional[str]:
        """
        上传文件到OSS
        :param file_data: 文件数据
        :param file_name: 文件名
        :param folder: 存储文件夹
        :return: 文件的URL，如果上传失败则返回None
        """
        if not self.access_key_id or not self.access_key_secret:
            app_logger.error("阿里云OSS凭证未配置，无法上传文件")
            return None
            
        try:
            # 生成唯一的文件路径
            unique_filename = f"{folder}/{uuid.uuid4()}_{file_name}"
            
            # 上传文件
            result = self.bucket.put_object(unique_filename, file_data)
            
            if result.status == 200:
                # 返回文件URL
                if self.cdn_domain:
                    # 如果配置了CDN域名，则使用CDN域名
                    file_url = f"https://{self.cdn_domain}/{unique_filename}"
                else:
                    # 否则使用默认的bucket域名
                    file_url = f"https://{self.bucket_name}.{self.endpoint.replace('https://', '')}/{unique_filename}"
                
                app_logger.info(f"文件上传成功: {file_url}")
                return file_url
            else:
                app_logger.error(f"文件上传失败，状态码: {result.status}")
                return None
                
        except Exception as e:
            app_logger.error(f"上传文件时发生错误: {str(e)}")
            return None
    
    def upload_multiple_files(self, files_data: List[dict], folder: str = "uploads") -> Optional[List[str]]:
        """
        批量上传多个文件到OSS
        :param files_data: 包含文件数据和文件名的列表，例如 [{'data': b'...', 'name': 'file.jpg'}, ...]
        :param folder: 存储文件夹
        :return: 成功上传的文件URL列表，如果上传失败则返回None
        """
        if not self.access_key_id or not self.access_key_secret:
            app_logger.error("阿里云OSS凭证未配置，无法批量上传文件")
            return None
            
        try:
            uploaded_urls = []
            for file_info in files_data:
                file_data = file_info['data']
                file_name = file_info['name']
                
                # 生成唯一的文件路径
                unique_filename = f"{folder}/{uuid.uuid4()}_{file_name}"
                
                # 上传文件
                result = self.bucket.put_object(unique_filename, file_data)
                
                if result.status == 200:
                    # 返回文件URL
                    if self.cdn_domain:
                        # 如果配置了CDN域名，则使用CDN域名
                        file_url = f"https://{self.cdn_domain}/{unique_filename}"
                    else:
                        # 否则使用默认的bucket域名
                        file_url = f"https://{self.bucket_name}.{self.endpoint.replace('https://', '')}/{unique_filename}"
                    
                    app_logger.info(f"文件上传成功: {file_url}")
                    uploaded_urls.append(file_url)
                else:
                    app_logger.error(f"文件上传失败，状态码: {result.status}")
                    return None
            
            return uploaded_urls
            
        except Exception as e:
            app_logger.error(f"批量上传文件时发生错误: {str(e)}")
            return None
    
    def delete_file(self, file_url: str) -> bool:
        """
        从OSS删除文件
        :param file_url: 文件URL
        :return: 删除是否成功
        """
        if not self.access_key_id or not self.access_key_secret:
            app_logger.error("阿里云OSS凭证未配置，无法删除文件")
            return False
            
        try:
            # 从URL中提取文件路径
            if self.cdn_domain:
                file_path = file_url.replace(f"https://{self.cdn_domain}/", "")
            else:
                file_path = file_url.replace(f"https://{self.bucket_name}.{self.endpoint.replace('https://', '')}/", "")
            
            # 删除文件
            result = self.bucket.delete_object(file_path)
            
            if result.status == 204:
                app_logger.info(f"文件删除成功: {file_url}")
                return True
            else:
                app_logger.error(f"文件删除失败，状态码: {result.status}")
                return False
                
        except Exception as e:
            app_logger.error(f"删除文件时发生错误: {str(e)}")
            return False
    
    def file_exists(self, file_path: str) -> bool:
        """
        检查OSS中是否存在指定文件
        :param file_path: 文件路径
        :return: 文件是否存在
        """
        if not self.access_key_id or not self.access_key_secret:
            app_logger.error("阿里云OSS凭证未配置，无法检查文件是否存在")
            return False
            
        try:
            return self.bucket.object_exists(file_path)
        except Exception as e:
            app_logger.error(f"检查文件是否存在时发生错误: {str(e)}")
            return False


# 全局OSS服务实例
oss_service = OSSService()