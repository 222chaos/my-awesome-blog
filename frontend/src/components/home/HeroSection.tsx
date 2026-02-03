'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import TextType from './TextType';
import GlassCard from '../ui/GlassCard';
import { useTheme } from '../../context/theme-context';
import WaveStack from '../ui/WaveStack';

export default function HeroSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 防止 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  const backgroundVideo = mounted && resolvedTheme === 'dark'
    ? '/video/moonlit-clouds-field-HD-live.mp4'
    : '/video/fantasy-landscape-deer-HD-live.mp4';

  // 跟踪视频加载状态
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // 重试计数器
  const [retryCount, setRetryCount] = useState(0);

  // 使用 useRef 存储超时 ID，以便在清理时使用
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const videoRef = useRef<HTMLVideoElement>(null);

  // 当 mounted 或 videoLoaded 变化时，重置视频状态
  useEffect(() => {
    if (mounted && !videoLoaded && !videoError && videoRef.current) {
      console.log('触发视频加载:', backgroundVideo);
      setVideoLoaded(false);
      setVideoError(false);
    }
  }, [mounted, backgroundVideo, retryCount]);

  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="英雄区域"
    >
      {/* 视频背景或静态背景 - 保持在底层 */}
      <div className="absolute inset-0 z-0">
        {mounted && !videoError && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            src={backgroundVideo}
            onCanPlayThrough={() => {
              console.log('视频已成功加载:', backgroundVideo);
              setVideoLoaded(true);
              setVideoError(false);
            }}
            onPlay={() => {
              console.log('视频开始播放:', backgroundVideo);
            }}
            onError={(e) => {
              console.error('视频加载失败:', backgroundVideo, e);
              setVideoError(true);
              // 重试机制
              if (retryCount < 3) {
                console.log(`重试视频加载 (${retryCount + 1}/3)...`);
                const newRetryCount = retryCount + 1;
                setRetryCount(newRetryCount);
                setTimeout(() => {
                  setVideoError(false);
                  setVideoLoaded(false);
                }, 2000);
              }
            }}
            onLoadStart={() => {
              console.log('开始加载视频:', backgroundVideo);
            }}
            onWaiting={() => {
              console.log('视频缓冲中...');
            }}
            key={`${backgroundVideo}-${retryCount}`} // 使用 retryCount 强制重新加载
            aria-hidden="true"
          />
        )}

        {/* 静态背景作为备用 */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: mounted && resolvedTheme === 'dark'
              ? 'linear-gradient(135deg, var(--tech-darkblue), var(--tech-deepblue), var(--tech-cyan))'
              : 'linear-gradient(135deg, var(--secondary), var(--accent), var(--primary))',
            backgroundSize: '400% 400%',
            animation: 'gradient-move 8s ease infinite'
          }}
          aria-hidden="true"
        />

        {/* 深色遮罩层，提高文字可读性 */}
        <div
          className="absolute inset-0 bg-[color:var(--background)]/[.3]"
          aria-hidden="true"
        />
      </div>

      {/* 主要内容区域 - 包含文字内容和波浪 */}
      <div className="relative z-20 flex flex-col w-full flex-1">
        <div className="container mx-auto px-4 text-center flex-1 flex flex-col justify-center">
          <GlassCard
            padding="sm"
            hoverEffect={false}
            glowEffect={true}
            className="max-w-2xl mx-auto text-center animate-fade-in-up"
            aria-label="欢迎信息"
          >
            <h1
              className="text-2xl md:text-3xl font-bold mb-4"
              id="hero-title"
            >
              <TextType
                fetchFromApi={true}
                typingSpeed={150}
                pauseDuration={1500}
                showCursor
                cursorCharacter="_"
                loop={true}
              />
            </h1>
          </GlassCard>
        </div>

        {/* 层叠波浪效果 - 明确放在内容区域的底部 */}
        <div
          className="relative w-full"
          aria-hidden="true"
        >
          <WaveStack className="wave-stack" waveCount={3} />
        </div>
      </div>
    </section>
  );
}