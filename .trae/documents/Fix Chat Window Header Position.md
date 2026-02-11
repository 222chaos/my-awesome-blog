## 修复聊天页面左上角被导航栏遮挡

### 问题分析
- ChatLayout 使用 `mt-16` 已向下偏移 64px
- ChatWindow 的 Header 使用 `top-4`（16px），相对于 ChatLayout 的顶部定位
- 但左上角的菜单按钮和标题仍被导航栏部分遮挡

### 解决方案
将 ChatWindow Header 的定位改为 `top-0`，使其紧贴 ChatLayout 的顶部（ChatLayout 已向下偏移导航栏高度）

**修改 `frontend/src/components/chat/ChatWindow.tsx` 第158行**

```tsx
// 修改前
<div className="absolute top-4 left-0 right-0 z-10 flex h-16 items-center justify-between px-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">

// 修改后
<div className="absolute top-0 left-0 right-0 z-10 flex h-16 items-center justify-between px-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
```