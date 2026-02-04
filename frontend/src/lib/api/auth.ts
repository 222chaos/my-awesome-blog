import { UserProfile } from '@/types';
import { get, post } from '@/lib/api-client';
import { setToken, removeToken, getToken, isAuthenticated as isAuth } from '@/lib/auth-utils';

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// 登录 API
export const loginApi = async (username: string, password: string): Promise<AuthResponse> => {
  // 调用后端真实登录接口
  // 使用标准的OAuth2用户名密码登录格式
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  // 直接使用fetch发送POST请求
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8989/api/v1';
  const response = await fetch(`${baseUrl}/auth/login`, {
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

  // 检查响应格式是否符合预期
  if (!data.access_token) {
    throw new Error('登录响应缺少访问令牌');
  }

  // 从响应中提取用户信息（如果有的话）
  // 如果后端没有返回用户信息，我们将在后续请求中获取
  const token = data.access_token;

  // 存储到 localStorage 和 Cookie（以便中间件可以访问）
  setToken(token);

  // 返回格式化的响应
  return {
    token,
    user: {
      id: '', // 实际ID将在获取用户信息时填充
      username: username,
      email: '', // 将在获取用户信息时填充
      fullName: username,
    }
  };
};

// 登出 API
export const logoutApi = async (): Promise<void> => {
  removeToken();
};

// 获取当前用户 API
export const getCurrentUserApi = async (): Promise<UserProfile | null> => {
  const token = getToken();

  if (!token) return null;

  // 使用API客户端获取用户信息，它会自动添加认证头
  const userData = await get('/users/me');

  // 存储最新的用户信息
  localStorage.setItem('auth_user', JSON.stringify(userData));
  return userData;
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return isAuth();
};
