## 修复 api-client 模块缺失的问题

### 问题描述
`frontend/src/lib/api/auth.ts` 导入了不存在的 `@/lib/api-client` 模块，导致构建失败。

### 修复方案
修改 `frontend/src/lib/api/auth.ts`：
- 移除对 `@/lib/api-client` 的导入
- 将 `get('/users/me')` 调用替换为直接使用 fetch（与其他 API 文件保持一致）
- 使用 `getToken()` 获取认证令牌

### 修改文件
- `frontend/src/lib/api/auth.ts`