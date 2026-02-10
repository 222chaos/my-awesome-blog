'use client';

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Reply, Trash2, Flame, Flag, Edit2, Check, Pin, Star, Settings, MoreHorizontal } from 'lucide-react';
import { LazyAvatar } from '@/components/ui/LazyImage';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { Message, UserProfile } from '@/types';
import MessageReactions from './MessageReactions';
import UserLevelBadge from './UserLevelBadge';
import MessageEditDialog from './MessageEditDialog';
import MessageReplies from './MessageReplies';
import MessageManageDialog from './MessageManageDialog';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

interface VirtualMessageListProps {
  messages: Message[];
  currentUser: UserProfile | null;
  isAdmin?: boolean;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (msg: Message) => void;
  onReport: (msg: Message) => void;
  onEdit?: (messageId: string, newContent: string) => Promise<void>;
  onMessageReply?: (messageId: string, content: string, parentReplyId?: string) => Promise<void>;
  onLikeReply?: (replyId: string) => void;
  onDeleteReply?: (replyId: string) => void;
  onTogglePin?: (messageId: string, isPinned: boolean) => Promise<void>;
  onToggleFeature?: (messageId: string, isFeatured: boolean) => Promise<void>;
  onUpdateTags?: (messageId: string, tags: string[]) => Promise<void>;
  columnCount?: number;
}

// 模拟用户等级和成就
const userLevels: Record<string, number> = {
  admin: 50,
  user1: 35,
  user2: 28,
  user3: 18,
  user4: 12,
  user5: 8,
  user6: 5
};

