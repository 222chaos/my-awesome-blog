import { UserProfile } from '@/types';
import { loginApi, logoutApi, getCurrentUserApi, isAuthenticated } from '@/lib/api/auth';

// 模拟用户数据
const mockUsers: Record<string, UserProfile> = {
  '1': {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatar: '/assets/avatar1.jpg',
    bio: 'Software developer passionate about creating amazing web experiences.',
    website: 'https://example.com',
    twitter: '@johndoe',
    github: 'johndoe',
    linkedin: 'johndoe'
  },
  '2': {
    id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    fullName: 'Jane Doe',
    avatar: '/assets/avatar1.jpg',
    bio: 'Designer focused on UI/UX and creating beautiful user experiences.',
    website: 'https://janedoe.design',
    twitter: '@janedoe',
    github: 'janedoe',
    linkedin: 'janedoe'
  }
};

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取用户资料
 * @param userId 用户ID
 * @returns 用户资料
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  await delay(500); // 模拟网络延迟
  const user = mockUsers[userId];
  
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }
  
  return { ...user };
};

/**
 * 更新用户资料
 * @param userId 用户ID
 * @param profile 更新的用户资料
 * @returns 更新后的用户资料
 */
export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<UserProfile> => {
  await delay(800); // 模拟网络延迟
  const user = mockUsers[userId];
  
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }
  
  // 更新用户信息
  mockUsers[userId] = { ...user, ...profile } as UserProfile;
  
  return { ...mockUsers[userId] };
};

/**
 * 上传头像
 * @param userId 用户ID
 * @param file 头像文件
 * @returns 上传后的头像URL
 */
export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  await delay(1000); // 模拟上传延迟
  
  // 这里只是模拟上传过程，实际上我们只是返回一个base64字符串
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const avatarUrl = reader.result as string;
      // 更新用户头像
      if (mockUsers[userId]) {
        mockUsers[userId].avatar = avatarUrl;
      }
      resolve(avatarUrl);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * 获取当前登录用户
 * @returns 当前登录用户信息
 */
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  await delay(300); // 模拟网络延迟

  // 使用 auth API 检查登录状态
  if (!isAuthenticated()) {
    return null;
  }

  try {
    return await getCurrentUserApi();
  } catch (error) {
    console.error('Error getting current user:', error);
    // 如果获取用户信息失败，清除认证状态
    await logoutUser();
    return null;
  }
};

/**
 * 用户登录
 * @param credentials 登录凭据（用户名/密码）
 * @returns 登录结果
 */
export const loginUser = async (credentials: { email: string; password: string }): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  try {
    // 步骤1：调用登录API获取token
    await loginApi(credentials.email, credentials.password);

    // 步骤2：获取用户信息
    const userData = await getCurrentUserApi();

    // 登录成功，返回用户信息
    return {
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.full_name || userData.username,
        avatar: userData.avatar,
        bio: userData.bio,
        website: userData.website,
        twitter: userData.twitter,
        github: userData.github,
        linkedin: userData.linkedin
      }
    };
  } catch (error) {
    // 登录失败
    return {
      success: false,
      error: error instanceof Error ? error.message : '登录失败，请重试'
    };
  }
};

/**
 * 用户登出
 */
export const logoutUser = async (): Promise<void> => {
  await logoutApi();
};

/**
 * 更新用户密码
 * @param userId 用户ID
 * @param passwords 包含原密码和新密码的对象
 * @returns 更新结果
 */
export const updatePassword = async (userId: string, passwords: { oldPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
  await delay(800); // 模拟网络延迟
  
  const user = mockUsers[userId];
  
  if (!user) {
    return { success: false, message: '用户不存在' };
  }
  
  // 这里简化处理，不实际验证原密码
  if (passwords.newPassword.length < 6) {
    return { success: false, message: '新密码长度至少为6位' };
  }
  
  return { success: true, message: '密码更新成功' };
};

/**
 * 验证社交链接格式
 * @param platform 平台名称
 * @param url 链接地址
 * @returns 验证结果
 */
export const validateSocialLink = (platform: string, url: string): { isValid: boolean; message?: string } => {
  if (!url) {
    return { isValid: true }; // 允许空链接
  }
  
  let regexPattern: RegExp;
  
  switch (platform.toLowerCase()) {
    case 'twitter':
      // Twitter用户名格式验证
      regexPattern = /^@[a-zA-Z0-9_]{1,15}$/;
      if (!regexPattern.test(url)) {
        return { 
          isValid: false, 
          message: 'Twitter用户名格式不正确 (例如: @username)' 
        };
      }
      break;
      
    case 'github':
      // GitHub用户名格式验证
      regexPattern = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;
      if (!regexPattern.test(url)) {
        return { 
          isValid: false, 
          message: 'GitHub用户名格式不正确' 
        };
      }
      break;
      
    case 'linkedin':
      // LinkedIn用户名格式验证
      regexPattern = /^[a-zA-Z0-9_-]{3,100}$/;
      if (!regexPattern.test(url)) {
        return { 
          isValid: false, 
          message: 'LinkedIn用户名格式不正确' 
        };
      }
      break;
      
    case 'website':
      // 网站URL格式验证
      regexPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!regexPattern.test(url)) {
        return { 
          isValid: false, 
          message: '网站URL格式不正确' 
        };
      }
      break;
      
    default:
      // 对于其他平台，验证是否为有效的URL
      try {
        new URL(url.startsWith('http') ? url : `http://${url}`);
      } catch (_) {
        return { 
          isValid: false, 
          message: '链接格式不正确' 
        };
      }
  }
  
  return { isValid: true };
};