## 修复聊天页面HTML嵌套错误

### 问题分析
Next.js App Router中：
- 只有根布局（`app/layout.tsx`）可以包含`<html>`和`<body>`标签
- 子路由布局（`app/chat/layout.tsx`）不能包含这些标签，会导致嵌套错误
- 根布局已经包含Navbar和`<main>`，聊天页面的ClientLayout与之冲突

### 解决方案

**1. 删除不需要的文件：** `frontend/src/app/chat/ClientLayout.tsx`

**2. 简化 `frontend/src/app/chat/layout.tsx`，直接使用ChatLayout组件：**

```tsx
import type { Metadata } from 'next';
import ChatLayout from '@/components/chat/ChatLayout';

export const metadata: Metadata = {
  title: 'AI 对话 - 我的优秀博客',
  description: '与AI模型进行对话',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayout sidebar={null} isSidebarOpen={false}>{children}</ChatLayout>;
}
```

### 说明
- 移除不必要的`html`、`body`、Navbar重复
- 直接使用已有的`ChatLayout`组件（包含侧边栏逻辑和正确的高度计算）
- 布局只传递`children`，让ChatLayout处理具体结构