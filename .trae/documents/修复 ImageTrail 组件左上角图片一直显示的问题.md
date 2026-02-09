# 修复 ImageTrail 组件左上角图片一直显示的问题

## 问题原因
1. ImageItem 初始化时没有应用默认隐藏样式（opacity: 0）
2. 第一张图片在首次触发后没有被正确隐藏
3. 容器使用 overflow-visible 可能导致意外显示

## 修复方案

### 1. 修改 ImageItem 类的构造函数
- 在构造函数中立即应用默认样式
- 确保所有图片初始状态为隐藏

### 2. 优化 ImageTrail 组件的 useEffect
- 添加 `items` 到依赖数组
- 确保图片变化时重新初始化

### 3. 调整容器样式
- 保持 overflow-visible（为了动画效果）
- 确保图片默认位置正确