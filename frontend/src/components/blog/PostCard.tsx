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
    <article className={cn("glass-card-secondary glass-hover group overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ", className)}>
      <div className="p-6 md:p-8 flex-grow">
        {category && (
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-glass rounded-full mb-4" style={{ backgroundColor: 'var(--glass-default)', color: 'var(--tech-cyan)' }}>
            {category}
          </span>
        )}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-tech-lightcyan transition-colors" style={{ color: 'var(--foreground)' }}>
            {title}
          </h2>
          <p className="mb-4 line-clamp-3" style={{ color: 'var(--foreground)' }}>
            {excerpt}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4">
          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <time>{date}</time> • {readTime}
          </div>

          <Button asChild variant="ghost" className="group" style={{ color: 'var(--tech-cyan)' }}>
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
        <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 animate-pulse" style={{ backgroundColor: 'var(--glass-default)' }}>
          <span className="text-transparent rounded-full w-12 h-4" style={{ backgroundColor: 'var(--glass-default)' }}>&nbsp;</span>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-transparent rounded mb-3 w-3/4 h-6 animate-pulse" style={{ backgroundColor: 'var(--glass-default)' }}>
            &nbsp;
          </h2>
          <p className="text-transparent rounded w-full h-4 mb-2 animate-pulse" style={{ backgroundColor: 'var(--glass-default)' }}>&nbsp;</p>
          <p className="text-transparent rounded w-5/6 h-4 mb-2 animate-pulse" style={{ backgroundColor: 'var(--glass-default)' }}>&nbsp;</p>
          <p className="text-transparent rounded w-4/6 h-4 animate-pulse" style={{ backgroundColor: 'var(--glass-default)' }}>&nbsp;</p>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4">
          <div className="text-sm text-transparent rounded w-1/3 h-4 animate-pulse" style={{ backgroundColor: 'var(--glass-default)' }}>
            &nbsp;
          </div>
          <div className="text-transparent rounded w-16 h-8 animate-pulse" style={{ backgroundColor: 'var(--glass-default)' }}>
            &nbsp;
          </div>
        </div>
      </div>
    </article>
  );
}