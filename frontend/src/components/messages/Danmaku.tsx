'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface DanmakuProps {
  messages: Message[];
  isPlaying?: boolean;
  className?: string;
  density?: number; // 弹幕密度百分比 (0-100)
}

interface DanmakuItem extends Message {
  top: number;
  duration: number;
  delay: number;
  fontSize: number; // 字体大小
  opacity: number;  // 透明度
}

export default function Danmaku({ messages, isPlaying = true, className, density = 50 }: DanmakuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [danmakuItems, setDanmakuItems] = useState<DanmakuItem[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const animationFrameRef = useRef<number>();

  // 计算弹幕位置
  const calculateDanmakuPosition = useCallback((existingItems: DanmakuItem[]): number => {
    if (!containerRef.current) return 0;

    const trackHeight = 40; // 每条轨道高度
    const tracks = Math.floor(containerHeight / trackHeight);

    // 随机选择一个轨道
    const track = Math.floor(Math.random() * tracks);
    return track * trackHeight + 10;
  }, [containerHeight]);

  // 初始化弹幕
  useEffect(() => {
    if (!containerRef.current || messages.length === 0) return;

    const height = containerRef.current.clientHeight;
    setContainerHeight(height);

    // 根据密度过滤消息
    const filteredMessages = messages.filter(() => Math.random() * 100 < density);

    const items: DanmakuItem[] = filteredMessages.map((msg, index) => ({
      ...msg,
      top: (index % Math.floor(height / 40)) * 40 + 10,
      duration: 15 + Math.random() * 10, // 15-25秒
      delay: index * 2 + Math.random() * 5, // 错开时间
      fontSize: 14 + Math.random() * 4, // 随机字体大小 (14-18px)
      opacity: 0.7 + Math.random() * 0.3, // 随机透明度 (0.7-1.0)
    }));

    setDanmakuItems(items);
  }, [messages, density]);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (messages.length === 0) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden bg-gradient-to-b from-background/50 to-background/30",
          "flex items-center justify-center text-muted-foreground",
          className
        )}
      >
        <p className="text-sm">暂无弹幕，快来发表第一条留言吧！</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/90",
        "dark:from-slate-950/90 dark:via-slate-900/80 dark:to-slate-950/90",
        className
      )}
    >
      {/* 背景网格效果 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* 弹幕轨道 */}
      {danmakuItems.map((item) => (
        <div
          key={item.id}
          className={cn(
            "absolute whitespace-nowrap",
            "px-4 py-1.5 rounded-full",
            "backdrop-blur-sm bg-black/20",
            "border border-white/10",
            "shadow-lg",
            isPlaying && "animate-danmaku"
          )}
          style={{
            top: item.top,
            color: item.color || '#FFFFFF',
            textShadow: '0 0 8px currentColor, 0 0 20px currentColor',
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            willChange: 'transform',
            fontSize: `${item.fontSize}px`,
            opacity: item.opacity,
          }}
        >
          <span className="flex items-center gap-2">
            {item.author.avatar && (
              <img
                src={item.author.avatar}
                alt={item.author.username}
                className="w-5 h-5 rounded-full border border-white/30"
              />
            )}
            <span className="font-medium opacity-80">
              {item.author.username}:
            </span>
            <span>{item.content}</span>
          </span>
        </div>
      ))}

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
    </div>
  );
}