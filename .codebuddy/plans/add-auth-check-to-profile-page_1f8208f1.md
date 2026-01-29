---
name: add-auth-check-to-profile-page
overview: 在 profile 页面添加用户登录检查，未登录时自动重定向到登录页面
design:
  architecture:
    framework: react
    component: shadcn
  styleKeywords:
    - 现代科技感
    - 玻璃态设计
    - 流畅过渡
    - 友好提示
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 24px
      weight: 600
    subheading:
      size: 18px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#06B6D4"
      - "#8B5CF6"
    background:
      - "#0F172A"
      - "#1E293B"
    text:
      - "#FFFFFF"
      - "#94A3B8"
    functional:
      - "#22C55E"
      - "#EF4444"
todos:
  - id: create-auth-api
    content: 创建 frontend/src/lib/api/auth.ts 认证 API 模块
    status: completed
  - id: update-getCurrentUser
    content: 修改 userService.ts 中的 getCurrentUser 函数，正确检查登录状态
    status: completed
    dependencies:
      - create-auth-api
  - id: update-profile-api
    content: 修改 profile.ts 中的 fetchCurrentUserProfile，添加登录状态检查
    status: completed
    dependencies:
      - create-auth-api
  - id: improve-page-auth
    content: 改进 profile/page.tsx 的登录验证逻辑，实现自动重定向
    status: completed
    dependencies:
      - update-getCurrentUser
      - update-profile-api
---

## 产品概述

改进 profile 页面的登录验证逻辑，实现自动检查用户登录状态，提供更清晰的登录引导和用户体验

## 核心功能

- 在 profile 页面加载时自动检查用户登录状态
- 未登录时自动重定向到登录页面
- 改进错误处理，提供清晰的登录引导信息
- 创建缺失的 auth API 模块，提供真实的登录状态检查
- 修复 getCurrentUser 函数，正确检查登录状态而非默认返回用户

## 技术需求

- 创建 `@/lib/api/auth.ts` 模块，提供登录、登出、获取当前用户等 API
- 修改 `userService.ts` 中的 getCurrentUser，正确判断登录状态
- 更新 `profile.ts` 中的 fetchCurrentUserProfile，使用真实 API 调用
- 改进 `profile/page.tsx` 的登录验证逻辑，实现自动重定向
- 使用 Next.js router 实现页面重定向
- 利用 localStorage 存储登录 token 和用户信息

## 技术栈

- Next.js 16.1.6 (App Router)
- TypeScript
- React Hooks (useState, useEffect)
- Next.js Router (useRouter, redirect)
- localStorage (客户端状态持久化)

## 实现方案

采用分层架构改进登录验证流程：

### 1. 创建 Auth API 模块

在 `frontend/src/lib/api/auth.ts` 中实现：

- `loginApi(email, password)`: 登录 API，返回 token 和用户信息
- `logoutApi()`: 登出 API，清除 token
- `getCurrentUserApi()`: 获取当前用户信息 API
- `isAuthenticated()`: 检查用户是否已登录

### 2. 更新 UserService

修改 `userService.ts`：

- 修复 `getCurrentUser()` 函数，正确检查 localStorage 中的 token
- 移除默认返回用户 '1' 的逻辑
- 改进错误处理，返回 null 表示未登录

### 3. 增强 Profile API

更新 `profile.ts`：

- 修改 `fetchCurrentUserProfile` 使用真实 API 调用
- 添加登录状态检查，未登录时抛出明确错误
- 保持向后兼容，保留 mock 函数作为备选

### 4. 改进 Profile 页面验证

修改 `profile/page.tsx`：

- 使用 `getCurrentUser()` 预先检查登录状态
- 未登录时使用 `router.push('/login')` 自动重定向
- 添加加载状态优化用户体验
- 改进"访问受限"提示信息

### 数据流

用户访问 /profile → useEffect 触发 → 调用 getCurrentUser() 检查登录 → 未登录则 router.push('/login') → 已登录则调用 fetchCurrentUserProfile() 加载数据 → 渲染页面

