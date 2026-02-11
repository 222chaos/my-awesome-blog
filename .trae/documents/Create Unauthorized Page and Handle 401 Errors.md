## 创建权限不足页面并处理401错误

### 方案

**1. 创建权限不足页面**
`frontend/src/app/unauthorized/page.tsx`

显示权限不足提示和登录按钮

**2. 修改 ChatWindow 错误处理**
`frontend/src/components/chat/ChatWindow.tsx`

捕获401错误，使用 `useRouter` 跳转到 `/unauthorized` 页面

**3. 修改 llm.ts 错误处理**
`frontend/src/lib/api/llm.ts`

返回更详细的错误信息，包括状态码