'use client';

import { cn } from '@/lib/utils';

interface ArticleCardSkeletonProps {
  variant?: 'default' | 'short' | 'tall';
}

export default function ArticleCardSkeleton({ variant = 'default' }: ArticleCardSkeletonProps) {
  const heights = {
    default: 'aspect-[4/5]',
    short: 'aspect-[4/3]',
    tall: 'aspect-[4/7]'
  };

  return (
    <div className={cn(
      'rounded-2xl bg-white/5 border border-white/10 overflow-hidden',
      'animate-pulse'
    )}>
      <div className={cn('w-full', heights[variant])}>
        <div className="p-4 space-y-3 h-full flex flex-col">
          <div className="w-3/4 h-4 bg-white/10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-white/10 rounded w-3/4" />
            <div className="h-6 bg-white/10 rounded w-full" />
          </div>
          <div className="h-3 bg-white/10 rounded w-2/3" />
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
          <div className="space-y-2 flex items-center justify-between mt-2">
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-white/10 rounded-full" />
              <div className="h-8 w-16 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
