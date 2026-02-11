"""
Context Service
上下文管理服务层
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.schemas.context import (
    ContextWindow,
    ContextConfig,
    ContextSummary as ContextSummarySchema,
    ContextResponse,
    ContextSummaryRequest,
    ContextSummaryResponse,
)
from app.context.manager import ContextManager
from app.context.summarizer import ContextSummarizer
from app.utils.logger import app_logger


class ContextService:
    """
    上下文服务类
    """

    def __init__(self):
        self.default_config = ContextConfig()

    async def get_context_window(
        self,
        db: Session,
        conversation_id: str,
        config: Optional[ContextConfig] = None,
    ) -> ContextWindow:
        """
        获取对话的上下文窗口
        
        Args:
            db: 数据库会话
            conversation_id: 对话 ID
            config: 上下文配置
        
        Returns:
            ContextWindow: 上下文窗口
        """
        manager = ContextManager(config or self.default_config)
        return await manager.get_context_window(db, conversation_id)

    async def get_relevant_context(
        self,
        db: Session,
        conversation_id: str,
        query: str,
        top_k: int = 5,
    ) -> List[dict]:
        """
        获取相关上下文
        
        Args:
            db: 数据库会话
            conversation_id: 对话 ID
            query: 查询内容
            top_k: 返回数量
        
        Returns:
            List[dict]: 相关消息列表
        """
        manager = ContextManager(self.default_config)
        return await manager.get_relevant_context(db, conversation_id, query, top_k)

    async def get_summaries(
        self,
        db: Session,
        conversation_id: str,
    ) -> List[ContextSummarySchema]:
        """
        获取对话的摘要列表
        
        Args:
            db: 数据库会话
            conversation_id: 对话 ID
        
        Returns:
            List[ContextSummarySchema]: 摘要列表
        """
        manager = ContextManager(self.default_config)
        return await manager.get_summaries(db, conversation_id)

    async def create_summary(
        self,
        db: Session,
        conversation_id: str,
        max_messages: Optional[int] = None,
    ):
        """
        创建对话摘要
        
        Args:
            db: 数据库会话
            conversation_id: 对话 ID
            max_messages: 最大消息数
        """
        summarizer = ContextSummarizer()
        return await summarizer.create_summary(db, conversation_id, max_messages)

    async def update_summary(
        self,
        db: Session,
        summary_id: str,
        conversation_id: str,
    ):
        """
        更新摘要
        
        Args:
            db: 数据库会话
            summary_id: 摘要 ID
            conversation_id: 对话 ID
        """
        from app.models.conversation import ConversationMessage
        
        messages = (
            db.query(ConversationMessage)
            .filter(ConversationMessage.conversation_id == conversation_id)
            .all()
        )
        
        summarizer = ContextSummarizer()
        return await summarizer.update_summary(db, summary_id, messages)

    async def clear_context(
        self,
        db: Session,
        conversation_id: str,
    ) -> None:
        """
        清空对话的上下文历史
        
        Args:
            db: 数据库会话
            conversation_id: 对话 ID
        """
        manager = ContextManager(self.default_config)
        manager.clear_context(db, conversation_id)
        app_logger.info(f"Cleared context for conversation {conversation_id}")


context_service = ContextService()
