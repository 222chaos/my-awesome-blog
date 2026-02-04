# 前端代码优化详细指南

> 生成日期: 2026-02-04  
> 分析范围: `e:/project/my-awesome-blog/frontend`

---

## 📋 目录

1. [执行摘要](#执行摘要)
2. [高优先级优化](#高优先级优化)
3. [中优先级优化](#中优先级优化)
4. [低优先级优化](#低优先级优化)
5. [代码规范建议](#代码规范建议)
6. [重构检查清单](#重构检查清单)

---

## 执行摘要

### 问题统计

| 类别 | 发现的问题 | 影响等级 | 预估工作量 |
|------|-----------|----------|-----------|
| 组件重复 | 4 处 | 高 | 4-6 小时 |
| 类型定义分散 | 5 处 | 高 | 2-3 小时 |
| API 请求不一致 | 7 个服务 | 高 | 3-4 小时 |
| 代码重复（日期/图片） | 15+ 处 | 中 | 2-3 小时 |
| 文件过大 | 9 个文件 | 中 | 6-8 小时 |
| CSS 冗余 | globals.css 1226行 | 中 | 3-4 小时 |
| **总计** | **40+ 处** | - | **20-28 小时** |

### 优化收益

- ✅ 减少代码重复约 **30%**
- ✅ 提升类型安全性
- ✅ 统一错误处理机制
- ✅ 改善代码可维护性
- ✅ 优化构建体积

---

## 高优先级优化

### 1. 统一 API 请求模式

#### 当前问题

各服务使用不同的 API 请求方式：

| 服务文件 | 请求方式 | Token 键 | 错误处理 |
|---------|---------|-----------|----------|
| `articleService.ts` | 自有 `apiRequest` | `auth_token` | try-catch + throw |
| `messageService.ts` | 自有 `apiRequest` | `auth_token` | throw Error |
| `typewriterService.ts` | 直接 `fetch` | `access_token` | 无统一处理 |
| `friendLinkService.ts` | 直接 `fetch` | `access_token` | 无统一处理 |
| `commentService.ts` | 直接 `fetch` | `access_token` | 无统一处理 |
| `timelineService.ts` | 直接 `fetch` | `access_token` | 无统一处理 |
| `lib/api-client.ts` | 统一 `apiRequest` | `auth_token` | 重试机制 + 401处理 |

#### 优化方案

**步骤 1: 确认 `lib/api-client.ts` 功能**

`lib/api-client.ts` 已提供：
- ✅ 自动 token 注入
- ✅ 自动重试机制（最多3次）
- ✅ 401 自动登出处理
- ✅ 统一错误响应格式

**步骤 2: 迁移各服务文件**

修改前 (`articleService.ts`):
```typescript
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  // ... 错误处理逻辑
};
```

修改后:
```typescript
import { apiRequest } from '@/lib/api-client';

const getArticles = async () => {
  return apiRequest(`/articles/`);
};
```

**步骤 3: 统一 Token 存储**

在 `lib/api-client.ts` 中定义常量：
```typescript
export const TOKEN_KEY = 'auth_token';
```

**需要修改的文件清单:**
- [ ] `src/services/articleService.ts`
- [ ] `src/services/messageService.ts`
- [ ] `src/services/typewriterService.ts`
- [ ] `src/services/friendLinkService.ts`
- [ ] `src/services/commentService.ts`
- [ ] `src/services/timelineService.ts`
- [ ] `src/services/albumService.ts`
- [ ] `src/services/userService.ts`

**预估时间**: 3-4 小时

---

### 2. 统一类型定义

#### 当前问题

`Article` 类型在多处重复定义：

```typescript
// types/index.ts (第2-12行)
export interface Post {
  id: string;
  title: string;
  // ...
}

// services/articleService.ts (第4-41行)
export interface Article {
  id: string;
  title: string;
  content: string;
  // ...
}

// components/ui/PostCard.tsx (第10-45行)
interface Article {
  id: string;
  title: string;
  // ...
}

// components/articles/HoloCard.tsx (第9-28行)
interface Article {
  id: string;
  title: string;
  // ...
}

// app/articles/[id]/enhanced-article.tsx (第17-54行)
interface Article {
  id: string;
  title: string;
  // ...
}
```

#### 优化方案

**步骤 1: 在 `types/index.ts` 中定义完整的 Article 类型**

```typescript
// types/index.ts

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author: {
    id: string;
    username: string;
    full_name?: string;
    avatar?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Tag[];
  status: 'draft' | 'published';
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string;
  updated_at: string;
  created_at: string;
}

export type ArticleVariant = 'simple' | 'detailed' | 'holo' | 'focus';

export interface ArticleCardProps {
  article: Article;
  variant?: ArticleVariant;
  onLike?: (id: string) => void;
}
```

**步骤 2: 删除各文件中的重复定义**

**需要修改的文件清单:**
- [ ] `src/services/articleService.ts` - 删除 Article 接口定义
- [ ] `src/components/ui/PostCard.tsx` - 从 `@/types` 导入
- [ ] `src/components/articles/HoloCard.tsx` - 从 `@/types` 导入
- [ ] `src/app/articles/[id]/enhanced-article.tsx` - 从 `@/types` 导入
- [ ] `src/components/blog/SimplePostCard.tsx` - 从 `@/types` 导入

**步骤 3: 更新导出语句**

```typescript
// types/index.ts
export * from './article';
export * from './user';
export * from './comment';
```

**预估时间**: 2-3 小时

---

### 3. 创建通用日期工具函数

#### 当前问题

日期格式化代码在多处重复：

```typescript
// PostCard.tsx
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

// HoloCard.tsx
{new Date(article.published_at).toLocaleDateString('zh-CN')}

// ArchiveDrawer.tsx
const month = new Date(article.published_at).toLocaleDateString('zh-CN', {
  year: 'numeric', month: '2-digit'
});

// MessageList.tsx
{formatDistanceToNow(new Date(message.created_at))}
```

#### 优化方案

**步骤 1: 创建 `src/utils/dateUtils.ts`**

```typescript
// src/utils/dateUtils.ts

/**
 * 格式化日期为中文格式
 * @param date - 日期字符串或 Date 对象
 * @param options - 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  locale: string = 'zh-CN'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, options);
}

/**
 * 格式化为相对时间（如 "3分钟前"）
 * @param date - 日期字符串或 Date 对象
 * @returns 相对时间字符串
 */
export function formatTimeAgo(
  date: string | Date,
  locale: string = 'zh-CN'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (locale === 'zh-CN') {
    if (diffSec < 60) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffHour < 24) return `${diffHour}小时前`;
    if (diffDay < 30) return `${diffDay}天前`;
    return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // 英文格式
  return new Intl.RelativeTimeFormat(locale).format(-diffDay, 'day');
}

/**
 * 获取日期的简短格式（月-日）
 */
export function formatShortDate(date: string | Date): string {
  return formatDate(date, {
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * 获取日期的完整格式（年-月-日）
 */
export function formatFullDate(date: string | Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * 获取日期的月份和年份
 */
export function formatMonthYear(date: string | Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit'
  });
}
```

**步骤 2: 在组件中使用**

```typescript
// 使用前
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

// 使用后
import { formatDate, formatTimeAgo } from '@/utils/dateUtils';

{formatDate(article.published_at)}
{formatTimeAgo(message.created_at)}
```

**需要修改的文件清单:**
- [ ] `src/components/ui/PostCard.tsx`
- [ ] `src/components/articles/HoloCard.tsx`
- [ ] `src/components/blog/SimplePostCard.tsx`
- [ ] `src/app/articles/ArchiveDrawer.tsx`
- [ ] `src/components/messages/MessageList.tsx`
- [ ] `src/app/articles/[id]/enhanced-article.tsx`

**预估时间**: 2-3 小时

---

## 中优先级优化

### 4. 拆分 globals.css

#### 当前问题

`src/styles/globals.css` 有 1226 行，包含：
- CSS 变量定义
- 重复的主题定义（`.dark` 定义了两次）
- 20+ 动画定义
- 多个相似的玻璃效果类
- 滚动条样式重复

#### 优化方案

**目标目录结构:**
```
styles/
├── base.css           # CSS 变量、基础重置
├── theme.css          # 明暗主题定义
├── glass.css          # 玻璃效果类
├── animations.css     # 动画定义
├── scrollbar.css      # 滚动条样式
├── typography.css     # 字体排版
├── utilities.css      # 工具类
└── globals.css        # 导入以上所有
```

**步骤 1: 创建 `base.css`**

```css
/* src/styles/base.css */

:root {
  /* 颜色变量 */
  --foreground: #0a0a0a;
  --background: #ffffff;
  --card: #ffffff;
  --card-foreground: #0a0a0a;
  --popover: #ffffff;
  --popover-foreground: #0a0a0a;
  --primary: #22c55e;
  --primary-foreground: #ffffff;
  --secondary: #f4f4f5;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --accent: #f4f4f5;
  --accent-foreground: #18181b;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #0a0a0a;
  
  /* 科技主题色 */
  --tech-cyan: #00f5ff;
  --tech-sky: #00bfff;
  --tech-lightcyan: #7fffd4;
  --shadow-tech-cyan: rgba(0, 245, 255, 0.3);
}

.dark {
  --foreground: #fafafa;
  --background: #0a0a0a;
  --card: #18181b;
  --card-foreground: #fafafa;
  --popover: #0a0a0a;
  --popover-foreground: #fafafa;
  --primary: #22c55e;
  --primary-foreground: #000000;
  --secondary: #27272a;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --accent: #27272a;
  --accent-foreground: #fafafa;
  --destructive: #7f1d1d;
  --destructive-foreground: #fafafa;
  --border: #27272a;
  --input: #27272a;
  --ring: #d4d4d8;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**步骤 2: 创建 `glass.css`**

```css
/* src/styles/glass.css */

.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-light {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.dark .glass {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .glass-light {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

**步骤 3: 创建 `animations.css`**

```css
/* src/styles/animations.css */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px var(--shadow-tech-cyan);
  }
  50% {
    box-shadow: 0 0 40px var(--shadow-tech-cyan);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
.animate-slide-up { animation: slideInUp 0.4s ease-out; }
.animate-slide-left { animation: slideInLeft 0.4s ease-out; }
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
.animate-rotate { animation: rotate 2s linear infinite; }
.animate-scale { animation: scale 2s ease-in-out infinite; }
```

**步骤 4: 创建新的 `globals.css`**

```css
/* src/styles/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* 导入拆分后的样式文件 */
@import './base.css';
@import './theme.css';
@import './glass.css';
@import './animations.css';
@import './scrollbar.css';
@import './typography.css';
@import './utilities.css';

/* 其他自定义样式 */
```

**预估时间**: 3-4 小时

---

### 5. 创建通用图片组件

#### 当前问题

图片错误处理逻辑在多处重复：

```typescript
// PostCard.tsx, SimplePostCard.tsx 中
const [imgSrc, setImgSrc] = useState(coverImage || '/assets/avatar.jpg');
const handleError = () => { setImgSrc('/assets/avatar.jpg'); };

// 使用
<img
  src={imgSrc}
  onError={handleError}
  alt={title}
/>
```

#### 优化方案

**步骤 1: 创建 `src/components/ui/ImageWithErrorFallback.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithErrorFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  [key: string]: any;
}

export function ImageWithErrorFallback({
  src,
  alt,
  fallback = '/assets/avatar.jpg',
  className,
  ...props
}: ImageWithErrorFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc(fallback);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        {...props}
      />
    </div>
  );
}
```

**步骤 2: 在组件中使用**

```typescript
// 使用前
const [imgSrc, setImgSrc] = useState(coverImage || '/assets/avatar.jpg');
const handleError = () => { setImgSrc('/assets/avatar.jpg'); };
<img src={imgSrc} onError={handleError} alt={title} />

// 使用后
import { ImageWithErrorFallback } from '@/components/ui/ImageWithErrorFallback';

<ImageWithErrorFallback
  src={coverImage}
  alt={title}
  className="h-48 w-full"
/>
```

**需要修改的文件清单:**
- [ ] `src/components/ui/PostCard.tsx`
- [ ] `src/components/blog/SimplePostCard.tsx`
- [ ] `src/components/articles/HoloCard.tsx`
- [ ] `src/app/albums/page.tsx`
- [ ] `src/components/home/Portfolio.tsx`

**预估时间**: 2 小时

---

### 6. 整理 Mock 数据

#### 当前问题

Mock 数据硬编码在组件中：

```typescript
// components/home/Portfolio.tsx (第27-103行)
const projects = [
  { id: 1, title: '个人博客系统', ... },
  { id: 2, title: 'React组件库', ... },
  // ...
];

// services/userService.ts (第5-30行)
export const mockUser = {
  id: '1',
  username: 'admin',
  // ...
};
```

#### 优化方案

**步骤 1: 创建 `src/mock/` 目录结构**

```
src/mock/
├── index.ts           # 导出所有 mock 数据
├── articles.ts        # 文章 mock 数据
├── users.ts           # 用户 mock 数据
├── projects.ts       # 项目 mock 数据
├── albums.ts         # 相册 mock 数据
└── apiHandlers.ts    # MSW API 处理器（可选）
```

**步骤 2: 创建 `mock/projects.ts`**

```typescript
// src/mock/projects.ts

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  stars: number;
  forks: number;
  watchers: number;
  demoUrl?: string;
  repoUrl?: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'tools';
}

export const mockProjects: Project[] = [
  {
    id: 1,
    title: '个人博客系统',
    description: '基于Next.js 14和FastAPI构建的现代化个人博客系统',
    tags: ['Next.js', 'FastAPI', 'TypeScript', 'Tailwind CSS'],
    stars: 245,
    forks: 32,
    watchers: 18,
    demoUrl: 'https://myblog.com',
    repoUrl: 'https://github.com/username/myblog',
    category: 'fullstack'
  },
  // ... 其他项目
];

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return mockProjects;
  return mockProjects.filter(p => p.category === category);
};
```

**步骤 3: 在组件中使用**

```typescript
// 使用前
const projects = [ ... ]; // 硬编码

// 使用后
import { mockProjects, getProjectsByCategory } from '@/mock/projects';

const projects = mockProjects;
const filteredProjects = getProjectsByCategory(selectedCategory);
```

**步骤 4: 可选 - 集成 MSW (Mock Service Worker)**

```bash
npm install msw --save-dev
```

```typescript
// src/mock/apiHandlers.ts
import { rest } from 'msw';
import { mockProjects } from './projects';

export const handlers = [
  rest.get('/api/projects', (req, res, ctx) => {
    const category = req.url.searchParams.get('category');
    return res(
      ctx.status(200),
      ctx.json(category === 'all' ? mockProjects : mockProjects.filter(p => p.category === category))
    );
  }),
];
```

**需要修改的文件清单:**
- [ ] 创建 `src/mock/` 目录
- [ ] 创建 `src/mock/projects.ts`
- [ ] 创建 `src/mock/users.ts`
- [ ] 创建 `src/mock/albums.ts`
- [ ] `src/components/home/Portfolio.tsx` - 使用 mock 数据
- [ ] `src/services/userService.ts` - 移除 mock 数据
- [ ] `src/app/albums/page.tsx` - 使用 mock 数据

**预估时间**: 2-3 小时

---

## 低优先级优化

### 7. 合并卡片组件

#### 当前问题

| 组件 | 大小 | 功能 |
|------|------|------|
| `PostCard` | 7.64 KB | 详细文章卡片（标签、统计、操作） |
| `SimplePostCard` | 6.33 KB | 简化版（仅标题、摘要、日期） |
| `HoloCard` | 10.34 KB | 全息效果 + 3D 变换 |
| `FocusCards` | 4.68 KB | 专注模式卡片（渐变背景） |

#### 优化方案

**步骤 1: 创建统一的 `ArticleCard.tsx`**

```typescript
'use client';

import { ImageWithErrorFallback } from './ImageWithErrorFallback';
import { formatDate, formatTimeAgo } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { Article, ArticleVariant } from '@/types';

interface ArticleCardProps {
  article: Article;
  variant?: ArticleVariant;
  onLike?: (id: string) => void;
  className?: string;
}

export function ArticleCard({
  article,
  variant = 'detailed',
  onLike,
  className
}: ArticleCardProps) {
  const renderSimple = () => (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
      <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
        {article.excerpt}
      </p>
      <span className="text-xs text-muted-foreground">
        {formatDate(article.published_at)}
      </span>
    </div>
  );

  const renderDetailed = () => (
    <div className="p-6">
      <ImageWithErrorFallback
        src={article.cover_image}
        alt={article.title}
        className="h-48 w-full mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
      <p className="text-muted-foreground mb-4 line-clamp-2">
        {article.excerpt}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.map(tag => (
          <span key={tag.id} className="text-xs px-2 py-1 bg-muted rounded-full">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatDate(article.published_at)}</span>
        <div className="flex gap-4">
          <span>👁️ {article.view_count}</span>
          <span>❤️ {article.like_count}</span>
          <span>💬 {article.comment_count}</span>
        </div>
      </div>
      {onLike && (
        <button onClick={() => onLike(article.id)}>点赞</button>
      )}
    </div>
  );

  const renderHolo = () => (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-tech-cyan to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
      {/* 全息效果实现 */}
      <div className="backdrop-blur-xl border border-glass-border">
        {renderDetailed()}
      </div>
    </div>
  );

  const variants = {
    simple: renderSimple,
    detailed: renderDetailed,
    holo: renderHolo,
    focus: () => <div>Focus card variant</div>
  };

  return (
    <div className={cn('rounded-xl', className)}>
      {variants[variant]?.() || renderDetailed()}
    </div>
  );
}
```

**步骤 2: 迁移使用方**

```typescript
// 使用前
import { PostCard } from '@/components/ui/PostCard';
<PostCard article={article} />

// 使用后
import { ArticleCard } from '@/components/ui/ArticleCard';
<ArticleCard article={article} variant="detailed" />
```

**预估时间**: 4-6 小时

---

### 8. 添加全局错误处理

#### 优化方案

**步骤 1: 创建 ErrorBoundary 组件**

```typescript
// src/components/ErrorBoundary.tsx

'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">出错了</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || '未知错误'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            重新加载
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**步骤 2: 创建 useApiError Hook**

```typescript
// src/hooks/useApiError.ts

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useApiError() {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    let message = '操作失败，请稍后重试';

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === 'object' && err !== null) {
      message = (err as any)?.detail || message;
    }

    setError(message);
    toast.error(message);

    // 3秒后自动清除错误
    setTimeout(() => setError(null), 3000);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, handleError, clearError };
}
```

**步骤 3: 在根布局中使用**

```typescript
// app/layout.tsx

import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**预估时间**: 2-3 小时

---

## 代码规范建议

### 1. 组件命名规范

- ✅ 使用 PascalCase 文件名: `UserProfile.tsx`
- ✅ 导出组件使用 PascalCase: `export function UserProfile`
- ❌ 避免: `user-profile.tsx`、`UserProfile.tsx` 中导出 `userProfile`

### 2. 类型定义规范

```typescript
// ✅ 正确 - 统一在 types/index.ts
import { Article, User } from '@/types';

// ❌ 错误 - 在组件中定义类型
interface Article {
  id: string;
  title: string;
}
```

### 3. API 请求规范

```typescript
// ✅ 正确 - 使用统一的 apiRequest
import { apiRequest } from '@/lib/api-client';

const getArticles = async () => {
  return apiRequest('/articles/');
};

// ❌ 错误 - 直接 fetch
const getArticles = async () => {
  const token = localStorage.getItem('auth_token');
  return fetch(`${API_BASE_URL}/articles/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
```

### 4. 样式组织规范

```typescript
// ✅ 正确 - 提取常用样式
const cardClass = cn(
  'rounded-xl border p-6 transition-all',
  'hover:shadow-lg',
  isActive && 'border-tech-cyan'
);

// ❌ 避免 - 过长的内联 Tailwind 类名
<div className="rounded-xl border border-glass-border p-6 transition-all hover:shadow-lg hover:shadow-tech-cyan/20 hover:scale-105 ...">
```

### 5. 文件组织规范

```
src/
├── components/       # 组件
│   ├── ui/         # 基础 UI 组件（shadcn/ui）
│   ├── article/    # 文章相关组件
│   ├── layout/     # 布局组件
│   └── features/   # 功能组件
├── services/       # API 服务
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
├── types/         # 类型定义
├── mock/          # Mock 数据
└── styles/        # 样式文件
```

---

## 重构检查清单

### 阶段一：基础设施（预计 7-10 小时）

- [ ] 创建 `src/utils/dateUtils.ts`
- [ ] 创建 `src/components/ui/ImageWithErrorFallback.tsx`
- [ ] 创建 `src/mock/` 目录结构
- [ ] 拆分 `src/styles/globals.css`
- [ ] 更新 `lib/api-client.ts` 导出常量

### 阶段二：类型统一（预计 2-3 小时）

- [ ] 在 `types/index.ts` 中定义完整的 Article 类型
- [ ] 删除 `services/articleService.ts` 中的重复定义
- [ ] 更新所有组件从 `@/types` 导入类型
- [ ] 运行 TypeScript 检查确保无类型错误

### 阶段三：API 统一（预计 3-4 小时）

- [ ] 迁移 `articleService.ts` 使用 `apiRequest`
- [ ] 迁移 `messageService.ts` 使用 `apiRequest`
- [ ] 迁移 `typewriterService.ts` 使用 `apiRequest`
- [ ] 迁移 `friendLinkService.ts` 使用 `apiRequest`
- [ ] 迁移 `commentService.ts` 使用 `apiRequest`
- [ ] 迁移 `timelineService.ts` 使用 `apiRequest`
- [ ] 迁移 `albumService.ts` 使用 `apiRequest`
- [ ] 迁移 `userService.ts` 使用 `apiRequest`
- [ ] 测试所有 API 调用

### 阶段四：组件优化（预计 6-8 小时）

- [ ] 创建 `src/components/ui/ArticleCard.tsx`
- [ ] 迁移 `PostCard` 使用方到 `ArticleCard`
- [ ] 迁移 `SimplePostCard` 使用方到 `ArticleCard`
- [ ] 迁移 `HoloCard` 使用方到 `ArticleCard`
- [ ] 删除旧的卡片组件文件
- [ ] 更新导入语句

### 阶段五：错误处理（预计 2-3 小时）

- [ ] 创建 `src/components/ErrorBoundary.tsx`
- [ ] 创建 `src/hooks/useApiError.ts`
- [ ] 在根布局中添加 ErrorBoundary
- [ ] 更新服务层使用错误处理

### 阶段六：代码清理（预计 2-3 小时）

- [ ] 删除未使用的文件
- [ ] 删除重复的 CSS 类
- [ ] 优化 Tailwind 类名
- [ ] 更新 README.md

### 阶段七：测试（预计 3-4 小时）

- [ ] 运行 TypeScript 检查: `npm run type-check`
- [ ] 运行 Linter: `npm run lint`
- [ ] 手动测试所有页面
- [ ] 性能测试
- [ ] 构建测试: `npm run build`

---

## 总结

### 预期收益

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 代码重复率 | ~30% | ~5% | ↓ 83% |
| 类型定义重复 | 5 处 | 0 处 | ↓ 100% |
| API 请求不一致 | 7 种 | 1 种 | ↓ 86% |
| 最大文件大小 | 27 KB | 15 KB | ↓ 44% |
| globals.css 行数 | 1226 行 | 200 行 | ↓ 84% |

### 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 破坏现有功能 | 高 | 分阶段重构 + 充分测试 |
| 引入新 Bug | 中 | Code Review + 回滚计划 |
| 学习曲线 | 低 | 详细文档 + 代码注释 |

### 下一步行动

1. ✅ 审查此优化计划
2. ⏸️ 备份当前代码
3. 🚀 按阶段开始执行（建议从阶段一开始）
4. 📝 记录重构过程中的问题
5. ✅ 完成后更新文档

---

**文档版本**: 1.0  
**最后更新**: 2026-02-04  
**维护者**: AI Assistant
