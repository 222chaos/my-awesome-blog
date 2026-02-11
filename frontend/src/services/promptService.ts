import { apiRequest } from '@/lib/api';
import type {
  Prompt,
  PromptCreate,
  PromptUpdate,
  PromptVersion,
  ABTestResult,
  PaginatedResponse,
} from '@/types';

const API_BASE = '/api/v1/prompts';

export const promptService = {
  async getPrompts(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    category?: string;
    is_active?: boolean;
  }): Promise<PaginatedResponse<Prompt>> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

    const url = queryParams.toString() ? `${API_BASE}/?${queryParams}` : API_BASE;
    return apiRequest<PaginatedResponse<Prompt>>(url);
  },

  async getPrompt(id: string): Promise<Prompt> {
    return apiRequest<Prompt>(`${API_BASE}/${id}`);
  },

  async createPrompt(data: PromptCreate): Promise<Prompt> {
    return apiRequest<Prompt>(API_BASE, {
      method: 'POST',
      body: data,
    });
  },

  async updatePrompt(id: string, data: PromptUpdate): Promise<Prompt> {
    return apiRequest<Prompt>(`${API_BASE}/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deletePrompt(id: string): Promise<void> {
    return apiRequest<void>(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  },

  async createPromptVersion(id: string, data: { content: string; variables?: Record<string, any>; description?: string }): Promise<PromptVersion> {
    return apiRequest<PromptVersion>(`${API_BASE}/${id}/versions`, {
      method: 'POST',
      body: data,
    });
  },

  async getPromptVersions(id: string, params?: { skip?: number; limit?: number }): Promise<PaginatedResponse<PromptVersion>> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const url = queryParams.toString() ? `${API_BASE}/${id}/versions?${queryParams}` : `${API_BASE}/${id}/versions`;
    return apiRequest<PaginatedResponse<PromptVersion>>(url);
  },

  async getABTestResults(id: string): Promise<ABTestResult> {
    return apiRequest<ABTestResult>(`${API_BASE}/ab-test/${id}`);
  },

  async activatePromptVersion(promptId: string, version: string): Promise<Prompt> {
    return apiRequest<Prompt>(`${API_BASE}/${promptId}/versions/${version}/activate`, {
      method: 'POST',
    });
  },

  async setABTestGroup(id: string, group: 'A' | 'B' | null): Promise<Prompt> {
    return apiRequest<Prompt>(`${API_BASE}/${id}/ab-test/group`, {
      method: 'POST',
      body: { ab_test_group: group },
    });
  },
};
