'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import StatsPanel from '@/components/home/StatsPanel';
import TagCloud from '@/components/home/TagCloud';
import Timeline from '@/components/home/Timeline';
import Portfolio from '@/components/home/Portfolio';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import type { Post, Category, PopularPost, TimelineItem } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineItem[]>([]);

  useEffect(() => {
    setPosts([
      {
        id: 'getting-started-with-nextjs',
        title: 'Next.js 14 入门指南',
        excerpt: '学习如何使用 Next.js 14 和新的 App Router 构建现代化网页应用。',
        date: '2024年1月15日',
        readTime: '5分钟阅读',
        category: '开发',
        image: '/assets/placeholder-post-image-1.jpg',
        likes: 128,
        comments: 32,
      },
      {
        id: 'tailwind-css-tips',
        title: '高级 Tailwind CSS 技巧',
        excerpt: '探索使用 Tailwind CSS 构建美观响应式用户界面的高级技巧。',
        date: '2024年1月10日',
        readTime: '8分钟阅读',
        category: '设计',
        image: '/assets/placeholder-post-image-2.jpg',
        likes: 95,
        comments: 24,
      },
      {
        id: 'typescript-best-practices',
        title: 'React 开发者的 TypeScript 最佳实践',
        excerpt: '每个 React 开发者都应该知道的重要 TypeScript 模式和实践。',
        date: '2024年1月5日',
        readTime: '6分钟阅读',
        category: '开发',
        image: '/assets/placeholder-post-image-3.jpg',
        likes: 210,
        comments: 42,
      },
      {
        id: 'api-design-guide',
        title: '现代 API 设计原则',
        excerpt: '学习如何为您的应用程序设计可扩展且易于维护的 API。',
        date: '2023年12月28日',
        readTime: '10分钟阅读',
        category: '后端',
        image: '/assets/placeholder-post-image-4.jpg',
        likes: 87,
        comments: 18,
      },
      {
        id: 'state-management-options',
        title: '2024年的状态管理',
        excerpt: '比较 React 应用程序的不同状态管理解决方案。',
        date: '2023年12月20日',
        readTime: '12分钟阅读',
        category: '前端',
        image: '/assets/placeholder-post-image-5.jpg',
        likes: 156,
        comments: 36,
      },
      {
        id: 'web-security-basics',
        title: '必备的网络安全实践',
        excerpt: '保护您的应用程序免受常见安全漏洞的影响。',
        date: '2023年12月15日',
        readTime: '9分钟阅读',
        category: '安全',
        image: '/assets/placeholder-post-image-6.jpg',
        likes: 74,
        comments: 15,
      },
    ]);

    setCategories([
      { name: '开发', count: 12 },
      { name: '设计', count: 8 },
      { name: '后端', count: 5 },
      { name: '前端', count: 10 },
      { name: '安全', count: 4 },
      { name: 'DevOps', count: 6 },
    ]);

    setPopularPosts([
      { id: 'getting-started-with-nextjs', title: 'Next.js 14 入门指南', date: '1月15日' },
      { id: 'tailwind-css-tips', title: '高级 Tailwind CSS 技巧', date: '1月10日' },
      { id: 'typescript-best-practices', title: 'TypeScript 最佳实践', date: '1月5日' },
      { id: 'api-design-guide', title: '现代 API 设计原则', date: '12月28日' },
    ]);

    setTimelineEvents([
      {
        date: '2024年1月',
        title: '博客启动',
        description: '开始了我的技术博客，分享知识和经验。',
      },
      {
        date: '2023年12月',
        title: 'React精通',
        description: '完成了高级React课程，开始构建复杂应用。',
      },
      {
        date: '2023年11月',
        title: 'Next.js之旅',
        description: '迁移到Next.js 14，使用App Router提升性能。',
      },
      {
        date: '2023年10月',
        title: '开源贡献',
        description: '为几个开源项目和GitHub仓库做出贡献。',
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div id="content" className="bg-background">
        <HeroSection />

        <div className="container mx-auto px-4 py-16 bg-background">
          <StatsPanel />
        </div>

        <div className="container mx-auto px-4 py-16 bg-background">
          <FeaturedSection />
        </div>

        <div className="container mx-auto px-4 py-16 bg-background">
          <TagCloud tags={categories.map(cat => ({ name: cat.name, count: cat.count }))} />
        </div>

        <div className="container mx-auto px-4 py-16 bg-background">
          <Timeline events={timelineEvents} />
        </div>

        <div className="container mx-auto px-4 py-16 bg-background">
          <Portfolio
            projects={[{
              id: '1',
              title: '电商网站',
              description: '使用React和Node.js构建的全功能电商平台',
              image: '/assets/placeholder-portfolio.jpg',
              tags: ['React', 'Node.js', 'MongoDB'],
              link: '/projects/ecommerce',
            }, {
              id: '2',
              title: '任务管理应用',
              description: '具有实时协作功能的任务管理工具',
              image: '/assets/placeholder-portfolio.jpg',
              tags: ['Vue.js', 'Firebase', 'Tailwind'],
              link: '/projects/task-manager',
            }]}
          />
        </div>

        <Card className="container mx-auto px-4 py-8 mt-12 glass-card glow-border">
          <CardContent className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4 animate-fade-in-up">
              订阅更新
            </h3>
            <p className="text-foreground max-w-2xl mx-auto mb-6">
              加入我们的邮件列表，获取最新文章、技巧和资源。
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="flex-1 px-4 py-2 rounded-md bg-glass border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-cyan backdrop-blur-lg"
              />
              <Button className="bg-tech-cyan text-white hover:bg-tech-lightcyan transition-colors">
                订阅
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
