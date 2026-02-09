'use client';

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Rainbow, Layers, Zap, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DanmakuMessage {
  id: string;
  content: string;
  color: string;
  speed: number;
  y: number;
  layer: number;
  author?: string;
  timestamp?: number;
}

interface OptimizedDanmakuProps {
  messages: DanmakuMessage[];
  className?: string;
  isPaused?: boolean;
  onTogglePause?: () => void;
  rainbowMode?: boolean;
  onToggleRainbow?: () => void;
  maxCount?: number;
  density?: 'low' | 'medium' | 'high';
}

// 优化后的图层配置
const LAYERS = [
  { zIndex: 100, speed: 20, opacity: 0.8, scale: 0.85, yRange: [5, 30] },
  { zIndex: 200, speed: 15, opacity: 0.9, scale: 0.95, yRange: [35, 65] },
  { zIndex: 300, speed: 12, opacity: 1, scale: 1, yRange: [70, 90] }
];

// 密度配置
const DENSITY_CONFIG = {
  low: { maxCount: 15, interval: 800, collisionThreshold: 50 },
  medium: { maxCount: 30, interval: 500, collisionThreshold: 35 },
  high: { maxCount: 50, interval: 300, collisionThreshold: 25 }
};

// 对象池实现
class DanmakuPool {
  private pool: HTMLDivElement[] = [];
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  acquire(): HTMLDivElement {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return document.createElement('div');
  }

  release(element: HTMLDivElement): void {
    if (this.pool.length < this.maxSize) {
      // 清理元素
      element.innerHTML = '';
      element.style.cssText = '';
      this.pool.push(element);
    }
  }

  clear(): void {
    this.pool = [];
  }
}

// 批量处理器
class BatchProcessor {
  private queue: DanmakuMessage[] = [];
  private callback: (messages: DanmakuMessage[]) => void;
  private timer: NodeJS.Timeout | null = null;
  private batchSize: number;
  private interval: number;

  constructor(
    callback: (messages: DanmakuMessage[]) => void,
    batchSize = 5,
    interval = 100
  ) {
    this.callback = callback;
    this.batchSize = batchSize;
    this.interval = interval;
  }

  add(message: DanmakuMessage): void {
    this.queue.push(message);
    if (!this.timer) {
      this.timer = setTimeout(() => this.process(), this.interval);
    }
  }

  private process(): void {
    const batch = this.queue.splice(0, this.batchSize);
    if (batch.length > 0) {
      this.callback(batch);
    }

    if (this.queue.length > 0) {
      this.timer = setTimeout(() => this.process(), this.interval);
    } else {
      this.timer = null;
    }
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.queue.length > 0) {
      this.callback([...this.queue]);
      this.queue = [];
    }
  }

  clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.queue = [];
  }
}

