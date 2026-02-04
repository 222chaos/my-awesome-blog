import { UserProfile } from '@/types';
import { setToken, removeToken, getToken, isAuthenticated as isAuth } from '@/lib/auth-utils';

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8989/api/v1';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
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

const get = (endpoint: string) => apiRequest(endpoint, { method: 'GET' });
const post = (endpoint: string, data?: any) => apiRequest(endpoint, { 
  method: 'POST', 
  body: data ? JSON.stringify(data) : undefined 
});

export const loginApi = async (username: string, password: string): Promise<AuthResponse> => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '登录失败');
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error('登录响应缺少访问令牌');
  }

  const token = data.access_token;
  setToken(token);

  return {
    token,
    user: {
      id: '',
      username: username,
      email: '',
      fullName: username,
    }
  };
};

export const logoutApi = async (): Promise<void> => {
  removeToken();
};

export const getCurrentUserApi = async (): Promise<UserProfile | null> => {
  const token = getToken();

  if (!token) return null;

  const userData = await get('/users/me');
  localStorage.setItem('auth_user', JSON.stringify(userData));
  return userData;
};

export const isAuthenticated = (): boolean => {
  return isAuth();
};
