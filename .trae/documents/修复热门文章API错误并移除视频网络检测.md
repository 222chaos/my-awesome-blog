## 修复计划

### 问题1：后端 `/articles/popular` 500错误

**根本原因**：
- `articles.py:read_popular_articles` 调用 `get_articles_with_categories_and_tags(db, order_by_views=True)`
- 但 `get_articles_with_categories_and_tags` 函数不支持 `order_by_views` 参数
- 导致参数未使用，查询按默认排序，且可能缺少必要的 joinedload

**解决方案**：
修改 `backend/app/api/v1/endpoints/articles.py` 第87-103行：
```python
# 直接调用 get_popular_articles 函数，它已经正确实现了按浏览量排序
# 而不是调用不支持 order_by_views 参数的 get_articles_with_categories_and_tags
```

### 问题2：移除网络慢跳过视频功能

**原因**：用户希望在网速慢时仍然加载视频

**修改文件**：`frontend/src/components/home/HeroSection.tsx`
- 移除第40-53行的 `checkNetworkQuality` 函数
- 移除第33行的 `networkInfo` state
- 移除第35行的 `timeoutRef` ref
- 修改第86-99行的 `useEffect`：移除网络检测逻辑，直接加载视频
- 移除所有网络质量检测相关的代码

### 修改的文件
1. `backend/app/api/v1/endpoints/articles.py` - 修复热门文章API
2. `frontend/src/components/home/HeroSection.tsx` - 移除网络检测，简化视频加载