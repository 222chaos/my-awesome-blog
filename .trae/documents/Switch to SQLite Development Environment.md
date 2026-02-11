## 切换到SQLite开发环境

### 问题分析
PostgreSQL数据库表结构与User模型不匹配（缺少tenant_id字段），Alembic迁移无法正常运行。

### 解决方案
切换到SQLite开发环境，它会自动创建表：

**修改 `backend/.env` 第2行**

```bash
# 修改前
DATABASE_URL=postgresql://postgres:123456@localhost:5432/my_awesome_blog

# 修改后
DATABASE_URL=sqlite:///./my_awesome_blog.db
```

**重启后端服务**
后端会自动创建SQLite数据库和所有表结构