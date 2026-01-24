import { Button } from '@/components/ui/Button';
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

// ... existing code ...

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
    <article className={cn("glass-card-secondary glass-hover group overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-tech-cyan/20", className)}>
      <div className="p-6 md:p-8 flex-grow">
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
        
        <div className="flex justify-between items-center mt-auto pt-4">
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

// PostCard Skeleton Component for Loading State
export function PostCardSkeleton() {
  return (
    <article className="glass-card-secondary overflow-hidden h-full flex flex-col">
      <div className="p-6 md:p-8 flex-grow">
        <div className="inline-block px-3 py-1 text-xs font-semibold bg-glass/30 rounded-full mb-4 animate-pulse">
          <span className="text-transparent bg-glass/40 rounded-full w-12 h-4">&nbsp;</span>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-glass/40 rounded mb-3 w-3/4 h-6 animate-pulse">
            &nbsp;
          </h2>
          <p className="text-transparent bg-glass/40 rounded w-full h-4 mb-2 animate-pulse">&nbsp;</p>
          <p className="text-transparent bg-glass/40 rounded w-5/6 h-4 mb-2 animate-pulse">&nbsp;</p>
          <p className="text-transparent bg-glass/40 rounded w-4/6 h-4 animate-pulse">&nbsp;</p>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4">
          <div className="text-sm text-transparent bg-glass/40 rounded w-1/3 h-4 animate-pulse">
            &nbsp;
          </div>
          <div className="text-transparent bg-glass/40 rounded w-16 h-8 animate-pulse">
            &nbsp;
          </div>
        </div>
      </div>
    </article>
  );
}