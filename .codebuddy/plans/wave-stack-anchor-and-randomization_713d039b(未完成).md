---
name: wave-stack-anchor-and-randomization
overview: 优化波浪组件：底部固定并增加伪随机波动效果，波动幅度调整为 10-15px
todos:
  - id: fix-bottom-anchor
    content: "添加 transform-origin: bottom center 到波浪元素"
    status: pending
  - id: add-pseudo-random
    content: 实现基于索引的伪随机函数并应用到动画参数
    status: pending
  - id: adjust-amplitude
    content: 将波动幅度从 -20px 调整到 -15px
    status: pending
    dependencies:
      - add-pseudo-random
---

## 产品概述

优化 WaveStack 组件的动画效果，将波浪底部固定并增加伪随机波动特性

## 核心功能

- 波浪底部固定：使用 transform-origin: bottom center 锁定底部变换基准，避免整体向上浮动
- 伪随机波动：基于索引使用 Math.sin 等数学函数生成稳定的随机参数（页面刷新保持一致）
- 波动幅度调整：将动画幅度从 -20px 调整到 -15px 范围

## 技术栈

- React + TypeScript
- Tailwind CSS
- CSS 动画 + JavaScript 动态参数生成

## 技术架构

### 修改范围

单个组件文件：frontend/src/components/ui/WaveStack.tsx

### 修改方案

#### 1. 固定底部变换

通过设置 SVG 元素的 `transform-origin: bottom center`，确保变换基准点位于底部中心，避免波浪整体向上浮动。

#### 2. 伪随机参数生成

使用基于索引的数学函数生成稳定的随机值：

```typescript
// 伪随机函数：基于索引生成 [0, 1) 范围的稳定随机值
const pseudoRandom = (index: number) => {
  const x = Math.sin(index * 9999) * 10000;
  return x - Math.floor(x);
};

// 基于伪随机生成波动延迟和持续时间
const randomDelay = pseudoRandom(index) * 2;
const randomDuration = 3 + pseudoRandom(index * 2) * 2;
```

#### 3. 动画幅度调整

将 CSS 动画中的 `translateY(-20px)` 修改为 `translateY(-15px)`。

### 数据流

组件初始化 → 循环生成波浪 → 为每个波浪计算伪随机参数 → 应用 CSS 动画 → 渲染 SVG

## 实现细节

### 关键修改点

1. **CSS 动画更新**

- 修改 wave-float 动画的 translateY 值为 -15px
- 为波浪元素添加 transform-origin: bottom center 样式

2. **伪随机逻辑**

- 添加 pseudoRandom 工具函数
- 使用索引作为种子生成随机 animationDelay 和 animationDuration
- 确保页面刷新时参数保持一致

3. **样式调整**

- 将 transform-origin 应用于每个波浪 SVG 元素
- 保持现有的 height、bottom、opacity 等样式不变

### 技术考虑

#### 性能优化

- 使用 will-change: transform 提示浏览器优化动画
- 纯 CSS 动画确保 60fps 流畅度
- 避免在动画过程中触发布局重排

#### 兼容性

- transform-origin 在现代浏览器中广泛支持
- Math.sin 和数学运算无兼容性问题

#### 可维护性

- 伪随机函数可复用
- 参数配置集中管理，便于后续调整
- 保持代码简洁，易于理解