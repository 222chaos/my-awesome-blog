## 修复后端导入错误

**问题**:
在 `backend/app/schemas/article.py` 中使用了 `List` 类型，但没有从 `typing` 模块导入。

**错误信息**:
```
NameError: name 'List' is not defined. Did you mean: 'list'?
```

**修复方案**:

### 修改 `backend/app/schemas/article.py`
在文件顶部的导入语句中添加 `List`:
```python
from typing import Optional, List
```

**预期结果**:
- 后端服务器能够正常启动
- `ArticleWithAuthor` schema 中的 `categories` 和 `tags` 字段使用 `List` 类型定义正常工作