'use client';

import { useState } from 'react';
import { Message } from '@/types';
import { formatDistanceToNow } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { deleteMessage } from '@/services/messageService';
import { useThemedClasses } from '@/hooks/useThemedClasses';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  onMessageDeleted?: (id: string) => void;
}

export default function MessageList({ 
  messages, 
  currentUserId, 
  onMessageDeleted 
}: MessageListProps) {
  const { themedClasses } = useThemedClasses();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条留言吗？')) return;
    
    setDeletingId(id);
    try {
      await deleteMessage(id);
      onMessageDeleted?.(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败');
    } finally {
      setDeletingId(null);
    }
  };

  if (messages.length === 0) {
    return (
      <div className={cn(
        "text-center py-12",
        themedClasses.cardBgClass,
        "rounded-xl"
      )}>
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">暂无留言，快来发表第一条吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className={cn(
        "text-lg font-semibold flex items-center gap-2",
        themedClasses.textClass
      )}>
        <MessageSquare className="w-5 h-5 text-tech-cyan" />
        全部留言 ({messages.length})
      </h3>
      
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "p-4 rounded-xl transition-all duration-300",
              "hover:scale-[1.01]",
              themedClasses.cardBgClass
            )}
          >
            <div className="flex items-start gap-3">
              {/* 头像 */}
              <div className="flex-shrink-0">
                {message.author.avatar ? (
                  <img
                    src={message.author.avatar}
                    alt={message.author.username}
                    className="w-10 h-10 rounded-full border-2 border-tech-cyan/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tech-cyan to-tech-lightcyan flex items-center justify-center text-white font-bold">
                    {message.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium",
                      themedClasses.textClass
                    )}>
                      {message.author.username}
                    </span>
                    {message.isDanmaku && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/30"
                      >
                        弹幕
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at))}
                  </span>
                </div>
                
                <p className={cn(
                  "mt-1 text-sm leading-relaxed",
                  themedClasses.textClass
                )}>
                  {message.content}
                </p>
              </div>

              {/* 删除按钮 */}
              {currentUserId === message.author.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(message.id)}
                  disabled={deletingId === message.id}
                  className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
