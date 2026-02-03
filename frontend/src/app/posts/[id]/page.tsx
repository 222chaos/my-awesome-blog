import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import SocialShare from '@/components/social/SocialShare';

// Sample posts data - in a real app, this would come from a CMS or content directory
const samplePosts = [
  {
    id: 'getting-started-with-nextjs',
    title: 'Next.js 14 入门指南',
    content: `
      <p>Next.js 14 为 React 框架带来了重大改进，包括增强的性能、新功能以及更好的开发者体验。</p>

      <h2>Next.js 14 的主要特性</h2>
      <p>最令人兴奋的新增功能之一是 App Router，它为构建复杂应用提供了更好的组织结构和更多灵活性。</p>

      <h3>服务器组件</h3>
      <p>服务器组件允许您默认在服务器上渲染组件，减少打包体积并提升性能。</p>

      <h3>流式传输</h3>
      <p>借助 React 18 的流式传输功能，您可以随着应用准备就绪逐步渲染各个部分。</p>

      <p>在本教程中，我们将详细介绍如何搭建新的 Next.js 14 项目并深入探索这些新功能。</p>
    `,
    date: '2024年1月15日',
    readTime: '5分钟阅读',
  },
  {
    id: 'tailwind-css-tips',
    title: '高级 Tailwind CSS 技巧',
    content: `
      <p>Tailwind CSS 彻底改变了我们处理现代网页应用样式的思路。以下是一些高级技巧，助您充分发挥其潜力。</p>

      <h2>自定义主题</h2>
      <p>Tailwind 最强大的功能之一是其广泛的自定义选项。您可以扩展默认主题以满足品牌需求。</p>

      <h3>创建组件类</h3>
      <p>尽管实用优先的方法在大多数情况下都很有效，但有时您需要可重用的组件类。</p>

      <h3>暗黑模式策略</h3>
      <p>Tailwind 为在应用中实现暗黑模式提供了出色的支持。</p>

      <p>这些技巧将帮助您使用 Tailwind CSS 构建更易维护和可扩展的应用程序。</p>
    `,
    date: '2024年1月10日',
    readTime: '8分钟阅读',
  },
  {
    id: 'typescript-best-practices',
    title: 'React 开发者的 TypeScript 最佳实践',
    content: `
      <p>TypeScript 已成为构建健壮 React 应用程序的必备工具。让我们探索一些有效集成它们的最佳实践。</p>

      <h2>React 组件类型定义</h2>
      <p>正确地为 React 组件添加类型注解可确保类型安全并改善开发体验。</p>

      <h3>泛型组件</h3>
      <p>创建泛型组件可在保持类型安全的同时实现更大的可重用性。</p>

      <h3>状态管理模式</h3>
      <p>有效的状态管理对于大规模应用至关重要。</p>

      <p>遵循这些实践将帮助您使用 TypeScript 构建更易维护的 React 应用程序。</p>
    `,
    date: '2024年1月5日',
    readTime: '6分钟阅读',
  },
  {
    id: 'api-design-guide',
    title: '现代 API 设计原则',
    content: `
      <p>设计有效的 API 对于构建可扩展和易维护的应用程序至关重要。让我们探讨基本原理。</p>

      <h2>RESTful 设计</h2>
      <p>REST 原则为设计直观且一致的 Web API 提供了标准化方法。</p>

      <h3>安全考虑</h3>
      <p>API 安全性至关重要，需要仔细考虑认证和授权机制。</p>

      <h3>速率限制和性能</h3>
      <p>实施适当的速率限制可防止滥用并确保公平使用。</p>

      <p>遵循这些原则将产生更易于使用和维护的 API。</p>
    `,
    date: '2023年12月28日',
    readTime: '10分钟阅读',
  },
];

export default function PostPage({ params }: { params: { id: string } }) {
  const post = samplePosts.find(p => p.id === params.id);

  if (!post) {
    notFound();
  }

  // 获取当前URL用于分享
  const currentUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://my-awesome-blog.com/posts/${params.id}`;

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 max-w-3xl">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: '首页', href: '/' },
            { label: '文章', href: '/posts' },
            { label: post.title, active: true }
          ]}
        />
      </div>

      <article className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center text-muted-foreground text-sm">
                <time className="mr-4">{post.date}</time>
                <span>{post.readTime}</span>
              </div>

              <SocialShare
                url={currentUrl}
                title={post.title}
                description={`阅读关于 "${post.title}" 的文章 - ${post.content.substring(0, 100)}...`}
                className="flex-wrap justify-end"
              />
            </div>
          </header>

          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <div className="mt-8 text-center">
        <a
          href="/posts"
          className="inline-flex items-center text-tech-cyan hover:text-tech-lightcyan transition-colors"
        >
          ← 返回所有文章
        </a>
      </div>
    </div>
  );
}