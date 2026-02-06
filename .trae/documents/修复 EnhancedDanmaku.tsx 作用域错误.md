## 修复 EnhancedDanmaku.tsx 作用域错误

### 问题
第 112 行清理函数中使用了 `delay` 变量，但该变量在 `processNext` 函数内部（第 103 行）定义，超出了作用域，导致 `delay is not defined` 错误。

### 解决方案
使用 `useRef` 存储所有 `setTimeout` ID，在清理函数中正确清除。

### 修改文件
- `frontend/src/components/messages/EnhancedDanmaku.tsx` - 第 68-114 行

### 具体改动
```tsx
// 添加 ref 存储定时器
const timersRef = useRef<NodeJS.Timeout[]>([]);

// 在 processNext 中存储定时器 ID
const timerId = setTimeout(processNext, delay);
timersRef.current.push(timerId);

// 在清理函数中清除所有定时器
return () => {
  timersRef.current.forEach(clearTimeout);
  timersRef.current = [];
};
```