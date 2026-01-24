'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  // 预计算浮动球体数据
  const floatingBalls = [...Array(20)].map((_, i) => ({
    id: i,
    size: Math.random() * 80 + 40,
    animationDelay: i * 0.3,
    animationDuration: Math.random() * 4 + 6,
  }));

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 gradient-bg"></div>

      <div className="absolute inset-0 z-10 overflow-hidden opacity-30">
        {floatingBalls.map((ball) => (
          <div
            key={ball.id}
            className="absolute rounded-full bg-tech-cyan animate-float-improved"
            style={{
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${ball.animationDelay}s`,
              animationDuration: `${ball.animationDuration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-20 container mx-auto px-4 py-16 text-center">
        <Card
          className="max-w-4xl mx-auto text-center backdrop-blur-xl border-glass-border/30 shadow-2xl glow-border glass-hover glass-card-primary"
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
              <Button asChild variant="glass" size="lg" className="ripple-effect group">
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
      </div>
    </section>
  );
}
