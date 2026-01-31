import SimplePostCard from '@/components/blog/SimplePostCard';
import GlassCard from '@/components/ui/GlassCard';
import Breadcrumb from '@/components/Breadcrumb';

export default function PostsPage() {
  // Sample posts data - in a real app, this would come from a CMS or content directory
  const samplePosts = [
    {
      id: 'getting-started-with-nextjs',
      title: 'Next.js 14 入门指南',
      excerpt: '学习如何使用 Next.js 14 和新的 App Router 构建现代化网页应用。',
      date: '2024年1月15日',
      readTime: '5分钟阅读',
      category: '开发',
    },
    {
      id: 'tailwind-css-tips',
      title: '高级 Tailwind CSS 技巧',
      excerpt: '探索使用 Tailwind CSS 构建美观响应式用户界面的高级技巧。',
      date: '2024年1月10日',
      readTime: '8分钟阅读',
      category: '设计',
    },
    {
      id: 'typescript-best-practices',
      title: 'React 开发者的 TypeScript 最佳实践',
      excerpt: '每个 React 开发者都应该知道的重要 TypeScript 模式和实践。',
      date: '2024年1月5日',
      readTime: '6分钟阅读',
      category: '开发',
    },
    {
      id: 'api-design-guide',
      title: '现代 API 设计原则',
      excerpt: '学习如何为您的应用程序设计可扩展且易于维护的 API。',
      date: '2023年12月28日',
      readTime: '10分钟阅读',
      category: '后端',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: '首页', href: '/' },
            { label: '文章', active: true }
          ]}
        />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <GlassCard className="max-w-4xl mx-auto mb-12 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            最新文章
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            关于现代Web开发的见解和教程
          </p>
        </GlassCard>

        <div className="max-w-4xl mx-auto space-y-8">
          {samplePosts.map((post, index) => (
            <div
              key={post.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <SimplePostCard {...post} />
            </div>
          ))}
        </div>

        {samplePosts.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-white mb-2">暂无文章</h2>
            <p className="text-muted-foreground mb-6">
              敬请期待新文章！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}