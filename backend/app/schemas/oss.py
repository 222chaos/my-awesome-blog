from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class OssFileUploadResponse(BaseModel):
    """
    OSS文件上传响应模型
    """
    file_url: str
    file_name: str
    file_size: int
    folder: str
    message: str
    upload_time: Optional[datetime] = None

    class Config:
        from_attributes = True


class OssBatchUploadResponse(BaseModel):
    """
    OSS批量文件上传响应模型
    """
    file_urls: List[str]
    file_count: int
    folder: str
    message: str
    upload_time: Optional[datetime] = None

    class Config:
        from_attributes = True


class OssDeleteResponse(BaseModel):
    """
    OSS文件删除响应模型
    """
    file_url: str
    deleted: bool
    message: str
    delete_time: Optional[datetime] = None

    class Config:
        from_attributes = True


class OssFileInfo(BaseModel):
    """
    OSS文件信息模型
    """
    file_url: str
    file_name: str
    file_size: int
    upload_time: Optional[datetime] = None
    content_type: Optional[str] = None

    class Config:
        from_attributes = True