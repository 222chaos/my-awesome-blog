# 修复 Loader 组件导入错误

## 问题分析
`Loader` 组件使用的是 `export default`，但 `articles/page.tsx` 中使用了命名导入 `{ Loader }`，导致编译错误。

## 修复方案
修改 `frontend/src/app/articles/page.tsx` 第 13 行的导入语句：
```tsx
// 修改前（错误）：
import { Loader } from '@/components/loading/Loader';

// 修改后（正确）：
import Loader from '@/components/loading/Loader';
```

这将修复编译错误，使文章页面能够正常加载。