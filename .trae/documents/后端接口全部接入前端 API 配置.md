## 后端接口全部接入前端 API 配置计划

### 🔍 现状分析

#### 后端 API 端点 (20个)
| 端点 | 路径 | 前端状态 |
|--------|--------|-----------|
| auth | /api/v1/auth | 部分完成 |
| users | /api/v1/users | ❌ 未创建 |
| articles | /api/v1/articles | ✅ 已创建 (lib/api/articles.ts) |
| comments | /api/v1/comments | ❌ 未创建 |
| categories | /api/v1/categories | ❌ 未创建 |
| tags | /api/v1/tags | ❌ 未创建 |
| friend_links | /api/v1/friend-links | ❌ 未创建 |
| portfolio | /api/v1/portfolio | ❌ 未创建 |
| timeline_events | /api/v1/timeline-events | ❌ 未创建 |
| statistics | /api/v1/stats | ❌ 未创建 |
| subscriptions | /api/v1/subscriptions | ❌ 未创建 |
| images | /api/v1/images | ❌ 未创建 |
| typewriter_contents | /api/v1/typewriter-contents | ✅ 已创建 (lib/api/typewriter.ts) |
| audit_logs | /api/v1/audit-logs | ❌ 未创建 |
| analytics | /api/v1/analytics | ❌ 未创建 |
| oss_upload | /api/v1/oss | ❌ 未创建 |
| messages | /api/v1/messages | ❌ 未创建 |
| albums | /api/v1/albums | ❌ 未创建 |
| monitoring | /api/v1/monitoring | ❌ 未创建 |
| llm | /api/v1/llm | ❌ 未创建 |

#### 前端现有服务
- `lib/api/auth.ts` - 认证
- `lib/api/articles.ts` - 文章
- `lib/api/typewriter.ts` - 打字机
- `services/` 目录下有部分服务但使用旧的配置

***

### 🛠 实施方案

#### 第一阶段：创建基础 API 服务文件 (lib/api/)

为每个后端端点创建对应的 TypeScript API 服务文件：

1. **users.ts** - 用户管理
   - getUsers, getUserById, getCurrentUser, updateUser, deleteUser

2. **comments.ts** - 评论管理
   - getComments, getCommentsByArticle, createComment, updateComment, deleteComment

3. **categories.ts** - 分类管理
   - getCategories, getCategoryById, createCategory, updateCategory, deleteCategory

4. **tags.ts** - 标签管理
   - getTags, getTagById, createTag, updateTag, deleteTag

5. **friend-links.ts** - 友链管理
   - getFriendLinks, getFriendLinkById, createFriendLink, updateFriendLink, deleteFriendLink

6. **portfolio.ts** - 作品集管理
   - getPortfolioItems, getPortfolioItemById, createPortfolioItem, updatePortfolioItem, deletePortfolioItem

7. **timeline-events.ts** - 时间轴管理
   - getTimelineEvents, getTimelineEventById, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent

8. **statistics.ts** - 统计信息
   - getWebsiteStats, getPopularArticlesStats, getGrowthStats

9. **subscriptions.ts** - 订阅管理
   - getSubscriptions, getSubscriptionById, createSubscription, updateSubscription, deleteSubscription

10. **images.ts** - 图片管理
    - getImages, getImageById, uploadImage, updateImage, deleteImage

11. **audit-logs.ts** - 审计日志
    - getAuditLogs, getAuditLogsByUser

12. **analytics.ts** - 分析数据
    - getAnalytics, getAnalyticsByPeriod

13. **albums.ts** - 相册管理
    - getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum

14. **llm.ts** - LLM 对话
    - chat, streamChat, getModels

14. **oss.ts** - OSS 上传
    - uploadFile, deleteFile, getFileUrl

15. **messages.ts** - 消息管理
    - getMessages, getMessageById, createMessage, updateMessage, deleteMessage

16. **monitoring.ts** - 监控
    - getHealthStatus, getSystemMetrics

#### 第二阶段：统一 API 基础配置

确保所有新建的 API 服务文件使用：
```typescript
import { env } from '@/lib/env';
const API_BASE_URL = env.NEXT_PUBLIC_API_URL || 'http://localhost:8989/api/v1';
```

#### 第三阶段：更新 lib/api/index.ts

统一导出所有 API 模块

#### 第四阶段：更新类型定义

确保 TypeScript 类型与后端 Pydantic 模型匹配

***

### ✅ 预期效果
- 所有后端 API 都有对应的前端 API 服务
- 统一的 API 配置管理
- 类型安全的前后端交互
- 便于维护和扩展的代码结构