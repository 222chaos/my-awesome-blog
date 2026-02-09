## 修复前端 article.category 为 null 时的错误

### 问题描述
前端代码直接使用 `article.category.name`，当文章没有分类时 `article.category` 为 `null`，导致错误。

### 修复方案
在 `frontend/src/app/articles/[id]/page.tsx` 中：
- 使用可选链 `article.category?.name`
- 或添加条件渲染，只在有分类时显示分类 Badge

### 修改文件
- `frontend/src/app/articles/[id]/page.tsx` (第 278-283 行)