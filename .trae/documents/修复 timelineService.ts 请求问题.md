## 修复 timelineService.ts 的请求问题

### 问题分析
`articleService.ts` 使用统一的 `apiRequest` 函数，自动添加 `API_BASE_URL` 前缀和授权头。但 `timelineService.ts` 直接使用 `fetch`，缺少统一的错误处理和授权机制。

### 修复方案
修改 `frontend/src/services/timelineService.ts`：
1. 添加统一的 `apiRequest` 函数（与 `articleService.ts` 一致）
2. 使用 `apiRequest` 替换所有直接的 `fetch` 调用
3. 统一错误处理逻辑

### 修改文件
- `frontend/src/services/timelineService.ts`