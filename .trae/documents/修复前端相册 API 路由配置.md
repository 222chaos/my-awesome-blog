# 修复前端相册 API 路由配置问题

## 问题分析

发现配置不一致的问题：

1. **albums/route.ts** 直接使用：
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8989/api/v1';
   ```

2. **.env.local** 设置为：
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8989
   ```

3. **其他 API 路由**使用统一配置：
   ```typescript
   import { API_BASE_URL } from '@/config/api';
   ```

4. **config/api.ts** 中的逻辑：
   ```typescript
   export const API_BASE_URL = env.NEXT_PUBLIC_API_URL || env.NEXT_PUBLIC_API_BASE_URL;
   ```

## 问题根源

- `albums/route.ts` 硬编码了默认值 `http://127.0.0.1:8989/api/v1`
- `.env.local` 中只有 `http://localhost:8989`（缺少 `/api/v1`）
- 导致请求的 URL 变成 `http://localhost:8989/albums`（错误）
- 正确应该是 `http://localhost:8989/api/v1/albums`

## 修复方案

### 方案一：统一使用配置 API_BASE_URL（推荐）
修改 `albums/route.ts`，从 `@/config/api` 导入配置，与其他路由保持一致

### 方案二：修正 .env.local 中的 URL
将 `.env.local` 中的 URL 改为包含完整路径

## 推荐实施

使用**方案一**，因为：
- 保持代码一致性
- 更容易维护
- 避免未来类似问题

## 执行步骤
1. 修改 `frontend/src/app/api/albums/route.ts`
   - 移除硬编码的 API_BASE_URL
   - 从 `@/config/api` 导入配置
2. 重启前端开发服务器（如果需要）
3. 测试相册页面是否正常加载