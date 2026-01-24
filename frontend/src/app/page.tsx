'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import PostGrid from '@/components/home/PostGrid';
import Sidebar from '@/components/home/Sidebar';
import GlassCard from '@/components/ui/GlassCard';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

interface Category {
  name: string;
  count: number;
}

interface PopularPost {
  id: string;
  title: string;
  date: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);

  useEffect(() => {
    // Sample data - in a real app, this would come from an API
    setPosts([
      {
        id: 'getting-started-with-nextjs',
        title: 'Getting Started with Next.js 14',
        excerpt: 'Learn how to build modern web applications with Next.js 14 and the new App Router.',
        date: 'January 15, 2024',
        readTime: '5 min read',
        category: 'Development'
      },
      {
        id: 'tailwind-css-tips',
        title: 'Advanced Tailwind CSS Techniques',
        excerpt: 'Discover advanced techniques for building beautiful and responsive UIs with Tailwind CSS.',
        date: 'January 10, 2024',
        readTime: '8 min read',
        category: 'Design'
      },
      {
        id: 'typescript-best-practices',
        title: 'TypeScript Best Practices for React Developers',
        excerpt: 'Essential TypeScript patterns and practices every React developer should know.',
        date: 'January 5, 2024',
        readTime: '6 min read',
        category: 'Development'
      },
      {
        id: 'api-design-guide',
        title: 'Modern API Design Principles',
        excerpt: 'Learn how to design scalable and maintainable APIs for your applications.',
        date: 'December 28, 2023',
        readTime: '10 min read',
        category: 'Backend'
      },
      {
        id: 'state-management-options',
        title: 'State Management in 2024',
        excerpt: 'Comparing different state management solutions for React applications.',
        date: 'December 20, 2023',
        readTime: '12 min read',
        category: 'Frontend'
      },
      {
        id: 'web-security-basics',
        title: 'Essential Web Security Practices',
        excerpt: 'Protect your applications from common security vulnerabilities.',
        date: 'December 15, 2023',
        readTime: '9 min read',
        category: 'Security'
      }
    ]);

    setCategories([
      { name: 'Development', count: 12 },
      { name: 'Design', count: 8 },
      { name: 'Backend', count: 5 },
      { name: 'Frontend', count: 10 },
      { name: 'Security', count: 4 },
      { name: 'DevOps', count: 6 }
    ]);

    setPopularPosts([
      { id: 'getting-started-with-nextjs', title: 'Getting Started with Next.js 14', date: 'Jan 15' },
      { id: 'tailwind-css-tips', title: 'Advanced Tailwind CSS Techniques', date: 'Jan 10' },
      { id: 'typescript-best-practices', title: 'TypeScript Best Practices', date: 'Jan 5' },
      { id: 'api-design-guide', title: 'Modern API Design Principles', date: 'Dec 28' }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-tech-darkblue text-white">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
            <PostGrid posts={posts} />
          </main>
          
          <aside className="lg:w-80">
            <Sidebar categories={categories} popularPosts={popularPosts} />
          </aside>
        </div>
      </div>
      
      <GlassCard className="container mx-auto px-4 py-8 mt-12" padding="lg">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Join our newsletter to receive updates on the latest articles, tips, and resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md bg-glass border border-glass-border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tech-cyan"
            />
            <button className="px-6 py-2 bg-tech-cyan text-white rounded-md hover:bg-tech-lightcyan transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}