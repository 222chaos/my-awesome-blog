import { API_BASE_URL } from '@/config/api';

export interface Subscription {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  verification_token: string | null;
  subscribed_at: string;
  verified_at: string | null;
  unsubscribed_at: string | null;
}

export interface SubscriptionCreate {
  email: string;
}

export interface SubscriptionUpdate {
  is_active?: boolean;
  is_verified?: boolean;
}

const API_URL = `${API_BASE_URL}/subscriptions`;

export const subscriptionService = {
  async getSubscriptions(params?: { is_active?: boolean; skip?: number; limit?: number }): Promise<Subscription[]> {
    const queryString = new URLSearchParams();
    if (params?.is_active !== undefined) queryString.append('is_active', params.is_active.toString());
    if (params?.skip !== undefined) queryString.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryString.append('limit', params.limit.toString());

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}?${queryString.toString()}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    return response.json();
  },

  async getSubscriptionById(subscriptionId: string): Promise<Subscription> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/${subscriptionId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch subscription');
    return response.json();
  },

  async createSubscription(email: string): Promise<Subscription> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Failed to create subscription');
    return response.json();
  },

  async unsubscribe(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/unsubscribe?email=${encodeURIComponent(email)}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to unsubscribe');
    return response.json();
  },

  async updateSubscription(subscriptionId: string, subscriptionData: SubscriptionUpdate): Promise<Subscription> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/${subscriptionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(subscriptionData),
    });
    if (!response.ok) throw new Error('Failed to update subscription');
    return response.json();
  },

  async deleteSubscription(subscriptionId: string): Promise<void> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete subscription');
  },

  async getSubscribersCount(): Promise<number> {
    const response = await fetch(`${API_URL}/count`);
    if (!response.ok) throw new Error('Failed to fetch subscribers count');
    return response.json();
  },
};