## 实现细节

### 核心目录结构

```
project-root/
└── frontend/src/
    ├── lib/api/
    │   ├── auth.ts          # [NEW] 认证相关 API
    │   └── profile.ts       # [MODIFY] 更新 profile API 使用真实认证
    ├── services/
    │   └── userService.ts   # [MODIFY] 修复 getCurrentUser 登录检查逻辑
    └── app/profile/
        └── page.tsx         # [MODIFY] 改进登录验证和重定向逻辑
```

### 关键代码结构

**auth.ts - 新增认证 API 模块**：

```typescript
export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// 存储键名
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// 登录 API
export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  // TODO: 调用后端登录接口
  // 模拟登录成功
  const mockResponse: AuthResponse = {
    token: 'mock_token_' + Date.now(),
    user: {
      id: '1',
      username: 'johndoe',
      email: email,
      fullName: 'John Doe',
      avatar: '/assets/avatar1.jpg'
    }
  };
  
  // 存储到 localStorage
  localStorage.setItem(TOKEN_KEY, mockResponse.token);
  localStorage.setItem(USER_KEY, JSON.stringify(mockResponse.user));
  
  return mockResponse;
};

// 登出 API
export const logoutApi = async (): Promise<void> => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// 获取当前用户 API
export const getCurrentUserApi = async (): Promise<UserProfile | null> => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY);
};
```

**userService.ts - 修改 getCurrentUser**：

```typescript
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  await delay(300); // 模拟网络延迟
  
  // 使用 auth API 检查登录状态
  if (!isAuthenticated()) {
    return null;
  }
  
  return await getCurrentUserApi();
};
```

**profile.ts - 更新 fetchCurrentUserProfile**：

```typescript
// 导入 auth API
import { isAuthenticated, getCurrentUserApi } from './auth';

export const fetchCurrentUserProfile = async (): Promise<UserProfile> => {
  // 检查登录状态
  if (!isAuthenticated()) {
    throw new Error('User not authenticated');
  }
  
  // 获取当前用户信息
  const user = await getCurrentUserApi();
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return user;
};
```

**page.tsx - 改进登录验证**：

```typescript
const loadProfileData = async () => {
  try {
    setLoading(true);
    
    // 预先检查登录状态
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      // 未登录，自动重定向到登录页
      router.push('/login');
      return;
    }
    
    // 已登录，加载资料和统计数据
    const profileData = await fetchCurrentUserProfile();
    const statsData = await fetchCurrentUserStats();
    setProfile(profileData);
    setStats(statsData);
    setFormData(profileData);
  } catch (error) {
    // 如果是认证错误，重定向到登录页
    if (error instanceof Error && error.message === 'User not authenticated') {
      router.push('/login');
    } else {
      console.log('Profile data not available (user may not be logged in)');
    }
  } finally {
    setLoading(false);
  }
};
```

## 技术考量

### 向后兼容

- 保留原有的 mock 函数导出，确保其他代码不受影响
- 逐步迁移，先改进核心认证逻辑，再优化其他部分

### 性能优化

- 登录状态检查使用缓存（localStorage），减少重复请求
- 使用 useEffect 依赖数组控制请求时机

### 安全性

- 前端验证仅为用户体验优化，实际安全需依赖后端验证
- token 存储在 localStorage（后续可考虑使用 HttpOnly Cookie）

### 用户体验

- 自动重定向减少用户操作步骤
- 清晰的加载状态和错误提示
- 保持页面跳转的流畅性

## 设计风格

采用现代科技感风格，与登录页面保持一致的视觉语言。

## 界面改进

- 优化"访问受限"页面设计，增加更友好的引导信息
- 添加加载动画，改善等待体验
- 使用一致的玻璃态设计元素
- 保持与项目整体设计系统的一致性

## 交互体验

- 自动重定向时添加平滑过渡效果
- 错误提示使用友好的文案和视觉反馈
- 按钮和链接添加 hover 效果和过渡动画

# Agent Extensions

暂无需要使用的 Agent Extensions