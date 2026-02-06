## 修复 RealTimeStats.tsx Hydration 错误

### 问题
1. `stats` 数组的 `change` 值在每次渲染时使用 `Math.random()` 重新计算（第 26、33、40、47 行）
2. 初始状态也使用了 `Math.random()`（第 17、20 行）
3. 这导致 SSR 和 CSR 的 HTML 不一致，触发 Hydration 错误

### 解决方案
1. 将 `stats` 数组改用 `useState` 管理
2. 使用 `useEffect` 在客户端初始化时设置随机值
3. 使用 `useEffect` 定期更新变化值，避免渲染时直接使用 `Math.random()`

### 修改文件
- `frontend/src/components/messages/RealTimeStats.tsx` - 第 16-65 行

### 具体改动
```tsx
// 使用 useState 管理 stats，避免每次渲染重新计算
const [stats, setStats] = useState<StatItem[]>([]);

// 使用 useEffect 在客户端初始化时设置值
useEffect(() => {
  setStats([
    { label: '在线用户', value: onlineUsers, change: Math.floor(Math.random() * 5) - 2, ... },
    { label: '今日留言', value: totalMessages, change: Math.floor(Math.random() * 10) + 1, ... },
    { label: '活跃度', value: `${messageRate}/min`, change: Math.floor(Math.random() * 3) - 1, ... },
    { label: '新用户', value: activeUsers, change: Math.floor(Math.random() * 2), ... }
  ]);
}, []);
```