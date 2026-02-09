## 诊断计划：热门文章 API 500 错误

### 问题分析

根据日志和代码分析，发现以下问题：

1. **请求到达后端但返回 500 错误**
   - 前端日志：`127.0.0.1:8989/api/v1/articles/popular?limit=3` 返回 500
   - 后端日志：完全没有 `/articles/popular` 的请求记录

2. **SQL 语法错误**（最可能的原因）
   - `backend/app/utils/db_utils.py` 第65行：`WHERE a.is_published = true`
   - PostgreSQL 要求使用 `TRUE`（大写）而不是 `true`（小写）
   - 这会导致 SQL 执行失败，抛出异常

3. **数据库可能为空**
   - 可能数据库中没有已发布的文章（`is_published = TRUE` 且 `published_at >= now() - 30 days`）

### 修复方案

#### 修改 1：修复 SQL 语法错误
**文件**：`backend/app/utils/db_utils.py`
- 第65行：将 `WHERE a.is_published = true` 改为 `WHERE a.is_published = TRUE`
- 这是标准的 PostgreSQL 布尔值语法

#### 修改 2：增强日志记录
**文件**：`backend/app/api/v1/endpoints/articles.py`
- 在 `read_popular_articles` 函数中添加更详细的日志记录
- 记录请求参数、查询结果和任何异常

#### 修改 3：数据库检查（可选）
- 确认数据库中是否有已发布的文章数据
- 如果没有，可以创建一些测试数据

### 预期结果
修复后：
- API 应该能正常返回热门文章（如果有数据）
- 如果没有数据，返回空数组而不是 500 错误
- 日志中能看到完整的请求处理流程