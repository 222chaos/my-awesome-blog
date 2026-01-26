'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category?: string;
  href?: string;
  className?: string;
  showCategory?: boolean;
  showMeta?: boolean;
}

export default function PostCard({
  id,
  title,
  excerpt,
  date,
  readTime,
  category,
  href = `/posts/${id}`,
  className,
  showCategory = true,
  showMeta = true
}: PostCardProps) {
  const { resolvedTheme } = useTheme();

  const glassCardClass = resolvedTheme === 'dark'
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
      <div className="p-6 md:p-8 flex-grow flex flex-col">
        {showCategory && category && (
          <span
            className="inline-block px-3 py-1 text-xs font-semibold bg-glass rounded-full mb-4 w-fit"
            style={{
              backgroundColor: 'var(--glass-default)',
              color: 'var(--tech-cyan)'
            }}
            aria-label={`分类: ${category}`}
          >
            {category}
          </span>
        )}

        <div className="flex-grow">
          <h2
            id={`post-title-${id}`}
            className="text-xl md:text-2xl font-bold mb-3 group-hover:text-tech-lightcyan transition-colors break-words"
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </h2>
          <p
            className="mb-4 line-clamp-3 break-words"
            style={{ color: 'var(--foreground)' }}
          >
            {excerpt}
          </p>
        </div>

        {showMeta && (
          <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-2">
            <div
              className="flex flex-wrap gap-3 text-sm"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <time>{date}</time>
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {readTime}
              </span>
            </div>

            <Button
              asChild
              variant="ghost"
              className="group p-0 h-auto font-medium"
              style={{ color: 'var(--tech-cyan)' }}
              aria-label={`阅读文章: ${title}`}
            >
              <Link href={href}>
                阅读更多
                <ArrowRightIcon
                  className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Button>
          </div>
        )}
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
      <div className="p-6 md:p-8 flex-grow flex flex-col">
        <div
          className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 w-16 h-6"
          style={{ backgroundColor: 'var(--muted)' }}
        />

        <div className="flex-grow">
          <div
            className="text-xl md:text-2xl font-bold text-transparent rounded mb-3 w-3/4 h-6 mb-4"
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div className="space-y-2">
            <div
              className="text-transparent rounded w-full h-4"
              style={{ backgroundColor: 'var(--muted)' }}
            />
            <div
              className="text-transparent rounded w-5/6 h-4"
              style={{ backgroundColor: 'var(--muted)' }}
            />
            <div
              className="text-transparent rounded w-4/6 h-4"
              style={{ backgroundColor: 'var(--muted)' }}
            />
          </div>
        </div>

        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-3">
            <div
              className="w-16 h-4 rounded"
              style={{ backgroundColor: 'var(--muted)' }}
            />
            <div
              className="w-12 h-4 rounded"
              style={{ backgroundColor: 'var(--muted)' }}
            />
          </div>
          <div
            className="w-16 h-6 rounded"
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>
      </div>
    </article>
  );
}