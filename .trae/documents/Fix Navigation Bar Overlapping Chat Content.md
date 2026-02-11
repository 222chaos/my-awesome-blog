## 修复导航栏遮挡对话页面内容

### 修改文件
`frontend/src/components/chat/ChatLayout.tsx`

### 修改内容
在第12行的根容器div上添加`pt-16`类名，为固定导航栏留出64px的顶部空间：

```tsx
// 修改前
<div className="flex h-screen w-full overflow-hidden bg-black text-white selection:bg-cyan-500/30">

// 修改后
<div className="flex h-screen w-full pt-16 overflow-hidden bg-black text-white selection:bg-cyan-500/30">
```

### 预期效果
- 对话页面内容将从导航栏下方开始显示
- 不会被固定导航栏遮挡
- 不影响其他页面的显示（因为这是ChatLayout组件的内部样式）