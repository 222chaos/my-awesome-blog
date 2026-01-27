'use client';

import { useState, useEffect, useMemo } from 'react';
import { FileText, Folder, Eye, Users, ArrowRight, Heart, MessageCircle, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/theme-context';
import { ArticleCardSkeleton } from './ArticleCardSkeleton';

interface Stat {
  label: string;
  value: number;
  icon: React.ElementType;
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  likes: number;
  comments: number;
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

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: 1,
    title: '深入理解React Hooks的工作原理',
    excerpt: 'React Hooks改变了我们编写组件的方式，本文将深入探讨Hooks的内部机制...',
    category: '前端开发',
    date: '2025-01-25',
    likes: 128,
    comments: 32
  },
  {
    id: 2,
    title: 'TypeScript高级类型系统指南',
    excerpt: '掌握TypeScript的高级类型特性，让你的代码更加类型安全和可维护...',
    category: 'TypeScript',
    date: '2025-01-20',
    likes: 95,
    comments: 18
  },
  {
    id: 3,
    title: 'Next.js 15新特性详解',
    excerpt: '探索Next.js 15带来的重大更新和新功能，包括App Router的改进...',
    category: '框架技术',
    date: '2025-01-18',
    likes: 87,
    comments: 24
  }
];

// 统计数据项组件（带动画）
function AnimatedStatItem({ stat }: { stat: Stat }) {
  const animatedValue = useNumberAnimation(stat.value);
  const IconComponent = stat.icon;

  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg hover:bg-tech-cyan/10 transition-colors"
      role="listitem"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-tech-cyan/20 flex items-center justify-center" aria-hidden="true">
          <IconComponent className="w-5 h-5 text-tech-cyan" />
        </div>
        <span className="text-foreground font-medium">{stat.label}</span>
      </div>
      <span className="text-tech-cyan font-bold text-base sm:text-lg" aria-label={`${stat.label}：${animatedValue.toLocaleString()}`}>
        {animatedValue.toLocaleString()}
      </span>
    </div>
  );
}

// 个人信息卡片组件
function ProfileCard() {
  const { resolvedTheme } = useTheme();
  const stats: Stat[] = [
    { label: '文章', value: 105, icon: FileText },
    { label: '分类', value: 6, icon: Folder },
    { label: '访问量', value: 251383, icon: Eye },
    { label: '友站', value: 12, icon: Users },
  ];

  return (
    <section
      className={`rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
        resolvedTheme === 'dark'
          ? 'glass-card'
          : 'bg-gradient-to-br from-tech-cyan/10 to-tech-lightcyan/10 shadow-xl border border-tech-cyan/20'
      }`}
      aria-label="个人信息卡片"
    >
      {/* 圆形头像 */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="relative group">
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-tech-cyan to-tech-lightcyan flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="查看头像"
          >
            <Users className="w-14 h-14 sm:w-16 sm:h-16 text-white" />
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" aria-label="在线状态"></div>
        </div>
      </div>

      {/* 网站名称 */}
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 text-foreground">
        POETIZE
      </h3>
      <p className="text-center text-muted-foreground mb-6 sm:mb-8 text-sm">
        分享技术与生活，记录成长点滴
      </p>

      {/* 统计数据 */}
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8" role="list" aria-label="统计数据">
        {stats.map((stat) => (
          <AnimatedStatItem key={stat.label} stat={stat} />
        ))}
      </div>

      {/* 友站按钮 */}
      <Button
        variant="outline"
        className="w-full border-tech-cyan text-tech-cyan hover:bg-tech-cyan hover:text-white transition-colors group"
        aria-label="查看友站链接"
      >
        友站链接
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </section>
  );
}

// 文章卡片组件
function ArticleCard({ article, delayClass }: { article: Article; delayClass: string }) {
  return (
    <article
      role="article"
      aria-label={article.title}
      tabIndex={0}
      className={`group`}
    >
      <Card
        key={article.id}
        className={`hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in-up ${delayClass}`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* 文章标题 */}
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground group-hover:text-tech-cyan transition-colors">
                {article.title}
              </h3>

              {/* 文章摘要 */}
              <p className="text-muted-foreground mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                {article.excerpt}
              </p>

              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1" aria-label={`发布日期：${article.date}`}>
                  <Calendar className="w-4 h-4" />
                  <time>{article.date}</time>
                </div>
                <div className="flex items-center gap-1" aria-label={`点赞数：${article.likes}`}>
                  <Heart className="w-4 h-4" />
                  <span>{article.likes}</span>
                </div>
                <div className="flex items-center gap-1" aria-label={`评论数：${article.comments}`}>
                  <MessageCircle className="w-4 h-4" />
                  <span>{article.comments}</span>
                </div>
                <span className="px-2 sm:px-3 py-1 rounded-full bg-tech-cyan/20 text-tech-cyan text-xs font-medium">
                  {article.category}
                </span>
              </div>
            </div>

            {/* 箭头图标 */}
            <div className="flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full bg-tech-cyan/20 flex items-center justify-center group-hover:bg-tech-cyan transition-colors"
                aria-label="查看文章详情"
              >
                <ArrowRight className="w-5 h-5 text-tech-cyan group-hover:text-white transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

// 文章列表组件
function ArticleList({ articles, loading, error, onRetry }: { articles: Article[]; loading: boolean; error: string | null; onRetry: () => void }) {
  const delayClasses = ['animate-delay-50', 'animate-delay-100', 'animate-delay-150'];

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 animate-fade-in-up">
          最新文章
        </h2>
        <div className="space-y-4 sm:space-y-6">
          {[1, 2, 3].map((i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 animate-fade-in-up">
          最新文章
        </h2>
        <Card className="p-6 sm:p-8 text-center">
          <AlertCircle className="w-14 h-14 sm:w-16 sm:h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">加载失败</h3>
          <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重新加载
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 animate-fade-in-up">
        最新文章
      </h2>

      <div className="space-y-4 sm:space-y-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            delayClass={delayClasses[index % delayClasses.length]}
          />
        ))}
      </div>

      {/* 查看更多按钮 */}
      <div className="text-center pt-4">
        <Button
          variant="link"
          className="text-tech-cyan hover:text-tech-lightcyan group inline-flex items-center gap-1"
          aria-label="查看更多文章"
        >
          查看更多文章
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

export default function StatsPanel() {
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* 左侧个人信息卡片 */}
          <div className="md:col-span-1">
            <ProfileCard />
          </div>

          {/* 右侧文章列表 */}
          <div className="md:col-span-2">
            <ArticleList
              articles={mockArticles}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
