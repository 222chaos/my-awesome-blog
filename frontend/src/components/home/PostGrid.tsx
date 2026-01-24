import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Post } from '@/types';
import React from 'react';

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

export default function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-fade-in-up">
          Latest Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <PostCardItem key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
