## 修复 RealTimeStats.tsx JSX 解析错误

### 问题
第 164 行使用了复杂的 `bg-[...]` 方括号语法包含渐变，导致 JSX 解析失败。

### 解决方案
将复杂的背景样式从 `className` 移到 `style` 属性中。

### 修改文件
- `frontend/src/components/messages/RealTimeStats.tsx` - 第 164 行

### 具体改动
```tsx
// 修改前
<div className="absolute inset-0 bg-[linear-gradient(...)] z-0 bg-[length:...] opacity-20" />

// 修改后
<div className="absolute inset-0 z-0 opacity-20" 
     style={{ background: 'linear-gradient(...)', backgroundSize: '...' }} />
```