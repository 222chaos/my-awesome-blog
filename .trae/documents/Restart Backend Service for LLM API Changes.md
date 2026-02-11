## 重启后端服务使修改生效

### 问题说明
已将后端`/llm/models`端点改为公开（移除认证要求），但Docker容器中的后端服务需要重启才能加载新代码。

### 解决方案
重启Docker Compose中的backend服务

**执行命令：**
```bash
docker-compose restart backend
```

### 预期效果
- 后端服务重启后，`/api/v1/llm/models`端点将变为公开访问
- 前端聊天页面可以正常获取模型列表
- 实际对话接口`/llm/chat`和`/llm/chat/stream`仍然需要登录认证