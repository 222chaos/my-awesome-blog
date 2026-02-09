## 修复文章详情 API 函数导出问题

### 问题描述
后端 API `read_article_by_id` 调用了 `crud.get_article_async` 和 `crud.increment_view_count`，但这些函数虽然在 `article.py` 中存在，却没有在 `crud/__init__.py` 中导出，导致 `AttributeError`。

### 修复内容
在 `backend/app/crud/__init__.py` 中：
1. 将 `get_article` 改为 `get_article_async`（异步版本，带缓存）
2. 添加 `get_article_with_relationships` 的导出（如需要）
3. 添加 `increment_view_count` 的异步版本导出

### 修改文件
- `backend/app/crud/__init__.py`