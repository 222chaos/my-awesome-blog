## 修复 HoloCard 组件的 category 读取错误

**问题诊断**:

1. **HoloCard.tsx** 尝试访问 `article.category.name`，但 `article.category` 可能是 `undefined`
2. **后端 Schema 问题**: `ArticleWithAuthor` schema 只包含 `author` 字段，没有 `categories` 和 `tags`
3. **前端期望的数据结构**:
   ```typescript
   category: { name: string; slug: string; }
   tags: Array<{ id: string; name: string; }>
   ```
4. **后端实际返回的数据结构**:
   ```python
   ArticleWithAuthor:
     author: Optional["User"] = None
     # 缺少 categories 和 tags 字段！
   ```

**修复方案**:

### 修改 1: 更新后端 Article Schema
**文件**: `backend/app/schemas/article.py`
- 在 `ArticleWithAuthor` 类中添加 `categories` 和 `tags` 字段
- 使用 `Optional[List[Category]]` 和 `Optional[List[Tag]]` 类型
- 添加正确的导入和前向引用

### 修改 2: 更新前端类型定义
**文件**: `frontend/src/types/index.ts`
- 添加完整的 `Article` 接口定义，包含 `categories` 和 `tags`
- 确保与后端返回的数据结构匹配

**修改 3: 更新 HoloCard 组件类型
**文件**: `frontend/src/components/articles/HoloCard.tsx`
- 使用正确的 `categories[0]` 而不是 `category`
- 或者添加可选链检查: `article.categories?.[0]?.name`

**预期结果**:
- 后端返回完整的文章数据，包含 categories 和 tags
- 前端可以正确访问 `article.categories[0].name` 和 `article.tags`
- HoloCard 组件正常显示分类和标签