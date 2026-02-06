## 修复 articleService.ts 中的 API 路径重复问题

### 问题原因
`API_BASE_URL` 已包含 `/api/v1`，但 `articleService.ts` 中的所有 endpoint 又添加了 `/api/v1` 前缀，导致：
- 请求 URL：`http://localhost:8989/api/v1/api/v1/articles/` (错误)
- 正确 URL：`http://localhost:8989/api/v1/articles/`

### 需要修改的位置

在 [articleService.ts](file:///e:\project\my-awesome-blog\frontend\src\services\articleService.ts) 中：

| 行号 | 当前错误路径 | 正确路径 |
|------|-------------|----------|
| 110 | `/api/v1/articles/` | `/articles/` |
| 118 | `/api/v1/articles/${id}` | `/articles/${id}` |
| 128 | `/api/v1/articles/slug/${slug}` | `/articles/slug/${slug}` |
| 138 | `/api/v1/articles/related/${articleId}` | `/articles/related/${articleId}` |
| 148 | `/api/v1/categories/` | `/categories/` |
| 158 | `/api/v1/tags/` | `/tags/` |
| 168 | `/api/v1/articles/featured` | `/articles/featured` |
| 178 | `/api/v1/articles/popular` | `/articles/popular` |
| 196 | `/api/v1/articles/search` | `/articles/search` |
| 223 | `${API_BASE_URL}/api/v1/images/` | `${API_BASE_URL}/images/` |
| 242 | `/api/v1/articles/${id}` | `/articles/${id}` |

### 修复方法
将所有 endpoint 中的 `/api/v1` 前缀移除