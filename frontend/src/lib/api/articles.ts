import { env } from '@/lib/env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || 'http://localhost:8989/api/v1';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  is_published: boolean;
  author_id: string;
  author?: {
    id: string;
    username: string;
    email?: string;
    full_name?: string;
  };
  category_id?: string;
  tags?: {
    id: string;
    name: string;
  }[];
  view_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_featured: boolean;
  is_pinned: boolean;
  slug?: string;
  created_at: string;
  updated_at?: string;
}

export interface ArticlesParams {
  skip?: number;
  limit?: number;
  published_only?: boolean;
  author_id?: string;
  category_id?: string;
  tag_id?: string;
  search?: string;
}

export const getArticles = async (params: ArticlesParams = {}): Promise<Article[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params.published_only !== undefined) queryParams.append('published_only', params.published_only.toString());
  if (params.author_id) queryParams.append('author_id', params.author_id);
  if (params.category_id) queryParams.append('category_id', params.category_id);
  if (params.tag_id) queryParams.append('tag_id', params.tag_id);
  if (params.search) queryParams.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}/articles/?${queryParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `请求失败: ${response.status}`);
  }

  return response.json();
};

export const getPopularArticles = async (params: { limit?: number } = {}): Promise<Article[]> => {
  const limit = params.limit || 10;
  const response = await fetch(`${API_BASE_URL}/articles/popular?limit=${limit}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `请求热门文章失败: ${response.status}`);
  }

  return response.json();
};

export const getFeaturedArticles = async (limit: number = 6): Promise<Article[]> => {
  const response = await fetch(`${API_BASE_URL}/articles/featured?limit=${limit}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `请求失败: ${response.status}`);
  }

  return response.json();
};

export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const response = await fetch(`${API_BASE_URL}/articles/slug/${slug}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('文章不存在');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `请求失败: ${response.status}`);
  }

  return response.json();
};
