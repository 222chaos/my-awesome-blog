import { API_BASE_URL } from '@/config/api';

export interface Comment {
  id: string;
  content: string;
  article_id: string;
  author_id: string;
  parent_id: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string | null;
  author?: {
    id: string;
    username: string;
    avatar: string | null;
    full_name: string | null;
  };
  article?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface CommentCreate {
  content: string;
  article_id: string;
  parent_id?: string | null;
}

export interface CommentUpdate {
  content?: string;
  is_approved?: boolean;
}

const API_URL = `${API_BASE_URL}/comments`;

export const commentService = {
  async getComments(params?: { article_id?: string; skip?: number; limit?: number }): Promise<Comment[]> {
    const queryString = new URLSearchParams();
    if (params?.article_id) queryString.append('article_id', params.article_id);
    if (params?.skip !== undefined) queryString.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryString.append('limit', params.limit.toString());

    const response = await fetch(`${API_URL}?${queryString.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  async getCommentById(commentId: string): Promise<Comment> {
    const response = await fetch(`${API_URL}/${commentId}`);
    if (!response.ok) throw new Error('Failed to fetch comment');
    return response.json();
  },

  async createComment(commentData: CommentCreate): Promise<Comment> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  },

  async updateComment(commentId: string, commentData: CommentUpdate): Promise<Comment> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
  },

  async deleteComment(commentId: string): Promise<void> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/${commentId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete comment');
  },

  async approveComment(commentId: string): Promise<Comment> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/${commentId}/approve`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to approve comment');
    return response.json();
  },
};
