'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon, Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

interface SimplePostCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  category?: string;
  href?: string;
  className?: string;
  showCategory?: boolean;
  showMeta?: boolean;
  coverImage?: string;
  likes?: number;
  comments?: number;
  style?: React.CSSProperties;
}

export default function SimplePostCard({
  id,
  title,
  excerpt,
  date,
  readTime,
  category,
  href,
  className,
  showCategory = true,
  showMeta = true,
  coverImage,
  likes = 0,
  comments = 0,
  style
}: SimplePostCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 防止 hydration 错误
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const glassCardClass = mounted && resolvedTheme === 'dark'
    ? 'glass-card'
    : 'bg-gray-100 shadow-lg border border-gray-200';

  // 设置默认封面图片
  const [imgSrc, setImgSrc] = React.useState(coverImage || '/assets/avatar.jpg');

  // 图片加载失败时的回调函数
  const handleError = () => {
    // 直接切换到默认图片
    setImgSrc('/assets/avatar.jpg');
  };

  // 当 coverImage 发生变化时，更新 imgSrc
  React.useEffect(() => {
    if (coverImage) {
      setImgSrc(coverImage);
    } else {
      setImgSrc('/assets/avatar.jpg');
    }
  }, [coverImage]);

  return (
    <article
      className={cn(
        `${glassCardClass} group overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer`,
        className
      )}
      role="article"
      aria-labelledby={`post-title-${id}`}
    >
      {/* 封面图片区域 */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={handleError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tech-darkblue/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2
              id={`post-title-${id}`}
              className="text-lg sm:text-xl font-bold mb-2 text-foreground group-hover:text-tech-cyan transition-colors break-words"
            >
              {title}
            </h2>
            <p className="text-muted-foreground mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
              {excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1" aria-label={`发布日期：${date}`}>
                <CalendarIcon className="w-4 h-4" />
                <time>{date}</time>
              </div>
              <div className="flex items-center gap-1" aria-label={`点赞数：${likes}`}>
                <Heart className="w-4 h-4" aria-hidden="true" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1" aria-label={`评论数：${comments}`}>
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{comments}</span>
              </div>
              {showCategory && category && (
                <span className="px-2 sm:px-3 py-1 rounded-full bg-tech-cyan/20 text-tech-cyan text-xs font-medium">
                  {category}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={href ? href as any : `/posts/${id}` as any}
              className="w-10 h-10 rounded-full bg-tech-cyan/20 flex items-center justify-center group-hover:bg-tech-cyan transition-colors"
              aria-label={`查看文章: ${title}`}
            >
              <ArrowRightIcon
                className="w-5 h-5 text-tech-cyan group-hover:text-white transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

// SimplePostCard Skeleton Component for Loading State
export function SimplePostCardSkeleton() {
  return (
    <article
      className="glass-card overflow-hidden h-full flex flex-col animate-pulse"
      role="status"
      aria-label="加载中"
    >
      <div className="relative aspect-video bg-glass/20"></div>
      
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div
              className="h-5 w-3/4 bg-glass/40 rounded mb-2"
              aria-hidden="true"
            />
            <div
              className="h-4 w-full bg-glass/30 rounded mb-3"
              aria-hidden="true"
            />
            <div
              className="h-4 w-5/6 bg-glass/30 rounded mb-3"
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div
                className="h-4 w-16 bg-glass/30 rounded"
                aria-hidden="true"
              />
              <div
                className="h-4 w-16 bg-glass/30 rounded"
                aria-hidden="true"
              />
              <div
                className="h-4 w-16 bg-glass/30 rounded"
                aria-hidden="true"
              />
              <div
                className="h-6 w-16 bg-tech-cyan/20 rounded-full"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full bg-tech-cyan/20"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
