"""
Context Manager
上下文管理器，负责对话上下文的窗口管理和检索
"""

from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.conversation import Conversation, ConversationMessage
from app.models.context_history import ContextHistory
from app.schemas.context import (
    ContextWindow,
    ContextConfig,
    ContextSummary as ContextSummarySchema,
)
from app.utils.logger import app_logger


class ContextManager:
    """
    上下文管理器
    
    负责管理对话的上下文窗口，包括消息检索、窗口裁剪、自动摘要等
    """
    
    def __init__(self, config: Optional[ContextConfig] = None):
        self.config = config or ContextConfig()
    
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
        effective_config = config or self.config
        
        messages = (
            db.query(ConversationMessage)
            .filter(ConversationMessage.conversation_id == conversation_id)
            .order_by(ConversationMessage.created_at)
            .all()
        )
        
        message_dicts = [
            {
                "id": str(msg.id),
                "role": msg.role,
                "content": msg.content,
                "tokens": msg.tokens,
                "created_at": msg.created_at.isoformat(),
            }
            for msg in messages
        ]
        
        total_tokens = sum(msg["tokens"] for msg in message_dicts)
        
        window = ContextWindow(
            conversation_id=conversation_id,
            messages=message_dicts,
            total_tokens=total_tokens,
            max_tokens=effective_config.max_tokens,
            is_truncated=False,
        )
        
        if total_tokens > effective_config.max_tokens:
            window = await self._truncate_window(
                db,
                window,
                effective_config,
            )
        
        return window
    
    async def _truncate_window(
        self,
        db: Session,
        window: ContextWindow,
        config: ContextConfig,
    ) -> ContextWindow:
        """
        裁剪上下文窗口
        
        根据 Token 数量或消息数量进行裁剪
        
        Args:
            db: 数据库会话
            window: 原始窗口
            config: 上下文配置
        
        Returns:
            ContextWindow: 裁剪后的窗口
        """
        if config.auto_summarize and window.total_tokens > config.summarize_threshold:
            from .summarizer import ContextSummarizer
            
            summarizer = ContextSummarizer()
            await summarizer.create_summary(db, window.conversation_id)
            
            summaries = (
                db.query(ContextHistory)
                .filter(ContextHistory.conversation_id == window.conversation_id)
                .order_by(ContextHistory.created_at)
                .all()
            )
            
            summary_messages = []
            for summary in summaries:
                if summary.summary:
                    summary_messages.append({
                        "id": f"summary_{summary.id}",
                        "role": "system",
                        "content": f"[Summary] {summary.summary}",
                        "tokens": 100,
                        "created_at": summary.created_at.isoformat(),
                    })
            
            remaining_messages = window.messages[-config.keep_last_messages:]
            
            window.messages = summary_messages + remaining_messages
            window.total_tokens = sum(msg["tokens"] for msg in window.messages)
        
        elif len(window.messages) > config.max_messages:
            window.messages = window.messages[-config.max_messages:]
            window.total_tokens = sum(msg["tokens"] for msg in window.messages)
        
        elif window.total_tokens > config.max_tokens:
            accumulated_tokens = 0
            truncated_messages = []
            
            for msg in reversed(window.messages):
                if accumulated_tokens + msg["tokens"] > config.max_tokens:
                    break
                truncated_messages.append(msg)
                accumulated_tokens += msg["tokens"]
            
            window.messages = list(reversed(truncated_messages))
            window.total_tokens = accumulated_tokens
        
        window.is_truncated = True
        
        app_logger.info(
            f"Truncated context window for conversation {window.conversation_id}: "
            f"{len(window.messages)} messages, {window.total_tokens} tokens"
        )
        
        return window
    
    async def get_relevant_context(
        self,
        db: Session,
        conversation_id: str,
        query: str,
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        获取相关上下文
        
        基于查询获取最相关的历史消息
        
        Args:
            db: 数据库会话
            conversation_id: 对话 ID
            query: 查询内容
            top_k: 返回数量
        
        Returns:
            List[Dict[str, Any]]: 相关消息列表
        """
        messages = (
            db.query(ConversationMessage)
            .filter(ConversationMessage.conversation_id == conversation_id)
            .order_by(ConversationMessage.created_at)
            .all()
        )
        
        scored_messages = []
        for msg in messages:
            score = self._calculate_relevance(query, msg.content)
            if score > 0:
                scored_messages.append({
                    "id": str(msg.id),
                    "role": msg.role,
                    "content": msg.content,
                    "score": score,
                    "created_at": msg.created_at.isoformat(),
                })
        
        scored_messages.sort(key=lambda x: x["score"], reverse=True)
        
        return scored_messages[:top_k]
    
    def _calculate_relevance(self, query: str, content: str) -> float:
        """
        计算相关性分数
        
        使用简单的关键词匹配计算相关性
        
        Args:
            query: 查询内容
            content: 消息内容
        
        Returns:
            float: 相关性分数
        """
        query_words = set(query.lower().split())
        content_words = set(content.lower().split())
        
        if not query_words or not content_words:
            return 0.0
        
        intersection = query_words & content_words
        if not intersection:
            return 0.0
        
        return len(intersection) / len(query_words)
    
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
        summaries = (
            db.query(ContextHistory)
            .filter(ContextHistory.conversation_id == conversation_id)
            .order_by(ContextHistory.created_at)
            .all()
        )
        
        return [
            ContextSummarySchema(
                id=str(summary.id),
                conversation_id=str(summary.conversation_id),
                message_count=summary.message_count,
                total_tokens=summary.total_tokens,
                summary=summary.summary,
                key_points=summary.key_points,
                created_at=summary.created_at,
            )
            for summary in summaries
        ]
    
    def clear_context(
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
        db.query(ContextHistory).filter(
            ContextHistory.conversation_id == conversation_id
        ).delete()
        
        db.commit()
        
        app_logger.info(f"Cleared context history for conversation {conversation_id}")
