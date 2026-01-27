# My Awesome Blog Backend - 整理后项目结构

## 总体结构

```
backend/
├── alembic/                    # 数据库迁移文件
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       ├── 001_add_new_tables.py
│       ├── 002_add_typewriter_contents_table.py
│       └── 003_migrate_to_uuid.py
├── app/                        # 主应用代码
│   ├── __init__.py
│   ├── main.py                # FastAPI应用入口
│   ├── api/                   # API路由
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py
│   │       └── endpoints/     # API端点
│   │           ├── __init__.py
│   │           ├── auth.py
│   │           ├── users.py
│   │           ├── articles.py
│   │           ├── comments.py
│   │           ├── categories.py
│   │           ├── tags.py
│   │           ├── friend_links.py
│   │           ├── portfolio.py
│   │           ├── timeline_events.py
│   │           ├── statistics.py
│   │           ├── subscriptions.py
│   │           ├── images.py
│   │           └── typewriter_contents.py
│   ├── core/                  # 核心配置和工具
│   │   ├── __init__.py
│   │   ├── config.py          # 应用配置
│   │   ├── database.py        # 数据库配置
│   │   ├── security.py        # 安全相关
│   │   └── dependencies.py    # 依赖注入
│   ├── models/                # SQLAlchemy模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── article.py
│   │   ├── comment.py
│   │   ├── category.py
│   │   ├── tag.py
│   │   ├── friend_link.py
│   │   ├── portfolio.py
│   │   ├── timeline_event.py
│   │   ├── subscription.py
│   │   ├── image.py
│   │   ├── typewriter_content.py
│   │   ├── article_category.py
│   │   └── article_tag.py
│   ├── schemas/               # Pydantic模型（数据验证）
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── article.py
│   │   ├── comment.py
│   │   ├── category.py
│   │   ├── tag.py
│   │   ├── friend_link.py
│   │   ├── portfolio.py
│   │   ├── timeline_event.py
│   │   ├── subscription.py
│   │   ├── image.py
│   │   ├── typewriter_content.py
│   │   ├── token.py
│   │   └── statistics.py
│   ├── crud/                  # 数据库CRUD操作
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── article.py
│   │   ├── comment.py
│   │   ├── category.py
│   │   ├── tag.py
│   │   ├── friend_link.py
│   │   ├── portfolio.py
│   │   ├── timeline_event.py
│   │   ├── subscription.py
│   │   ├── image.py
│   │   └── typewriter_content.py
│   ├── services/              # 业务逻辑服务
│   │   ├── __init__.py
│   │   ├── cache_service.py
│   │   ├── email_service.py
│   │   ├── image_service.py
│   │   └── statistics_service.py
│   ├── utils/                 # 工具函数
│   │   ├── __init__.py
│   │   ├── logger.py
│   │   └── middleware.py
│   ├── logs/                  # 日志文件
│   └── tests/                 # 测试文件
│       └── [测试文件]
├── scripts/                   # 脚本文件
│   ├── __init__.py
│   ├── create_admin_user.py
│   ├── run_server.py
│   ├── simple_server.py
│   ├── run_migration.py
│   ├── db_setup.py
│   ├── diagnose_db.py
│   ├── fix_db_connection.py
│   ├── run_migrations.py
│   └── update_db_config.py
├── docs/                      # 文档
│   ├── API_DOCUMENTATION.md
│   └── PROJECT_STRUCTURE.md
├── migration_scripts/         # 临时迁移脚本
│   ├── migrate_to_uuid.py
│   ├── migrate_to_uuid_complete.py
│   ├── migrate_to_uuid_final.py
│   ├── migrate_to_uuid_precise.py
│   ├── migrate_to_uuid_safe_method.py
│   └── migrate_to_uuid_safe.py
├── logs/                      # 日志输出目录
├── .env.example              # 环境变量示例
├── .gitignore
├── alembic.ini               # Alembic配置
├── requirements.txt          # 生产依赖
├── requirements-test.txt     # 测试依赖
├── Dockerfile
├── docker-compose.yml        # 如果存在
├── pytest.ini                # Pytest配置
├── PROJECT_STRUCTURE.md      # 项目结构文档
├── README.md
├── LICENSE
└── init_db.bat              # 初始化数据库脚本（Windows）
```

## 目录职责说明

### `app/api/v1/endpoints/` - API端点
存放所有API端点的路由定义，每个文件对应一个资源的CRUD操作。

### `app/models/` - 数据模型
存放SQLAlchemy模型定义，每个文件对应一个数据库表。

### `app/schemas/` - 数据模式
存放Pydantic模型，用于请求/响应数据验证和序列化。

### `app/crud/` - 数据操作
存放数据库CRUD操作函数，每个文件对应一个模型的操作。

### `app/core/` - 核心配置
存放应用的核心配置、数据库连接、安全配置等。

### `app/services/` - 业务逻辑
存放复杂的业务逻辑处理，解耦控制器和数据层。

### `app/utils/` - 工具函数
存放通用的工具函数和中间件。

### `alembic/versions/` - 数据库迁移
存放数据库结构变更的历史记录。

### `scripts/` - 脚本文件
存放各种辅助脚本，如数据库初始化、服务器启动等。

### `migration_scripts/` - 临时迁移脚本
存放开发过程中产生的临时迁移脚本，用于参考和备份。

## 文件命名规范

- Python文件使用 `snake_case.py` 格式
- 类名使用 `PascalCase` 格式
- 函数和变量使用 `snake_case` 格式
- 常量使用 `UPPER_SNAKE_CASE` 格式