'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FadeIn, ScaleIn, HoverScale } from '@/components/ui/OptimizedMotion';
import {
  Send, Heart, MessageSquare, BarChart2,
  Zap, Hash, Sparkles, RefreshCw, Trash2, Reply,
  Filter, Clock, Flame, SortAsc, Search, Flag,
  Smile, Keyboard
} from 'lucide-react';
import {
  getMessages, createMessage, likeMessage,
  deleteMessage, replyToMessage, editMessage, getDanmakuMessages,
  getTrendingMessages, getMessageActivity, DANMAKU_COLORS,
  getMessageReplies, likeReplyMessage, deleteReplyMessage,
  pinMessage, featureMessage, updateMessageTags, replyToMessageWithParent
} from '@/services/messageService';
import { getCurrentUserApi } from '@/lib/api/auth';
import { Message, UserProfile } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import GlitchText from '@/components/ui/GlitchText';
import InteractiveCursor from '@/components/ui/InteractiveCursor';
import HoloCard from '@/components/ui/HoloCard';
import UserLevelBadge from '@/components/messages/UserLevelBadge';
import MessageReactions from '@/components/messages/MessageReactions';
import RealTimeStats from '@/components/messages/RealTimeStats';
import EnhancedDanmaku from '@/components/messages/EnhancedDanmaku';
import MessagePagination from '@/components/messages/MessagePagination';
import ReportDialog from '@/components/messages/ReportDialog';
import VirtualMessageList from '@/components/messages/VirtualMessageList';
import MessageManageDialog from '@/components/messages/MessageManageDialog';
import { QuickActionsPanel, KeyboardShortcutHelp } from '@/components/messages/QuickActions';
import { webSocketService, WebSocketEvent } from '@/services/websocketService';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

type FilterType = 'all' | 'danmaku' | 'latest' | 'popular';
type SortType = 'time' | 'likes';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface DanmakuMessage {
  id: string;
  content: string;
  color: string;
  speed: number;
  y: number;
  layer: number;
  message?: Message; // 完整的留言信息，用于悬停和交互
}

