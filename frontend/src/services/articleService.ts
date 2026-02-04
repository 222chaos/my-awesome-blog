import { API_BASE_URL } from '@/config/api';

// 文章数据类型
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
  read_time: number; // 阅读时间（分钟）
  likes_count: number; // 点赞数
  comments_count: number; // 评论数
  shares_count: number; // 分享数
  author: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    reputation: number; // 声誉分数
    followers_count: number; // 关注者数量
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
  article_count: number; // 分类文章数量
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  article_count: number; // 标签文章数量
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

// 通用请求函数
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `请求失败: ${response.status}`);
  }

  return response.json();
};

// 获取文章列表
export const getArticles = async (filters?: {
  category?: string;
  tag?: string;
  search?: string;
}): Promise<Article[]> => {
  // 构建查询参数
  const params = new URLSearchParams();
  if (filters?.category) params.append('category_id', filters.category);
  if (filters?.tag) params.append('tag_id', filters.tag);
  if (filters?.search) params.append('search', filters.search);

  const queryString = params.toString();
  const endpoint = `/api/v1/articles/${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest(endpoint);
};

// 根据ID获取文章详情
export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    return await apiRequest(`/api/v1/articles/${id}`);
  } catch (error) {
    console.error(`获取文章 ${id} 失败:`, error);
    return null;
  }
};

// 根据Slug获取文章详情
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    return await apiRequest(`/api/v1/articles/slug/${slug}`);
  } catch (error) {
    console.error(`获取文章 ${slug} 失败:`, error);
    return null;
  }
};

// 获取相关文章
export const getRelatedArticles = async (articleId: string): Promise<RelatedArticle[]> => {
  try {
    return await apiRequest(`/api/v1/articles/related/${articleId}`);
  } catch (error) {
    console.error('获取相关文章失败:', error);
    return [];
  }
};

// 获取分类列表
export const getCategories = async (): Promise<Category[]> => {
  try {
    return await apiRequest('/api/v1/categories/');
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return [];
  }
};

// 获取标签列表
export const getTags = async (): Promise<Tag[]> => {
  try {
    return await apiRequest('/api/v1/tags/');
  } catch (error) {
    console.error('获取标签列表失败:', error);
    return [];
  }
};

// 获取精选文章
export const getFeaturedArticles = async (limit: number = 5): Promise<Article[]> => {
  try {
    return await apiRequest(`/api/v1/articles/featured?limit=${limit}`);
  } catch (error) {
    console.error('获取精选文章失败:', error);
    return [];
  }
};

// 获取热门文章
export const getPopularArticles = async (limit: number = 10): Promise<Article[]> => {
  try {
    return await apiRequest(`/api/v1/articles/popular?limit=${limit}`);
  } catch (error) {
    console.error('获取热门文章失败:', error);
    return [];
  }
};

// 搜索文章
export const searchArticles = async (query: string, filters?: {
  category_slug?: string;
  tag_slug?: string;
}): Promise<Article[]> => {
  try {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters?.category_slug) params.append('category_slug', filters.category_slug);
    if (filters?.tag_slug) params.append('tag_slug', filters.tag_slug);
    
    return await apiRequest(`/api/v1/articles/search?${params.toString()}`);
  } catch (error) {
    console.error('搜索文章失败:', error);
    return [];
  }
};
