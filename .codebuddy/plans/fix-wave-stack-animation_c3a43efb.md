---
name: fix-wave-stack-animation
overview: 修复 WaveStack 组件的动画实现问题，包括在 HeroSection 中启用动画、优化动画实现方式，并确保波浪路径的无缝循环效果
todos:
  - id: enable-hero-animation
    content: 在 HeroSection 组件中启用 WaveStack 动画
    status: completed
  - id: fix-wave-path-algorithm
    content: 修复 WaveStack 中的波浪路径生成算法
    status: completed
  - id: adjust-animation-position
    content: 将动画样式从 SVG 容器移至 g 元素
    status: completed
    dependencies:
      - fix-wave-path-algorithm
  - id: optimize-path-closure
    content: 优化波浪路径闭合方式
    status: completed
    dependencies:
      - fix-wave-path-algorithm
  - id: verify-animation-effect
    content: 验证动画流畅性和无缝循环效果
    status: completed
    dependencies:
      - enable-hero-animation
      - adjust-animation-position
---

## Product Overview

修复 WaveStack 组件的动画实现问题，包括在 HeroSection 中启用动画、优化动画实现方式，并确保波浪路径的无缝循环效果

## Core Features

- 在 HeroSection 中启用 WaveStack 动画功能
- 修复 WaveStack 组件中波浪路径生成算法，实现平滑的贝塞尔曲线
- 调整动画应用位置，从 SVG 容器移至 g 元素，提高动画流畅度
- 优化波浪路径的闭合方式，确保无缝循环效果
- 参考 Wave.tsx 和 AnimatedWave.tsx 的成功实现模式

## Tech Stack

- Frontend: React + TypeScript + Next.js
- Styling: Tailwind CSS
- Animation: CSS Keyframes (已在 globals.css 中定义)

## Tech Architecture

### System Architecture

```
HeroSection (页面组件)
    ↓ 使用
WaveStack (UI组件)
    ↓ 应用动画
SVG → g元素 → path元素
    ↓ CSS动画
wave-flow (globals.css定义)
```

### Module Division

- **WaveStack 组件**: 波浪堆叠动画组件，支持静态和动画两种模式
- **HeroSection 组件**: 使用 WaveStack 的页面区域组件
- **globals.css**: 定义 wave-flow 等动画关键帧

### Data Flow

HeroSection 传递 animated=true → WaveStack 组件检测 animated 属性 → 生成动态波浪路径 → 应用 wave-flow CSS 动画到 g 元素 → 实现波浪流动效果

## Implementation Details

### Core Directory Structure (修改文件)

```
frontend/src/
├── components/
│   ├── ui/
│   │   └── WaveStack.tsx         # 修改：修复动画实现
│   └── home/
│       └── HeroSection.tsx       # 修改：启用动画
```

### Key Code Structures

**WaveStack 修复要点**：

1. 路径生成算法：使用 `C${x - 5},${y} ${x + 5},${y} ${x + 10},${y}` 替代当前不正确的贝塞尔曲线格式
2. 动画应用位置：将 `animation` 样式从 SVG 容器移至 `<g>` 元素
3. 路径闭合优化：确保波浪路径底部正确闭合，避免动画闪烁
4. 参考 AnimatedWave.tsx 的实现模式：使用更平滑的波形计算

**HeroSection 修复要点**：
添加 `animated={true}` 属性到 WaveStack 组件调用

### Technical Implementation Plan

1. **修复波浪路径生成算法**

- 问题：当前使用 `C${x - 3.33},${y} ${x + 3.33},${y} ${x},${y}` 格式错误
- 解决方案：使用正确的三次贝塞尔曲线格式 `C${x},${y} ${x + 5},${y} ${x + 10},${y}`
- 参考 AnimatedWave.tsx 的实现方式

2. **调整动画应用位置**

- 问题：动画应用于整个 SVG 容器，导致性能问题和变形
- 解决方案：将 animation 样式移至 `<g>` 元素，与 Wave.tsx 和 AnimatedWave.tsx 保持一致
- 优势：提高性能，减少不必要的元素变换

3. **优化路径闭合**

- 问题：路径底部闭合可能导致动画不连贯
- 解决方案：使用 `L1200,${waveHeight} L1200,${waveHeight + 200} L0,${waveHeight + 200} Z` 确保底部固定
- 参考：AnimatedWave.tsx 第47行的实现

4. **启用 HeroSection 动画**

- 问题：未传递 `animated={true}` 属性
- 解决方案：在 HeroSection.tsx 第52行添加 `animated={true}`

5. **测试验证**

- 验证动画流畅性
- 确认无缝循环效果
- 检查响应式表现