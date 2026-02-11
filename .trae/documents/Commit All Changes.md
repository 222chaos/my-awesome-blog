## 提交所有更改到Git

### 当前更改内容

**后端修改：**
- `backend/app/api/v1/endpoints/llm.py` - 将/llm/models端点改为公开访问
- `backend/app/core/config.py` - 配置更新
- `backend/app/services/llm_service.py` - LLM服务更新
- `backend/requirements.txt` - 依赖更新
- `backend/.env.example` - 环境变量示例更新

**前端修改：**
- `frontend/src/app/chat/` - 新增聊天页面目录（layout、page、ClientLayout等）
- `frontend/src/components/chat/` - 新增聊天组件（ChatLayout、ChatWindow、ChatSidebar、MessageBubble、ChatInput、ModelSelector）
- `frontend/src/components/navigation/Navbar.tsx` - 更新路由链接/ai-chat → /chat
- 其他组件的修复和优化

### 执行步骤

1. 添加所有相关文件到Git（排除.trae临时文档）
2. 提交更改

### 提交信息
```
feat: 添加AI对话页面并修复相关问题

- 新增完整的AI对话功能（聊天页面、侧边栏、消息流）
- 实现流式响应、Markdown渲染、会话管理
- 将/llm/models API改为公开访问
- 修复导航栏遮挡对话页面内容问题
- 修复HTML嵌套和CSS导入路径错误
- 更新Navbar路由链接
```