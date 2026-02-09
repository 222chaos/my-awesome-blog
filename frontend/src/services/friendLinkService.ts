import { API_BASE_URL } from '@/config/api';

export interface FriendLink {
  id: string;
  name: string;
  url: string;
  favicon: string | null;
  avatar: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  click_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface FriendLinkCreate {
  name: string;
  url: string;
  favicon?: string;
  avatar?: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface FriendLinkUpdate {
  name?: string;
  url?: string;
  favicon?: string;
  avatar?: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

const API_URL = `${API_BASE_URL}/friend-links`;

export const friendLinkService = {
  async getFriendLinks(params?: { is_active?: boolean; is_featured?: boolean; skip?: number; limit?: number }): Promise<FriendLink[]> {
    const queryString = new URLSearchParams();
    if (params?.is_active !== undefined) queryString.append('is_active', params.is_active.toString());
    if (params?.is_featured !== undefined) queryString.append('is_featured', params.is_featured.toString());
    if (params?.skip !== undefined) queryString.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryString.append('limit', params.limit.toString());

    const response = await fetch(`${API_URL}?${queryString.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch friend links');
    return response.json();
  },

  async getFriendLinkById(linkId: string): Promise<FriendLink> {
    const response = await fetch(`${API_URL}/${linkId}`);
    if (!response.ok) throw new Error('Failed to fetch friend link');
    return response.json();
  },

  async createFriendLink(linkData: FriendLinkCreate): Promise<FriendLink> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(linkData),
    });
    if (!response.ok) throw new Error('Failed to create friend link');
    return response.json();
  },

  async updateFriendLink(linkId: string, linkData: FriendLinkUpdate): Promise<FriendLink> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/${linkId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(linkData),
    });
    if (!response.ok) throw new Error('Failed to update friend link');
    return response.json();
  },

  async deleteFriendLink(linkId: string): Promise<void> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/${linkId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete friend link');
  },

  async trackClick(linkId: string): Promise<void> {
    const response = await fetch(`${API_URL}/${linkId}/click`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to track click');
  },
};
