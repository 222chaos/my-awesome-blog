## 通过API接口新增文章

### 方案概述
使用Python脚本通过HTTP API接口创建多篇文章，而不是直接操作数据库。

### 执行步骤

1. **创建API调用脚本**
   - 在 `backend/scripts/` 目录下创建 `create_articles_via_api.py` 脚本
   - 实现登录功能获取 access_token
   - 调用 `POST /api/v1/articles/` 接口创建文章

2. **文章内容**
   创建5-6篇技术文章，涵盖不同主题：
   - FastAPI 相关
   - React/前端开发
   - 数据库技术
   - DevOps/Docker
   - AI/人工智能

3. **执行脚本**
   - 运行脚本创建文章
   - 验证文章是否成功创建

### 技术细节
- **登录接口**：`POST /api/v1/auth/login-json`
- **创建文章接口**：`POST /api/v1/articles/`
- **认证方式**：Bearer Token
- **请求体**：ArticleCreate schema（title, slug, content, excerpt, cover_image, is_published）

### 测试账号
- 用户名：admin
- 密码：admin123