## 修复前端API端点拼写错误

### 问题分析
- 后端端点：`/articles/popular`（第92行）
- 前端调用：`/articles/popular`（第69行）

前端多了一个`p`，是拼写错误。

### 解决方案

**修改 `frontend/src/lib/api/articles.ts` 第69行**

```tsx
// 修改前
const response = await fetch(`${API_BASE_URL}/articles/popular?limit=${limit}`,

// 修改后  
const response = await fetch(`${API_BASE_URL}/articles/popular?limit=${limit}`,
```