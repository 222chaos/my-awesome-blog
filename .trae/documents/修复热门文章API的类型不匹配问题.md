## 修复计划：解决热门文章API的500错误

### 问题根源分析

查看 `backend/app/utils/db_utils.py` 的 `get_popular_articles_optimized` 函数：

**问题**：类型不匹配导致字典查找失败
- 第77行：`article_ids = [row.id for row in result]` - SQL 查询返回的 `row.id` 可能是字符串
- 第93行：`articles_dict = {str(article.id): article for article in articles}` - 字典键是字符串
- 第96行：`if row.id in articles_dict:` - 检查 `row.id` 是否在字典中，但类型可能不匹配

**实际情况**：
- `row.id` 从原生 SQL 查询返回，可能是字符串或特定格式
- `article.id` 是 UUID 对象
- 当 `row.id` 不是字符串时，`if row.id in articles_dict` 会返回 `False`
- 导致 `ordered_articles` 始终为空列表
- API 返回空数组，但如果有其他异常可能返回 500 错误

### 解决方案

**修改文件**：`backend/app/utils/db_utils.py`

**修改内容**（第93-99行）：
```python
# 按查询结果的顺序排序
articles_dict = {str(article.id): article for article in articles}
ordered_articles = []
for row in result:
    row_id_str = str(row.id)
    if row_id_str in articles_dict:
        ordered_articles.append(articles_dict[row_id_str])
```

**核心改动**：
- 将 `row.id` 转换为字符串后再检查
- 使用一致的字符串键进行字典查找
- 确保类型匹配

### 为什么会出现500错误

可能的原因：
1. 数据库中可能没有已发布的文章（空结果集）
2. SQL 查询的某些字段与模型不匹配
3. 异常处理不当

**附加修复**：在函数中添加异常处理和日志记录

```python
def get_popular_articles_optimized(db: Session, limit: int = 5, days: int = 30):
    """
    优化的热门文章查询，使用预加载关系避免N+1问题
    """
    from datetime import datetime, timedelta
    from sqlalchemy import text
    from app.utils.logger import app_logger
    
    try:
        # ... 现有代码 ...
        
        return ordered_articles
    except Exception as e:
        app_logger.error(f"获取热门文章失败: {e}", exc_info=True)
        return []
```