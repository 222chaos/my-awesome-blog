from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
import os
from datetime import datetime
from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_active_user, get_current_superuser
from app import crud
from app.schemas.image import Image, ImageCreate
from app.models.user import User
from app.services.oss_service import oss_service
from app.services.image_service import ImageService
from app.core.config import settings
from app.utils.logger import app_logger
from app.schemas.oss import OssFileUploadResponse, OssBatchUploadResponse, OssDeleteResponse

router = APIRouter()


@router.post("/upload", response_model=OssFileUploadResponse)
async def upload_file_to_oss(
    *,
    file: UploadFile = File(...),
    folder: str = "general",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    上传文件到OSS
    :param file: 上传的文件
    :param folder: 存储的文件夹，默认为general
    :param db: 数据库会话
    :param current_user: 当前登录用户
    :return: 包含文件URL的响应
    """
    # 检查文件类型是否允许
    allowed_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".mp4", ".avi", ".mov", ".pdf", ".doc", ".docx", ".txt"]
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_extension} not allowed. Allowed types: {allowed_extensions}"
        )

    # 临时保存文件以进行处理
    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            buffer.write(await file.read())
        
        # 对于图片，使用ImageService进行验证
        if file_extension in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
            image_service = ImageService()
            if not image_service.validate_image_format(temp_file_path):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid image format. Supported formats: JPEG, PNG, WEBP, GIF"
                )
        
        # 读取文件内容
        with open(temp_file_path, "rb") as f:
            file_data = f.read()
        
        # 上传到OSS
        file_url = oss_service.upload_file(
            file_data=file_data,
            file_name=file.filename,
            folder=f"uploads/{folder}"
        )
        
        if not file_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload file to cloud storage"
            )
        
        # 记录日志
        app_logger.info(f"File uploaded to OSS: {file_url} by user {current_user.id}")
        
        # 清理临时文件
        os.remove(temp_file_path)
        
        response = OssFileUploadResponse(
            file_url=file_url,
            file_name=file.filename,
            file_size=len(file_data),
            folder=folder,
            message="File uploaded successfully",
            upload_time=datetime.utcnow()
        )
        
        return response
        
    except HTTPException:
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 清理临时文件
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        app_logger.error(f"Error uploading file to OSS: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )


@router.post("/batch-upload", response_model=OssBatchUploadResponse)
async def batch_upload_files_to_oss(
    *,
    files: List[UploadFile] = File(...),
    folder: str = "general",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    批量上传文件到OSS
    :param files: 上传的文件列表
    :param folder: 存储的文件夹，默认为general
    :param db: 数据库会话
    :param current_user: 当前登录用户
    :return: 包含文件URL列表的响应
    """
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided for upload"
        )

    # 验证所有文件类型
    allowed_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".mp4", ".avi", ".mov", ".pdf", ".doc", ".docx", ".txt"]
    for file in files:
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_extension} not allowed. Allowed types: {allowed_extensions}"
            )

    temp_files = []
    files_data = []

    try:
        # 临时保存所有文件
        for file in files:
            temp_file_path = f"temp_{file.filename}"
            with open(temp_file_path, "wb") as buffer:
                buffer.write(await file.read())
            temp_files.append(temp_file_path)

            # 对于图片，使用ImageService进行验证
            file_extension = os.path.splitext(file.filename)[1].lower()
            if file_extension in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
                image_service = ImageService()
                if not image_service.validate_image_format(temp_file_path):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid image format for {file.filename}. Supported formats: JPEG, PNG, WEBP, GIF"
                    )

            # 读取文件内容
            with open(temp_file_path, "rb") as f:
                file_data = f.read()
            
            files_data.append({
                'data': file_data,
                'name': file.filename
            })

        # 批量上传到OSS
        uploaded_urls = oss_service.upload_multiple_files(
            files_data=files_data,
            folder=f"uploads/{folder}"
        )

        if not uploaded_urls:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload files to cloud storage"
            )

        # 记录日志
        app_logger.info(f"Batch uploaded {len(uploaded_urls)} files to OSS by user {current_user.id}")

        # 清理临时文件
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                os.remove(temp_file)

        response = OssBatchUploadResponse(
            file_urls=uploaded_urls,
            file_count=len(uploaded_urls),
            folder=folder,
            message=f"{len(uploaded_urls)} files uploaded successfully",
            upload_time=datetime.utcnow()
        )
        
        return response

    except HTTPException:
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 清理临时文件
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                os.remove(temp_file)
        
        app_logger.error(f"Error batch uploading files to OSS: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading files: {str(e)}"
        )


@router.delete("/delete", response_model=OssDeleteResponse)
async def delete_file_from_oss(
    *,
    file_url: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    从OSS删除文件
    :param file_url: 要删除的文件URL
    :param db: 数据库会话
    :param current_user: 当前登录用户
    :return: 删除结果
    """
    if not file_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File URL is required"
        )

    try:
        # 删除文件
        delete_result = oss_service.delete_file(file_url)
        
        if delete_result:
            app_logger.info(f"File deleted from OSS: {file_url} by user {current_user.id}")
            response = OssDeleteResponse(
                file_url=file_url,
                deleted=True,
                message="File deleted successfully",
                delete_time=datetime.utcnow()
            )
            
            return response
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete file from cloud storage"
            )
            
    except Exception as e:
        app_logger.error(f"Error deleting file from OSS: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting file: {str(e)}"
        )