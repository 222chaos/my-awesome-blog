---
name: fix-typewriter-api-connection
overview: 修复首页打字机内容无法从后端 API 获取的问题，更新前端 API 调用和 TypeScript 接口定义。
todos:
  - id: fix-api-interface
    content: 更新 api.ts 中 TypewriterContent 接口定义，匹配后端 schema
    status: completed
  - id: implement-api-call
    content: 修改 getActiveTypewriterContents 函数，实现真实 API 调用
    status: completed
    dependencies:
      - fix-api-interface
  - id: cleanup-texttype-logic
    content: 移除 TextType 组件中的数据转换逻辑
    status: completed
    dependencies:
      - implement-api-call
---

## 产品概述

修复首页打字机组件无法从后端 API 获取数据的问题，使打字机内容能够动态显示后端数据库中的数据。

## 核心功能

- 修复前端 API 调用，使 getActiveTypewriterContents() 从真实后端接口获取数据
- 更新 TypeScript 接口定义，使 TypewriterContent 接口与后端 schema 完全匹配
- 移除 TextType 组件中不必要的数据转换逻辑

## 技术栈

- Frontend Framework: Next.js (App Router)
- Language: TypeScript
- API Communication: Next.js Rewrites (代理到后端服务)

## 技术架构

### 数据流修正

```mermaid
flowchart LR
    A[TextType Component] -->|fetchFromApi=true| B[getActiveTypewriterContents]
    B -->|API Call| C[/api/v1/typewriter-contents/active]
    C -->|Next.js Rewrite| D[http://localhost:8989/api/v1/typewriter-contents/active]
    D -->|Response| B
    B -->|TypewriterContent[]| A
    A -->|TypewriterEffect| E[Display Text]
```

## 实现细节

### 核心目录结构

```
frontend/src/
├── lib/
│   └── api.ts                        # 修改: 更新接口定义和 API 调用逻辑
└── components/
    └── home/
        └── TextType.tsx              # 修改: 移除不必要的数据转换
```

### 关键代码结构

**修正后的 TypewriterContent 接口**：与后端 schema 完全匹配

```typescript
export interface TypewriterContent {
  id: string;              // UUID 类型
  text: string;
  priority: number;
  is_active: boolean;
  created_at: string;      // ISO 8601 格式
  updated_at: string;      // ISO 8601 格式
}
```

**修正后的 getActiveTypewriterContents 函数**：调用真实 API

```typescript
export async function getActiveTypewriterContents(): Promise<TypewriterContent[]> {
  const response = await fetch('/api/v1/typewriter-contents/active', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status}`);
  }
  
  const data = await response.json();
  return data as TypewriterContent[];
}
```

### 技术实现计划

**问题 1: API 调用未实现**

1. 将 getActiveTypewriterContents() 从返回模拟数据改为真实 API 调用
2. 使用 Next.js 配置的 rewrites 规则访问后端接口
3. 添加错误处理，确保 API 调用失败时有合理的降级方案

**问题 2: TypeScript 接口不匹配**

1. 修改 TypewriterContent.id 从 number 改为 string (UUID)
2. 重命名 isActive 为 is_active，保持与后端 schema 一致
3. 添加 priority, created_at, updated_at 字段

**问题 3: 数据转换逻辑冗余**

1. 移除 TextType 组件中的数据转换逻辑（第 68-74 行）
2. 直接使用 API 返回的 TypewriterContent 数据

### 集成点

- Next.js API Proxy: 已配置 `/api/v1/:path*` → `http://localhost:8989/api/v1/:path*`
- 后端 API: `GET /api/v1/typewriter-contents/active` 返回活动的打字机内容
- TextType 组件: 通过 fetchFromApi 属性控制是否从 API 获取数据

## 技术考虑

### 错误处理

- API 调用失败时抛出错误，由 TextType 组件的 useEffect 捕获
- 在 TextType 组件中显示错误状态或降级到静态文本

### 性能优化

- 使用 fetch 而非 axios，减少依赖包大小
- 保持缓存策略，避免重复请求

### 安全性

- API 请求通过 Next.js server-side proxy，避免 CORS 问题
- 后端 API 应实现适当的认证和授权机制