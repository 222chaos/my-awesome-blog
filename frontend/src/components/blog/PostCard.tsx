import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  href?: string;
}

export default function PostCard({ 
  id, 
  title, 
  excerpt, 
  date, 
  readTime,
  href = `/posts/${id}`
}: PostCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-secondary-600 dark:text-secondary-300 mb-4">
            {excerpt}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-secondary-500 dark:text-secondary-400">
            <time>{date}</time> • {readTime}
          </div>
          
          <Button asChild>
            <Link href={href as any}>Read More</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}