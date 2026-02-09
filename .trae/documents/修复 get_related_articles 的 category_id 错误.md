## 修复 get_related_articles 的 category_id 错误

### 问题描述
`get_related_articles` 函数使用了 `original_article.category_id`，但 Article 模型使用的是多对多关系 `categories`，没有 `category_id` 字段，导致 `AttributeError`。

### 修复内容
在 `backend/app/crud/article.py` 中修改 `get_related_articles` 函数：
- 使用 `original_article.categories` 来获取第一个分类
- 或者从 `original_article.article_categories` 关系中获取分类 ID

### 修改文件
- `backend/app/crud/article.py` (第 240-283 行)