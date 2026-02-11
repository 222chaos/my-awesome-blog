## 修复聊天页面因Footer导致的外部滚动

### 问题分析
- ChatLayout 高度：`h-[calc(100vh-4rem)]`（100vh - 导航栏64px）
- Footer 在 main 外面，会占据额外空间
- 总高度超过 100vh，导致页面滚动

### 解决方案

**修改 `frontend/src/components/chat/ChatLayout.tsx`**

将高度计算改为减去导航栏（64px）和Footer（约32px）：

```tsx
// 修改前
<div className="flex h-[calc(100vh-4rem)] w-full mt-16 overflow-hidden bg-black text-white selection:bg-cyan-500/30">

// 修改后
<div className="flex h-[calc(100vh-6rem)] w-full mt-16 overflow-hidden bg-black text-white selection:bg-cyan-500/30">
```

或者更好的方案：改为动态高度，让内容自动适应

```tsx
<div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden bg-black text-white selection:bg-cyan-500/30">
```