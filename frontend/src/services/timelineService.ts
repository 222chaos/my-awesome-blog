import { API_BASE_URL } from '@/config/api';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: string;
  icon: string | null;
  color: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface TimelineEventCreate {
  title: string;
  description?: string;
  event_date: string;
  event_type?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface TimelineEventUpdate {
  title?: string;
  description?: string;
  event_date?: string;
  event_type?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
  sort_order?: number;
}

const API_URL = `/api/v1/timeline-events`;

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

export const timelineService = {
  async getTimelineEvents(params?: { is_active?: boolean; skip?: number; limit?: number }): Promise<TimelineEvent[]> {
    const queryString = new URLSearchParams();
    if (params?.is_active !== undefined) queryString.append('is_active', params.is_active.toString());
    if (params?.skip !== undefined) queryString.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryString.append('limit', params.limit.toString());

    return apiRequest(`${API_URL}?${queryString.toString()}`);
  },

  async getTimelineEventById(eventId: string): Promise<TimelineEvent> {
    return apiRequest(`${API_URL}/${eventId}`);
  },

  async createTimelineEvent(eventData: TimelineEventCreate): Promise<TimelineEvent> {
    return apiRequest(API_URL, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateTimelineEvent(eventId: string, eventData: TimelineEventUpdate): Promise<TimelineEvent> {
    return apiRequest(`${API_URL}/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  async deleteTimelineEvent(eventId: string): Promise<void> {
    return apiRequest(`${API_URL}/${eventId}`, {
      method: 'DELETE',
    });
  },
};
