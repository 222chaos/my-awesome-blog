# 数据库初始化说明

## 概述

本项目提供了多种数据库初始化脚本，用于创建数据库表结构和初始化基础数据。

## 脚本说明

### 1. init_db_simple.py
- **位置**: `scripts/init_db_simple.py`
- **功能**: 简单的数据库表结构初始化
- **特点**: 
  - 创建所有数据表
  - 不包含用户创建功能（避免密码长度问题）
  - 适合首次部署

### 2. init_db_complete.py
- **位置**: `scripts/init_db_complete.py`
- **功能**: 完整的数据库初始化，包括基础数据
- **特点**:
  - 创建所有数据表
  - 创建管理员用户
  - 包含示例数据

### 3. init_db_basic.py
- **位置**: `scripts/init_db_basic.py`
- **功能**: 基础数据库表结构初始化
- **特点**:
  - 最简单的初始化脚本
  - 仅创建表结构

## 使用方法

### 方法一：使用批处理脚本（推荐）
```bash
# Windows
init_db.bat
```

### 方法二：直接运行Python脚本
```bash
# 运行简单初始化
python scripts/init_db_simple.py

# 或运行完整初始化
python scripts/init_db_complete.py
```

### 方法三：使用Alembic迁移
```bash
# 应用所有迁移（推荐用于已有数据库）
alembic upgrade head
```

## 注意事项

1. **环境配置**：确保已正确配置`.env`文件中的数据库连接信息
2. **依赖安装**：确保已安装所有依赖包
3. **权限问题**：确保数据库用户有足够的权限创建表和数据库
4. **密码长度**：PostgreSQL的bcrypt限制密码长度为72字节

## 故障排除

### 常见错误及解决方案

1. **数据库连接错误**
   - 检查数据库服务是否运行
   - 检查数据库连接字符串是否正确
   - 检查用户名密码是否正确

2. **权限错误**
   - 确保数据库用户有创建表的权限
   - 检查数据库是否存在

3. **编码错误**
   - 确保数据库字符集为UTF-8

## 生产环境部署

在生产环境中，请注意：

1. 使用强密码替换默认密码
2. 确保数据库备份策略
3. 使用SSL连接数据库
4. 定期更新依赖包

## 数据库结构

初始化完成后，将创建以下主要表：

- `users`: 用户表
- `articles`: 文章表
- `comments`: 评论表
- `categories`: 分类表
- `tags`: 标签表
- `friend_links`: 友情链接表
- `portfolios`: 作品集表
- `timeline_events`: 时间线事件表
- `subscriptions`: 订阅表
- `images`: 图片表
- `typewriter_contents`: 打字机内容表
- `request_logs`: 请求日志表