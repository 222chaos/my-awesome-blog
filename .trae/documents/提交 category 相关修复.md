## 提交当前的代码更改

### 修改的文件
根据之前的修改，需要提交以下文件：
- `backend/app/schemas/article.py` - 添加 `@computed_field` 的 `category` 字段
- `backend/app/crud/article.py` - 修复 `get_related_articles` 函数中的 `category_id` 错误
- `frontend/src/app/articles/[id]/page.tsx` - 添加条件渲染处理 `article.category` 为 null 的情况
- `frontend/src/app/articles/[id]/enhanced-article.tsx` - 添加条件渲染处理 `article.category` 为 null 的情况

### 提交步骤
1. 查看当前 git 状态
2. 添加修改的文件
3. 创建提交信息并提交