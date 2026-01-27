import { UserProfile } from '@/lib/types';

// 模拟用户数据
const mockUsers: Record<string, UserProfile> = {
  '1': {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatar: '/assets/微信图片.jpg',
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
    avatar: '/assets/default-avatar.png',
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
  
  // 模拟获取当前登录用户（这里假设是用户1）
  const currentUserId = localStorage.getItem('currentUserId') || '1';
  
  if (mockUsers[currentUserId]) {
    return { ...mockUsers[currentUserId] };
  }
  
  return null;
};

/**
 * 用户登录
 * @param credentials 登录凭据（邮箱/密码）
 * @returns 登录结果
 */
export const loginUser = async (credentials: { email: string; password: string }): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  await delay(800); // 模拟网络延迟
  
  // 简单验证
  if (!credentials.email || !credentials.password) {
    return { success: false, error: '请输入邮箱和密码' };
  }
  
  // 查找匹配的用户
  const user = Object.values(mockUsers).find(u => u.email === credentials.email);
  
  if (!user) {
    return { success: false, error: '用户不存在' };
  }
  
  // 模拟密码验证（这里简化处理）
  if (credentials.password.length < 6) {
    return { success: false, error: '密码错误' };
  }
  
  // 模拟登录成功
  localStorage.setItem('currentUserId', user.id);
  return { success: true, user: { ...user } };
};

/**
 * 用户登出
 */
export const logoutUser = async (): Promise<void> => {
  await delay(300); // 模拟网络延迟
  
  // 清除登录信息
  localStorage.removeItem('currentUserId');
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
      } catch (e) {
        return { 
          isValid: false, 
          message: '链接格式不正确' 
        };
      }
  }
  
  return { isValid: true };
};