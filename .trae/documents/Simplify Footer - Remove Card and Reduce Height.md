## 简化Footer样式 - 移除卡片和减少高度

### 修改文件
`frontend/src/components/navigation/Footer.tsx`

### 修改内容
1. 移除 `GlassCard` 卡片包装，只保留文字
2. 移除多余的 padding（`pt-16 pb-8`）
3. 简化为纯文字显示

### 修改后的代码
```tsx
'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background py-4">
      <p className="text-muted-foreground text-sm text-center">
        © {currentYear} 我的优秀博客. 保留所有权利。
      </p>
    </footer>
  );
}
```

### 预期效果
- Footer 不占据额外页面高度
- 只显示版权文字，没有卡片背景
- 保持简洁的底部文字