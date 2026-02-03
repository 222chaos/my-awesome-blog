// 博客文章类型
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  likes?: number;
  comments?: number;
}

// 分类类型
export interface Category {
  name: string;
  count: number;
}

// 后端分类类型（带文章数）
export interface BackendCategoryWithCount {
  id: string;
  name: string;
  article_count: number;
  is_active: boolean;
  description?: string;
}

// 标签类型
export interface Tag {
  name: string;
  count: number;
}

// 友情链接类型
export interface FriendLink {
  id: string;
  name: string;
  url: string;
  favicon: string;
  avatar?: string;
  description?: string;
}

// 作品集类型
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

// 时间轴类型
export interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

// 后端时间轴事件类型
export interface BackendTimelineEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  is_active: boolean;
}

// 新的时间轴事件类型
export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

// 统计数据类型
export interface Stat {
  label: string;
  value: number;
  icon: React.ElementType;
}

// 特色推荐类型
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
}

// 热门文章类型
export interface PopularPost {
  id: string;
  title: string;
  date: string;
}

// 用户相关类型
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

// 打字机内容类型
export interface TypewriterContent {
  id: string;
  text: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 用户统计类型
export interface UserStats {
  article_count?: number;
  comment_count?: number;
  joined_date?: string;
  total_views?: number;
}

// 回复类型
export interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  created_at: string;
  likes?: number;
}

// 留言/弹幕消息类型
export interface Message {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  created_at: string;
  color?: string; // 弹幕颜色
  isDanmaku?: boolean; // 是否以弹幕形式显示
  likes?: number; // 点赞数
  replies?: Reply[]; // 回复列表
  level?: number; // 用户等级
}

// 创建留言请求类型
export interface CreateMessageRequest {
  content: string;
  color?: string;
  isDanmaku?: boolean;
}

// 相册类型
export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  date: string;
  featured: boolean;
  images: number;
  slug?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  status?: string;
  sortOrder?: number;
}

// 后端文章类型（带作者信息）
export interface BackendArticleWithAuthor {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  published_at: string;
  read_time: number | null;
  cover_image: string | null;
  categories: Array<{
    id: string;
    name: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
  }>;
  author?: {
    id: string;
    username: string;
    avatar?: string;
  };
}