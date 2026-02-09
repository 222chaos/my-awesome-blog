## 修改 API 端点使用更新后的文章对象

### 问题描述
API 端点从缓存获取旧的 Article 对象（没有预加载关系），然后调用 `increment_view_count` 更新数据库，但没有使用 `increment_view_count` 返回的新对象（从数据库重新查询并包含关系数据）。最后返回的仍然是旧的缓存对象，导致序列化时出错。

### 修复内容
在 `backend/app/api/v1/endpoints/articles.py` 中修改 `read_article_by_id` 端点：
- 使用 `crud.increment_view_count` 的返回值（已从数据库重新查询并预加载关系）
- 如果缓存中有旧对象，使用增量操作更新的新对象替换它

### 修改文件
- `backend/app/api/v1/endpoints/articles.py` (第 201-220 行)