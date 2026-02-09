# 修复 ImageTrail 组件不能显示动画效果的问题

## 问题根源
所有 8 个 Variant 类（Variant1-8）在构造函数中都将 `isRunning` 设置为 `true`，导致 `handlePointerMove` 中的条件 `if (!this.isRunning)` 永远不满足，`render()` 方法永远不会被调用，图片动画无法启动。

## 修复方案

将所有 8 个 Variant 类的 `isRunning` 初始值从 `true` 改为 `false`：

### 需要修复的类：
1. ImageTrailVariant1 - 第 363 行
2. ImageTrailVariant2 - 第 506 行
3. ImageTrailVariant3 - 第 363 行
4. ImageTrailVariant4 - 第 666 行
5. ImageTrailVariant5 - 第 820 行
6. ImageTrailVariant6 - 第 820 行
7. ImageTrailVariant7 - 第 994 行
8. ImageTrailVariant8 - 第 1070 行

### 修复逻辑
```typescript
// 修改前
this.isRunning = true;

// 修改后
this.isRunning = false;
```

这样首次鼠标移动时，`if (!this.isRunning)` 条件会满足，启动渲染循环，图片动画才能正常工作。