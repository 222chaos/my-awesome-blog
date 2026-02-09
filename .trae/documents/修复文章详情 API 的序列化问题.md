## 修复文章详情 API 的序列化问题

### 问题描述
API 端点 `read_article_by_id` 使用 `get_article_async` 返回的对象（可能来自 Redis 缓存），但该对象没有预加载 `author`、`categories`、`tags` 关系。当 FastAPI 尝试序列化 `ArticleWithAuthor` 时，由于对象已从 session 中分离，无法进行延迟加载，导致 `DetachedInstanceError`。

### 修复方案
在 `backend/app/api/v1/endpoints/articles.py` 中修改 `read_article_by_id` 端点：
- 使用 `crud.increment_view_count` 的返回值（已经从数据库重新查询并更新了）
- 或者创建并使用 `get_article_with_relationships` 函数

### 修改文件
- `backend/app/api/v1/endpoints/articles.py` (第 201-220 行)