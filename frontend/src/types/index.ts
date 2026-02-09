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
  parent_id?: string; // 父回复ID，用于多级回复
  replies?: Reply[]; // 嵌套回复
  isEdited?: boolean;
  editedAt?: string;
  mentionedUsers?: string[]; // @的用户列表
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
  updated_at?: string; // 更新时间（编辑后）
  color?: string; // 弹幕颜色
  isDanmaku?: boolean; // 是否以弹幕形式显示
  likes?: number; // 点赞数
  replies?: Reply[]; // 回复列表（楼中楼）
  parent_id?: string; // 父留言ID，用于多级回复
  reply_count?: number; // 回复总数（包括嵌套回复）
  level?: number; // 用户等级
  isEdited?: boolean; // 是否已编辑
  editedAt?: string; // 编辑时间
  tags?: string[]; // 标签
  isPinned?: boolean; // 是否置顶
  isFeatured?: boolean; // 是否精华
  mentionedUsers?: string[]; // @的用户列表
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
  featured?: boolean;
  images: number;
  category?: string;
  likes?: number;
  views?: number;
  slug?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  status?: string;
  sortOrder?: number;
}

// 相册过滤器类型
export interface AlbumFilters {
  filter: 'all' | 'featured' | 'recent' | 'popular';
  sort: 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
  viewMode: 'grid' | 'list' | 'masonry';
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

// 文章数据类型
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  author_id: string;
  category_id?: string;
  cover_image?: string;
  read_time: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  author: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    reputation?: number;
    followers_count?: number;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  article_count: number;
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  article_count: number;
}

// 评论类型
export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

// 相关文章类型
export interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  published_at: string;
  category: {
    name: string;
  };
  view_count: number;
}