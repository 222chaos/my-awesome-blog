## 修复 articles/[id]/page.tsx 导入路径大小写错误

### 问题
第 16 行导入路径使用了小写的 `progress`，但实际文件名是 `Progress.tsx`（大写 P）

```tsx
import { Progress } from '@/components/ui/progress';  // ❌ 错误
```

### 解决方案
将导入路径改为大写的 `Progress`

```tsx
import { Progress } from '@/components/ui/Progress';  // ✅ 正确
```

### 修改文件
- `frontend/src/app/articles/[id]/page.tsx` - 第 16 行