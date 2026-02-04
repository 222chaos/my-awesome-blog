## 修复 Articles Page 的 "Not Found" 错误

**问题分析**:
1. `.env.local` 中 `NEXT_PUBLIC_API_URL=http://localhost:8989/api/v1` 包含了 `/api/v1` 后缀
2. `api.ts` 中使用 `API_BASE_URL` 拼接 endpoint 时，endpoint 也包含 `/api/v1`
3. 结果请求路径变成: `http://localhost:8989/api/v1/api/v1/articles/` (重复了 `/api/v1`)
4. `page.tsx` 中直接 fetch `/api/v1/articles/featured` 使用相对路径，会请求前端自己的端口而不是后端

**修复方案**:

### 修改 1: 更新 `.env.local` 配置
**文件**: `frontend/.env.local`
- 将 `NEXT_PUBLIC_API_URL` 改为 `http://localhost:8989` (去掉 `/api/v1` 后缀)
- 这样 `api.ts` 中的 `${API_BASE_URL}/api/v1/articles/` 就会正确解析为 `http://localhost:8989/api/v1/articles/`

### 修改 2: 修复 page.tsx 中的直接 fetch
**文件**: `frontend/src/app/articles/page.tsx`
- 将直接 fetch 改为使用 `getFeaturedArticles` 函数
- 或者使用完整的 API URL 而不是相对路径

**预期结果**:
- `getArticles()` 请求: `http://localhost:8989/api/v1/articles/` ✅
- `getFeaturedArticles()` 请求: `http://localhost:8989/api/v1/articles/featured?limit=5` ✅