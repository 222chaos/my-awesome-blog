## 修复构建错误

**问题分析**
- StatsPanel.tsx 使用命名导入 `import { ArticleCardSkeleton } from './ArticleCardSkeleton'`
- 但 ArticleCardSkeleton.tsx 使用的是默认导出 `export default function ArticleCardSkeleton`
- 导致构建时找不到命名导出

**修复方案**
修改 StatsPanel.tsx 第 8 行的导入方式：
```typescript
// 从命名导入改为默认导入
- import { ArticleCardSkeleton } from './ArticleCardSkeleton'
+ import ArticleCardSkeleton from './ArticleCardSkeleton'
```

这样与同一文件中的其他导入（如 FriendLinks、ProfileCard）保持一致。