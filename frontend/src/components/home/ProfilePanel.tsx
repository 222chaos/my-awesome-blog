'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Mail, ExternalLink, BookOpen, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/theme-context';
import type { Post } from '@/types';

interface ProfileInfo {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  joinDate: string;
  socialLinks: {
    platform: string;
    url: string;
    icon: React.ElementType;
  }[];
}

interface ProfileCardProps {
  profile: ProfileInfo;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="bg-gradient-to-r from-tech-cyan to-tech-lightcyan p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="/assets/微信图片.jpg"
              alt={profile.name}
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-6 h-6 border-2 border-white"></div>
          </div>
          <h2 className="text-xl font-bold text-white mt-4">{profile.name}</h2>
          <p className="text-tech-lightcyan text-sm">{profile.title}</p>
        </div>
      </div>
      
      <CardContent className="pt-6">
        <p className="text-muted-foreground mb-4">{profile.bio}</p>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {profile.location}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="w-4 h-4 mr-2" />
            <a href={`mailto:${profile.email}`} className="hover:text-foreground transition-colors">
              {profile.email}
            </a>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            加入于 {profile.joinDate}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-foreground mb-3">社交链接</h3>
          <div className="flex space-x-3">
            {profile.socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
                >
                  <IconComponent className="w-4 h-4 text-foreground" />
                </a>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg leading-tight">
            <a href={`/posts/${post.id}`} className="hover:text-tech-cyan transition-colors">
              {post.title}
            </a>
          </CardTitle>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{post.date}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
        
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {post.category}
          </span>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProfilePanel() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 防止 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  const profileInfo: ProfileInfo = {
    name: '张三',
    title: '资深前端工程师',
    bio: '热爱编程和技术分享，专注于现代Web开发技术和用户体验优化。在React、Vue和Node.js方面有丰富经验。',
    location: '北京, 中国',
    email: 'zhangsan@example.com',
    joinDate: '2022年5月',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com', icon: ExternalLink },
      { platform: 'Twitter', url: 'https://twitter.com', icon: ExternalLink },
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: ExternalLink },
    ]
  };

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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up text-foreground">
          个人资料
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：个人卡片 */}
          <div className="lg:col-span-1">
            <ProfileCard profile={profileInfo} />
          </div>

          {/* 右侧：文章卡片 */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">最新文章</h3>
              <Button variant="outline" className="text-tech-cyan border-tech-cyan hover:bg-tech-cyan/10">
                查看全部
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {samplePosts.map((post, index) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}