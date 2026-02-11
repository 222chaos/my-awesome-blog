## 修复首页文章API拼写错误

### 问题分析
前端调用的是 `/articles/popular`，但后端端点是 `/articles/popular`（应该是 `popular`）

### 解决方案

**修改 `frontend/src/lib/api/articles.ts` 第69行**

```tsx
// 修改前
const response = await fetch(`${API_BASE_URL}/articles/popular?limit=${limit}`,

// 修改后
const response = await fetch(`${API_BASE_URL}/articles/popular?limit=${limit}`,
```

### 说明
- 端点从 `/articles/popular` 改为 `/articles/popular`
- 与后端 `@router.get("/popular")` 一致