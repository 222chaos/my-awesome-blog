import { env } from '@/lib/env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || 'http://localhost:8989/api/v1';

// 通用 API 请求函数，自动携带认证信息
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  retries = 1
): Promise<any> => {
  // 从 localStorage 获取认证令牌
  const token = localStorage.getItem('auth_token');

  // 检查是否在浏览器环境中（客户端）
  if (typeof window !== 'undefined') {
    // 在浏览器中，从localStorage获取令牌并将其添加到请求头中
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // 认证失败，清理本地认证信息并重定向到登录页
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login?message=认证已过期，请重新登录';
          throw new Error('认证失败');
        }
        
        // 如果是网络错误或服务器错误，且还有重试次数，则重试
        if ((response.status >= 500 || response.status === 0) && retries > 0) {
          console.warn(`请求失败，正在重试 (${retries}次剩余): ${endpoint}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
          return apiRequest(endpoint, options, retries - 1);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // 网络错误或其他异常，如果有重试次数则重试
      if (retries > 0) {
        console.warn(`网络错误，正在重试 (${retries}次剩余): ${endpoint}`, error);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
        return apiRequest(endpoint, options, retries - 1);
      }
      throw error;
    }
  } else {
    // 在服务端（如SSR期间），令牌无法从localStorage获取，需要从其他方式传入
    // 这里可以考虑从请求上下文或其他来源获取令牌
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('认证失败');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `请求失败: ${response.status}`);
    }

    return response.json();
  }
};

// GET 请求
export const get = (endpoint: string, options: RequestInit = {}) =>
  apiRequest(endpoint, { ...options, method: 'GET' });

// POST 请求
export const post = (endpoint: string, data?: any, options: RequestInit = {}) =>
  apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

// PUT 请求
export const put = (endpoint: string, data?: any, options: RequestInit = {}) =>
  apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

// DELETE 请求
export const del = (endpoint: string, options: RequestInit = {}) =>
  apiRequest(endpoint, { ...options, method: 'DELETE' });