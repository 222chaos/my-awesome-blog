## 修复 UserLevelBadge.tsx JSX 解析错误

### 问题
第 120-132 行的内部 `motion.div` 使用了复杂的 `boxShadow` 动画数组，包含模板字符串，导致 JSX 解析器在 `transition` 属性处失败。

### 解决方案
将 `boxShadow` 动画从对象属性移到独立的数组变量中。

### 修改文件
- `frontend/src/components/messages/UserLevelBadge.tsx` - 第 108-136 行

### 具体改动
```tsx
// 添加独立的 boxShadow 动画变量
const pulseBoxShadow = [
  '0 0 0 0px rgba(0,217,255,0)',
  '0 0 0 4px rgba(0,217,255,0)',
  '0 0 0 0px rgba(0,217,255,0)'
];

// 使用变量
<motion.div
  animate={{ boxShadow: pulseBoxShadow }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```