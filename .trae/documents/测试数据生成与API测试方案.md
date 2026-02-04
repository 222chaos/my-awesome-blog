# 测试数据生成与API测试方案

## 一、创建测试数据种子脚本

### 文件：`backend/scripts/seed_test_data.py`

将创建以下测试数据：

#### 1. 用户数据
- 创建管理员用户 (admin/admin123)
- 创建普通测试用户 (testuser/test123)
- 创建多个测试用户用于评论和留言

#### 2. 文章数据
- 10-15篇不同分类的测试文章
- 包含已发布/未发布状态
- 包含精选文章
- 包含置顶文章
- 不同阅读时长和浏览量

#### 3. 评论数据
- 每篇文章2-5条评论
- 包含回复评论（parent_id）
- 包含已审核/未审核状态
- 多个不同作者的评论

#### 4. 留言数据
- 20条留言数据
- 包含弹幕样式
- 包含回复
- 包含点赞数据
- 不同时间戳

#### 5. 友链数据
- 8-10个友情链接
- 包含推荐友链 (is_featured=true)
- 包含favicon
- 不同优先级

#### 6. 订阅数据
- 15-20个订阅记录
- 部分已验证/未验证
- 部分已激活/已取消

#### 7. 时间轴数据
- 10-15个时间轴事件
- 不同类型：里程碑、成就、项目、荣誉
- 不同日期分布
- 包含图标和颜色

#### 8. 打字机内容数据
- 5-8条打字机文字
- 不同优先级
- 全部激活

#### 9. 作品集数据
- 5-8个相册/项目
- 包含特色相册
- 关联图片

#### 10. 分类和标签数据
- 补充分类（如：Python、前端、后端、DevOps、数据库）
- 补充标签（如：React、Vue、Node.js、TypeScript）

---

## 二、创建API测试脚本

### 文件：`backend/scripts/test_api_endpoints.py`

测试以下接口：

#### 认证接口
- POST /api/v1/auth/login
- POST /api/v1/auth/register

#### 用户接口
- GET /api/v1/users/me
- PUT /api/v1/users/me
- PUT /api/v1/users/me/password (新增)
- GET /api/v1/users/me/stats

#### 文章接口
- GET /api/v1/articles/
- GET /api/v1/articles/featured
- GET /api/v1/articles/popular
- GET /api/v1/articles/search
- GET /api/v1/articles/{id}

#### 评论接口
- GET /api/v1/comments/
- POST /api/v1/comments/
- PUT /api/v1/comments/{id}/approve

#### 友链接口
- GET /api/v1/friend-links/
- POST /api/v1/friend-links/{id}/click

#### 订阅接口
- POST /api/v1/subscriptions/
- POST /api/v1/subscriptions/unsubscribe (新增)
- GET /api/v1/subscriptions/count

#### 时间轴接口
- GET /api/v1/timeline-events/

#### 打字机内容接口
- GET /api/v1/typewriter-contents/

#### 留言接口
- GET /api/v1/messages/
- POST /api/v1/messages/
- POST /api/v1/messages/{id}/like
- POST /api/v1/messages/{id}/unlike (新增)

#### 作品集接口
- GET /api/v1/portfolios/
- GET /api/v1/portfolios/{id}/images

---

## 三、使用说明

1. **运行种子数据脚本**
```bash
cd backend
python scripts/seed_test_data.py
```

2. **运行API测试脚本**
```bash
cd backend
python scripts/test_api_endpoints.py
```

3. **启动后端服务**
```bash
cd backend
python -m uvicorn app.main:app --reload
```

4. **启动前端服务**
```bash
cd frontend
npm run dev
```

5. **验证页面展示**
- 访问首页查看文章列表
- 访问 /profile 测试密码更新
- 访问 /about 查看友链
- 访问首页查看时间轴
- 访问首页查看订阅卡片
- 访问文章详情查看评论

---

## 四、测试数据特点

- 真实感的用户名和邮箱
- 中文内容（适合中文博客）
- 合理的时间戳分布
- 关联数据正确性
- 包含边界情况数据