'use client';

import { useState, useEffect } from 'react';
import { FileText, Folder, Eye, Hash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/theme-context';

interface Stat {
  label: string;
  value: number;
  icon: React.ElementType;
}

// 自定义Hook - 实现数字滚动动画
function useNumberAnimation(target: number, duration: number = 2000) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCurrent(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return current;
}

export default function StatsPanel() {
  const { resolvedTheme } = useTheme();
  const stats: Stat[] = [
    { label: '文章', value: 105, icon: FileText },
    { label: '分类', value: 12, icon: Folder },
    { label: '访问量', value: 12500, icon: Eye },
    { label: '标签', value: 28, icon: Hash },
  ];

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up text-foreground">
          网站统计
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const animatedValue = useNumberAnimation(stat.value);
            const IconComponent = stat.icon;

            return (
              <div
                key={stat.label}
                className={`rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300 group ${
                  resolvedTheme === 'dark'
                    ? 'glass-card'
                    : 'bg-white shadow-lg border border-tech-cyan/20'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 图标 */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-tech-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-tech-cyan" />
                  </div>
                </div>

                {/* 数字 */}
                <div className="text-3xl font-bold mb-2 text-foreground">
                  {animatedValue.toLocaleString()}+
                </div>

                {/* 标签 */}
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}