// 单个弹幕组件 - 使用 memo 避免不必要的重渲染
const DanmakuItem = memo(function DanmakuItem({
  msg,
  isPaused,
  rainbowMode,
  onComplete,
  onHover,
  onClick
}: {
  msg: DanmakuMessage;
  isPaused: boolean;
  rainbowMode: boolean;
  onComplete: (id: string) => void;
  onHover: (id: string | null) => void;
  onClick: (msg: DanmakuMessage) => void;
}) {
  const layerConfig = LAYERS[msg.layer];

  return (
    <motion.div
      key={msg.id}
      initial={{ x: '100vw', opacity: 0 }}
      animate={isPaused ? { x: '100vw' } : { x: '-100vw', opacity: [0, 1, 1, 0] }}
      transition={{
        duration: msg.speed,
        ease: 'linear',
        times: [0, 0.05, 0.95, 1]
      }}
      onAnimationComplete={() => !isPaused && onComplete(msg.id)}
      onMouseEnter={() => onHover(msg.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(msg)}
      className="absolute whitespace-nowrap cursor-pointer pointer-events-auto"
      style={{
        top: `${msg.y}%`,
        zIndex: layerConfig.zIndex,
        opacity: layerConfig.opacity,
        transform: `translateZ(0) scale(${layerConfig.scale})`,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
      whileHover={{ scale: layerConfig.scale * 1.1 }}
    >
      <span
        className={cn(
          'text-base font-bold px-3 py-1 rounded-full backdrop-blur-md border',
          'inline-block transition-all duration-200',
          rainbowMode ? 'animate-rainbow-shift' : ''
        )}
        style={{
          color: rainbowMode ? 'hsl(var(--rainbow-hue), 80%, 60%)' : msg.color,
          background: rainbowMode
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.5)',
          borderColor: rainbowMode
            ? 'hsl(var(--rainbow-hue), 80%, 60%)'
            : `${msg.color}50`,
          boxShadow: rainbowMode
            ? '0 0 15px hsl(var(--rainbow-hue), 80%, 60%, 0.3)'
            : `0 0 10px ${msg.color}25`,
          transform: 'translateZ(0)',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility'
        }}
      >
        {msg.content}
      </span>
    </motion.div>
  );
});

export default function OptimizedDanmaku({
  messages,
  className,
  isPaused = false,
  onTogglePause,
  rainbowMode = false,
  onToggleRainbow,
  maxCount = 30,
  density = 'medium'
}: OptimizedDanmakuProps) {
  const [activeMessages, setActiveMessages] = useState<DanmakuMessage[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<DanmakuMessage | null>(null);
  const [currentDensity, setCurrentDensity] = useState(density);
  const [showSettings, setShowSettings] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef(new DanmakuPool(50));
  const batchProcessorRef = useRef<BatchProcessor | null>(null);
  const processedIdsRef = useRef(new Set<string>());
  const rafRef = useRef<number | null>(null);

  const config = DENSITY_CONFIG[currentDensity];

  // 限制消息数量
  const limitedMessages = useMemo(() => {
    return messages.slice(0, maxCount);
  }, [messages, maxCount]);

  // 初始化批量处理器
  useEffect(() => {
    batchProcessorRef.current = new BatchProcessor(
      (batch) => {
        setActiveMessages((prev) => {
          const newMessages = [...prev, ...batch];
          // 保持最大数量限制
          if (newMessages.length > config.maxCount) {
            return newMessages.slice(-config.maxCount);
          }
          return newMessages;
        });
      },
      3,
      config.interval
    );

    return () => {
      batchProcessorRef.current?.clear();
    };
  }, [config.maxCount, config.interval]);

  // 生成随机位置（考虑密度和碰撞检测）
  const getRandomPosition = useCallback(
    (layer: number, existingMessages: DanmakuMessage[]) => {
      const layerConfig = LAYERS[layer];
      const [minY, maxY] = layerConfig.yRange;
      let attempts = 0;
      let y = Math.random() * (maxY - minY) + minY;

      // 简单的碰撞检测
      while (attempts < 10) {
        const hasCollision = existingMessages.some(
          (msg) =>
            msg.layer === layer && Math.abs(msg.y - y) < config.collisionThreshold
        );
        if (!hasCollision) break;
        y = Math.random() * (maxY - minY) + minY;
        attempts++;
      }

      return y;
    },
    [config.collisionThreshold]
  );

  // 使用 requestAnimationFrame 批量处理弹幕
  useEffect(() => {
    if (!limitedMessages.length || isPaused) return;

    let index = 0;
    const processBatch = () => {
      if (index >= limitedMessages.length || isPaused) return;

      const msg = limitedMessages[index];
      if (!processedIdsRef.current.has(msg.id)) {
        const layer = Math.floor(Math.random() * LAYERS.length);
        const speed = LAYERS[layer].speed + Math.random() * 5 - 2.5;
        const y = getRandomPosition(layer, activeMessages);

        const danmakuMsg: DanmakuMessage = {
          ...msg,
          y,
          layer,
          speed
        };

        batchProcessorRef.current?.add(danmakuMsg);
        processedIdsRef.current.add(msg.id);
      }

      index++;
      const delay = Math.random() * config.interval + config.interval / 2;
      rafRef.current = window.setTimeout(() => {
        rafRef.current = requestAnimationFrame(processBatch);
      }, delay) as unknown as number;
    };

    rafRef.current = requestAnimationFrame(processBatch);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        clearTimeout(rafRef.current as unknown as number);
      }
    };
  }, [limitedMessages, isPaused, getRandomPosition, config.interval]);

  // 当 messages 变化时重置
  useEffect(() => {
    processedIdsRef.current.clear();
    setActiveMessages([]);
  }, [messages]);

  // 处理弹幕完成
  const handleMessageComplete = useCallback((id: string) => {
    setActiveMessages((prev) => prev.filter((msg) => msg.id !== id));
    processedIdsRef.current.delete(id);
  }, []);

  // 处理弹幕悬停
  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  // 处理弹幕点击
  const handleClick = useCallback((msg: DanmakuMessage) => {
    setSelectedMsg(msg);
  }, []);

  // 暂停所有弹幕动画
  const effectivePaused = isPaused || hoveredId !== null;

  return (
    <div className={cn('relative', className)}>
      {/* 弹幕容器 */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
        style={{ pointerEvents: hoveredId ? 'auto' : 'none' }}
      >
        <AnimatePresence mode="popLayout">
          {activeMessages.map((msg) => (
            <DanmakuItem
              key={msg.id}
              msg={msg}
              isPaused={effectivePaused}
              rainbowMode={rainbowMode}
              onComplete={handleMessageComplete}
              onHover={handleHover}
              onClick={handleClick}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 弹幕详情弹窗 */}
      <AnimatePresence>
        {selectedMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMsg(null)}
          >
            <motion.div
              className="bg-slate-900 border border-white/20 rounded-xl p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: selectedMsg.color }}>
                {selectedMsg.content}
              </h3>
              {selectedMsg.author && (
                <p className="text-sm text-white/60 mb-2">@{selectedMsg.author}</p>
              )}
              {selectedMsg.timestamp && (
                <p className="text-xs text-white/40">
                  {new Date(selectedMsg.timestamp).toLocaleString()}
                </p>
              )}
              <button
                onClick={() => setSelectedMsg(null)}
                className="mt-4 px-4 py-2 bg-tech-cyan text-black rounded-lg text-sm font-medium"
              >
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 控制面板 */}
      <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2">
        {/* 主控制按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePause}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300',
              isPaused
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                : 'bg-tech-cyan/20 text-tech-cyan border-tech-cyan/50'
            )}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="text-xs font-medium">
              {isPaused ? '播放' : '暂停'}
            </span>
          </button>

          <button
            onClick={onToggleRainbow}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300',
              rainbowMode
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white border-white/50'
                : 'bg-black/40 text-white/70 border-white/10 hover:border-white/30'
            )}
          >
            <Rainbow className={cn('w-4 h-4', rainbowMode && 'animate-spin')} />
            <span className="text-xs font-medium">
              {rainbowMode ? '彩虹' : '标准'}
            </span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300',
              showSettings
                ? 'bg-white/20 text-white border-white/50'
                : 'bg-black/40 text-white/70 border-white/10 hover:border-white/30'
            )}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* 设置面板 */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-3"
            >
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">弹幕密度</label>
                  <div className="flex gap-1">
                    {(['low', 'medium', 'high'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setCurrentDensity(d)}
                        className={cn(
                          'px-2 py-1 text-xs rounded transition-colors',
                          currentDensity === d
                            ? 'bg-tech-cyan text-black'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        )}
                      >
                        {d === 'low' ? '低' : d === 'medium' ? '中' : '高'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 统计信息 */}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 border border-white/10">
          <Layers className="w-3 h-3 text-white/50" />
          <span className="text-xs text-white/50">
            {activeMessages.length}/{config.maxCount}
          </span>
        </div>
      </div>

      {/* 状态指示器 */}
      <motion.div
        className="fixed top-20 left-4 z-[10000] flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md"
        style={{
          borderColor: 'rgba(0,217,255,0.3)',
          background: 'rgba(0,217,255,0.05)'
        }}
        animate={effectivePaused ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Zap className="w-4 h-4 text-tech-cyan animate-pulse" />
        <span className="text-xs font-medium text-tech-cyan">
          {effectivePaused ? (hoveredId ? '悬停暂停' : '已暂停') : '运行中'}
        </span>
      </motion.div>

      {/* 悬停提示 */}
      <AnimatePresence>
        {hoveredId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 right-4 z-[10000] px-3 py-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/20"
          >
            <p className="text-xs text-white/80">点击弹幕查看详情</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
