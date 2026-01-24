import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category?: string;
  href?: string;
  className?: string;
}

export default function PostCard({ 
  id, 
  title, 
  excerpt, 
  date, 
  readTime,
  category,
  href = `/posts/${id}`,
  className
}: PostCardProps) {
  return (
    <article className={cn("glass-card-secondary glass-hover group overflow-hidden", className)}>
      <div className="p-6 md:p-8">
        {category && (
          <span className="inline-block px-3 py-1 text-xs font-semibold text-tech-cyan bg-glass/50 rounded-full mb-4">
            {category}
          </span>
        )}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-tech-lightcyan transition-colors">
            {title}
          </h2>
          <p className="text-gray-300 mb-4 line-clamp-3">
            {excerpt}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            <time>{date}</time> • {readTime}
          </div>
          
          <Button asChild variant="ghost" className="text-tech-cyan hover:text-tech-lightcyan group">
            <Link href={href as any} aria-label={`阅读文章: ${title}`}>
              阅读更多
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
          </Button>
        </div>
      </div>
    </article>
  );
}