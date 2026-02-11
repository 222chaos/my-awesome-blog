## 修复 API_BASE_URL 导入错误

### 🔍 问题分析

错误信息显示：
```
Export API_BASE_URL doesn't exist in target module
```

**原因**: `env.ts` 只导出了 `env` 对象，没有直接导出 `API_BASE_URL`。

在 `articles.ts` 和 `typewriter.ts` 中，我错误地使用了：
```typescript
import { API_BASE_URL } from '@/lib/env';
```

但 `env.ts` 的实际导出是：
```typescript
export { env };
```

### 🛠 修复方案

需要修改两个文件：

#### 1. 修改 `frontend/src/lib/api/articles.ts`
```typescript
// 错误的导入
import { API_BASE_URL } from '@/lib/env';

// 正确的导入
import { env } from '@/lib/env';

// 使用时改为
const API_BASE_URL = env.NEXT_PUBLIC_API_URL || 'http://localhost:8989/api/v1';
```

#### 2. 修改 `frontend/src/lib/api/typewriter.ts`
```typescript
// 错误的导入
import { API_BASE_URL } from '@/lib/env';

// 正确的导入
import { env } from '@/lib/env';

// 使用时改为
const API_BASE_URL = env.NEXT_PUBLIC_API_URL || 'http://localhost:8989/api/v1';
```