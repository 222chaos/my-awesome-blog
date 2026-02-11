## 修复前端 API 接口配置计划

### 🔍 问题分析

#### 当前配置状态
| 组件 | 端口 | 路径前缀 | 认证要求 |
|--------|------|-----------|----------|
| 后端 (main.py) | `8989` | `/api/v1` | 无 |
| 前端 (.env.local) | `8989` | `/api/v1` | 无 |
| 前端 (lib/env.ts) | `8989` (默认) | `/api/v1` | 无 |

#### 发现的问题

1. **端口和路径配置正确** - 后端运行在 `8989` 端口，前端配置正确

2. **组件使用 Mock 数据** - [FeaturedHighlights.tsx](file:///e:\project\my-awesome-blog\frontend\src\components\home\FeaturedHighlights.tsx) 中定义了 `mockHighlights`，没有实际调用 API

3. **API 客户端配置问题** - [api-client.ts](file:///e:\project\my-awesome-blog\frontend\src\lib\api-client.ts) 从 `@/config/api` 导入 `API_BASE_URL`，但实际上应该是从 `@/lib/env` 导入

***

### 🛠 修复方案

#### 第一步：修复 API 客户端导入路径
- 修改 `frontend/src/lib/api-client.ts`
- 将 `import { API_BASE_URL } from '@/config/api'` 改为 `import { env } from '@/lib/env'`
- 将 `API_BASE_URL` 改为 `env.NEXT_PUBLIC_API_URL`

#### 第二步：创建文章 API 服务函数
- 创建 `frontend/src/lib/api/articles.ts`
- 添加获取文章列表的 API 函数：
  ```typescript
  export const getArticles = async (params?: {
    skip?: number
    limit?: number
    published_only?: boolean
    category_id?: string
    tag_id?: string
    search?: string
  }) => { ... }
  ```
- 添加获取精选文章的函数

#### 第三步：创建打字机内容 API 服务函数
- 创建 `frontend/src/lib/api/typewriter.ts`
- 添加获取打字机内容的 API 函数：
  ```typescript
  export const getTypewriterContents = async (params?: {
    skip?: number
    limit?: number
    active_only?: boolean
  }) => { ... }
  ```
- 添加获取激活内容的函数

#### 第四步：更新 FeaturedHighlights 组件
- 移除 `mockHighlights` 数据
- 使用 `getArticles` API 获取真实数据
- 添加加载状态和错误处理
- 保持现有 UI 设计不变

#### 第五步：检查其他组件
- 检查其他使用 mock 数据的组件
- 更新为真实 API 调用

***

### ✅ 预期效果
- 首页可以正常显示从后端获取的文章数据
- 打字机内容页面可以正常显示数据
- 所有 API 调用统一使用正确的配置
- 错误处理和加载状态完善