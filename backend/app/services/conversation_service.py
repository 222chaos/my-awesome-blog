"""
Conversation Service
对话管理服务层
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
    Conversation,
    ConversationListResponse,
    ChatRequest,
    ChatResponse,
    ChatStreamChunk,
)
from app.conversation.engine import conversation_engine
from app.utils.logger import app_logger


class ConversationService:
    """
    对话服务类
    """

    def __init__(self):
        pass

    async def create_conversation(
        self,
        db: Session,
        conversation_in: ConversationCreate,
        tenant_id: str,
        user_id: str,
    ) -> Conversation:
        """
        创建新对话
        
        Args:
            db: 数据库会话
            conversation_in: 创建请求
            tenant_id: 租户 ID
            user_id: 用户 ID
        
        Returns:
            Conversation: 创建的对话对象
        """
        return await conversation_engine.create_conversation(
            db, conversation_in, tenant_id, user_id
        )

    async def get_conversation(
        self,
        db: Session,
        conversation_id: str,
        tenant_id: str,
        user_id: str,
    ) -> Optional[Conversation]:
        """
        获取对话
        
        Args:
            db: 数据库会话
            conversation_id: 对话 ID
            tenant_id: 租户 ID
            user_id: 用户 ID
        
        Returns:
            Conversation: 对话对象或 None
        """
        return await conversation_engine.get_conversation(
            db, conversation_id, tenant_id, user_id
        )

    async def list_conversations(
        self,
        db: Session,
        tenant_id: str,
        user_id: str,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
    ) -> ConversationListResponse:
        """
        获取对话列表
        
        Args:
            db: 数据库会话
            tenant_id: 租户 ID
            user_id: 用户 ID
            skip: 跳过数量
            limit: 限制数量
            status: 状态筛选
        
        Returns:
            ConversationListResponse: 对话列表响应
        """
        from app.crud.conversation import count_conversations
        
        conversations = await conversation_engine.list_conversations(
            db, tenant_id, user_id, skip, limit, status
        )
        
        total = count_conversations(db, tenant_id, user_id, status)
        
        return ConversationListResponse(
            conversations=conversations,
            total=total,
            page=skip // limit + 1,
            page_size=limit,
        )

    async def chat(
        self,
        db: Session,
        chat_request: ChatRequest,
        tenant_id: str,
        user_id: str,
    ) -> ChatResponse:
        """
        处理聊天请求（非流式）
        
        Args:
            db: 数据库会话
            chat_request: 聊天请求
            tenant_id: 租户 ID
            user_id: 用户 ID
        
        Returns:
            ChatResponse: 聊天响应
        """
        return await conversation_engine.chat(
            db, chat_request, tenant_id, user_id
        )

    async def chat_stream(
        self,
        db: Session,
        chat_request: ChatRequest,
        tenant_id: str,
        user_id: str,
    ):
        """
        处理聊天请求（流式）
        
        Args:
            db: 数据库会话
            chat_request: 聊天请求
            tenant_id: 租户 ID
            user_id: 用户 ID
        
        Yields:
            ChatStreamChunk: 流式响应块
        """
        async for chunk in conversation_engine.chat_stream(
            db, chat_request, tenant_id, user_id
        ):
            yield chunk

    async def update_conversation(
        self,
        db: Session,
        conversation_id: str,
        conversation_in: ConversationUpdate,
        tenant_id: str,
        user_id: str,
    ) -> Optional[Conversation]:
        """
        更新对话
        
        Args:
            db: 数据库会话
            conversation_id: 对话 ID
            conversation_in: 更新请求
            tenant_id: 租户 ID
            user_id: 用户 ID
        
        Returns:
            Conversation: 更新后的对话对象或 None
        """
        from app.crud.conversation import get_conversation, update_conversation
        
        conversation = get_conversation(db, conversation_id)
        
        if not conversation or (
            str(conversation.tenant_id) != tenant_id or
            str(conversation.user_id) != user_id
        ):
            return None
        
        app_logger.info(f"Updating conversation: {conversation_id}")
        return update_conversation(db, conversation, conversation_in)

    async def delete_conversation(
        self,
        db: Session,
        conversation_id: str,
        tenant_id: str,
        user_id: str,
    ) -> Optional[Conversation]:
        """
        删除对话
        
        Args:
            db: 数据库会话
            conversation_id: 对话 ID
            tenant_id: 租户 ID
            user_id: 用户 ID
        
        Returns:
            Conversation: 被删除的对话对象或 None
        """
        conversation = await conversation_engine.delete_conversation(
            db, conversation_id, tenant_id, user_id
        )
        
        if conversation:
            app_logger.info(f"Deleted conversation: {conversation_id}")
        
        return conversation


conversation_service = ConversationService()
