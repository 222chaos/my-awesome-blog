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

const API_URL = `${API_BASE_URL}/timeline-events`;

export const timelineService = {
  async getTimelineEvents(params?: { is_active?: boolean; skip?: number; limit?: number }): Promise<TimelineEvent[]> {
    const queryString = new URLSearchParams();
    if (params?.is_active !== undefined) queryString.append('is_active', params.is_active.toString());
    if (params?.skip !== undefined) queryString.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryString.append('limit', params.limit.toString());

    const response = await fetch(`${API_URL}?${queryString.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch timeline events');
    return response.json();
  },

  async getTimelineEventById(eventId: string): Promise<TimelineEvent> {
    const response = await fetch(`${API_URL}/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch timeline event');
    return response.json();
  },

  async createTimelineEvent(eventData: TimelineEventCreate): Promise<TimelineEvent> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to create timeline event');
    return response.json();
  },

  async updateTimelineEvent(eventId: string, eventData: TimelineEventUpdate): Promise<TimelineEvent> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to update timeline event');
    return response.json();
  },

  async deleteTimelineEvent(eventId: string): Promise<void> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete timeline event');
  },
};
