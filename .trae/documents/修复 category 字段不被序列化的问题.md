## 修复 category 字段不被序列化的问题

### 问题描述
Pydantic 的 `@property` 默认不会被序列化到 JSON 响应中，导致前端接收到的 `article.category` 仍然是 undefined。

### 修复方案
在 `backend/app/schemas/article.py` 中修改 `ArticleWithAuthor` 类：
- 使用 `computed_field` 替代 `@property`
- 正确设置 `computed_field` 的类型注解

### 修改文件
- `backend/app/schemas/article.py`