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