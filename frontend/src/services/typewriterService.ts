import { API_BASE_URL } from '@/config/api';

export interface TypewriterContent {
  id: string;
  text: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface TypewriterContentCreate {
  text: string;
  priority?: number;
  is_active?: boolean;
}

export interface TypewriterContentUpdate {
  text?: string;
  priority?: number;
  is_active?: boolean;
}

export interface TypewriterContentList {
  contents: TypewriterContent[];
  total: number;
}

const API_URL = `${API_BASE_URL}/typewriter-contents`;

export const typewriterService = {
  async getTypewriterContents(params?: { is_active?: boolean; skip?: number; limit?: number }): Promise<TypewriterContentList> {
    const queryString = new URLSearchParams();
    if (params?.is_active !== undefined) queryString.append('is_active', params.is_active.toString());
    if (params?.skip !== undefined) queryString.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryString.append('limit', params.limit.toString());

    const response = await fetch(`${API_URL}?${queryString.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch typewriter contents');
    return response.json();
  },

  async getTypewriterContentById(contentId: string): Promise<TypewriterContent> {
    const response = await fetch(`${API_URL}/${contentId}`);
    if (!response.ok) throw new Error('Failed to fetch typewriter content');
    return response.json();
  },

  async createTypewriterContent(contentData: TypewriterContentCreate): Promise<TypewriterContent> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(contentData),
    });
    if (!response.ok) throw new Error('Failed to create typewriter content');
    return response.json();
  },

  async updateTypewriterContent(contentId: string, contentData: TypewriterContentUpdate): Promise<TypewriterContent> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/${contentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(contentData),
    });
    if (!response.ok) throw new Error('Failed to update typewriter content');
    return response.json();
  },

  async deleteTypewriterContent(contentId: string): Promise<void> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/${contentId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete typewriter content');
  },
};
