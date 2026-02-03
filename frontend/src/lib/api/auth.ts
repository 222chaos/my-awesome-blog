import { API_BASE_URL } from '@/config/api';

// 获取 token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// 设置 token 到 localStorage
const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// 设置 token 到 cookie（用于中间件检查）
const setCookieToken = (token: string) => {
  if (typeof document !== 'undefined') {
    const maxAge = 7 * 24 * 60 * 60; // 7 天过期
    document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; secure; samesite=lax`;
  }
};

// 清除 cookie 中的 token
const clearCookieToken = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth_token=; path=/; max-age=0; secure; samesite=lax';
  }
};

// 用户登录接口
export const loginApi = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // 处理FastAPI的ValidationError (422)
      if (response.status === 422 && errorData.detail) {
        const detail = Array.isArray(errorData.detail)
          ? errorData.detail.map((d: any) => `${d.loc?.join('.') || 'field'}: ${d.msg}`).join('; ')
          : errorData.detail;
        throw new Error(detail);
      }

      throw new Error(errorData.detail || errorData.message || '登录失败，请重试');
    }

    const data = await response.json();

    // 保存 token 到 localStorage 和 cookie
    if (data.access_token) {
      setAuthToken(data.access_token);
      setCookieToken(data.access_token);
    }

    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

// 用户登出
export const logoutApi = async () => {
  try {
    const token = getAuthToken();
    if (token) {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // 清除 localStorage 和 cookie 中的 token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    clearCookieToken();
  }
};

// 清除认证 token
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    console.log('Auth token cleared');
  }
};

// 获取当前用户信息
export const getCurrentUserApi = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // 如果是认证错误（401或403），清除过期的token
      if (response.status === 401 || response.status === 403) {
        clearAuthToken();
        const errorMessage = errorData.detail || '认证已过期，请重新登录';
        console.error('Authentication failed:', errorMessage, `Status: ${response.status}`);
        throw new Error(errorMessage);
      }

      throw new Error(errorData.detail || '获取用户信息失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Get current user API error:', error);
    throw error;
  }
};

// 检查登录状态
export const checkAuthStatus = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

// 检查用户是否已认证（同步，仅检查本地token）
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};
