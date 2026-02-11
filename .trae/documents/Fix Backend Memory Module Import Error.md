## 修复后端启动错误 - 移除不存在的memory模块导入

### 问题分析
`backend/app/services/memory_service.py` 导入了不存在的模块：
- `app.memory.short_term`
- `app.memory.long_term`  
- `app.memory.vector_store`

这些模块在项目中不存在，导致后端无法启动。

### 解决方案
修改 `backend/app/services/memory_service.py`，移除不存在的模块导入和相关代码：

**修改内容：**
1. 移除第19-21行的导入
2. 移除第30-33行的相关初始化
3. 简化服务类，只保留基本的数据库操作功能

**修改后的代码：**
```python
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.schemas.memory import (
    MemoryCreate,
    MemoryUpdate,
    Memory,
    MemoryListResponse,
    MemorySearchRequest,
    MemorySearchResponse,
    MemoryStats,
    MemoryBatchCreate,
)
from app.crud import memory as memory_crud
from app.utils.logger import app_logger

class MemoryService:
    """
    记忆服务类
    """

    def __init__(self):
        pass
    # ... 其余方法保持不变，但移除vector_store相关调用
```

具体需要移除或注释掉的行：
- 第30-33行的初始化代码
- 第64行的`await self._add_to_vector_store(memory, tenant_id, user_id)`
- 第82-94行的`_add_to_vector_store`方法
- 第279-280行的`await self._add_to_vector_store`调用
- 第320行、第335行、第352行、第367行中对`short_term`和`long_term`的调用