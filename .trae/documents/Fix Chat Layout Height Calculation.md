## 修复导航栏遮挡对话页面的正确方案

### 问题分析
- 当前使用`h-screen pt-16`会导致总高度 = 100vh + 64px，超出视口
- 正确的做法是减去导航栏高度，而不是添加padding

### 修改方案
修改`frontend/src/components/chat/ChatLayout.tsx`第12行：

```tsx
// 修改前
<div className="flex h-screen w-full pt-16 overflow-hidden bg-black text-white selection:bg-cyan-500/30">

// 修改后
<div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-black text-white selection:bg-cyan-500/30">
```

### 说明
- 移除`pt-16` padding
- 使用`h-[calc(100vh-4rem)]`计算高度（4rem = 64px = 导航栏高度）
- 这样整个布局会正好占据导航栏下方的空间，不会遮挡或产生滚动