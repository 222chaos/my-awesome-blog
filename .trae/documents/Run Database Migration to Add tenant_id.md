## 运行数据库迁移添加tenant_id字段

### 问题分析
迁移文件`009_add_llm_tables.py`已经存在，包含添加`tenant_id`到users表的逻辑，但未运行。

### 解决方案
直接使用Python运行迁移

```bash
cd backend
python -c "
from alembic.config import Config
from alembic import command
from app.core.database import engine

# Upgrade to head
cfg = Config()
cfg.set_main_option('sqlalchemy.url', str(engine.url))
command.upgrade(cfg, 'head')
"
```