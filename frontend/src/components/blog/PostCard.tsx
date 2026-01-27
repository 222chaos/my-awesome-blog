'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

interface PostCardProps {
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
}

export default function PostCard({
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
  comments = 0
}: PostCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 防止 hydration 错误
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const glassCardClass = mounted && resolvedTheme === 'dark'
    ? 'glass-card'
    : 'bg-gray-100 shadow-lg border border-gray-200';

  return (
    <article
      className={cn(
        `${glassCardClass} group overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`,
        className
      )}
      role="article"
      aria-labelledby={`post-title-${id}`}
    >
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-4 h-4" aria-hidden="true">
                  <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                </svg>
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1" aria-label={`评论数：${comments}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-4 h-4" aria-hidden="true">
                  <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path>
                </svg>
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

// PostCard Skeleton Component for Loading State
export function PostCardSkeleton() {
  return (
    <article
      className="glass-card-secondary overflow-hidden h-full flex flex-col animate-pulse"
      role="status"
      aria-label="加载中"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div
              className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"
              aria-hidden="true"
            />
            <div
              className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mb-3"
              aria-hidden="true"
            />
            <div
              className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded mb-3"
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div
                className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"
                aria-hidden="true"
              />
              <div
                className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"
                aria-hidden="true"
              />
              <div
                className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"
                aria-hidden="true"
              />
              <div
                className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </article>
  );
}