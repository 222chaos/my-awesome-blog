---
name: wave-animation-plan
overview: 为 WaveStack 组件添加波浪动画效果，包括水平移动动画和多层波浪的视差效果
design:
  styleKeywords:
    - Smooth
    - Fluid
    - Parallax
    - Dynamic
todos:
  - id: add-wave-animation
    content: 在 WaveStack.tsx 中添加 CSS keyframes 动画定义
    status: completed
  - id: apply-parallax-effect
    content: 为每层波浪设置不同的动画持续时间实现视差效果
    status: completed
    dependencies:
      - add-wave-animation
  - id: test-animation
    content: 测试动画在不同主题下的效果和性能
    status: completed
    dependencies:
      - apply-parallax-effect
---

## 产品概述

为 WaveStack 组件添加波浪动画效果，使静态的层叠波浪变为动态的流动波浪，增强视觉吸引力和页面的生动感

## 核心功能

- 为波浪 SVG 添加水平移动的 CSS 动画
- 为每层波浪设置不同的动画持续时间，产生视差效果
- 保持亮色/暗色主题切换的兼容性
- 动画平滑循环播放，无视觉跳跃
- 波浪动画速度适中，不影响用户体验

## 技术栈

- 前端框架：React + TypeScript
- 动画技术：CSS Keyframes
- 样式方案：Tailwind CSS + 内联样式

## 技术架构

### 动画实现方案

- 使用 CSS @keyframes 定义波浪移动动画
- 通过 transform: translateX() 实现水平位移
- 每层波浪设置不同的 animation-duration 实现视差
- 使用 infinite 实现无限循环

### 关键技术点

- 波浪动画名称：wave-move
- 动画持续时间：根据波浪层级递增（如 8s、12s、16s）
- 动画缓动函数：linear 确保匀速运动
- 动画方向：alternate 实现往返运动或直接使用无限循环

## 实现细节

### 核心目录结构

```
frontend/src/components/ui/
└── WaveStack.tsx  # 修改：添加波浪动画效果
```

### 关键代码结构

**CSS 动画定义**：

```typescript
const waveAnimation = `
  @keyframes wave-move {
    0% {
      transform: translateX(0) scaleX(${1 + index * 0.1});
    }
    100% {
      transform: translateX(-50%) scaleX(${1 + index * 0.1});
    }
  }
`;
```

**动画应用**：

```typescript
// 为每层波浪设置不同的动画持续时间
const animationDuration = `${8 + index * 4}s`;

// 在 style 中添加动画属性
style={{
  // ... 现有样式
  animation: `wave-move ${animationDuration} linear infinite`,
}}
```

## 设计风格

保持现有的简洁风格，通过动态波浪动画增强页面的活力和层次感。动画效果应该自然流畅，不会过于抢眼，而是作为背景装饰元素存在

## 动画效果

- 波浪从右向左平滑移动
- 多层波浪速度不同，产生视差深度感
- 动画循环无缝衔接
- 动画速度适中，不会让人眼花缭乱