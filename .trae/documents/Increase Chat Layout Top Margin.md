## 增加聊天页面顶部偏移以避开导航栏

### 问题分析
- 导航栏使用 `h-16`（64px）但可能有额外padding或box-shadow
- 当前 `mt-16` 可能不够，需要增加偏移量

### 解决方案
将 ChatLayout 的顶部偏移从 `mt-16` 改为 `mt-20`（80px），增加16px的缓冲空间

**修改 `frontend/src/components/chat/ChatLayout.tsx` 第12行**

```tsx
// 修改前
<div className="flex h-[calc(100vh-4rem)] w-full mt-16 overflow-hidden bg-black text-white selection:bg-cyan-500/30">

// 修改后
<div className="flex h-[calc(100vh-4rem)] w-full mt-20 overflow-hidden bg-black text-white selection:bg-cyan-500/30">
```