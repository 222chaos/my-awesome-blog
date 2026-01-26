---
name: fix-postcard-import-error
overview: 修复 PostCard 组件导入错误，将命名导入改为默认导入
todos:
  - id: fix-import-statement
    content: 修改 PostGrid.tsx 第8行，将 PostCard 从命名导入改为默认导入
    status: completed
---

## Product Overview

修复 PostCard 组件的导入错误，解决 React 运行时错误 "Element type is invalid"

## Core Features

- 将 PostGrid.tsx 中 PostCard 的命名导入改为默认导入
- 保持 PostCardSkeleton 的命名导入不变
- 确保 PostCard 组件能正确渲染

## Tech Stack

- 前端框架：React + TypeScript + Next.js

## 技术修复方案

### 问题分析

PostGrid.tsx 第8行使用命名导入 `{ PostCard, PostCardSkeleton }`，但 PostCard.tsx 中 PostCard 是默认导出（第22行 `export default`），PostCardSkeleton 是命名导出（第117行 `export function`）。这种不匹配导致 PostCard 为 undefined，触发 React 运行时错误。

### 修复策略

将 PostGrid.tsx 的导入语句改为混合导入：默认导入 PostCard，命名导入 PostCardSkeleton。

### 修改文件

- `e:/A_Project/my-awesome-blog/frontend/src/components/home/PostGrid.tsx`

### 具体修改

将第8行从：

```typescript
import { PostCard, PostCardSkeleton } from '@/components/blog/PostCard';
```

改为：

```typescript
import PostCard, { PostCardSkeleton } from '@/components/blog/PostCard';
```

### 预期结果

- PostCard 组件能正确导入
- 消除 "Element type is invalid" 运行时错误
- PostCard 和 PostCardSkeleton 都能正常使用