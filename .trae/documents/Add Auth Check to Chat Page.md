## 为聊天页面添加登录检查

### 问题分析
`/llm/chat/stream` 返回 401 错误，表示需要用户登录
- 获取模型列表是公开的（无需登录）
- 实际对话需要登录认证

### 解决方案
使用现有的 `useAuthCheck` hook 为聊天页面添加登录检查

**修改 `frontend/src/app/chat/page.tsx`**

在组件顶部添加登录检查：

```tsx
'use client';

import { useState, useEffect } from 'react';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { ChatSidebar, ChatSession } from '@/components/chat/ChatSidebar';
import { ChatWindow, ChatMessage } from '@/components/chat/ChatWindow';
import { useAuthCheck } from '@/hooks/useAuthCheck';

// Local storage key
const STORAGE_KEY = 'chat_sessions_v1';

export default function ChatPage() {
  // 添加登录检查
  useAuthCheck();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // ... 其余代码不变
```

### 预期效果
- 未登录用户访问聊天页面会自动重定向到登录页
- 登录后可以正常使用对话功能