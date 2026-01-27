'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, Code, Palette, Zap } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/theme-context';
import { useState, useEffect } from 'react';

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
}

export default function FeaturedSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 防止 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  const glassCardClass = mounted && resolvedTheme === 'dark'
    ? 'glass-card'
    : 'bg-gray-100 shadow-lg border border-gray-200';
  
  const features: FeaturedItem[] = [
    {
      id: 'latest-posts',
      title: '最新文章',
      description: '查看我们最新的技术文章和行业见解，涵盖前端、后端和全栈开发。',
      icon: FileText,
      link: '/posts',
    },
    {
      id: 'coding-tips',
      title: '编程技巧',
      description: '学习实用的编程技巧和最佳实践，提升你的开发技能。',
      icon: Code,
      link: '/tips',
    },
    {
      id: 'design-insights',
      title: '设计灵感',
      description: '探索最新的UI/UX设计趋势和创意灵感，让您的项目脱颖而出。',
      icon: Palette,
      link: '/design',
    },
    {
      id: 'quick-tutorials',
      title: '快速教程',
      description: '简明扼要的教程，帮助您快速掌握新技术和工具。',
      icon: Zap,
      link: '/tutorials',
    },
  ];

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 animate-fade-in-up">
          特色推荐
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <GlassCard
                key={item.id}
                className={`${glassCardClass} group cursor-pointer`}
                hoverEffect={true}
                glowEffect={true}
                padding="lg"
              >
                {/* 图标 */}
                <div className="w-16 h-16 bg-tech-cyan/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-8 h-8 text-tech-cyan" />
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-tech-cyan transition-colors">
                  {item.title}
                </h3>
                
                {/* 描述 */}
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}