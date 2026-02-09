## 修复 increment_view_count 的缓存问题

### 问题描述
`get_article_async` 返回的 Article 对象可能来自 Redis 缓存，不属于当前数据库 session。当 `increment_view_count` 调用 `db.refresh(db_article)` 时会报错：`Instance '<Article>' is not persistent within this Session`

### 修复内容
在 `backend/app/crud/article.py` 中修改 `increment_view_count` 函数：
- 直接从数据库查询文章（使用同步查询），而不是使用 `get_article_async`（可能返回缓存对象）
- 移除不必要的 `db.refresh(db_article)` 调用，因为刚查询的对象已经在 session 中

### 修改文件
- `backend/app/crud/article.py` (第 198-211 行)