import { Message, CreateMessageRequest } from '@/types';
import { API_BASE_URL } from '@/config/api';

// 通用请求函数
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

// 弹幕颜色选项
export const DANMAKU_COLORS = [
  { name: '科技蓝', value: '#00D9FF' },
  { name: '樱花粉', value: '#FF6B9D' },
  { name: '薄荷绿', value: '#4ECDC4' },
  { name: '阳光黄', value: '#FFE66D' },
  { name: '珊瑚红', value: '#FF6B6B' },
  { name: '紫罗兰', value: '#A855F7' },
  { name: '橙色', value: '#FB923C' },
  { name: '白色', value: '#FFFFFF' },
] as const;

/**
 * 获取所有留言
 * @returns 留言列表
 */
export const getMessages = async (): Promise<Message[]> => {
  try {
    const messages = await apiRequest('/api/v1/messages/');
    // 转换后端格式到前端格式
    return messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      author: {
        id: msg.author?.id || '',
        username: msg.author?.username || '匿名用户',
        avatar: msg.author?.avatar,
      },
      created_at: msg.created_at,
      color: msg.color || '#00D9FF',
      isDanmaku: msg.is_danmaku ?? true,
      likes: msg.likes || 0,
      replies: [],
      level: msg.level || 1,
    }));
  } catch (error) {
    console.error('获取留言失败:', error);
    return [];
  }
};

/**
 * 获取弹幕列表（仅返回设置为弹幕的消息）
 * @returns 弹幕消息列表
 */
export const getDanmakuMessages = async (): Promise<Message[]> => {
  try {
    const messages = await apiRequest('/api/v1/messages/danmaku');
    // 转换后端格式到前端格式并随机排序
    return messages
      .map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        author: {
          id: msg.author?.id || '',
          username: msg.author?.username || '匿名用户',
          avatar: msg.author?.avatar,
        },
        created_at: msg.created_at,
        color: msg.color || '#00D9FF',
        isDanmaku: true,
        likes: msg.likes || 0,
        replies: [],
        level: msg.level || 1,
      }))
      .sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('获取弹幕失败:', error);
    return [];
  }
};

/**
 * 创建新留言
 * @param data 留言数据
 * @returns 创建的留言
 */
export const createMessage = async (data: CreateMessageRequest): Promise<Message> => {
  const response = await apiRequest('/api/v1/messages/', {
    method: 'POST',
    body: JSON.stringify({
      content: data.content,
      color: data.color,
      is_danmaku: data.isDanmaku,
    }),
  });

  // 转换后端格式到前端格式
  return {
    id: response.id,
    content: response.content,
    author: {
      id: response.author?.id || '',
      username: response.author?.username || '匿名用户',
      avatar: response.author?.avatar,
    },
    created_at: response.created_at,
    color: response.color || '#00D9FF',
    isDanmaku: response.is_danmaku ?? true,
    likes: response.likes || 0,
    replies: [],
    level: response.level || 1,
  };
};

/**
 * 删除留言
 * @param messageId 留言ID
 * @returns 是否删除成功
 */
export const deleteMessage = async (messageId: string): Promise<boolean> => {
  try {
    await apiRequest(`/api/v1/messages/${messageId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('删除留言失败:', error);
    throw error;
  }
};

/**
 * 点赞留言
 * @param messageId 留言ID
 * @returns 更新后的留言
 */
export const likeMessage = async (messageId: string): Promise<Message> => {
  const response = await apiRequest(`/api/v1/messages/${messageId}/like`, {
    method: 'POST',
  });

  return {
    id: response.id,
    content: response.content,
    author: {
      id: response.author?.id || '',
      username: response.author?.username || '匿名用户',
      avatar: response.author?.avatar,
    },
    created_at: response.created_at,
    color: response.color || '#00D9FF',
    isDanmaku: response.is_danmaku ?? true,
    likes: response.likes || 0,
    replies: [],
    level: response.level || 1,
  };
};

/**
 * 回复留言
 * @param messageId 留言ID
 * @param content 回复内容
 * @returns 更新后的留言
 */
export const replyToMessage = async (messageId: string, content: string): Promise<Message> => {
  const response = await apiRequest('/api/v1/messages/', {
    method: 'POST',
    body: JSON.stringify({
      content,
      parent_id: messageId,
      is_danmaku: false,
    }),
  });

  return {
    id: response.id,
    content: response.content,
    author: {
      id: response.author?.id || '',
      username: response.author?.username || '匿名用户',
      avatar: response.author?.avatar,
    },
    created_at: response.created_at,
    color: response.color || '#00D9FF',
    isDanmaku: false,
    likes: 0,
    replies: [],
    level: response.level || 1,
  };
};

/**
 * 获取留言的回复列表
 * @param messageId 留言ID
 * @returns 回复列表
 */
export const getMessageReplies = async (messageId: string): Promise<Message[]> => {
  try {
    const replies = await apiRequest(`/api/v1/messages/${messageId}/replies`);
    return replies.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      author: {
        id: msg.author?.id || '',
        username: msg.author?.username || '匿名用户',
        avatar: msg.author?.avatar,
      },
      created_at: msg.created_at,
      color: msg.color || '#00D9FF',
      isDanmaku: msg.is_danmaku ?? false,
      likes: msg.likes || 0,
      replies: [],
      level: msg.level || 1,
    }));
  } catch (error) {
    console.error('获取回复失败:', error);
    return [];
  }
};

/**
 * 验证留言内容
 * @param content 留言内容
 * @returns 验证结果
 */
export const validateMessage = (content: string): { isValid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: '留言内容不能为空' };
  }

  if (content.trim().length > 200) {
    return { isValid: false, error: '留言内容不能超过200字' };
  }

  return { isValid: true };
};

/**
 * 获取热门留言
 * @param limit 限制数量
 * @returns 热门留言列表
 */
export const getTrendingMessages = async (limit: number = 10): Promise<Message[]> => {
  try {
    const messages = await apiRequest(`/api/v1/messages/trending?limit=${limit}`);
    return messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      author: {
        id: msg.author?.id || '',
        username: msg.author?.username || '匿名用户',
        avatar: msg.author?.avatar,
      },
      created_at: msg.created_at,
      color: msg.color || '#00D9FF',
      isDanmaku: msg.is_danmaku ?? true,
      likes: msg.likes || 0,
      replies: [],
      level: msg.level || 1,
    }));
  } catch (error) {
    console.error('获取热门留言失败:', error);
    return [];
  }
};

/**
 * 获取留言活跃度
 * @param days 天数
 * @returns 活跃度数据
 */
export const getMessageActivity = async (days: number = 7): Promise<{date: string, count: number}[]> => {
  try {
    return await apiRequest(`/api/v1/messages/stats/activity?days=${days}`);
  } catch (error) {
    console.error('获取活跃度失败:', error);
    return [];
  }
};
