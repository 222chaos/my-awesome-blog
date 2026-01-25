'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  // 预计算浮动球体数据，使用确定性算法以避免SSR不匹配
  // 使用基于索引的哈希函数来生成看似随机但确定的值
  const deterministicRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const floatingBalls = [...Array(20)].map((_, i) => ({
    id: i,
    size: Math.floor(deterministicRandom(i) * 80 + 40),
    top: Math.floor(deterministicRandom(i + 100) * 80 + 10),
    left: Math.floor(deterministicRandom(i + 200) * 80 + 10),
    animationDelay: i * 0.3,
    animationDuration: Math.floor(deterministicRandom(i + 300) * 4 + 6),
  }));

  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const scrollToContent = () => {
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-start pt-16 overflow-hidden">
      <div className="absolute inset-0 z-0 gradient-bg hero-bg"></div>

      <div className="absolute inset-0 z-10 overflow-hidden opacity-30">
        {floatingBalls.map((ball) => (
          <div
            key={ball.id}
            className="absolute rounded-full bg-tech-cyan animate-float-improved"
            style={
              {
                width: `${ball.size}px`,
                height: `${ball.size}px`,
                top: `${ball.top}%`,
                left: `${ball.left}%`,
                animationDelay: `${ball.animationDelay}s`,
                animationDuration: `${ball.animationDuration}s`,
              }
            }
          />
        ))}
      </div>

      <div className="relative z-20 container mx-auto px-4 pt-20 pb-16 text-center">
        <Card
          className={cn(
            "max-w-4xl mx-auto text-center backdrop-blur-xl border-glass-border/30 shadow-2xl glow-border glass-hover glass-card-primary transition-all duration-1000 ease-out",
            isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          )}
        >
          <CardContent className="p-12 md:p-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
              欢迎来到我的{' '}
              <span className="text-gradient-primary">技术博客</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              探索前沿技术，分享创新见解与解决方案。
              与我一起踏上数字世界的探索之旅。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Button asChild variant="glass" size="lg" className="group">
                <Link href="/posts" aria-label="探索所有技术文章">
                  探索文章
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group">
                <Link href="/about" aria-label="了解更多关于作者信息">
                  了解更多
                  <Sparkles className="ml-2 w-4 h-4 transition-transform group-hover:rotate-90" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 滚动提示按钮 */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          aria-label="向下滚动"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-gray-400 text-sm">探索更多</span>
            <ChevronDown className="h-6 w-6 text-tech-cyan" />
          </div>
        </button>
      </div>
    </section>
  );
}
