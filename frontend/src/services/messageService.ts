import { Message, CreateMessageRequest, UserProfile } from '@/types';
import { getCurrentUser } from './userService';

// 模拟留言数据
let mockMessages: Message[] = [
  {
    id: '1',
    content: '欢迎来到我的个人博客！希望大家多多交流～',
    author: {
      id: '1',
      username: '博主',
      avatar: '/assets/avatar1.jpg',
    },
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    color: '#00D9FF',
    isDanmaku: true,
  },
  {
    id: '2',
    content: '博客设计得真不错，学习了！',
    author: {
      id: '2',
      username: '前端小白',
    },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    color: '#FF6B6B',
    isDanmaku: true,
  },
  {
    id: '3',
    content: '期待更多技术文章的分享',
    author: {
      id: '3',
      username: '代码爱好者',
    },
    created_at: new Date(Date.now() - 43200000).toISOString(),
    color: '#4ECDC4',
    isDanmaku: true,
  },
  {
    id: '4',
    content: '这个弹幕效果很酷啊！',
    author: {
      id: '4',
      username: '设计师小王',
    },
    created_at: new Date(Date.now() - 3600000).toISOString(),
    color: '#FFE66D',
    isDanmaku: true,
  },
  {
    id: '5',
    content: '支持一下，继续加油！',
    author: {
      id: '5',
      username: '路人甲',
    },
    created_at: new Date(Date.now() - 1800000).toISOString(),
    isDanmaku: false,
  },
];

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  await delay(300);
  return [...mockMessages].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

/**
 * 获取弹幕列表（仅返回设置为弹幕的消息）
 * @returns 弹幕消息列表
 */
export const getDanmakuMessages = async (): Promise<Message[]> => {
  await delay(200);
  return mockMessages
    .filter(msg => msg.isDanmaku !== false)
    .sort(() => Math.random() - 0.5); // 随机排序
};

/**
 * 创建新留言
 * @param data 留言数据
 * @returns 创建的留言
 */
export const createMessage = async (data: CreateMessageRequest): Promise<Message> => {
  await delay(500);
  
  // 获取当前登录用户
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    throw new Error('请先登录后再留言');
  }
  
  const newMessage: Message = {
    id: Date.now().toString(),
    content: data.content.trim(),
    author: {
      id: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
    },
    created_at: new Date().toISOString(),
    color: data.color || DANMAKU_COLORS[0].value,
    isDanmaku: data.isDanmaku ?? true,
  };
  
  mockMessages.unshift(newMessage);
  
  return newMessage;
};

/**
 * 删除留言
 * @param messageId 留言ID
 * @returns 是否删除成功
 */
export const deleteMessage = async (messageId: string): Promise<boolean> => {
  await delay(300);
  
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('请先登录');
  }
  
  const message = mockMessages.find(m => m.id === messageId);
  if (!message) {
    throw new Error('留言不存在');
  }
  
  // 只能删除自己的留言
  if (message.author.id !== currentUser.id) {
    throw new Error('只能删除自己的留言');
  }
  
  mockMessages = mockMessages.filter(m => m.id !== messageId);
  return true;
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