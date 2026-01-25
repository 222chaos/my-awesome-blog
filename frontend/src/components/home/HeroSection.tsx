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
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-start pt-24 overflow-hidden -mt-16">
      {/* 视频背景 */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundVideo}
        />
        {/* 深色遮罩层，提高文字可读性 */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>

      {/* 内容区域 - flex-1 让它占据剩余空间 */}
      <div className="relative z-20 container mx-auto px-4 text-center flex-1 flex flex-col justify-center">
        <GlassCard padding="sm" hoverEffect={false} glowEffect={true} className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 animate-fade-in-up">
            <TextType
              text={["欢迎来到我的技术博客", "探索前沿技术", "分享创新见解", "编程思维与实践", "Web开发艺术", "现代架构设计"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              loop={true}
            />
          </h1>
        </GlassCard>
      </div>

      {/* 层叠波浪效果 - 放在最底部 */}
      <WaveStack className="mt-auto" waveCount={3} />
    </section>
  );
}
