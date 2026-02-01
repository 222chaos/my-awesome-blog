'use client';

import { useEffect, useState, useCallback } from 'react';
import { Message } from '@/types';
import { getMessages, getDanmakuMessages } from '@/services/messageService';
import { getCurrentUser } from '@/services/userService';
import { useThemedClasses } from '@/hooks/useThemedClasses';
import { cn } from '@/lib/utils';
import { Mail, MessageCircle, Users, Sparkles } from 'lucide-react';
import Danmaku from '@/components/messages/Danmaku';
import MessageList from '@/components/messages/MessageList';
import MessageInput from '@/components/messages/MessageInput';

export default function MessagesPage() {
  const { themedClasses } = useThemedClasses();
  const [messages, setMessages] = useState<Message[]>([]);
  const [danmakuMessages, setDanmakuMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; avatar?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDanmakuPlaying, setIsDanmakuPlaying] = useState(true);

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      const [allMessages, danmakuMsgs, user] = await Promise.all([
        getMessages(),
        getDanmakuMessages(),
        getCurrentUser(),
      ]);
      setMessages(allMessages);
      setDanmakuMessages(danmakuMsgs);
      setCurrentUser(user);
    } catch (error) {
      console.error('加载留言失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 新留言发送成功回调
  const handleMessageSent = useCallback((newMessage: Message) => {
    setMessages((prev) => [newMessage, ...prev]);
    if (newMessage.isDanmaku !== false) {
      setDanmakuMessages((prev) => [...prev, newMessage]);
    }
  }, []);

  // 留言删除回调
  const handleMessageDeleted = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setDanmakuMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 页面标题 */}
      <div className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-tech-cyan/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-tech-cyan to-tech-lightcyan mb-6 shadow-lg shadow-tech-cyan/20">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className={cn(
              "text-3xl md:text-4xl font-bold mb-4",
              themedClasses.textClass
            )}>
              留言板
            </h1>
            <p className={cn(
              "text-lg max-w-2xl mx-auto",
              themedClasses.mutedTextClass
            )}>
              欢迎留下你的想法和建议，你的留言将以弹幕形式在页面上滚动播放
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 space-y-6">
        {/* 弹幕区域 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className={cn(
              "text-lg font-semibold flex items-center gap-2",
              themedClasses.textClass
            )}>
              <Sparkles className="w-5 h-5 text-tech-cyan" />
              弹幕舞台
            </h2>
            <button
              onClick={() => setIsDanmakuPlaying(!isDanmakuPlaying)}
              className={cn(
                "text-sm px-3 py-1.5 rounded-full transition-colors",
                isDanmakuPlaying 
                  ? "bg-tech-cyan/20 text-tech-cyan" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isDanmakuPlaying ? '暂停弹幕' : '播放弹幕'}
            </button>
          </div>
          
          <Danmaku
            messages={danmakuMessages}
            isPlaying={isDanmakuPlaying}
            className="h-64 md:h-80 rounded-2xl"
          />
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className={cn(
            "p-4 rounded-xl text-center",
            themedClasses.cardBgClass
          )}>
            <MessageCircle className="w-6 h-6 mx-auto mb-2 text-tech-cyan" />
            <p className="text-2xl font-bold">{messages.length}</p>
            <p className="text-xs text-muted-foreground">总留言</p>
          </div>
          <div className={cn(
            "p-4 rounded-xl text-center",
            themedClasses.cardBgClass
          )}>
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-tech-cyan" />
            <p className="text-2xl font-bold">{danmakuMessages.length}</p>
            <p className="text-xs text-muted-foreground">弹幕数</p>
          </div>
          <div className={cn(
            "p-4 rounded-xl text-center",
            themedClasses.cardBgClass
          )}>
            <Users className="w-6 h-6 mx-auto mb-2 text-tech-cyan" />
            <p className="text-2xl font-bold">
              {new Set(messages.map(m => m.author.id)).size}
            </p>
            <p className="text-xs text-muted-foreground">参与用户</p>
          </div>
        </div>

        {/* 留言输入 */}
        <MessageInput
          isLoggedIn={!!currentUser}
          currentUser={currentUser}
          onMessageSent={handleMessageSent}
        />

        {/* 留言列表 */}
        <MessageList
          messages={messages}
          currentUserId={currentUser?.id}
          onMessageDeleted={handleMessageDeleted}
        />
      </div>
    </div>
  );
}
