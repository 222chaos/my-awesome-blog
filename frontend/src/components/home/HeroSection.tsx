'use client';

import TextType from './TextType';
import GlassCard from '../ui/GlassCard';
import { useTheme } from '../../context/theme-context';
import WaveStack from '../ui/WaveStack';

export default function HeroSection() {
  const { resolvedTheme } = useTheme();

  const backgroundVideo = resolvedTheme === 'dark'
    ? '/video/moonlit-clouds-field-HD-live.mp4'
    : '/video/fantasy-landscape-deer-HD-live.mp4';

  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden -mt-16"
      aria-label="英雄区域"
    >
      {/* 视频背景 - 保持在底层 */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundVideo}
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
                typingSpeed={75}
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
