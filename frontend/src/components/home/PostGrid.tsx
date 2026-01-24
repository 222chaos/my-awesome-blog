import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import type { Post } from '@/types';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PostCardSkeleton } from '@/components/blog/PostCard';

interface PostCardItemProps {
  post: Post;
  index: number;
}

const PostCardItem = React.memo(({ post, index }: PostCardItemProps) => (
  <Card
    key={post.id}
    className="glass-hover group h-full flex flex-col animate-fade-scale-up"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <CardContent className="flex-grow p-6">
      <span className="inline-block px-3 py-1 text-xs font-semibold text-tech-cyan bg-glass/50 rounded-full mb-4">
        {post.category}
      </span>

      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-tech-lightcyan transition-colors">
        {post.title}
      </h3>

      <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
    </CardContent>

    <CardFooter className="mt-auto">
      <Link
        href={`/posts/${post.id}`}
        className="text-tech-cyan hover:text-tech-lightcyan font-medium inline-flex items-center group-hover:translate-x-1 transition-transform"
        aria-label={`阅读文章: ${post.title}`}
      >
        Read more
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </CardFooter>
  </Card>
));

PostCardItem.displayName = 'PostCardItem';

interface PostGridProps {
  posts: Post[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function PostGrid({ posts, loading = false, hasMore = true, onLoadMore }: PostGridProps) {
  const [page, setPage] = useState(1);
  const [hasMoreLocal, setHasMoreLocal] = useState(hasMore);
  const [loadingLocal, setLoadingLocal] = useState(loading);
  const observerRef = useRef<IntersectionObserver>();
  
  const loadMore = useCallback(async () => {
    if (loadingLocal || !hasMoreLocal || !onLoadMore) return;
    
    setLoadingLocal(true);
    onLoadMore();
    
    // 模拟加载数据
    setTimeout(() => {
      setLoadingLocal(false);
      setPage(prev => prev + 1);
    }, 1000);
  }, [loadingLocal, hasMoreLocal, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreLocal && !loadingLocal) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMoreLocal, loadingLocal]);
  
  // 根据加载状态决定是否显示骨架屏
  const shouldShowSkeleton = loadingLocal && posts.length === 0;
  
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-fade-in-up">
          Latest Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shouldShowSkeleton ? (
            // 显示骨架屏
            Array.from({ length: 6 }).map((_, index) => (
              <PostCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            posts.map((post, index) => (
              <PostCardItem key={post.id} post={post} index={index} />
            ))
          )}
        </div>
        
        {(hasMoreLocal || loadingLocal) && (
          <div id="sentinel" className="flex justify-center py-8">
            {loadingLocal && posts.length > 0 && (
              <div className="h-12 w-12 border-4 border-tech-cyan border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
