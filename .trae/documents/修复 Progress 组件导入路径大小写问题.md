## 修复 Progress 组件导入错误

### 问题描述
在 `frontend/src/app/articles/[id]/page.tsx` 中导入 Progress 组件时使用了错误的路径：
- 文件名是 `progress.tsx`（小写）
- 但导入时使用 `@/components/ui/Progress`（大写）

### 修复内容
将导入语句从：
```tsx
import { Progress } from '@/components/ui/Progress';
```
改为：
```tsx
import { Progress } from '@/components/ui/progress';
```

### 修改文件
- `frontend/src/app/articles/[id]/page.tsx` (第 16 行)