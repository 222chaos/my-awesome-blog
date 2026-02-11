"""
Prompt CRUD Operations
Prompt 数据库操作
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from app.models.prompt import Prompt
from app.schemas.prompt import PromptCreate, PromptUpdate


def get_prompt(db: Session, prompt_id: str) -> Optional[Prompt]:
    """
    根据 ID 获取 Prompt
    
    Args:
        db: 数据库会话
        prompt_id: Prompt ID
    
    Returns:
        Prompt: Prompt 对象或 None
    """
    return db.query(Prompt).filter(Prompt.id == prompt_id).first()


def get_prompt_by_name_and_version(db: Session, name: str, version: str, tenant_id: str) -> Optional[Prompt]:
    """
    根据名称和版本获取 Prompt
    
    Args:
        db: 数据库会话
        name: Prompt 名称
        version: 版本号
        tenant_id: 租户 ID
    
    Returns:
        Prompt: Prompt 对象或 None
    """
    return (
        db.query(Prompt)
        .filter(
            and_(
                Prompt.name == name,
                Prompt.version == version,
                Prompt.tenant_id == tenant_id
            )
        )
        .first()
    )


def get_prompts(
    db: Session,
    tenant_id: str,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    is_active: Optional[bool] = None,
    is_system: Optional[bool] = None,
) -> List[Prompt]:
    """
    获取 Prompt 列表
    
    Args:
        db: 数据库会话
        tenant_id: 租户 ID
        skip: 跳过数量
        limit: 限制数量
        category: 分类筛选
        is_active: 是否激活筛选
        is_system: 是否系统 Prompt 筛选
    
    Returns:
        List[Prompt]: Prompt 列表
    """
    query = db.query(Prompt).filter(Prompt.tenant_id == tenant_id)
    
    if category:
        query = query.filter(Prompt.category == category)
    if is_active is not None:
        query = query.filter(Prompt.is_active == is_active)
    if is_system is not None:
        query = query.filter(Prompt.is_system == is_system)
    
    return (
        query.order_by(desc(Prompt.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_prompt_versions(db: Session, name: str, tenant_id: str) -> List[Prompt]:
    """
    获取某个 Prompt 的所有版本
    
    Args:
        db: 数据库会话
        name: Prompt 名称
        tenant_id: 租户 ID
    
    Returns:
        List[Prompt]: 所有版本的 Prompt 列表
    """
    return (
        db.query(Prompt)
        .filter(
            and_(
                Prompt.name == name,
                Prompt.tenant_id == tenant_id
            )
        )
        .order_by(desc(Prompt.created_at))
        .all()
    )


def get_ab_test_prompts(db: Session, group: str, tenant_id: str) -> List[Prompt]:
    """
    获取 A/B 测试分组的 Prompt
    
    Args:
        db: 数据库会话
        group: A/B 测试分组名
        tenant_id: 租户 ID
    
    Returns:
        List[Prompt]: A/B 测试 Prompt 列表
    """
    return (
        db.query(Prompt)
        .filter(
            and_(
                Prompt.ab_test_group == group,
                Prompt.tenant_id == tenant_id
            )
        )
        .order_by(Prompt.created_at)
        .all()
    )


def create_prompt(db: Session, prompt_in: PromptCreate, tenant_id: str) -> Prompt:
    """
    创建新 Prompt
    
    Args:
        db: 数据库会话
        prompt_in: 创建请求
        tenant_id: 租户 ID
    
    Returns:
        Prompt: 创建的 Prompt 对象
    """
    import uuid
    db_prompt = Prompt(
        id=uuid.uuid4(),
        tenant_id=tenant_id,
        **prompt_in.dict()
    )
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt


def update_prompt(db: Session, db_prompt: Prompt, prompt_in: PromptUpdate) -> Prompt:
    """
    更新 Prompt
    
    Args:
        db: 数据库会话
        db_prompt: 现有 Prompt 对象
        prompt_in: 更新请求
    
    Returns:
        Prompt: 更新后的 Prompt 对象
    """
    for field, value in prompt_in.dict(exclude_unset=True).items():
        setattr(db_prompt, field, value)
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt


def delete_prompt(db: Session, prompt_id: str) -> Prompt:
    """
    删除 Prompt
    
    Args:
        db: 数据库会话
        prompt_id: Prompt ID
    
    Returns:
        Prompt: 被删除的 Prompt 对象
    """
    prompt = get_prompt(db, prompt_id)
    if prompt:
        db.delete(prompt)
        db.commit()
    return prompt


def increment_prompt_usage(db: Session, prompt_id: str) -> Optional[Prompt]:
    """
    增加 Prompt 使用计数
    
    Args:
        db: 数据库会话
        prompt_id: Prompt ID
    
    Returns:
        Prompt: 更新后的 Prompt 对象
    """
    prompt = get_prompt(db, prompt_id)
    if prompt:
        prompt.usage_count += 1
        prompt.total_interactions += 1
        db.commit()
        db.refresh(prompt)
    return prompt


def update_prompt_success_rate(db: Session, prompt_id: str, success: bool) -> Optional[Prompt]:
    """
    更新 Prompt 成功率
    
    Args:
        db: 数据库会话
        prompt_id: Prompt ID
        success: 是否成功
    
    Returns:
        Prompt: 更新后的 Prompt 对象
    """
    prompt = get_prompt(db, prompt_id)
    if prompt:
        if success:
            prompt.success_rate += 1
        db.commit()
        db.refresh(prompt)
    return prompt


def count_prompts(db: Session, tenant_id: str, is_active: Optional[bool] = None) -> int:
    """
    统计 Prompt 数量
    
    Args:
        db: 数据库会话
        tenant_id: 租户 ID
        is_active: 是否激活筛选
    
    Returns:
        int: Prompt 数量
    """
    query = db.query(Prompt).filter(Prompt.tenant_id == tenant_id)
    if is_active is not None:
        query = query.filter(Prompt.is_active == is_active)
    return query.count()
