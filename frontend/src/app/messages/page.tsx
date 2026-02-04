'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Heart, MessageSquare, BarChart2, 
  Zap, Hash, Sparkles, RefreshCw, Trash2, Reply
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import GlitchText from '@/components/ui/GlitchText';
import NeonCard from '@/components/ui/NeonCard';
import CyberButton from '@/components/ui/CyberButton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 弹幕组件
const DanmakuItem = ({ message, style, onComplete }: { message: Message, style: React.CSSProperties, onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ x: '100vw' }}
      animate={{ x: '-100vw' }}
      transition={{ 
        duration: Math.random() * 10 + 15, 
        ease: "linear",
        repeat: Infinity 
      }}
      className="absolute whitespace-nowrap pointer-events-none select-none z-0"
      style={style}
      onAnimationComplete={onComplete}
    >
      <span 
        className="text-lg font-bold px-4 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/10"
        style={{ color: message.color || '#fff' }}
      >
        {message.content}
      </span>
    </motion.div>
  );
};

export default function MessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [danmakuList, setDanmakuList] = useState<Message[]>([]);
  const [trendingMessages, setTrendingMessages] = useState<Message[]>([]);
  const [activityStats, setActivityStats] = useState<{date: string, count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Input states
  const [newMessage, setNewMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(DANMAKU_COLORS[0].value);
  const [isDanmaku, setIsDanmaku] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Initial Data Loading
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [msgs, danmaku, trending, activity, user] = await Promise.all([
        getMessages(),
        getDanmakuMessages(),
        getTrendingMessages(5),
        getMessageActivity(7),
        getCurrentUserApi()
      ]);
      
      setMessages(msgs);
      setDanmakuList(danmaku);
      setTrendingMessages(trending);
      setActivityStats(activity);
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
      if (isDanmaku) setDanmakuList([...danmakuList, msg]);
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
      // Refresh messages to show reply (simplified)
      loadData();
      setReplyTo(null);
      setReplyContent('');
      toast({ title: "回复成功", description: "链接已建立。" });
    } catch (error) {
      toast({ title: "回复失败", description: "链接建立失败。", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F23] text-white overflow-x-hidden font-manrope relative">
      {/* Background Grid & Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tech-purple/20 via-[#0F0F23] to-[#0F0F23] pointer-events-none z-0" />
      
      {/* Danmaku Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
        {danmakuList.slice(0, 30).map((msg, i) => (
          <DanmakuItem 
            key={msg.id} 
            message={msg} 
            style={{ 
              top: `${(i * 5) % 80 + 10}%`,
              fontSize: `${Math.random() * 1 + 1}rem` 
            }}
            onComplete={() => {}}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <header className="mb-16 text-center space-y-4">
          <GlitchText text="CYBER GUESTBOOK" className="text-5xl md:text-7xl mb-2" />
          <p className="text-tech-cyan/80 font-mono tracking-widest text-sm md:text-base uppercase">
            &lt; 系统状态: 在线 / 请留下您的留言 /&gt;
          </p>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          
          {/* Main Input Area (HUD Style) */}
          <div className="md:col-span-8">
            <NeonCard className="h-full p-6 bg-black/60 border-tech-cyan/30" variant="primary" glow>
              <div className="flex items-center gap-2 mb-6 border-b border-tech-cyan/20 pb-4">
                <Zap className="text-tech-cyan w-5 h-5 animate-pulse" />
                <h2 className="font-syne font-bold text-xl tracking-wider">新传输</h2>
              </div>
              
              <div className="space-y-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="输入你的留言..."
                  className="bg-black/40 border-tech-cyan/30 text-white min-h-[120px] focus:border-tech-cyan focus:ring-tech-cyan/20 resize-none font-mono"
                />
                
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
                  
                  <CyberButton
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    disabled={!newMessage.trim()}
                    className="w-full md:w-auto"
                  >
                    发送信号 <Send className="w-4 h-4 ml-2 inline" />
                  </CyberButton>
                </div>
              </div>
            </NeonCard>
          </div>

          {/* Side Panel: Stats & Trending */}
          <div className="md:col-span-4 space-y-6">
            {/* Stats Card */}
            <NeonCard className="p-5 bg-black/60 border-tech-purple/30" variant="secondary">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="text-tech-purple w-5 h-5" />
                <h3 className="font-syne font-bold text-lg">网络活动</h3>
              </div>
              <div className="flex items-end justify-between h-24 gap-1">
                {activityStats.map((stat, i) => {
                  const max = Math.max(...activityStats.map(s => s.count), 1);
                  const height = (stat.count / max) * 100;
                  return (
                    <div key={i} className="flex flex-col items-center flex-1 group">
                      <div className="w-full bg-white/5 rounded-t-sm h-full relative overflow-hidden">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          className="absolute bottom-0 w-full bg-tech-purple/60 group-hover:bg-tech-purple transition-colors"
                        />
                      </div>
                      <span className="text-[10px] text-white/40 mt-1 font-mono">{stat.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </NeonCard>

            {/* Trending Card */}
            <NeonCard className="p-5 bg-black/60 border-tech-pink/30 flex-1" variant="accent">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-tech-pink w-5 h-5" />
                <h3 className="font-syne font-bold text-lg">热门信号</h3>
              </div>
              <div className="space-y-3">
                {trendingMessages.map((msg, i) => (
                  <div key={msg.id} className="flex items-start gap-3 text-sm group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                    <span className="font-mono text-tech-pink font-bold">0{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-white/80 group-hover:text-white transition-colors">{msg.content}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                        <span>@{msg.author.username}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {msg.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </NeonCard>
          </div>
        </div>

        {/* Message Stream */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-syne font-bold flex items-center gap-2">
              <Hash className="text-tech-cyan" />
              信号流
            </h2>
            <Button variant="ghost" size="sm" onClick={loadData} className="text-tech-cyan hover:bg-tech-cyan/10 hover:text-tech-cyan">
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              刷新
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <NeonCard 
                    className="h-full flex flex-col p-5 bg-black/40 hover:bg-black/60 transition-colors"
                    style={{ borderColor: `${msg.color}40` }}
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
                          <div className="text-xs text-white/50 font-mono">
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: zhCN })}
                          </div>
                        </div>
                      </div>
                      {currentUser?.id === msg.author.id && (
                        <button 
                          onClick={() => handleDelete(msg.id)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-white/80 mb-6 flex-1 leading-relaxed break-words" style={{ color: msg.color }}>
                      {msg.content}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleLike(msg.id)}
                          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-tech-pink transition-colors group"
                        >
                          <Heart className="w-4 h-4 group-hover:fill-tech-pink transition-colors" />
                          {msg.likes}
                        </button>
                        <button
                          onClick={() => setReplyTo(replyTo?.id === msg.id ? null : msg)}
                          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-tech-cyan transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          回复
                        </button>
                      </div>
                      {msg.isDanmaku && (
                        <Badge variant="outline" className="text-[10px] border-white/10 text-white/30 px-1 py-0 h-5">
                          弹幕
                        </Badge>
                      )}
                    </div>

                    {/* Reply Input */}
                    <AnimatePresence>
                      {replyTo?.id === msg.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-4"
                        >
                          <div className="flex gap-2">
                            <Input
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="回复内容..."
                              className="h-8 text-xs bg-black/50 border-white/10"
                            />
                            <Button size="sm" className="h-8 w-8 p-0 bg-tech-cyan text-black hover:bg-tech-cyan/80" onClick={() => handleReplySubmit(msg.id)}>
                              <Reply className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </NeonCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-20 text-white/30 font-mono">
              暂无信号...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
