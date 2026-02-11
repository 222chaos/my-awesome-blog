## 修复ModelSelector重复key错误

### 问题分析
`model.id` 可能重复，导致React警告：
- API返回的模型可能用`name`作为id
- 不同provider可能有相同的name

### 解决方案
**修改 `frontend/src/components/chat/ModelSelector.tsx`**

使用组合key `${model.provider}_${model.name}` 确保唯一性：

```tsx
// 修改第64行
<button
  key={`${model.provider}_${model.name}`}
  onClick={() => {
    onSelect(model.id);
    setIsOpen(false);
  }}
```

同样修改第71行的比较，使用相同的key格式：

```tsx
// 修改第71行
currentModel === model.id
  ? "bg-cyan-500/10 text-cyan-400"
  : "text-zinc-300 hover:bg-white/5 hover:text-white"
```

改为使用provider_name组合作为唯一标识：

```tsx
currentModel === `${model.provider}_${model.name}`
  ? "bg-cyan-500/10 text-cyan-400"
  : "text-zinc-300 hover:bg-white/5 hover:text-white"
```

同时也需要在ChatWindow中更新模型ID的生成方式。