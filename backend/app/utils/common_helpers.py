"""
公共工具函数模块
提供UUID解析、批量验证等通用功能
"""
from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status


def parse_uuid(uuid_str: str, error_detail: str = "Invalid ID format") -> UUID:
    """
    解析UUID字符串，统一错误处理

    Args:
        uuid_str: UUID字符串
        error_detail: 错误消息，默认为 "Invalid ID format"

    Returns:
        UUID对象

    Raises:
        HTTPException: UUID格式无效时抛出400错误
    """
    try:
        return UUID(uuid_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_detail
        )


def parse_uuid_list(
    uuid_strs: List[str],
    max_count: int = 100,
    error_detail_count: Optional[str] = None,
    error_detail_format: Optional[str] = None
) -> List[UUID]:
    """
    批量解析UUID列表，包含数量限制和格式验证

    Args:
        uuid_strs: UUID字符串列表
        max_count: 最大允许的数量，默认100
        error_detail_count: 数量超限的错误消息，默认自动生成
        error_detail_format: 格式错误的错误消息，默认自动生成

    Returns:
        UUID对象列表

    Raises:
        HTTPException: 数量超限或格式无效时抛出400错误
    """
    # 验证数量限制
    if len(uuid_strs) > max_count:
        if error_detail_count:
            detail = error_detail_count
        else:
            detail = f"一次最多可以操作{max_count}个项目"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )

    # 批量解析UUID
    try:
        return [UUID(uid) for uid in uuid_strs]
    except ValueError:
        if error_detail_format:
            detail = error_detail_format
        else:
            detail = "Invalid ID format"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )


def validate_batch_limit(items: List, max_count: int = 100, resource_name: str = "项目") -> None:
    """
    验证批量操作数量限制

    Args:
        items: 待处理的项目列表
        max_count: 最大允许的数量，默认100
        resource_name: 资源名称，用于错误消息

    Raises:
        HTTPException: 数量超限时抛出400错误
    """
    if len(items) > max_count:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"一次最多可以操作{max_count}个{resource_name}"
        )


def validate_uuid_list_size(uuid_strs: List[str], max_count: int = 100) -> None:
    """
    验证UUID列表大小，仅检查数量不进行解析

    Args:
        uuid_strs: UUID字符串列表
        max_count: 最大允许的数量，默认100

    Raises:
        HTTPException: 数量超限时抛出400错误
    """
    if len(uuid_strs) > max_count:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"一次最多可以操作{max_count}个项目"
        )
