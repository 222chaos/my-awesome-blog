## 修复 cookie-utils 模块缺失的问题

### 问题描述
`frontend/src/lib/auth-utils.ts` 导入了不存在的 `./cookie-utils` 模块，导致构建失败。

### 修复方案
简化 `frontend/src/lib/auth-utils.ts`：
- 移除对 `cookie-utils` 的依赖
- 移除 cookie 相关的 `setCookie` 和 `eraseCookie` 调用
- 只保留 localStorage 操作
- 这是因为应用主要使用 localStorage 存储认证令牌

### 修改文件
- `frontend/src/lib/auth-utils.ts`