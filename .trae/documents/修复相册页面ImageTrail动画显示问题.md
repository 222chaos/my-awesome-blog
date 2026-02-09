## 问题诊断：相册页面 ImageTrail 动画无法正确显示

### 问题分析

查看 `albums/page.tsx` 第250-260行的标题区域代码：

```tsx
<div className="relative p-6 sm:p-10 rounded-3xl overflow-hidden min-h-[450px]">
  <div className="absolute -top-20 -right-20 w-64 h-64 bg-tech-cyan/20 rounded-full blur-3xl" />
  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20" />
  
  <div className="absolute inset-0 z-0 overflow-hidden h-full w-full">
    <ImageTrail 
      items={albums.map(album => album.coverImage)}
      variant={3}
    />
  </div>
```

### 根本原因

**外层容器的 `overflow-hidden` 裁剪了 ImageTrail 动画**

1. **父容器限制**：第250行的 `overflow-hidden` 会裁剪超出边界的所有内容
2. **动画特性**：ImageTrail 的动画需要移出容器边界才能显示完整的拖尾效果
3. **图片尺寸**：ImageTrail 组件中的图片是 `w-[280px] aspect-[1.1]`，可能超出容器

### 具体问题

**ImageTrailVariant3 (variant=3) 的动画特点**（第302-430行）：
- 图片会从 `scale: 0` 放大到 `scale: 1`
- 然后移动到 `xPercent: () => gsap.utils.random(-30, 30)`
- 最终移动到 `yPercent: -200`（向上移动200%）
- 这些动画都需要超出容器边界

**容器布局导致的限制**：
```tsx
<div className="relative p-6 sm:p-10 rounded-3xl overflow-hidden min-h-[450px]">
  {/* overflow-hidden 会裁剪所有动画 */}
```

### 解决方案

**修改文件**：`frontend/src/app/albums/page.tsx`

**方案1：移除外层容器的 overflow-hidden**（推荐）
```tsx
// 第250行，移除 overflow-hidden
<div className="relative p-6 sm:p-10 rounded-3xl min-h-[450px]">
```

**方案2：为 ImageTrail 容器设置 overflow-visible**
```tsx
// 第255行，将 overflow-hidden 改为 overflow-visible
<div className="absolute inset-0 z-0 overflow-visible h-full w-full">
  <ImageTrail 
    items={albums.map(album => album.coverImage)}
    variant={3}
  />
</div>
```

**方案3：调整容器尺寸和 z-index**
```tsx
// 增加 ImageTrail 容器的尺寸，确保动画有足够空间
<div className="absolute -inset-4 z-0 overflow-visible h-[calc(100%+2rem)] w-[calc(100%+2rem)]">
  <ImageTrail 
    items={albums.map(album => album.coverImage)}
    variant={3}
  />
</div>
```

### 推荐方案

**方案1 + 方案2 组合**：
1. 移除外层容器的 `overflow-hidden`
2. 为 ImageTrail 容器设置 `overflow-visible`
3. 保持其他样式不变

这样既保证了动画完整显示，又不会影响其他布局。