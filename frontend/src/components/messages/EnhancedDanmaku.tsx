'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Rainbow, Layers, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DanmakuMessage {
  id: string;
  content: string;
  color: string;
  speed: number;
  y: number;
  layer: number;
}

interface EnhancedDanmakuProps {
  messages: DanmakuMessage[];
  className?: string;
  isPaused?: boolean;
  onTogglePause?: () => void;
  rainbowMode?: boolean;
  onToggleRainbow?: () => void;
}

const LAYERS = [
  { zIndex: 10, speed: 15, opacity: 0.6, scale: 0.8 },
  { zIndex: 20, speed: 20, opacity: 0.8, scale: 0.9 },
  { zIndex: 30, speed: 25, opacity: 1, scale: 1 }
];

const MAX_DANMAKU_COUNT = 50;
const COLLISION_THRESHOLD = 30;

export default function EnhancedDanmaku({
  messages,
  className,
  isPaused = false,
  onTogglePause,
  rainbowMode = false,
  onToggleRainbow
}: EnhancedDanmakuProps) {
  const [activeMessages, setActiveMessages] = useState<DanmakuMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const processedIndexRef = useRef(0);

  const getRandomPosition = useCallback(() => {
    return Math.random() * 70 + 10;
  }, []);

  const getRandomLayer = useCallback(() => {
    return Math.floor(Math.random() * LAYERS.length);
  }, []);

  const getRandomSpeed = useCallback((layer: number) => {
    const baseSpeed = LAYERS[layer].speed;
    return baseSpeed + Math.random() * 10 - 5;
  }, []);

  const checkCollision = useCallback((newY: number, existingMessages: DanmakuMessage[]) => {
    for (const msg of existingMessages) {
      const distance = Math.abs(newY - msg.y);
      if (distance < COLLISION_THRESHOLD) {
        return true;
      }
    }
    return false;
  }, []);

  const limitedMessages = useMemo(() => {
    return messages.slice(0, MAX_DANMAKU_COUNT);
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    processedIndexRef.current = 0;

    const processNext = () => {
      if (processedIndexRef.current >= limitedMessages.length) {
        return;
      }

      if (activeMessages.length >= MAX_DANMAKU_COUNT) {
        return;
      }

      const msg = limitedMessages[processedIndexRef.current];
      let newY = getRandomPosition();
      let attempts = 0;
      const maxAttempts = 20;

      while (checkCollision(newY, activeMessages) && attempts < maxAttempts) {
        newY = getRandomPosition();
        attempts++;
      }

      const layer = getRandomLayer();
      const speed = getRandomSpeed(layer);

      const danmakuMsg: DanmakuMessage = {
        ...msg,
        y: newY,
        layer,
        speed
      };

      setActiveMessages(prev => {
        const newMessages = [...prev, danmakuMsg];
        return newMessages.slice(-MAX_DANMAKU_COUNT);
      });

      processedIndexRef.current++;

      const delay = Math.random() * 500 + 200;
      const timerId = setTimeout(processNext, delay);
      timersRef.current.push(timerId);
    };

    if (limitedMessages.length > 0) {
      setTimeout(processNext, 100);
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setActiveMessages([]);
    };
  }, [limitedMessages, activeMessages, getRandomPosition, getRandomLayer, getRandomSpeed, checkCollision]);

  const handleMessageComplete = useCallback((id: string) => {
    setActiveMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          {activeMessages.map((msg) => {
            const layerConfig = LAYERS[msg.layer];
            const isPausedLayer = isPaused;

            return (
              <motion.div
                key={msg.id}
                initial={{ x: '100vw', opacity: 0 }}
                animate={isPausedLayer ? { x: '100vw' } : { x: '-100vw', opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: msg.speed,
                  ease: "linear",
                  times: [0, 0.05, 0.95, 1]
                }}
                onAnimationComplete={() => !isPausedLayer && handleMessageComplete(msg.id)}
                className="absolute whitespace-nowrap will-change-transform"
                style={{
                  top: `${msg.y}%`,
                  zIndex: layerConfig.zIndex,
                  opacity: layerConfig.opacity,
                  transform: `scale(${layerConfig.scale})`
                }}
              >
                <span
                  className={cn(
                    "text-lg font-bold px-4 py-1.5 rounded-full backdrop-blur-md border",
                    "will-change-transform",
                    rainbowMode ? "animate-rainbow-shift" : ""
                  )}
                  style={{
                    color: rainbowMode ? 'hsl(var(--rainbow-hue), 80%, 60%)' : msg.color,
                    background: rainbowMode
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.4)',
                    borderColor: rainbowMode
                      ? 'hsl(var(--rainbow-hue), 80%, 60%)'
                      : `${msg.color}40`,
                    boxShadow: rainbowMode
                      ? '0 0 20px hsl(var(--rainbow-hue), 80%, 60%, 0.3)'
                      : `0 0 15px ${msg.color}30`
                  }}
                >
                  {msg.content}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePause}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300",
              isPaused
                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                : "bg-tech-cyan/20 text-tech-cyan border-tech-cyan/50"
            )}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="text-xs font-medium">
              {isPaused ? '播放弹幕' : '暂停弹幕'}
            </span>
          </button>

          <button
            onClick={onToggleRainbow}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300",
              rainbowMode
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white border-white/50"
                : "bg-black/40 text-white/70 border-white/10 hover:border-white/30"
            )}
          >
            <Rainbow className={cn("w-4 h-4", rainbowMode && "animate-spin")} />
            <span className="text-xs font-medium">
              {rainbowMode ? '彩虹模式' : '标准模式'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 border border-white/10">
          <Layers className="w-3 h-3 text-white/50" />
          <span className="text-xs text-white/50">
            {activeMessages.length}/{limitedMessages.length}
          </span>
        </div>
      </div>

      <motion.div
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md"
        style={{
          borderColor: 'rgba(0,217,255,0.3)',
          background: 'rgba(0,217,255,0.05)'
        }}
        animate={isPaused ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Zap className="w-4 h-4 text-tech-cyan animate-pulse" />
        <span className="text-xs font-medium text-tech-cyan">
          {isPaused ? '已暂停' : '运行中'}
        </span>
      </motion.div>
    </div>
  );
}
