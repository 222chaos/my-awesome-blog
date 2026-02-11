"""
Memory Service
记忆管理服务层
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.schemas.memory import (
    MemoryCreate,
    MemoryUpdate,
    Memory,
    MemoryListResponse,
    MemorySearchRequest,
    MemorySearchResponse,
    MemoryStats,
    MemoryBatchCreate,
)
from app.crud import memory as memory_crud
from app.memory.short_term import ShortTermMemory
from app.memory.long_term import LongTermMemory
from app.memory.vector_store import create_vector_store
from app.utils.logger import app_logger


class MemoryService:
    """
    记忆服务类
    """

    def __init__(self):
        self.short_term = ShortTermMemory()
        self.long_term = LongTermMemory()
        self.vector_store = create_vector_store(store_type="simple")

    async def create_memory(
        self,
        db: Session,
        memory_in: MemoryCreate,
        tenant_id: str,
        user_id: str,
    ) -> Memory:
        """
        创建新记忆
        
        Args:
            db: 数据库会话
            memory_in: 创建请求
            tenant_id: 租户 ID
            user_id: 用户 ID
        
        Returns:
            Memory: 创建的记忆对象
        """
        memory = await self.long_term.add_memory(
            db=db,
            content=memory_in.content,
            memory_type=memory_in.memory_type,
            tenant_id=tenant_id,
            user_id=user_id,
            importance=memory_in.importance,
            expires_at=memory_in.expires_at,
        )
        
        await self._add_to_vector_store(memory, tenant_id, user_id)
        
        return memory

    async def _add_to_vector_store(
        self,
        memory: Memory,
        tenant_id: str,
        user_id: str,
    ) -> None:
        """
        将记忆添加到向量存储
        
        Args:
            memory: 记忆对象
            tenant_id: 租户 ID
            user_id: 用户 ID
        """
        try:
            await self.vector_store.add_vector(
                text=memory.content,
                vector=[0.0] * 1536,
                metadata={
                    "memory_type": memory.memory_type,
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "importance": memory.importance,
                },
            )
        except Exception as e:
            app_logger.error(f"Error adding to vector store: {e}")

    async def get_memory(
        self,
        db: Session,
        memory_id: str,
        user_id: str,
    ) -> Optional[Memory]:
        """
        获取记忆
        
        Args:
            db: 数据库会话
            memory_id: 记忆 ID
            user_id: 用户 ID
        
        Returns:
            Memory: 记忆对象或 None
        """
        memory = memory_crud.get_memory(db, memory_id)
        if memory and str(memory.user_id) == user_id:
            memory_crud.increment_memory_access(db, memory_id)
            return memory
        return None

    async def get_memories(
        self,
        db: Session,
        tenant_id: str,
        user_id: str,
        skip: int = 0,
        limit: int = 100,
        memory_type: Optional[str] = None,
        min_importance: Optional[float] = None,
    ) -> MemoryListResponse:
        """
        获取记忆列表
        
        Args:
            db: 数据库会话
            tenant_id: 租户 ID
            user_id: 用户 ID
            skip: 跳过数量
            limit: 限制数量
            memory_type: 记忆类型筛选
            min_importance: 最小重要性筛选
        
        Returns:
            MemoryListResponse: 记忆列表响应
        """
        memories = memory_crud.get_memories(
            db, tenant_id, user_id, skip, limit, memory_type, min_importance
        )
        total = memory_crud.count_memories(db, tenant_id, user_id, memory_type)
        
        return MemoryListResponse(
            memories=memories,
            total=total,
            page=skip // limit + 1,
            page_size=limit,
        )

    async def search_memories(
        self,
        db: Session,
        tenant_id: str,
        user_id: str,
        search_request: MemorySearchRequest,
    ) -> MemorySearchResponse:
        """
        搜索记忆
        
        Args:
            db: 数据库会话
            tenant_id: 租户 ID
            user_id: 用户 ID
            search_request: 搜索请求
        
        Returns:
            MemorySearchResponse: 搜索结果响应
        """
        memories = memory_crud.search_memories(
            db=db,
            tenant_id=tenant_id,
            user_id=user_id,
            query=search_request.query,
            memory_type=search_request.memory_type,
            min_importance=search_request.min_importance,
            top_k=search_request.top_k,
        )
        
        results = [
            {
                "id": str(mem.id),
                "content": mem.content,
                "memory_type": mem.memory_type,
                "importance": mem.importance,
                "access_count": mem.access_count,
                "created_at": mem.created_at.isoformat(),
            }
            for mem in memories
        ]
        
        return MemorySearchResponse(
            memories=results,
            query=search_request.query,
            total=len(results),
        )

    async def update_memory(
        self,
        db: Session,
        memory_id: str,
        memory_in: MemoryUpdate,
        user_id: str,
    ) -> Optional[Memory]:
        """
        更新记忆
        
        Args:
            db: 数据库会话
            memory_id: 记忆 ID
            memory_in: 更新请求
            user_id: 用户 ID
        
        Returns:
            Memory: 更新后的记忆对象或 None
        """
        memory = memory_crud.get_memory(db, memory_id)
        if not memory or str(memory.user_id) != user_id:
            return None
        
        return memory_crud.update_memory(db, memory, memory_in)

    async def delete_memory(
        self,
        db: Session,
        memory_id: str,
        user_id: str,
    ) -> Optional[Memory]:
        """
        删除记忆
        
        Args:
            db: 数据库会话
            memory_id: 记忆 ID
            user_id: 用户 ID
        
        Returns:
            Memory: 被删除的记忆对象或 None
        """
        memory = memory_crud.get_memory(db, memory_id)
        if not memory or str(memory.user_id) != user_id:
            return None
        
        return memory_crud.delete_memory(db, memory_id)

    async def batch_create_memories(
        self,
        db: Session,
        batch_request: MemoryBatchCreate,
        tenant_id: str,
        user_id: str,
    ) -> List[Memory]:
        """
        批量创建记忆
        
        Args:
            db: 数据库会话
            batch_request: 批量创建请求
            tenant_id: 租户 ID
            user_id: 用户 ID
        
        Returns:
            List[Memory]: 创建的记忆对象列表
        """
        from app.crud.memory import create_memories_batch
        
        memories = create_memories_batch(
            db=db,
            memories_in=batch_request.memories,
            tenant_id=tenant_id,
            user_id=user_id,
        )
        
        for memory in memories:
            await self._add_to_vector_store(memory, tenant_id, user_id)
        
        return memories

    async def get_stats(
        self,
        db: Session,
        tenant_id: str,
        user_id: str,
    ) -> MemoryStats:
        """
        获取记忆统计信息
        
        Args:
            db: 数据库会话
            tenant_id: 租户 ID
            user_id: 用户 ID
        
        Returns:
            MemoryStats: 统计信息
        """
        stats = memory_crud.get_memory_stats(db, tenant_id, user_id)
        
        return MemoryStats(**stats)

    async def cleanup_expired(
        self,
        db: Session,
        tenant_id: str,
    ) -> int:
        """
        清理过期记忆
        
        Args:
            db: 数据库会话
            tenant_id: 租户 ID
        
        Returns:
            int: 删除的记忆数量
        """
        return await self.long_term.cleanup_expired(db, tenant_id)

    async def get_short_term_context(
        self,
        conversation_id: str,
    ) -> Optional[Dict[str, Any]]:
        """
        获取短期记忆上下文
        
        Args:
            conversation_id: 对话 ID
        
        Returns:
            Dict[str, Any]: 上下文数据或 None
        """
        return await self.short_term.get_conversation_context(conversation_id)

    async def set_short_term_context(
        self,
        conversation_id: str,
        context: Dict[str, Any],
    ) -> bool:
        """
        设置短期记忆上下文
        
        Args:
            conversation_id: 对话 ID
            context: 上下文数据
        
        Returns:
            bool: 是否成功
        """
        return await self.short_term.set_conversation_context(conversation_id, context)

    async def clear_short_term(
        self,
        conversation_id: str,
    ) -> bool:
        """
        清空短期记忆
        
        Args:
            conversation_id: 对话 ID
        
        Returns:
            bool: 是否成功
        """
        return await self.short_term.clear_conversation(conversation_id)


memory_service = MemoryService()
