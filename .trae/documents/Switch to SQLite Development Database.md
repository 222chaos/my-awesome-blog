## 修复数据库模式不匹配 - 运行数据库迁移

### 问题分析
错误：`字段 users.tenant_id 不存在`

User模型包含`tenant_id`字段，但数据库表结构不匹配，需要运行Alembic迁移。

### 解决方案

**1. 检查并运行数据库迁移**
```bash
cd backend
python -m alembic upgrade head
```

**2. 如果迁移失败，创建新的迁移**
```bash
cd backend
python -m alembic revision --autogenerate -m "add tenant_id to users"
python -m alembic upgrade head
```

**3. 如果数据库连接问题，切换到SQLite开发环境**
修改 `backend/.env`：
```bash
DATABASE_URL=sqlite:///./my_awesome_blog.db
```