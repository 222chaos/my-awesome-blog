import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

export default function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <section className="py-16 bg-gradient-to-b from-tech-darkblue to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Latest Articles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <GlassCard 
              key={post.id} 
              className="glass-hover group h-full flex flex-col"
              hoverEffect={true}
              glowEffect={false}
              padding="md"
            >
              <div className="flex-grow">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-tech-cyan bg-glass/50 rounded-full mb-4">
                  {post.category}
                </span>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-tech-lightcyan transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href={`/posts/${post.id}`} className="text-tech-cyan hover:text-tech-lightcyan font-medium inline-flex items-center">
                  Read more
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}