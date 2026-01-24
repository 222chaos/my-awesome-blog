import PostCard from '@/components/blog/PostCard';

export default function PostsPage() {
  // Sample posts data - in a real app, this would come from a CMS or content directory
  const samplePosts = [
    {
      id: 'getting-started-with-nextjs',
      title: 'Getting Started with Next.js 14',
      excerpt: 'Learn how to build modern web applications with Next.js 14 and the new App Router.',
      date: 'January 15, 2024',
      readTime: '5 min read',
    },
    {
      id: 'tailwind-css-tips',
      title: 'Advanced Tailwind CSS Techniques',
      excerpt: 'Discover advanced techniques for building beautiful and responsive UIs with Tailwind CSS.',
      date: 'January 10, 2024',
      readTime: '8 min read',
    },
    {
      id: 'typescript-best-practices',
      title: 'TypeScript Best Practices for React Developers',
      excerpt: 'Essential TypeScript patterns and practices every React developer should know.',
      date: 'January 5, 2024',
      readTime: '6 min read',
    },
    {
      id: 'api-design-guide',
      title: 'Modern API Design Principles',
      excerpt: 'Learn how to design scalable and maintainable APIs for your applications.',
      date: 'December 28, 2023',
      readTime: '10 min read',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary-800 dark:text-primary-200 mb-4">Latest Articles</h1>
        <p className="text-xl text-secondary-700 dark:text-secondary-300">
          Insights and tutorials on modern web development
        </p>
      </div>

      <div className="space-y-8">
        {samplePosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>

      {samplePosts.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h2>
          <p className="text-secondary-600 dark:text-secondary-300 mb-6">
            Check back soon for new articles!
          </p>
        </div>
      )}
    </div>
  );
}