## 使用OSS上传文章封面图

### 方案概述
从网上下载高质量图片，通过后端API上传到阿里云OSS，然后将OSS URL更新到文章。

### 执行步骤

1. **创建图片上传脚本**
   - 文件：`backend/scripts/upload_and_update_covers.py`
   - 功能：
     - 下载高质量技术主题图片
     - 通过 `POST /api/v1/images/` 上传到OSS
     - 通过 `PUT /api/v1/articles/{id}` 更新文章

2. **图片准备**
   下载6张匹配主题的图片（800x400尺寸）：
   - FastAPI异步编程：Python/代码主题
   - React Server Components：React/前端主题
   - PostgreSQL全文搜索：数据库主题
   - Docker多阶段构建：容器/DevOps主题
   - AI大模型应用开发：AI/科技主题
   - TypeScript高级类型：编程/代码主题

3. **执行上传和更新**
   - 登录获取Token
   - 逐个上传图片到OSS
   - 更新文章的cover_image为OSS URL

### 技术细节
- **图片上传接口**：`POST /api/v1/images/`
- **文章更新接口**：`PUT /api/v1/articles/{article_id}`
- **OSS配置**：已配置Access Key和Secret
- **图片要求**：JPG/PNG格式，800x400推荐尺寸

### 预期结果
- 6张图片上传到OSS
- 6篇文章的cover_image更新为OSS URL
- 前端显示OSS托管的图片