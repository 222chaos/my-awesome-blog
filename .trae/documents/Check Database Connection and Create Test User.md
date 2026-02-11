## 检查数据库连接和创建测试用户

### 问题分析
后端返回500错误，可能是：
1. PostgreSQL数据库未运行
2. 用户表不存在
3. 数据库连接配置问题

### 解决方案

**1. 检查PostgreSQL是否运行**
```bash
docker ps -a | findstr postgres
```

**2. 如果数据库未运行，启动Docker Compose**
```bash
docker-compose up -d
```

**3. 如果数据库运行但没有用户表，需要运行数据库迁移**
```bash
cd backend
python -m alembic upgrade head
```

**4. 或者使用SQLite开发环境**
修改 `backend/.env`：
```bash
DATABASE_URL=sqlite:///./my_awesome_blog.db
```