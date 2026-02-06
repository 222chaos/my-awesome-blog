'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Heart, MessageSquare, BarChart2,
  Zap, Hash, Sparkles, RefreshCw, Trash2, Reply,
  Filter, Clock, Flame, SortAsc, Search, Flag
} from 'lucide-react';
import { 
  getMessages, createMessage, likeMessage, 
  deleteMessage, replyToMessage, getDanmakuMessages,
  getTrendingMessages, getMessageActivity, DANMAKU_COLORS
} from '@/services/messageService';
import { getCurrentUserApi } from '@/lib/api/auth';
import { Message, UserProfile } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/Button';
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
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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

  // Search, Pagination, and Report states
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter and sort messages
  const filteredMessages = useCallback(() => {
    let filtered = [...messages];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.content.toLowerCase().includes(query) ||
        m.author.username.toLowerCase().includes(query)
      );
    }

    if (filterType === 'danmaku') {
      filtered = filtered.filter(m => m.isDanmaku);
    }

    if (sortType === 'likes') {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (filterType === 'popular') {
      filtered = trendingMessages;
    }

    return filtered;
  }, [messages, filterType, sortType, trendingMessages, searchQuery]);

  // Pagination
  const paginatedMessages = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMessages().slice(startIndex, endIndex);
  }, [filteredMessages, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMessages().length / itemsPerPage);

  // Convert messages to danmaku format
  const danmakuMessages = useCallback(() => {
    return messages
      .filter(m => m.isDanmaku)
      .map(m => ({
        id: m.id,
        content: m.content,
        color: m.color || DANMAKU_COLORS[0].value,
        speed: Math.random() * 10 + 15,
        y: Math.random() * 70 + 10,
        layer: Math.floor(Math.random() * 3)
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
      console.error('Failed to load data', error);
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
      console.error('Like failed', error);
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

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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
    <div className="min-h-screen bg-[#0F0F23] text-white overflow-x-hidden font-manrope relative">
      <InteractiveCursor />

      {/* Background Grid & Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tech-purple/20 via-[#0F0F23] to-[#0F0F23] pointer-events-none z-0" />

      {/* Enhanced Danmaku Layer */}
      <EnhancedDanmaku
        messages={danmakuMessages}
        isPaused={isDanmakuPaused}
        onTogglePause={() => setIsDanmakuPaused(!isDanmakuPaused)}
        rainbowMode={rainbowMode}
        onToggleRainbow={() => setRainbowMode(!rainbowMode)}
      />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.header
          className="mb-16 text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlitchText text="CYBER GUESTBOOK" className="text-5xl md:text-7xl mb-2" />
          <p className="text-tech-cyan/80 font-mono tracking-widest text-sm md:text-base uppercase">
            &lt; 系统状态: 在线 / 请留下您的留言 /&gt;
          </p>
        </motion.header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">

          {/* Main Input Area */}
          <motion.div
            className="md:col-span-7 lg:col-span-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
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
                  value={newMessage}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  placeholder="输入你的留言... (支持 Markdown)"
                  className="bg-black/40 border-tech-cyan/30 text-white min-h-[120px] focus:border-tech-cyan focus:ring-tech-cyan/20 resize-none font-mono"
                />

                {/* Live Preview */}
                {showPreview && previewContent && (
                  <motion.div
                    className="mt-4 p-4 rounded-lg border border-tech-cyan/20 bg-tech-cyan/5"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="text-xs text-tech-cyan/60 mb-2 font-mono">实时预览</div>
                    <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                      {previewContent
                        .replace(/@\w+/g, '<span class="text-tech-cyan font-bold">$&</span>')
                        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-tech-lightcyan hover:underline" target="_blank">$1</a>')
                      }
                    </div>
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

                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !newMessage.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-tech-cyan text-black font-bold uppercase tracking-wider hover:bg-tech-lightcyan transition-all"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,217,255,0.4)' }}
                    whileTap={{ scale: 0.98 }}
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
                  </motion.button>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* Side Panel: Stats */}
          <motion.div
            className="md:col-span-5 lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RealTimeStats />
          </motion.div>
        </div>

        {/* Filter & Sort Bar */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-cyan" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="搜索留言..."
                className="pl-10 pr-4 py-2 w-64 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:border-tech-cyan focus:ring-tech-cyan/20 focus:outline-none transition-all"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-tech-cyan" />
              <div className="flex gap-1">
                {(['all', 'danmaku', 'popular'] as FilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
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
              <SortAsc className="w-4 h-4 text-tech-cyan" />
              <div className="flex gap-1">
                {(['time', 'likes'] as SortType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSortType(type)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      sortType === type
                        ? "bg-tech-purple text-white"
                        : "bg-black/40 text-white/70 hover:bg-white/5"
                    )}
                  >
                    {type === 'time' && <Clock className="w-3 h-3" />}
                    {type === 'likes' && <Heart className="w-3 h-3" />}
                    {type === 'time' && '最新'}
                    {type === 'likes' && '最热'}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
        </motion.div>

        {/* Message Stream */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-syne font-bold flex items-center gap-2">
              <Hash className="text-tech-cyan" />
              信号流
              <span className="text-sm font-mono text-white/40 ml-2">
                ({searchQuery ? '搜索结果' : '全部'}: {filteredMessages().length})
              </span>
            </h2>
            <div className="text-sm text-white/40 font-mono">
              第 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredMessages().length)} 条
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {paginatedMessages().map((msg, index) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <HoloCard
                    variant={index % 3 === 0 ? 'cyan' : index % 3 === 1 ? 'purple' : 'pink'}
                    className="h-full flex flex-col p-5"
                    tiltStrength={3}
                    glowIntensity={0.15}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-white/20">
                          <AvatarImage src={msg.author.avatar || undefined} />
                          <AvatarFallback className="bg-tech-darkblue text-tech-cyan">
                            {msg.author.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-sm text-white/90">@{msg.author.username}</div>
                          <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: zhCN })}
                            <UserLevelBadge
                              level={userLevels[msg.author.username] || 1}
                              size="sm"
                              showProgress={false}
                            />
                          </div>
                        </div>
                      </div>

                      {currentUser?.id === msg.author.id && (
                        <motion.button
                          onClick={() => handleDelete(msg.id)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>

                    <p className="text-white/80 mb-6 flex-1 leading-relaxed break-words" style={{ color: msg.color }}>
                      {msg.content}
                    </p>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      {/* Reactions */}
                      <MessageReactions
                        messageId={msg.id}
                        reactions={[
                          { emoji: '❤️', count: Math.floor(Math.random() * 10), users: [] },
                          { emoji: '👍', count: Math.floor(Math.random() * 5), users: [] }
                        ]}
                        currentUser={currentUser?.id}
                        onReaction={handleReaction}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setReplyTo(replyTo?.id === msg.id ? null : msg)}
                            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-tech-cyan transition-colors"
                          >
                            <Reply className="w-4 h-4" />
                            回复
                          </button>
                          {msg.isDanmaku && (
                            <span className="flex items-center gap-1.5 text-xs text-tech-pink/80 border border-tech-pink/30 px-2 py-0.5 rounded-full">
                              <Flame className="w-3 h-3" />
                              弹幕
                            </span>
                          )}
                          <button
                            onClick={() => handleReportClick(msg)}
                            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-tech-pink transition-colors"
                            title="举报"
                          >
                            <Flag className="w-4 h-4" />
                            举报
                          </button>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-white/40 font-mono">
                          <Heart className={cn("w-4 h-4", msg.likes && msg.likes > 0 && "fill-tech-pink")} />
                          <span>{msg.likes || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reply Input */}
                    <AnimatePresence>
                      {replyTo?.id === msg.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-2">
                            <input
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="回复内容..."
                              className="flex-1 px-3 py-2 text-sm rounded-lg bg-black/50 border border-white/10 focus:border-tech-cyan focus:ring-tech-cyan/20"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleReplySubmit(msg.id)}
                              className="bg-tech-cyan text-black hover:bg-tech-lightcyan"
                            >
                              <Reply className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </HoloCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {paginatedMessages().length === 0 && !isLoading && (
            <motion.div
              className="text-center py-20 text-white/30 font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white/20" />
              {searchQuery ? '未找到匹配的留言' : '暂无信号...'}
            </motion.div>
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
        </motion.div>

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
