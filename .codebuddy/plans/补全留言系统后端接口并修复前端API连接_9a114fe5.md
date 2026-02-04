---
name: 补全留言系统后端接口并修复前端API连接
overview: 创建后端留言/弹幕系统接口（含模型、CRUD、API端点），并修复前端 articleService 和 messageService 以连接真实后端API替代模拟数据
todos:
  - id: create-message-model
    content: 创建后端Message模型文件 (backend/app/models/message.py)
    status: completed
  - id: create-message-schema
    content: 创建Message Pydantic Schemas (backend/app/schemas/message.py)
    status: completed
    dependencies:
      - create-message-model
  - id: create-message-crud
    content: 创建Message CRUD操作 (backend/app/crud/message.py)
    status: completed
    dependencies:
      - create-message-model
  - id: create-message-api
    content: 创建Message API端点 (backend/app/api/v1/endpoints/messages.py)
    status: completed
    dependencies:
      - create-message-schema
      - create-message-crud
  - id: update-backend-exports
    content: 更新模型和CRUD导出文件 (__init__.py)
    status: completed
    dependencies:
      - create-message-model
      - create-message-crud
  - id: register-message-router
    content: 在router.py中注册message路由
    status: completed
    dependencies:
      - create-message-api
  - id: create-alembic-migration
    content: 创建数据库迁移文件 (Alembic)
    status: completed
    dependencies:
      - create-message-model
  - id: fix-article-service
    content: 修复articleService.ts，使用真实API替代模拟数据
    status: completed
  - id: fix-message-service
    content: 修复messageService.ts，连接后端真实API
    status: completed
    dependencies:
      - create-message-api
  - id: create-frontend-api-route
    content: 创建前端API路由 (frontend/src/app/api/messages/route.ts)
    status: completed
---

## 产品概述

补全博客系统的后端接口，实现留言/弹幕功能，并修复前端服务层以使用真实API替代模拟数据。

## 核心功能

### 后端留言/弹幕模块

- 留言/弹幕数据模型设计与实现
- 完整的CRUD接口（创建、读取、更新、删除）
- 留言点赞功能
- 留言回复功能（支持嵌套回复）
- 弹幕模式开关（is_danmaku字段）
- 留言颜色自定义
- 用户等级系统

### 前端服务层修复

- articleService.ts 从模拟数据改为真实API调用
- messageService.ts 从模拟数据改为真实API调用
- 统一API客户端配置，确保端口一致（8000）
- 创建Next.js API路由处理留言请求

## Tech Stack

- **后端**: Python + FastAPI + SQLAlchemy + SQLite/PostgreSQL
- **前端**: Next.js + TypeScript + React
- **数据库迁移**: Alembic
- **API通信**: RESTful API with JWT认证

## 架构设计

### 后端架构

```
backend/app/
├── models/message.py          # 留言模型（新建）
├── schemas/message.py         # Pydantic Schemas（新建）
├── crud/message.py            # CRUD操作（新建）
├── api/v1/endpoints/messages.py  # API端点（新建）
├── api/v1/router.py           # 路由注册（修改）
├── models/__init__.py         # 模型导出（修改）
└── crud/__init__.py           # CRUD导出（修改）
```

### 前端架构

```
frontend/src/
├── services/articleService.ts    # 修复：使用真实API
├── services/messageService.ts    # 修复：使用真实API
└── app/api/messages/route.ts     # Next.js API路由（新建）
```

## 数据模型设计

### Message模型字段

- id: UUID (主键)
- content: Text (留言内容)
- color: String (弹幕颜色)
- is_danmaku: Boolean (是否弹幕显示)
- likes: Integer (点赞数)
- level: Integer (用户等级)
- created_at: DateTime
- updated_at: DateTime
- author_id: UUID (外键，关联users表)
- parent_id: UUID (自关联，支持嵌套回复)

## 接口设计

### 留言API端点

- `GET /api/v1/messages` - 获取留言列表（支持筛选弹幕消息）
- `POST /api/v1/messages` - 创建留言
- `GET /api/v1/messages/{id}` - 获取单条留言
- `PUT /api/v1/messages/{id}` - 更新留言
- `DELETE /api/v1/messages/{id}` - 删除留言
- `POST /api/v1/messages/{id}/like` - 点赞留言
- `GET /api/v1/messages/{id}/replies` - 获取回复列表
- `GET /api/v1/messages/danmaku` - 获取弹幕消息列表

### 前端API端点

- `GET /api/messages` - 前端代理获取留言
- `POST /api/messages` - 前端代理创建留言