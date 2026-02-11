## 修复聊天页面导航栏遮挡问题

### 问题分析
当前布局存在冲突：
1. `ChatLayout` 使用 `h-[calc(100vh-4rem)]`（减去导航栏64px），但内容从视口顶部开始
2. `ChatWindow` 的 Header 使用 `absolute top-0`，覆盖在导航栏上
3. 整个聊天区域需要向下偏移导航栏高度才能正确显示

### 解决方案

**修改 `frontend/src/components/chat/ChatLayout.tsx`**

在根容器上添加 `mt-16`（64px顶部外边距），让整个聊天布局向下偏移导航栏的高度：

```tsx
// 修改前
<div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-black text-white selection:bg-cyan-500/30">

// 修改后  
<div className="flex h-[calc(100vh-4rem)] w-full mt-16 overflow-hidden bg-black text-white selection:bg-cyan-500/30">
```

**修改 `frontend/src/components/chat/ChatWindow.tsx`**

调整 Header 的顶部位置，使其定位在聊天布局的顶部（而不是视口顶部）：

```tsx
// 修改前
<div className="absolute top-0 left-0 right-0 z-10 flex h-16 items-center justify-between px-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">

// 修改后
<div className="absolute top-4 left-0 right-0 z-10 flex h-16 items-center justify-between px-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
```

### 预期效果
- 整个聊天区域向下偏移 64px，不会被导航栏遮挡
- ChatWindow 的 Header 正确定位在聊天区域顶部
- 所有内容都能正确显示