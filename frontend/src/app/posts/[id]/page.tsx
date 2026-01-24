import { notFound } from 'next/navigation';

// Sample posts data - in a real app, this would come from a CMS or content directory
const samplePosts = [
  {
    id: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js 14',
    content: `
      <p>Next.js 14 introduces significant improvements to the React framework, including enhanced performance, new features, and better developer experience.</p>
      
      <h2>Key Features of Next.js 14</h2>
      <p>One of the most exciting additions is the App Router, which provides better organization and more flexibility for building complex applications.</p>
      
      <h3>Server Components</h3>
      <p>Server Components allow you to render components on the server by default, reducing bundle size and improving performance.</p>
      
      <h3>Streaming</h3>
      <p>With React 18's streaming capabilities, you can progressively render parts of your application as they become ready.</p>
      
      <p>In this tutorial, we'll walk through setting up a new Next.js 14 project and exploring these new features in detail.</p>
    `,
    date: 'January 15, 2024',
    readTime: '5 min read',
  },
  {
    id: 'tailwind-css-tips',
    title: 'Advanced Tailwind CSS Techniques',
    content: `
      <p>Tailwind CSS has revolutionized how we approach styling in modern web applications. Here are some advanced techniques to maximize its potential.</p>
      
      <h2>Customizing Your Theme</h2>
      <p>One of the most powerful features of Tailwind is its extensive customization options. You can extend the default theme to match your brand requirements.</p>
      
      <h3>Creating Component Classes</h3>
      <p>While utility-first approach works well for most cases, sometimes you need reusable component classes.</p>
      
      <h3>Dark Mode Strategies</h3>
      <p>Tailwind provides excellent support for implementing dark mode in your applications.</p>
      
      <p>These techniques will help you build more maintainable and scalable applications with Tailwind CSS.</p>
    `,
    date: 'January 10, 2024',
    readTime: '8 min read',
  },
  {
    id: 'typescript-best-practices',
    title: 'TypeScript Best Practices for React Developers',
    content: `
      <p>TypeScript has become essential for building robust React applications. Let's explore some best practices for integrating them effectively.</p>
      
      <h2>Typing React Components</h2>
      <p>Properly typing your React components ensures type safety and improves the development experience.</p>
      
      <h3>Generic Components</h3>
      <p>Creating generic components allows for greater reusability while maintaining type safety.</p>
      
      <h3>State Management Patterns</h3>
      <p>Effective state management is crucial for large-scale applications.</p>
      
      <p>Following these practices will help you build more maintainable React applications with TypeScript.</p>
    `,
    date: 'January 5, 2024',
    readTime: '6 min read',
  },
  {
    id: 'api-design-guide',
    title: 'Modern API Design Principles',
    content: `
      <p>Designing effective APIs is crucial for building scalable and maintainable applications. Let's explore the fundamental principles.</p>
      
      <h2>RESTful Design</h2>
      <p>REST principles provide a standardized approach to designing web APIs that are intuitive and consistent.</p>
      
      <h3>Security Considerations</h3>
      <p>API security is paramount and requires careful consideration of authentication and authorization mechanisms.</p>
      
      <h3>Rate Limiting and Performance</h3>
      <p>Implementing proper rate limiting protects your API from abuse and ensures fair usage.</p>
      
      <p>Following these principles will result in APIs that are easier to use and maintain.</p>
    `,
    date: 'December 28, 2023',
    readTime: '10 min read',
  },
];

export default function PostPage({ params }: { params: { id: string } }) {
  const post = samplePosts.find(p => p.id === params.id);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center text-secondary-600 dark:text-secondary-400 text-sm">
              <time className="mr-4">{post.date}</time>
              <span>{post.readTime}</span>
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
          href="#" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
        >
          ← Back to all articles
        </a>
      </div>
    </div>
  );
}