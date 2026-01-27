'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="h-full flex flex-col border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            <a href={`/posts/${post.id}`}>
              {post.title}
            </a>
          </CardTitle>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {post.category}
          </span>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProfilePanel() {
  const samplePosts: Post[] = [
    {
      id: 'getting-started-with-nextjs',
      title: 'Next.js 14 入门指南',
      excerpt: '学习如何使用 Next.js 14 和新的 App Router 构建现代化网页应用。',
      date: '2024年1月15日',
      readTime: '5分钟阅读',
      category: '开发',
    },
    {
      id: 'tailwind-css-tips',
      title: '高级 Tailwind CSS 技巧',
      excerpt: '探索使用 Tailwind CSS 构建美观响应式用户界面的高级技巧。',
      date: '2024年1月10日',
      readTime: '8分钟阅读',
      category: '设计',
    },
    {
      id: 'typescript-best-practices',
      title: 'React 开发者的 TypeScript 最佳实践',
      excerpt: '每个 React 开发者都应该知道的重要 TypeScript 模式和实践。',
      date: '2024年1月5日',
      readTime: '6分钟阅读',
      category: '开发',
    },
    {
      id: 'api-design-guide',
      title: '现代 API 设计原则',
      excerpt: '学习如何为您的应用程序设计可扩展且易于维护的 API。',
      date: '2023年12月28日',
      readTime: '10分钟阅读',
      category: '后端',
    },
  ];

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            最新文章
          </h2>
          <Button 
            variant="outline" 
            className="cursor-pointer transition-all duration-200 hover:scale-105 group"
          >
            查看全部
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {samplePosts.map((post, index) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}