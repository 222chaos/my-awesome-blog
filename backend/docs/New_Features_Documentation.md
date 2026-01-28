# 新功能文档

本文档介绍了为 My Awesome Blog 项目添加的新功能，包括实现细节和使用方法。

## 1. 缓存层实现

### 1.1 技术选择
- 使用 Redis 作为缓存后端
- 使用 `aioredis` 库进行异步操作
- 实现了通用的缓存服务类

### 1.2 实现细节
- 缓存服务位于 `app/services/cache_service.py`
- 主要缓存热点数据，如文章详情、用户信息等
- 实现了 `cache_get_or_set` 便捷函数

### 1.3 配置要求
在 `.env` 文件中添加以下配置：
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=your_redis_password
```

### 1.4 使用示例
```python
from app.services.cache_service import cache_service

# 存储数据到缓存
await cache_service.set("key", data, expire=3600)

# 从缓存获取数据
cached_data = await cache_service.get("key")

# 删除缓存
await cache_service.delete("key")
```

## 2. 游标分页

### 2.1 介绍
游标分页是一种高效的分页方法，特别适用于大数据集。相比传统的偏移分页，游标分页在大数据集上的性能更好。

### 2.2 实现
- 分页工具位于 `app/utils/pagination.py`
- 游标分页函数已添加到各个 CRUD 模块
- API 端点 `/articles/cursor-paginated` 提供游标分页功能

### 2.3 API 使用
```
GET /api/v1/articles/cursor-paginated?cursor=<cursor>&limit=20
```

参数说明：
- `cursor`: 上次请求返回的游标，首次请求可为空
- `limit`: 每页项目数量，默认为20
- `published_only`: 是否只返回已发布的文章
- `author_id`: 按作者过滤
- `search`: 搜索关键词

## 3. 全文搜索

### 3.1 技术实现
- 使用 PostgreSQL 的全文搜索功能
- 创建 `search_vector` 列和 GIN 索引
- 使用 `tsvector` 和 `tsquery` 进行搜索

### 3.2 数据库迁移
运行以下迁移来添加全文搜索功能：
```
alembic upgrade head
```

### 3.3 API 使用
```
GET /api/v1/articles/search-fulltext?search_query=python&published_only=true&skip=0&limit=10
```

## 4. 审计日志

### 4.1 数据模型
审计日志记录系统中的关键操作，包括：
- 用户ID
- 操作类型
- 资源类型和ID
- 旧值和新值（JSON格式）
- IP地址和用户代理
- 时间戳

### 4.2 API 端点
- `GET /api/v1/audit-logs/` - 获取审计日志列表
- `GET /api/v1/audit-logs/user/{user_id}` - 获取特定用户的审计日志
- `GET /api/v1/audit-logs/action/{action}` - 获取特定操作类型的审计日志

### 4.3 权限要求
审计日志端点仅对超级用户开放。

## 5. 增强数据分析

### 5.1 功能概述
增强的数据分析功能提供了更丰富的统计信息：
- 文章增长统计
- 用户参与度统计
- 顶级作者排行
- 月度统计
- 内容洞察

### 5.2 API 端点
- `GET /api/v1/analytics/growth-stats`
- `GET /api/v1/analytics/engagement-stats`
- `GET /api/v1/analytics/top-authors-by-articles`
- `GET /api/v1/analytics/top-authors-by-views`
- `GET /api/v1/analytics/monthly-stats`
- `GET /api/v1/analytics/content-insights`
- `GET /api/v1/analytics/dashboard-summary`

## 6. 错误处理改进

### 6.1 标准错误响应
实现了一致的错误响应格式：
```json
{
  "success": false,
  "error": "RESOURCE_NOT_FOUND",
  "error_code": "RESOURCE_NOT_FOUND",
  "message": "Resource not found",
  "details": null
}
```

### 6.2 异常处理器
- 全局异常处理器
- HTTP异常处理器
- 500服务器错误处理

## 7. 环境变量验证

### 7.1 验证功能
在应用启动时验证关键配置项：
- SECRET_KEY 不是默认值
- 数据库连接URL
- Redis主机配置
- 邮件服务配置（如果启用）

### 7.2 配置示例
在 `app/core/config.py` 中实现验证逻辑。

## 8. CI/CD 改进

### 8.1 GitHub Actions
- 更新了后端CI流程
- 添加了前端CI流程
- 改进了部署工作流

### 8.2 测试覆盖
- 为新功能编写了单元测试
- 集成测试覆盖主要功能路径
- 代码覆盖率报告

## 9. 数据库优化

### 9.1 新增索引
为提高查询性能，添加了以下索引：
- 文章表的 `is_published`, `published_at`, `view_count` 等字段
- 复合索引用于常见查询模式
- 全文搜索的 GIN 索引

### 9.2 迁移脚本
- `004_add_indexes_for_optimized_queries.py`
- `005_add_composite_indexes.py`
- `006_add_fulltext_search.py`
- `007_add_audit_log_table.py`

以上是新功能的主要文档，详细实现可在对应文件中查看。