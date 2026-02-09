## 修复后端返回 categories 数组导致前端 category 未定义的问题

### 问题描述
后端 Article 模型使用多对多关系，返回 `categories` 数组，但前端期望 `article.category` 单个对象，导致 `article.category` 为 undefined。

### 修复方案
在 `backend/app/schemas/article.py` 中的 `ArticleWithAuthor` schema 中：
- 添加 `category` 字段，返回第一个分类（如果存在）
- 保留 `categories` 数组字段供需要多分类的场景使用

### 修改文件
- `backend/app/schemas/article.py`