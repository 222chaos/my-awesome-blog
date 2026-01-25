---
name: wave-stack-animation-optimization
overview: 为 WaveStack 组件添加基于 cubic-bezier 的弹性波浪动画，实现多层波浪的自然波动效果
design:
  architecture:
    framework: react
  styleKeywords:
    - Elastic
    - Natural Flow
    - Smooth Animation
todos:
  - id: define-animation-keyframes
    content: 在 WaveStack 组件中定义波浪浮动动画的 CSS keyframes
    status: completed
  - id: apply-animation-props
    content: 为每个波浪层添加 animation 属性，使用弹性贝塞尔曲线
    status: completed
    dependencies:
      - define-animation-keyframes
  - id: implement-phase-offset
    content: 设置不同层的相位差（animation-delay）和时长差异
    status: completed
    dependencies:
      - apply-animation-props
  - id: test-visual-effect
    content: 在不同主题和波浪数量下测试动画效果和性能
    status: completed
    dependencies:
      - implement-phase-offset
---

## Product Overview

为现有的 WaveStack 组件添加基于 cubic-bezier 的弹性波浪动画效果，实现多层波浪的自然波动，提升页面视觉动态感

## Core Features

- 添加波浪上下浮动动画，使用 cubic-bezier(0.68, -0.55, 0.265, 1.55) 实现弹性效果
- 通过不同层的相位差（animation-delay）实现波浪的自然错落波动
- 保持现有主题切换功能（暗色/亮色）
- 支持自定义波浪数量参数
- 确保动画平滑流畅，不卡顿

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS（已安装 tailwindcss-animate）
- CSS Animation API

## Implementation Details

### Key Code Structures

**CSS Animation Keyframes**: 定义波浪的上下浮动动画，结合弹性贝塞尔曲线实现自然的波动效果。

```css
@keyframes wave-float {
  0%, 100% { transform: translateY(0) scaleX(1); }
  50% { transform: translateY(-20px) scaleX(1.05); }
}
```

**Dynamic Animation Props**: 为每个波浪层设置不同的动画参数，通过相位差机制增强连续性。

```typescript
const animationDelay = index * 0.5; // 相位差
const animationDuration = 4 + index * 0.5; // 动画时长递增
```

### Technical Implementation Plan

1. **问题陈述**: 当前 WaveStack 组件为静态 SVG，需要添加弹性波浪动画
2. **解决方案**: 使用 CSS animation + cubic-bezier 自定义贝塞尔曲线，通过相位差实现多层自然波动
3. **关键技术**: Tailwind CSS animation、自定义贝塞尔曲线、React inline styles
4. **实施步骤**:

- 在 WaveStack 组件中添加 animation 属性到每个 SVG 元素
- 使用 cubic-bezier(0.68, -0.55, 0.265, 1.55) 实现弹性效果
- 为每层波浪设置不同的 animation-delay 和 duration
- 优化性能，使用 transform 而非 top/bottom 属性

5. **测试策略**: 在不同主题和波浪数量下验证动画流畅性

### Performance Optimization

- 使用 CSS transform（translateY）进行位移，触发 GPU 加速
- 避免 top/bottom 属性动画，减少重排
- 合理设置动画时长和延迟，避免过度动画导致性能问题

## Design Style

为 WaveStack 组件添加优雅的弹性动画效果，保持与现有设计系统的一致性。波浪通过自然的起伏和相位差创造出流动的视觉效果，适配暗色和亮色主题。动画应该平滑流畅，具有有机的波动感，而非机械的重复运动。

### Page Planning Rules

该任务为现有组件的动画优化，不涉及新页面创建。

### Visual Effect

- 波浪层从底部向上优雅浮动
- 多层波浪通过不同的动画时长和延迟形成自然的相位差
- 弹性贝塞尔曲线赋予波浪有机的起伏感
- 暗色模式下使用渐变色增强视觉层次
- 动画循环播放，无缝衔接