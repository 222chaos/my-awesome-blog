# 修复 ArchiveDrawer 组件 Link 导入错误

## 问题分析
`ArchiveDrawer.tsx` 文件中使用了错误的方式导入 Next.js 的 `Link` 组件。Next.js 的 `Link` 是**默认导出**，不是命名导出。

## 修复方案
在 `ArchiveDrawer.tsx` 第 6 行修改导入语句：
```tsx
// 修改前（错误）：
import { Link } from 'next/link';

// 修改后（正确）：
import Link from 'next/link';
```

这将修复 "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined" 错误。