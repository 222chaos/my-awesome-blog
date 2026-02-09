# 修复前端 API 路由 URL 拼接问题

## 问题分析

发现了 URL 拼接的不一致性问题：

### messages/route.ts 的模式
```typescript
import { API_BASE_URL } from '@/config/api';

const endpoint = danmakuOnly 
  ? `${API_BASE_URL}/api/v1/messages/danmaku`
  : `${API_BASE_URL}/api/v1/messages/`;
```

这意味着 `messages` 路由在 API_BASE_URL 后面**手动添加了 `/api/v1`**

### .env.local 配置
```
NEXT_PUBLIC_API_URL=http://localhost:8989
```

### albums/route.ts 的模式
```typescript
const response = await fetch(`${API_BASE_URL}/albums?skip=${skip}&limit=${limit}`, {
```

这里**没有**手动添加 `/api/v1`

## 问题根源

- `.env.local` 中 `NEXT_PUBLIC_API_URL=http://localhost:8989`（缺少 `/api/v1` 后缀）
- `messages/route.ts` 手动添加 `/api/v1`，所以请求正确：`http://localhost:8989/api/v1/messages/`
- `albums/route.ts` 没有手动添加 `/api/v1`，所以请求错误：`http://localhost:8989/albums`

## 解决方案

### 方案一：修改 .env.local（推荐）
将 `.env.local` 中的 URL 改为包含完整路径：
```env
NEXT_PUBLIC_API_URL=http://localhost:8989/api/v1
```

### 方案二：修改 albums/route.ts 的请求 URL
在 `albums/route.ts` 中手动添加 `/api/v1` 前缀，与其他路由保持一致

## 推荐实施

使用**方案一**，因为：
- 只需修改一个环境变量文件
- 所有 API 路由都能正确工作
- 符合配置管理的最佳实践

## 执行步骤
1. 修改 `frontend/.env.local`
   - 将 `NEXT_PUBLIC_API_URL=http://localhost:8989` 
   - 改为 `NEXT_PUBLIC_API_URL=http://localhost:8989/api/v1`
2. 重启前端开发服务器（如果需要）
3. 测试相册页面是否正常加载数据