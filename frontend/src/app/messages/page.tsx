'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Message } from '@/types';
import { getMessages, getDanmakuMessages } from '@/services/messageService';
import { getCurrentUserApi } from '@/lib/api/auth';
import { useThemedClasses } from '@/hooks/useThemedClasses';
import { cn } from '@/lib/utils';
import { Mail, MessageCircle, Users, Sparkles, Volume2, VolumeX, BarChart3, TrendingUp, Calendar, Clock } from 'lucide-react';
import Danmaku from '@/components/messages/Danmaku';
import MessageList from '@/components/messages/MessageList';
import MessageInput from '@/components/messages/MessageInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MessagesPage() {
  const { themedClasses } = useThemedClasses();
  const [messages, setMessages] = useState<Message[]>([]);
  const [danmakuMessages, setDanmakuMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; avatar?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDanmakuPlaying, setIsDanmakuPlaying] = useState(true);
  const [danmakuDensity, setDanmakuDensity] = useState(50); // 弹幕密度百分比
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalDanmaku: 0,
    uniqueUsers: 0,
    todayMessages: 0,
    peakHour: 0
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      const [allMessages, danmakuMsgs, user] = await Promise.all([
        getMessages(),
        getDanmakuMessages(),
        getCurrentUserApi(),
      ]);
      setMessages(allMessages);
      setDanmakuMessages(danmakuMsgs);
      setCurrentUser(user);

      // 计算统计数据
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const todayMessages = allMessages.filter(msg =>
        new Date(msg.created_at).toISOString().split('T')[0] === todayStr
      ).length;

      const hours = allMessages.reduce((acc, msg) => {
        const hour = new Date(msg.created_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // 添加安全检查，防止空数组reduce错误
      const peakHour = Object.keys(hours).length > 0
        ? Object.entries(hours).reduce((a, b) =>
            hours[parseInt(a[0])] > hours[parseInt(b[0])] ? a : b
          )[0]
        : '12'; // 默认值

      setStats({
        totalMessages: allMessages.length,
        totalDanmaku: danmakuMsgs.length,
        uniqueUsers: new Set(allMessages.map(m => m.author.id)).size,
        todayMessages,
        peakHour: parseInt(peakHour)
      });
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

    // 更新统计数据
    setStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages + 1,
      totalDanmaku: newMessage.isDanmaku !== false ? prev.totalDanmaku + 1 : prev.totalDanmaku,
      uniqueUsers: prev.uniqueUsers + (new Set([...messages, newMessage].map(m => m.author.id)).size - new Set(messages.map(m => m.author.id)).size),
      todayMessages: prev.todayMessages + 1
    }));
  }, [messages]);

  // 留言删除回调
  const handleMessageDeleted = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setDanmakuMessages((prev) => prev.filter((m) => m.id !== id));

    // 更新统计数据
    setStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages - 1,
      totalDanmaku: danmakuMessages.some(m => m.id === id && m.isDanmaku !== false)
        ? prev.totalDanmaku - 1
        : prev.totalDanmaku
    }));
  }, [danmakuMessages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" ref={containerRef}>
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className={cn(
              "text-lg font-semibold flex items-center gap-2",
              themedClasses.textClass
            )}>
              <Sparkles className="w-5 h-5 text-tech-cyan" />
              弹幕舞台
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={danmakuDensity}
                  onChange={(e) => setDanmakuDensity(parseInt(e.target.value))}
                  className="w-24 accent-tech-cyan"
                  aria-label="弹幕密度"
                />
                <span className="text-sm text-muted-foreground">{danmakuDensity}%</span>
              </div>

              <button
                onClick={() => setIsDanmakuPlaying(!isDanmakuPlaying)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors",
                  isDanmakuPlaying
                    ? "bg-tech-cyan/20 text-tech-cyan"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isDanmakuPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" /> 播放中
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" /> 已暂停
                  </>
                )}
              </button>

              <button
                onClick={() => setShowStats(!showStats)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors",
                  showStats
                    ? "bg-tech-cyan/20 text-tech-cyan"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" /> 统计
              </button>
            </div>
          </div>

          <Danmaku
            messages={danmakuMessages}
            isPlaying={isDanmakuPlaying}
            density={danmakuDensity}
            className="h-64 md:h-80 rounded-2xl"
          />
        </div>

        {/* 扩展统计信息面板 */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={cn(themedClasses.cardBgClass)}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <MessageCircle className="w-4 h-4 text-tech-cyan" />
                  总留言数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  今日 {stats.todayMessages} 条
                </p>
              </CardContent>
            </Card>

            <Card className={cn(themedClasses.cardBgClass)}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-tech-cyan" />
                  弹幕数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.totalDanmaku}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  占比 {stats.totalMessages ? Math.round((stats.totalDanmaku / stats.totalMessages) * 100) : 0}%
                </p>
              </CardContent>
            </Card>

            <Card className={cn(themedClasses.cardBgClass)}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Users className="w-4 h-4 text-tech-cyan" />
                  参与用户
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
                <p className="text-xs text-muted-foreground mt-1">活跃用户</p>
              </CardContent>
            </Card>

            <Card className={cn(themedClasses.cardBgClass)}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4 text-tech-cyan" />
                  活跃时段
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.peakHour}:00</p>
                <p className="text-xs text-muted-foreground mt-1">最活跃时段</p>
              </CardContent>
            </Card>
          </div>
        )}

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
          onMessageUpdated={(updatedMessage) => {
            // 更新留言列表中的对应留言
            setMessages(prev =>
              prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
            );
            // 更新弹幕列表中的对应留言
            setDanmakuMessages(prev =>
              prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
            );
          }}
        />
      </div>
    </div>
  );
}