// 单个留言卡片 - memo优化
const MessageCard = memo(function MessageCard({
  msg,
  currentUser,
  onLike,
  onDelete,
  onReply,
  onReport,
  onEdit,
  onOpenEdit,
  onMessageReply,
  onLikeReply,
  onDeleteReply,
  onOpenManage,
  isAdmin
}: {
  msg: Message;
  currentUser: UserProfile | null;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (msg: Message) => void;
  onReport: (msg: Message) => void;
  onEdit?: (messageId: string, newContent: string) => Promise<void>;
  onOpenEdit: (msg: Message) => void;
  onMessageReply?: (messageId: string, content: string, parentReplyId?: string) => Promise<void>;
  onLikeReply?: (replyId: string) => void;
  onDeleteReply?: (replyId: string) => void;
  onOpenManage: (msg: Message) => void;
  isAdmin?: boolean;
}) {
  const isOwner = currentUser?.id === msg.author.id;
  const level = userLevels[msg.author.username] || 1;
  
  // 控制内容显示的展开/收起
  const [isExpanded, setIsExpanded] = useState(false);

  // 截取内容以显示摘要
  const getContentSummary = () => {
    if (isExpanded) return msg.content;
    
    const maxLength = 150; // 最大字符数
    if (msg.content.length <= maxLength) return msg.content;
    
    return msg.content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      id={`message-${msg.id}`}
      className="p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className={cn(
          'h-full rounded-xl border p-4 transition-all duration-200',
          'bg-slate-900/50 backdrop-blur-sm',
          'border-white/10 hover:border-tech-cyan/50 hover:shadow-lg hover:shadow-tech-cyan/10'
        )}
      >
        {/* 头部：用户信息 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <LazyAvatar
              src={msg.author.avatar}
              fallback={msg.author.username[0].toUpperCase()}
              className="w-8 h-8 border border-white/20"
            />
            <div>
              <div className="font-bold text-sm text-white/90 flex items-center gap-1">
                @{msg.author.username}
                <UserLevelBadge level={userLevels[msg.author.username] || 1} size="xs" showProgress={false} />
              </div>
              <div className="text-xs text-white/40">
                {formatDistanceToNow(new Date(msg.created_at), {
                  addSuffix: true,
                  locale: zhCN
                })}
              </div>
            </div>
          </div>

          {/* 标记：置顶、精华、弹幕 */}
          <div className="flex items-center gap-1">
            {msg.isPinned && (
              <span className="flex items-center gap-1 text-xs text-tech-cyan/80 border border-tech-cyan/30 px-2 py-0.5 rounded-full">
                <Pin className="w-3 h-3" />
                置顶
              </span>
            )}
            {msg.isFeatured && (
              <span className="flex items-center gap-1 text-xs text-yellow-400/80 border border-yellow-400/30 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3" />
                精华
              </span>
            )}
            {msg.isDanmaku && (
              <span className="flex items-center gap-1 text-xs text-tech-pink/80 border border-tech-pink/30 px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3" />
                弹幕
              </span>
            )}
          </div>
        </div>

        {/* 内容 */}
        <div className="mb-3 min-h-[40px]">
          <div
            className="text-sm leading-relaxed break-words"
            style={{ color: msg.color || 'rgba(255,255,255,0.8)' }}
          >
            <MarkdownRenderer
              content={getContentSummary()}
              className={isExpanded ? "" : "max-h-40 overflow-hidden"}
            />
          </div>
          
          {/* 如果内容过长，显示展开/收起按钮 */}
          {msg.content.length > 150 && (
            <div className="mt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-tech-cyan hover:text-tech-lightcyan transition-colors font-mono flex items-center gap-1"
              >
                {isExpanded ? '收起内容' : '展开内容'}
                <MoreHorizontal className={`w-3 h-3 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
          
          {/* 编辑标记 */}
          {msg.isEdited && (
            <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
              <Check className="w-3 h-3" />
              <span>已编辑</span>
              {msg.editedAt && (
                <span>
                  {formatDistanceToNow(new Date(msg.editedAt), {
                    addSuffix: true,
                    locale: zhCN
                  })}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 反应和互动 */}
        <div className="space-y-2">
          <MessageReactions
            messageId={msg.id}
            reactions={[
              { emoji: '❤️', count: msg.likes || 0, users: [] },
              { emoji: '👍', count: Math.floor(Math.random() * 5), users: [] }
            ]}
            currentUser={currentUser?.id}
            onReaction={() => onLike(msg.id)}
          />

          {/* 操作按钮 */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex gap-2">
              <button
                onClick={() => onReply(msg)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-white/50 hover:text-tech-cyan transition-all px-3 py-2 rounded-lg hover:bg-white/5 active:scale-95 min-h-[44px] sm:min-h-0 sm:min-w-0"
              >
                <Reply className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">回复</span>
              </button>
              <button
                onClick={() => onReport(msg)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-white/50 hover:text-tech-pink transition-all px-3 py-2 rounded-lg hover:bg-white/5 active:scale-95 min-h-[44px] sm:min-h-0 sm:min-w-0"
              >
                <Flag className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">举报</span>
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onLike(msg.id)}
                className={cn(
                  'flex items-center gap-1.5 text-sm transition-all px-3 py-2 rounded-lg active:scale-95 min-h-[44px]',
                  msg.likes && msg.likes > 0
                    ? 'text-tech-pink hover:text-tech-pink/80 bg-tech-pink/5'
                    : 'text-white/50 hover:text-tech-pink hover:bg-white/5'
                )}
              >
                <Heart
                  className={cn('w-4 h-4 sm:w-3.5 sm:h-3.5', msg.likes && msg.likes > 0 && 'fill-current')}
                />
                {msg.likes || 0}
              </button>

              {isOwner && (
                <>
                  <button
                    onClick={() => onOpenEdit(msg)}
                    className="text-white/30 hover:text-tech-cyan transition-all p-2 rounded-lg hover:bg-tech-cyan/10 active:scale-95 min-h-[44px] min-w-[44px]"
                    title="编辑留言"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(msg.id)}
                    className="text-white/30 hover:text-red-500 transition-all p-2 rounded-lg hover:bg-red-500/10 active:scale-95 min-h-[44px] min-w-[44px]"
                    title="删除留言"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* 管理按钮（仅管理员） */}
              {isAdmin && (
                <button
                  onClick={() => onOpenManage(msg)}
                  className="text-white/30 hover:text-tech-purple transition-all p-2 rounded-lg hover:bg-tech-purple/10 active:scale-95 min-h-[44px] min-w-[44px]"
                  title="内容管理"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 楼中楼回复 */}
        {msg.replies && msg.replies.length > 0 && (
          <MessageReplies
            message={msg}
            currentUser={currentUser || null}
            onReply={async (content, parentReplyId) => {
              await onMessageReply?.(msg.id, content, parentReplyId);
            }}
            onLikeReply={onLikeReply}
            onDeleteReply={onDeleteReply}
          />
        )}
      </div>
    </motion.div>
  );
});

// 响应式列数计算
function useColumnCount() {
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width < 640) setColumnCount(1); // 移动端单列
      else if (width < 1024) setColumnCount(2); // 平板双列
      else setColumnCount(3); // 桌面三列
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  return columnCount;
}

export default function VirtualMessageList({
  messages,
  currentUser,
  isAdmin,
  onLike,
  onDelete,
  onReply,
  onReport,
  onEdit,
  onMessageReply,
  onLikeReply,
  onDeleteReply,
  onTogglePin,
  onToggleFeature,
  onUpdateTags,
  columnCount: propColumnCount
}: VirtualMessageListProps) {
  const columnCount = propColumnCount || useColumnCount();

  // 编辑对话框状态
  const [editMessage, setEditMessage] = useState<Message | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 管理对话框状态
  const [manageMessage, setManageMessage] = useState<Message | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

  // 打开编辑对话框
  const handleOpenEdit = useCallback((msg: Message) => {
    setEditMessage(msg);
    setIsEditDialogOpen(true);
  }, []);

  // 关闭编辑对话框
  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditMessage(null);
  }, []);

  // 确认编辑
  const handleConfirmEdit = useCallback(async (newContent: string) => {
    if (!editMessage || !onEdit) return;
    await onEdit(editMessage.id, newContent);
    handleCloseEditDialog();
  }, [editMessage, onEdit, handleCloseEditDialog]);

  // 打开管理对话框
  const handleOpenManage = useCallback((msg: Message) => {
    setManageMessage(msg);
    setIsManageDialogOpen(true);
  }, []);

  // 关闭管理对话框
  const handleCloseManageDialog = useCallback(() => {
    setIsManageDialogOpen(false);
    setManageMessage(null);
  }, []);

  // 处理回复留言
  const handleMessageReply = useCallback(async (messageId: string, content: string, parentReplyId?: string) => {
    if (!onMessageReply) return;
    try {
      await onMessageReply(messageId, content, parentReplyId);
    } catch (error) {
      throw error;
    }
  }, [onMessageReply]);

  if (messages.length === 0) {
    return (
      <div className="text-center py-20 text-white/30 font-mono">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-dashed border-white/20" />
        暂无留言...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        className={cn(
          "grid gap-4",
          columnCount === 1 && "grid-cols-1",
          columnCount === 2 && "grid-cols-2",
          columnCount === 3 && "grid-cols-3"
        )}
      >
        {messages.map((msg) => (
          <MessageCard
            key={msg.id}
            msg={msg}
            currentUser={currentUser}
            isAdmin={isAdmin}
            onLike={onLike}
            onDelete={onDelete}
            onReply={onReply}
            onReport={onReport}
            onEdit={onEdit}
            onOpenEdit={handleOpenEdit}
            onMessageReply={handleMessageReply}
            onLikeReply={onLikeReply}
            onDeleteReply={onDeleteReply}
            onOpenManage={handleOpenManage}
          />
        ))}
      </div>

      {/* 统计信息 */}
      <div className="mt-4 flex items-center justify-between text-xs text-white/40">
        <span>共 {messages.length} 条留言</span>
        <span>
          显示 {messages.length} / {messages.length}
        </span>
      </div>

      {/* 编辑对话框 */}
      <MessageEditDialog
        message={editMessage}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onConfirm={handleConfirmEdit}
      />

      {/* 管理对话框 */}
      <MessageManageDialog
        message={manageMessage}
        isOpen={isManageDialogOpen}
        onClose={handleCloseManageDialog}
        onTogglePin={async (messageId, isPinned) => {
          await onTogglePin?.(messageId, isPinned);
          handleCloseManageDialog();
        }}
        onToggleFeature={async (messageId, isFeatured) => {
          await onToggleFeature?.(messageId, isFeatured);
          handleCloseManageDialog();
        }}
        onUpdateTags={async (messageId, tags) => {
          await onUpdateTags?.(messageId, tags);
          handleCloseManageDialog();
        }}
      />
    </div>
  );
}