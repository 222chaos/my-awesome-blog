// 模拟API调用，实际应用中应替换为真实的API请求
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8989/api/v1';

// 模拟文章数据类型
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  author_id: string;
  category_id: string;
  featured_image?: string;
  author: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  published_at: string;
  category: {
    name: string;
  };
  view_count: number;
}

// 获取文章列表
export const getArticles = async (filters?: {
  category?: string;
  tag?: string;
  search?: string;
}): Promise<Article[]> => {
  try {
    // 构建查询参数
    const params = new URLSearchParams();
    if (filters?.category) params.append('category_id', filters.category);
    if (filters?.tag) params.append('tag_id', filters.tag);
    if (filters?.search) params.append('search', filters.search);

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 模拟返回数据
    return [
      {
        id: '1',
        title: '深入理解React Hooks',
        content: '<p>React Hooks 是 React 16.8 引入的新特性...</p>',
        excerpt: 'React Hooks 是 React 16.8 引入的新特性，它允许我们在不编写 class 的情况下使用 state 以及其他的 React 特性。',
        is_published: true,
        view_count: 1200,
        created_at: '2023-01-15T10:30:00Z',
        updated_at: '2023-01-15T10:30:00Z',
        published_at: '2023-01-15T10:30:00Z',
        author_id: '1',
        category_id: '1',
        author: {
          id: '1',
          username: '开发者小王',
          email: 'xiaowang@example.com',
          bio: '热爱前端技术，专注React生态'
        },
        category: {
          id: '1',
          name: '前端开发',
          slug: 'frontend',
          description: '关于前端开发的技术文章'
        },
        tags: [
          { id: '1', name: 'React', slug: 'react' },
          { id: '2', name: 'JavaScript', slug: 'javascript' },
          { id: '3', name: 'Hooks', slug: 'hooks' }
        ]
      },
      {
        id: '2',
        title: 'TypeScript高级技巧',
        content: '<p>TypeScript 是 JavaScript 的超集...</p>',
        excerpt: 'TypeScript 是 JavaScript 的超集，它添加了可选的类型和基于类的面向对象编程。',
        is_published: true,
        view_count: 950,
        created_at: '2023-02-20T14:45:00Z',
        updated_at: '2023-02-20T14:45:00Z',
        published_at: '2023-02-20T14:45:00Z',
        author_id: '2',
        category_id: '1',
        author: {
          id: '2',
          username: 'TypeScript专家',
          email: 'ts-expert@example.com',
          bio: 'TypeScript深度使用者，喜欢探索类型系统'
        },
        category: {
          id: '1',
          name: '前端开发',
          slug: 'frontend',
          description: '关于前端开发的技术文章'
        },
        tags: [
          { id: '2', name: 'JavaScript', slug: 'javascript' },
          { id: '4', name: 'TypeScript', slug: 'typescript' },
          { id: '5', name: '编程技巧', slug: 'programming-tips' }
        ]
      },
      {
        id: '3',
        title: 'Node.js性能优化指南',
        content: '<p>Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境...</p>',
        excerpt: '本文介绍了如何通过多种方式优化 Node.js 应用程序的性能。',
        is_published: true,
        view_count: 780,
        created_at: '2023-03-10T09:20:00Z',
        updated_at: '2023-03-10T09:20:00Z',
        published_at: '2023-03-10T09:20:00Z',
        author_id: '3',
        category_id: '2',
        author: {
          id: '3',
          username: '后端架构师',
          email: 'architect@example.com',
          bio: '专注于后端架构和性能优化'
        },
        category: {
          id: '2',
          name: '后端开发',
          slug: 'backend',
          description: '关于后端开发的技术文章'
        },
        tags: [
          { id: '6', name: 'Node.js', slug: 'nodejs' },
          { id: '7', name: '性能优化', slug: 'performance' },
          { id: '8', name: '服务器', slug: 'server' }
        ]
      }
    ];
  } catch (error) {
    console.error('获取文章列表失败:', error);
    throw error;
  }
};

// 根据ID获取文章详情
export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 模拟返回数据
    const articles = await getArticles();
    return articles.find(article => article.id === id) || null;
  } catch (error) {
    console.error(`获取文章 ${id} 失败:`, error);
    throw error;
  }
};

// 获取相关文章
export const getRelatedArticles = async (articleId: string, categoryId: string): Promise<RelatedArticle[]> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 模拟返回数据
    return [
      {
        id: '4',
        title: 'React性能优化实战',
        excerpt: '探讨如何优化React应用程序的性能...',
        published_at: '2023-04-05T11:30:00Z',
        category: {
          name: '前端开发'
        },
        view_count: 650
      },
      {
        id: '5',
        title: 'ESLint配置最佳实践',
        excerpt: '详细介绍如何配置ESLint以提高代码质量...',
        published_at: '2023-04-12T16:20:00Z',
        category: {
          name: '前端开发'
        },
        view_count: 520
      },
      {
        id: '6',
        title: 'Next.js服务端渲染详解',
        excerpt: '深入了解Next.js的SSR机制及其应用场景...',
        published_at: '2023-04-18T10:15:00Z',
        category: {
          name: '前端开发'
        },
        view_count: 890
      }
    ];
  } catch (error) {
    console.error('获取相关文章失败:', error);
    throw error;
  }
};

// 获取分类列表
export const getCategories = async (): Promise<Category[]> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 模拟返回数据
    return [
      {
        id: '1',
        name: '前端开发',
        slug: 'frontend',
        description: '关于前端开发的技术文章'
      },
      {
        id: '2',
        name: '后端开发',
        slug: 'backend',
        description: '关于后端开发的技术文章'
      },
      {
        id: '3',
        name: '数据库',
        slug: 'database',
        description: '关于数据库设计和优化的文章'
      },
      {
        id: '4',
        name: 'DevOps',
        slug: 'devops',
        description: '关于运维和部署的文章'
      },
      {
        id: '5',
        name: '人工智能',
        slug: 'ai',
        description: '关于AI和机器学习的文章'
      }
    ];
  } catch (error) {
    console.error('获取分类列表失败:', error);
    throw error;
  }
};

// 获取标签列表
export const getTags = async (): Promise<Tag[]> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 模拟返回数据
    return [
      {
        id: '1',
        name: 'React',
        slug: 'react'
      },
      {
        id: '2',
        name: 'JavaScript',
        slug: 'javascript'
      },
      {
        id: '3',
        name: 'Hooks',
        slug: 'hooks'
      },
      {
        id: '4',
        name: 'TypeScript',
        slug: 'typescript'
      },
      {
        id: '5',
        name: '编程技巧',
        slug: 'programming-tips'
      },
      {
        id: '6',
        name: 'Node.js',
        slug: 'nodejs'
      },
      {
        id: '7',
        name: '性能优化',
        slug: 'performance'
      },
      {
        id: '8',
        name: '服务器',
        slug: 'server'
      }
    ];
  } catch (error) {
    console.error('获取标签列表失败:', error);
    throw error;
  }
};