export default function MessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [danmakuList, setDanmakuList] = useState<DanmakuMessage[]>([]);
  const [trendingMessages, setTrendingMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Input states
  const [newMessage, setNewMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(DANMAKU_COLORS[0].value);
  const [isDanmaku, setIsDanmaku] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // New states
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('time');
  const [isDanmakuPaused, setIsDanmakuPaused] = useState(false);
  const [rainbowMode, setRainbowMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Quick actions states
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Search, Pagination, and Report states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchByUsername, setSearchByUsername] = useState(false); // 是否仅搜索用户名
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportMessageId, setReportMessageId] = useState<string | null>(null);
  const [reportMessage, setReportMessage] = useState<Message | null>(null);

  // Simulated user levels and achievements
  const userLevels: Record<string, number> = {
    'admin': 50,
    'user1': 35,
    'user2': 28,
    'user3': 18,
    'user4': 12,
    'user5': 8,
    'user6': 5
  };

  const userAchievements: Record<string, string[]> = {
    'admin': ['🏆', '⭐', '💎'],
    'user1': ['🥇', '🔥', '✨'],
    'user2': ['🥈', '💪', '🎯'],
    'user3': ['🥉', '⚡', '🎪'],
    'user4': ['🏅', '🌟', '🚀'],
    'user5': ['💎', '⭐', '🎪'],
    'user6': ['🌟', '✨', '🎯']
  };

  // 提取所有标签
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    messages.forEach(m => {
      if (m.tags && m.tags.length > 0) {
        m.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [messages]);

  // Filter and sort messages
  const filteredMessages = useMemo(() => {
    let filtered = [...messages];

    if (filterType === 'popular') {
      return trendingMessages;
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => {
        if (searchByUsername) {
          // 仅搜索用户名
          return m.author.username.toLowerCase().includes(query);
        } else {
          // 搜索内容和用户名
          return (
            m.content.toLowerCase().includes(query) ||
            m.author.username.toLowerCase().includes(query)
          );
        }
      });
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(m => {
        const messageDate = new Date(m.created_at).getTime();
        if (dateRange.start && messageDate < new Date(dateRange.start).getTime()) {
          return false;
        }
        if (dateRange.end && messageDate > new Date(dateRange.end).getTime()) {
          return false;
        }
        return true;
      });
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(m => {
        if (!m.tags || m.tags.length === 0) return false;
        return selectedTags.every(tag => m.tags!.includes(tag));
      });
    }

    // Filter type
    if (filterType === 'danmaku') {
      filtered = filtered.filter(m => m.isDanmaku);
    }

    // Sort
    if (sortType === 'likes') {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [messages, filterType, sortType, trendingMessages, searchQuery, searchByUsername, dateRange, selectedTags]);

  // Pagination
  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMessages.slice(startIndex, endIndex);
  }, [filteredMessages, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  // Convert messages to danmaku format with full message info
  const danmakuMessages = useMemo(() => {
    return messages
      .filter(m => m.isDanmaku)
      .map(m => ({
        id: m.id,
        content: m.content,
        color: m.color || DANMAKU_COLORS[0].value,
        speed: Math.random() * 10 + 15,
        y: Math.random() * 70 + 10,
        layer: Math.floor(Math.random() * 3),
        message: m // 添加完整留言信息，用于悬停和交互
      }));
  }, [messages]);

  // Initial Data Loading
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [msgs, danmaku, trending, user] = await Promise.all([
        getMessages(),
        getDanmakuMessages(),
        getTrendingMessages(5),
        getCurrentUserApi()
      ]);

      setMessages(msgs);
      setDanmakuList(danmaku);
      setTrendingMessages(trending);
      setCurrentUser(user);
    } catch (error) {
      toast({
        title: "加载失败",
        description: "无法连接到服务器矩阵，请稍后重试。",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 键盘快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter 发送留言
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      // Ctrl+E 打开表情面板
      else if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        setShowQuickActions(prev => !prev);
      }
      // Ctrl+P 打开常用短语面板
      else if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setShowQuickActions(prev => !prev);
      }
      // Esc 关闭面板
      else if (e.key === 'Escape') {
        setShowQuickActions(false);
        setShowKeyboardHelp(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
}, [newMessage, currentUser]);

// WebSocket 实时通知
useEffect(() => {
  const handleWebSocketEvent = (event: WebSocketEvent) => {
    switch (event.type) {
      case 'new_message':
        toast({
          title: "新留言",
          description: `${event.data.author.username}: ${event.data.content.substring(0, 50)}${event.data.content.length > 50 ? '...' : ''}`,
          duration: 5000,
        });
        // 自动添加到消息列表
        setMessages(prev => [event.data, ...prev]);
        break;
      case 'new_reply':
        toast({
          title: "新回复",
          description: `${event.data.reply.author.username} 回复了留言`,
          duration: 5000,
        });
        // 重新加载数据以获取最新回复
        loadData();
        break;
      case 'message_liked':
        // 更新对应留言的点赞数
        setMessages(prev => prev.map(m => 
          m.id === event.data.messageId 
            ? { ...m, likes: event.data.likes }
            : m
        ));
        break;
      case 'user_online':
        toast({
          title: "用户上线",
          description: `${event.data.username} 已接入网络`,
          duration: 3000,
        });
        break;
      case 'user_offline':
        toast({
          title: "用户离线",
          description: `${event.data.username} 已断开连接`,
          duration: 3000,
        });
        break;
    }
  };

  webSocketService.addHandler(handleWebSocketEvent);
  webSocketService.connect();

  return () => {
    webSocketService.removeHandler(handleWebSocketEvent);
    webSocketService.disconnect();
  };
}, [loadData, toast]);

// Handlers
  const handleSubmit = async () => {
    if (!newMessage.trim()) return;
    if (!currentUser) {
      toast({ title: "权限拒绝", description: "请先登录接入网络。", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const msg = await createMessage({
        content: newMessage,
        color: selectedColor,
        isDanmaku
      });

      setMessages([msg, ...messages]);
      if (isDanmaku) {
        const newDanmaku: DanmakuMessage = {
          id: msg.id,
          content: msg.content,
          color: msg.color || selectedColor,
          speed: Math.random() * 10 + 15,
          y: Math.random() * 70 + 10,
          layer: Math.floor(Math.random() * 3)
        };
        setDanmakuList(prev => [...prev, newDanmaku]);
      }
      setNewMessage('');
      toast({ title: "传输成功", description: "您的信号已广播到网络。" });
    } catch (error) {
      toast({ title: "传输中断", description: "信号发送失败。", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    if (!currentUser) return;
    try {
      await likeMessage(id);
      setMessages(messages.map(m => m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m));
      setTrendingMessages(trendingMessages.map(m => m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m));
    } catch (error) {
      toast({ title: "点赞失败", description: "操作失败。", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      toast({ title: "已删除", description: "该记录已从数据库擦除。" });
    } catch (error) {
      toast({ title: "删除失败", description: "操作被拒绝。", variant: "destructive" });
    }
  };

  const handleEdit = async (messageId: string, newContent: string) => {
    if (!currentUser) return;
    try {
      const editedMessage = await editMessage(messageId, newContent);
      setMessages(messages.map(m => m.id === messageId ? editedMessage : m));
      toast({ title: "编辑成功", description: "留言内容已更新。" });
    } catch (error) {
      throw error;
    }
  };

  const handleMessageReply = async (messageId: string, content: string, parentReplyId?: string) => {
    if (!currentUser) {
      toast({ title: "权限拒绝", description: "请先登录接入网络。", variant: "destructive" });
      return;
    }

    try {
      await replyToMessageWithParent(messageId, content, parentReplyId);
      // 重新加载留言数据以获取最新的回复
      await loadData();
      toast({ title: "回复成功", description: "您的回复已发送。" });
    } catch (error) {
      toast({ title: "回复失败", description: "回复发送失败。", variant: "destructive" });
      throw error;
    }
  };

  const handleLikeReply = async (replyId: string) => {
    if (!currentUser) return;
    try {
      await likeReplyMessage(replyId);
      toast({ title: "点赞成功", description: "您点赞了这条回复。" });
    } catch (error) {
      toast({ title: "点赞失败", description: "操作失败。", variant: "destructive" });
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!currentUser) return;
    try {
      await deleteReplyMessage(replyId);
      // 重新加载留言数据
      await loadData();
      toast({ title: "删除成功", description: "回复已删除。" });
    } catch (error) {
      toast({ title: "删除失败", description: "操作失败。", variant: "destructive" });
    }
  };

  // 检查是否是管理员
  const isAdmin = currentUser?.username === 'admin';

  // 管理功能处理函数
  const handleTogglePin = async (messageId: string, isPinned: boolean) => {
    if (!isAdmin) return;
    try {
      await pinMessage(messageId, isPinned);
      await loadData();
      toast({
        title: isPinned ? "置顶成功" : "取消置顶",
        description: isPinned ? "留言已置顶到顶部。" : "留言已取消置顶。"
      });
    } catch (error) {
      toast({ title: "操作失败", description: "置顶操作失败。", variant: "destructive" });
    }
  };

  const handleToggleFeature = async (messageId: string, isFeatured: boolean) => {
    if (!isAdmin) return;
    try {
      await featureMessage(messageId, isFeatured);
      await loadData();
      toast({
        title: isFeatured ? "设为精华" : "取消精华",
        description: isFeatured ? "留言已标记为精华。" : "留言已取消精华标记。"
      });
    } catch (error) {
      toast({ title: "操作失败", description: "精华操作失败。", variant: "destructive" });
    }
  };

  const handleUpdateTags = async (messageId: string, tags: string[]) => {
    if (!isAdmin) return;
    try {
      await updateMessageTags(messageId, tags);
      await loadData();
      toast({ title: "标签更新成功", description: "留言标签已更新。" });
    } catch (error) {
      toast({ title: "操作失败", description: "标签更新失败。", variant: "destructive" });
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim()) return;
    try {
      await replyToMessage(parentId, replyContent);
      loadData();
      setReplyTo(null);
      setReplyContent('');
      toast({ title: "回复成功", description: "链接已建立。" });
    } catch (error) {
      toast({ title: "回复失败", description: "链接建立失败。", variant: "destructive" });
    }
  };

  const handleReaction = async (emoji: string) => {
    toast({ title: "反应已添加", description: `您添加了 ${emoji} 反应！` });
  };

  // Report handlers
  const handleReportClick = (message: Message) => {
    setReportMessage(message);
    setReportMessageId(message.id);
    setIsReportDialogOpen(true);
  };

  const handleReportSubmit = (reason: string, details: string) => {
    toast({
      title: "举报已提交",
      description: "感谢您的反馈，我们会尽快处理。",
    });
  };

  // 快捷操作处理函数
  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = newMessage;
      const newText = text.substring(0, start) + emoji + text.substring(end);
      setNewMessage(newText);
      // 恢复焦点并设置光标位置
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + emoji.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      setNewMessage(prev => prev + emoji);
    }
  };

  const handlePhraseSelect = (phrase: string) => {
    setNewMessage(prev => prev + (prev ? ' ' : '') + phrase);
    setShowQuickActions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // 弹幕交互处理函数
  const handleDanmakuClick = (messageId: string) => {
    // 滚动到对应的留言卡片
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 高亮效果
      messageElement.classList.add('ring-2', 'ring-tech-cyan');
      setTimeout(() => {
        messageElement.classList.remove('ring-2', 'ring-tech-cyan');
      }, 2000);
    } else {
      toast({
        title: "未找到留言",
        description: "该留言可能已被删除或不在当前视图中。",
        variant: "destructive"
      });
    }
  };

  const handleCopyDanmaku = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "复制成功",
        description: "弹幕内容已复制到剪贴板。"
      });
    }).catch(() => {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板。",
        variant: "destructive"
      });
    });
  };

  const handleReportDanmaku = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      handleReportClick(message);
    }
  };

  const handleBlockUser = (userId: string) => {
    // 这里可以实现屏蔽用户的功能，暂时显示提示
    toast({
      title: "功能开发中",
      description: "用户屏蔽功能即将推出。",
    });
  };

  // Search handler
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, 300);

  const handleMessageChange = (value: string) => {
    setNewMessage(value);
    setPreviewContent(value);
    setShowPreview(value.length > 0);
  };

  const handleQuickReply = (text: string) => {
    setNewMessage(prev => prev + ' ' + text);
    setPreviewContent(prev => prev + ' ' + text);
  };

  const quickReplies = [
    '👍 精彩！',
    '🔥 太棒了！',
    '🚀 同感！',
    '✨ 不错！',
    '💪 强！'
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-manrope relative">
      <InteractiveCursor />

      {/* Background Grid & Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tech-purple/20 via-background to-background pointer-events-none z-0" />

      {/* Enhanced Danmaku Layer */}
      <EnhancedDanmaku
        messages={danmakuMessages}
        isPaused={isDanmakuPaused}
        onTogglePause={() => setIsDanmakuPaused(!isDanmakuPaused)}
        rainbowMode={rainbowMode}
        onToggleRainbow={() => setRainbowMode(!rainbowMode)}
        onMessageClick={handleDanmakuClick}
        onCopyMessage={handleCopyDanmaku}
        onReportMessage={handleReportDanmaku}
        onBlockUser={handleBlockUser}
      />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <FadeIn direction="down" delay={0} className="mb-16 text-center space-y-4">
          <GlitchText text="CYBER GUESTBOOK" className="text-5xl md:text-7xl mb-2" />
          <p className="text-tech-cyan/80 font-mono tracking-widest text-sm md:text-base uppercase">
            &lt; 系统状态: 在线 / 请留下您的留言 /&gt;
          </p>
        </FadeIn>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">

          {/* Main Input Area */}
          <ScaleIn delay={0.1} className="md:col-span-7 lg:col-span-8">
            <HoloCard variant="cyan" className="h-full p-6" tiltStrength={5} glowIntensity={0.2}>
              <div className="flex items-center justify-between mb-6 border-b border-tech-cyan/20 pb-4">
                <div className="flex items-center gap-2">
                  <Zap className="text-tech-cyan w-5 h-5 animate-pulse" />
                  <h2 className="font-syne font-bold text-xl tracking-wider">新传输</h2>
                </div>
                {currentUser && (
                  <UserLevelBadge
                    level={userLevels[currentUser.username] || 1}
                    size="sm"
                    showProgress={false}
                    achievements={userAchievements[currentUser.username] || []}
                  />
                )}
              </div>

              <div className="space-y-4">
                <Textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  placeholder="输入你的留言... (支持 Markdown，Ctrl+Enter 快速发送)"
                  className="bg-black/40 border-tech-cyan/30 text-white min-h-[120px] focus:border-tech-cyan focus:ring-tech-cyan/20 resize-none font-mono"
                />

                {/* 快捷操作按钮 */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className={cn(
                      "flex items-center gap-1 sm:gap-2 px-3 sm:px-3 py-2 sm:py-1.5 rounded-lg border text-xs sm:text-sm transition-all min-h-[44px]",
                      showQuickActions
                        ? "bg-tech-cyan/20 border-tech-cyan/50 text-tech-cyan"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                    )}
                  >
                    <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline sm:inline">表情 & 常用语</span>
                    <span className="xs:hidden sm:hidden">表情</span>
                  </button>
                  <button
                    onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-3 py-2 sm:py-1.5 rounded-lg border text-xs sm:text-sm bg-white/5 border-white/10 text-white/60 hover:border-white/20 transition-all min-h-[44px]"
                  >
                    <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline sm:inline">快捷键</span>
                    <span className="xs:hidden sm:hidden">快捷</span>
                  </button>
                  <span className="text-xs text-white/30 font-mono ml-auto hidden sm:inline">
                    Ctrl+Enter 发送 | Ctrl+E 表情 | Ctrl+P 常用语
                  </span>
                </div>

                {/* 快捷操作面板 */}
                <AnimatePresence>
                  {showQuickActions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <QuickActionsPanel
                        onEmojiSelect={handleEmojiSelect}
                        onPhraseSelect={handlePhraseSelect}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 键盘快捷键帮助 */}
                <KeyboardShortcutHelp
                  isOpen={showKeyboardHelp}
                  onClose={() => setShowKeyboardHelp(false)}
                />

                {/* Live Preview */}
                {showPreview && previewContent && (
                  <motion.div
                    className="mt-4 p-4 rounded-lg border border-tech-cyan/20 bg-tech-cyan/5"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="text-xs text-tech-cyan/60 mb-2 font-mono">实时预览</div>
                    <MarkdownRenderer
                      content={previewContent}
                      className="max-h-48 overflow-y-auto"
                      maxHeight="12rem"
                    />
                  </motion.div>
                )}

                {/* Quick Replies */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-white/40 font-mono">快捷回复:</span>
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/70 hover:border-tech-cyan/50 hover:text-tech-cyan hover:bg-tech-cyan/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {DANMAKU_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setSelectedColor(c.value)}
                          className={cn(
                            "w-6 h-6 rounded-sm border transition-transform hover:scale-110",
                            selectedColor === c.value ? "border-white scale-110" : "border-transparent opacity-70"
                          )}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <input
                        type="checkbox"
                        id="danmaku-toggle"
                        checked={isDanmaku}
                        onChange={(e) => setIsDanmaku(e.target.checked)}
                        className="accent-tech-cyan w-4 h-4"
                      />
                      <label htmlFor="danmaku-toggle" className="text-xs text-tech-cyan/80 font-mono cursor-pointer uppercase">
                        启用弹幕
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !newMessage.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-tech-cyan text-black font-bold uppercase tracking-wider hover:bg-tech-lightcyan transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        发送中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        发送信号
                      </>
                    )}
                  </button>
                </div>
              </div>
            </HoloCard>
          </ScaleIn>

          {/* Side Panel: Stats */}
          <FadeIn direction="right" delay={0.2} className="md:col-span-5 lg:col-span-4 space-y-6">
            <RealTimeStats />
          </FadeIn>
        </div>

        {/* Filter & Sort Bar */}
        <FadeIn delay={0.3} className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-cyan" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchByUsername ? "搜索用户名..." : "搜索留言..."}
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:border-tech-cyan focus:ring-tech-cyan/20 focus:outline-none transition-all"
              />
            </div>

            {/* Advanced Search Toggle */}
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all",
                showAdvancedSearch || searchByUsername || dateRange.start || dateRange.end || selectedTags.length > 0
                  ? "bg-tech-purple text-white"
                  : "bg-black/40 text-white/70 hover:bg-white/5"
              )}
              title="高级筛选"
            >
              <Hash className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">高级筛选</span>
              <span className="sm:hidden">筛选</span>
              <span className="ml-1">{showAdvancedSearch ? "▼" : "▶"}</span>
            </button>

            {/* Advanced Search Panel */}
            <AnimatePresence>
              {showAdvancedSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mt-4 p-4 rounded-lg bg-black/30 border border-white/10 space-y-4"
                >
                  {/* Search Mode */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="search-by-username"
                      checked={searchByUsername}
                      onChange={(e) => {
                        setSearchByUsername(e.target.checked);
                        setCurrentPage(1);
                      }}
                      className="accent-tech-cyan w-4 h-4"
                    />
                    <label htmlFor="search-by-username" className="text-xs text-white/70">
                      仅搜索用户名
                    </label>
                  </div>

                  {/* Date Range */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-tech-cyan" />
                      <span className="text-xs text-white/50">日期范围:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => {
                          setDateRange({ ...dateRange, start: e.target.value });
                          setCurrentPage(1);
                        }}
                        className="px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs focus:border-tech-cyan focus:outline-none"
                      />
                      <span className="text-xs text-white/40">至</span>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => {
                          setDateRange({ ...dateRange, end: e.target.value });
                          setCurrentPage(1);
                        }}
                        className="px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs focus:border-tech-cyan focus:outline-none"
                      />
                    </div>
                    {(dateRange.start || dateRange.end) && (
                      <button
                        onClick={() => setDateRange({ start: '', end: '' })}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        清除
                      </button>
                    )}
                  </div>

                  {/* Tags */}
                  {allTags.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-tech-cyan" />
                        <span className="text-xs text-white/50">标签筛选:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSelectedTags(prev =>
                                prev.includes(tag)
                                  ? prev.filter(t => t !== tag)
                                  : [...prev, tag]
                              );
                              setCurrentPage(1);
                            }}
                            className={cn(
                              "px-3 py-1 rounded-full text-xs transition-all",
                              selectedTags.includes(tag)
                                ? "bg-tech-cyan text-black font-bold"
                                : "bg-black/40 text-white/70 hover:bg-white/10"
                            )}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                      {selectedTags.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedTags([]);
                            setCurrentPage(1);
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          清除标签 ({selectedTags.length})
                        </button>
                      )}
                    </div>
                  )}

                  {/* Clear All Filters */}
                  <button
                    onClick={() => {
                      setSearchByUsername(false);
                      setDateRange({ start: '', end: '' });
                      setSelectedTags([]);
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="w-full py-2 rounded-lg border border-white/10 text-xs text-white/50 hover:bg-white/5 hover:text-white transition-all"
                  >
                    清除所有筛选
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-tech-cyan hidden sm:block" />
              <div className="flex gap-1">
                {(['all', 'danmaku', 'popular'] as FilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all",
                      filterType === type
                        ? "bg-tech-cyan text-black"
                        : "bg-black/40 text-white/70 hover:bg-white/5"
                    )}
                  >
                    {type === 'all' && '全部'}
                    {type === 'danmaku' && '弹幕'}
                    {type === 'popular' && '热门'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-tech-cyan hidden sm:block" />
              <div className="flex gap-1">
                {(['time', 'likes'] as SortType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSortType(type)}
                    className={cn(
                      "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2",
                      sortType === type
                        ? "bg-tech-purple text-white"
                        : "bg-black/40 text-white/70 hover:bg-white/5"
                    )}
                  >
                    {type === 'time' && <Clock className="w-3 h-3" />}
                    {type === 'likes' && <Heart className="w-3 h-3" />}
                    <span className="hidden sm:inline">
                      {type === 'time' && '最新'}
                      {type === 'likes' && '最热'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadData}
                className="text-tech-cyan hover:bg-tech-cyan/10 hover:text-tech-cyan"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                刷新
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Message Stream */}
        <FadeIn delay={0.4} className="relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-syne font-bold flex items-center gap-2">
              <Hash className="text-tech-cyan" />
              信号流
              <span className="text-sm font-mono text-white/40 ml-2">
                ({searchQuery ? '搜索结果' : '全部'}: {filteredMessages.length})
              </span>
            </h2>
            <div className="text-sm text-white/40 font-mono">
              第 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredMessages.length)} 条
            </div>
          </div>

          {/* Virtual Scroll Message List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/10 p-4 bg-white/5 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="w-24 h-3 rounded" />
                        <Skeleton className="w-16 h-2 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="w-10 h-5 rounded-full" />
                      <Skeleton className="w-10 h-5 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <Skeleton className="w-full h-3 rounded" />
                    <Skeleton className="w-4/5 h-3 rounded" />
                    <Skeleton className="w-3/5 h-3 rounded" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex gap-2">
                      <Skeleton className="w-12 h-8 rounded-lg" />
                      <Skeleton className="w-12 h-8 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-12 h-8 rounded-lg" />
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <motion.div
              className="text-center py-20 text-white/30 font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white/20" />
              {searchQuery ? '未找到匹配的留言' : '暂无信号...'}
            </motion.div>
          ) : (
            <VirtualMessageList
              messages={filteredMessages}
              currentUser={currentUser}
              isAdmin={isAdmin}
              onLike={handleLike}
              onDelete={handleDelete}
              onReply={(msg) => setReplyTo(replyTo?.id === msg.id ? null : msg)}
              onReport={handleReportClick}
              onEdit={handleEdit}
              onMessageReply={handleMessageReply}
              onLikeReply={handleLikeReply}
              onDeleteReply={handleDeleteReply}
              onTogglePin={handleTogglePin}
              onToggleFeature={handleToggleFeature}
              onUpdateTags={handleUpdateTags}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <MessagePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </motion.div>
          )}
        </FadeIn>

        {/* Report Dialog */}
        <ReportDialog
          isOpen={isReportDialogOpen}
          onClose={() => setIsReportDialogOpen(false)}
          onSubmit={handleReportSubmit}
          messageAuthor={reportMessage?.author.username}
          messageContent={reportMessage?.content}
        />
      </div>
    </div>
  );
}
