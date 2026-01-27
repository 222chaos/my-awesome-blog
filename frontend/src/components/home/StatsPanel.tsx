'use client';

import { useState, useEffect } from 'react';
import { FileText, Eye, Users, ArrowRight, Heart, MessageCircle, Calendar, AlertCircle, RefreshCw, ExternalLink, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { ArticleCardSkeleton } from './ArticleCardSkeleton';

interface Stat {
  label: string;
  value: number;
  icon: React.ElementType;
}

interface FriendLink {
  id: number;
  name: string;
  description: string;
  url: string;
  avatar?: string;
}

// 模拟友链数据
const mockFriendLinks: FriendLink[] = [
  {
    id: 1,
    name: '技术博客',
    description: '分享前端开发经验',
    url: 'https://example1.com',
    avatar: 'https://placehold.co/40x40/2563eb/ffffff?text=T'
  },
  {
    id: 2,
    name: '设计灵感',
    description: 'UI/UX设计资源',
    url: 'https://example2.com',
    avatar: 'https://placehold.co/40x40/10b981/ffffff?text=D'
  },
  {
    id: 3,
    name: '开源社区',
    description: '开源项目分享',
    url: 'https://example3.com',
    avatar: 'https://placehold.co/40x40/f59e0b/ffffff?text=O'
  },
  {
    id: 4,
    name: '程序员笔记',
    description: '算法与数据结构',
    url: 'https://example4.com',
    avatar: 'https://placehold.co/40x40/ef4444/ffffff?text=C'
  }
];

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  likes: number;
  comments: number;
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

// 个人信息卡片组件 - 普通玻璃卡片（无翻转动画）
function ProfileCard() {
  const stats: Stat[] = [
    { label: '文章', value: 105, icon: FileText },
    { label: '访问量', value: 251383, icon: Eye },
    { label: '友站', value: 12, icon: Users },
  ];

  return (
    <section className="rounded-2xl p-6 sm:p-8 transition-all duration-300 glass-card" aria-label="个人信息卡片">
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

      {/* 统计数据 - 同一行显示 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4" role="list" aria-label="统计数据">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg hover:bg-tech-cyan/10 transition-colors"
            role="listitem"
          >
            {/* 图标 */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-tech-cyan/20 flex items-center justify-center mb-2" aria-hidden="true">
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-tech-cyan" />
            </div>
            {/* 数量 */}
            <span className="text-tech-cyan font-bold text-lg sm:text-xl mb-1">
              {stat.value.toLocaleString()}
            </span>
            {/* 标签 */}
            <span className="text-foreground font-medium text-xs sm:text-sm">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// 友站链接翻转卡片组件
function FriendLinkFlipCard() {
  const friendCount = mockFriendLinks.length;
  const totalVisits = 12580; // 模拟友站总访问量

  return (
    <section className="flip-card" style={{ width: '100%', minHeight: '200px' }} aria-label="友站链接卡片">
      <div className="flip-card-inner" style={{ minHeight: '200px' }}>
        {/* 正面 - 友站统计 */}
        <div className="flip-card-front rounded-2xl p-6 transition-all duration-300 glass-card flex flex-col items-center justify-center">
          <div className="text-center">
            {/* 大数字显示 */}
            <div className="flex items-center justify-center mb-3">
              <Globe className="w-8 h-8 text-tech-cyan mr-3" />
              <span className="text-5xl font-bold text-tech-cyan">{friendCount}</span>
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">友情链接</p>
            <p className="text-sm text-muted-foreground mb-4">累计访问 {totalVisits.toLocaleString()} 次</p>
            
            {/* 提示文字 */}
            <div className="flex items-center justify-center text-tech-cyan/80 text-sm">
              <span>悬停查看友链</span>
              <ArrowRight className="w-4 h-4 ml-1 animate-pulse" />
            </div>
          </div>
        </div>

        {/* 背面 - 友链列表 */}
        <div className="flip-card-back rounded-2xl transition-all duration-300 glass-card overflow-hidden">
          {/* 背面内容 */}
          <div className="h-full flex flex-col p-4">
            <h4 className="text-sm font-bold text-foreground mb-3 text-center">友情链接</h4>
            
            {/* 友链列表 - 2x2 网格 */}
            <div className="grid grid-cols-2 gap-2 flex-1">
              {mockFriendLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-2 rounded-lg bg-[var(--card)]/80 hover:bg-tech-cyan/20 transition-colors"
                >
                  <img
                    src={link.avatar}
                    alt={link.name}
                    className="w-8 h-8 rounded-full mb-1 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-xs font-medium text-foreground group-hover:text-tech-cyan truncate w-full text-center">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>

            {/* 查看更多按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-tech-cyan hover:bg-tech-cyan/10 text-xs group"
            >
              查看全部
              <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
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
          {/* 左侧列 - 垂直堆叠两个卡片 */}
          <div className="md:col-span-1 flex flex-col gap-6">
            {/* 个人资料卡片 */}
            <ProfileCard />
            {/* 友站链接翻转卡片 */}
            <FriendLinkFlipCard />
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
