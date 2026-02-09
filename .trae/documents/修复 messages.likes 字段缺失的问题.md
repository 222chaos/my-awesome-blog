## 修复 messages.likes 字段缺失的问题

### 问题描述
数据库表 `messages` 缺少 `likes` 字段，导致查询时出现 "字段 messages.likes 不存在" 错误。

### 修复方案
创建数据库迁移添加 `messages.likes` 字段：
1. 使用 alembic 创建迁移文件
2. 生成迁移脚本添加 `likes` 列
3. 执行迁移更新数据库

### 执行步骤
1. 进入 backend 目录
2. 运行 `alembic revision --autogenerate -m "add likes column to messages"`
3. 运行 `alembic upgrade head`