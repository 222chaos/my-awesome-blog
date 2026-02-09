---
name: backend-cleanup-and-organize
overview: 清理后端无用测试文件，整理目录结构，将散乱文件归类到合适位置
todos:
  - id: create-dirs
    content: 创建scripts/init、scripts/seed、scripts/utils、scripts/tests子目录
    status: completed
  - id: move-init-scripts
    content: 移动init_db.py和init_db.bat到scripts/init/目录
    status: completed
    dependencies:
      - create-dirs
  - id: organize-seed
    content: 合并并移动数据创建脚本到scripts/seed/目录
    status: completed
    dependencies:
      - create-dirs
  - id: move-utils
    content: 移动工具脚本到scripts/utils/目录
    status: completed
    dependencies:
      - create-dirs
  - id: move-test-scripts
    content: 移动API测试脚本到scripts/tests/目录
    status: completed
    dependencies:
      - create-dirs
  - id: delete-root-tests
    content: 删除后端根目录下的临时测试文件（9个）
    status: completed
    dependencies:
      - move-test-scripts
  - id: delete-duplicate-scripts
    content: 删除scripts目录下的重复/过时脚本（15个）
    status: completed
    dependencies:
      - organize-seed
  - id: update-imports
    content: 更新被移动文件中的导入路径
    status: completed
    dependencies:
      - organize-seed
      - move-utils
  - id: verify-structure
    content: 验证目录结构正确，无导入错误
    status: completed
    dependencies:
      - update-imports
---

## 需求概述

清理后端目录结构，删除无用测试文件，整理散乱的数据脚本和工具脚本，建立清晰的目录层级。

## 核心问题

1. 后端根目录有19个散乱文件（测试脚本、数据脚本、工具脚本混杂）
2. scripts目录包含25个Python文件，存在大量重复功能的初始化脚本
3. 缺少清晰的目录分类，难以维护

## 技术方案

### 目录结构规划

```
backend/
├── app/                    # 主应用代码（保持不变）
│   ├── tests/              # 正式的pytest测试文件（保留）
│   └── ...
├── scripts/                # 脚本目录
│   ├── __init__.py
│   ├── init/               # 初始化脚本
│   │   ├── __init__.py
│   │   ├── init_db.py      # 主数据库初始化（从根目录移入）
│   │   └── init_db.bat     # Windows批处理（从根目录移入）
│   ├── seed/               # 数据填充脚本
│   │   ├── __init__.py
│   │   ├── admin.py        # 管理员创建（合并根目录create_admin_user.py）
│   │   ├── albums.py       # 相册数据（合并根目录create_rich_albums.py等）
│   │   ├── articles.py     # 文章数据
│   │   ├── categories.py   # 分类数据
│   │   ├── comments.py     # 评论数据
│   │   └── tags.py         # 标签数据
│   ├── utils/              # 工具脚本
│   │   ├── __init__.py
│   │   ├── migration_helper.py   # 迁移辅助
│   │   ├── upload_image.py       # 图片上传工具（从根目录移入）
│   │   └── upload_public_to_oss.py  # OSS上传工具（从根目录移入）
│   └── tests/              # 临时测试脚本（可选执行）
│       ├── __init__.py
│       ├── test_api_endpoints.py  # 从scripts移入
│       ├── test_auth_api.py       # 从scripts移入
│       └── test_message_api.py    # 从scripts移入
├── start_server.py         # 保留在根目录（主要入口）
├── requirements.txt        # 保留在根目录
└── requirements-test.txt   # 保留在根目录
```

### 删除文件清单

**后端根目录删除（9个）：**

- test_auth_fix.py - 临时测试脚本，功能被app/tests/覆盖
- test_login.py - 临时测试脚本，功能被app/tests/覆盖
- test_oss_upload.py - 临时测试脚本，功能单一
- check_db_tables.py - PostgreSQL专用检查，使用范围有限
- verify_data.py - 数据验证脚本，使用频率低
- create_admin_user.py - 合并到scripts/seed/admin.py
- create_test_albums.py - 合并到scripts/seed/albums.py
- create_test_articles.py - 合并到scripts/seed/articles.py
- create_test_categories.py - 合并到scripts/seed/categories.py
- create_test_comments.py - 合并到scripts/seed/comments.py
- create_test_tags.py - 合并到scripts/seed/tags.py
- create_rich_albums.py - 合并到scripts/seed/albums.py
- migration_helper.py - 移动到scripts/utils/

**scripts目录删除（15个重复/过时文件）：**

- create_admin_simple.py - 与create_admin_sql.py重复
- create_admin_sql.py - 直接使用SQL，与ORM方式重复
- create_admin_user.py - 与根目录文件重复
- create_articles_via_api.py - 临时脚本
- create_tables.py - 被init_db.py覆盖
- init_db_basic.py - 被init_db.py覆盖
- init_db_complete.py - 被init_db.py覆盖
- init_db_simple.py - 被init_db.py覆盖
- seed_danmaku.py - 特定功能，可保留或删除
- start_server.py - 与根目录重复
- fix_timeline_color.py - 一次性修复脚本
- clean_articles.py - 临时清理脚本
- check_article_covers.py - 临时检查脚本
- check_messages.py - 临时检查脚本
- replace_with_oss_images.py - 一次性迁移脚本
- update_article_covers_real.py - 一次性更新脚本
- upload_and_update_covers.py - 临时脚本