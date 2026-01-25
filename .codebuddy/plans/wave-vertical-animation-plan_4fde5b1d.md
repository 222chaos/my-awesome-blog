---
name: wave-vertical-animation-plan
overview: 修改 WaveStack 组件的动画效果，将水平移动改为垂直方向的上下波动，模拟真实波浪起伏效果
todos:
  - id: modify-animation-keyframes
    content: 修改 WaveStack 组件的 CSS keyframes，将 translateX 改为 translateY 实现垂直波动
    status: completed
  - id: adjust-animation-parameters
    content: 调整动画参数，优化波动幅度和 ease-in-out 曲线
    status: completed
    dependencies:
      - modify-animation-keyframes
  - id: test-animation-effect
    content: 测试多层波浪的垂直波动效果和层叠感
    status: completed
    dependencies:
      - adjust-animation-parameters
  - id: verify-theme-support
    content: 验证浅色和深色主题下的动画表现
    status: completed
    dependencies:
      - test-animation-effect
---

## 产品概述

修改 WaveStack 组件的动画效果，将当前的水平移动动画改为垂直方向的上下波动动画，以模拟真实波浪的起伏效果。

## 核心功能

- 将波浪动画从 translateX 水平移动改为 translateY 垂直上下波动
- 保持多层波浪的不同动画时长（8s、12s、16s）和相位偏移，产生层叠波动效果
- 保留主题切换功能和渐变颜色支持
- 优化波浪的视觉真实感，使其更接近自然波动
- 确保动画流畅且性能良好

## 技术栈

- 前端框架：React + TypeScript
- 样式方案：Tailwind CSS + Inline Styles + Styled JSX
- 动画实现：CSS Keyframes

## 架构设计

### 系统架构

这是一个单组件修改任务，无需涉及系统架构调整。WaveStack 组件使用 CSS 动画实现波浪效果，修改主要集中在动画定义和样式应用上。

### 模块划分

- **WaveStack 组件**：波浪堆叠组件，负责渲染多层波浪并应用动画效果
- **动画定义**：通过 styled JSX 定义 CSS keyframes 动画
- **主题适配**：根据当前主题（dark/light）调整波浪颜色

### 数据流

主题上下文（theme-context）→ WaveStack 组件 → 判断主题 → 应用对应颜色和渐变 → 渲染多层 SVG 波浪 → 应用 CSS 动画

## 实现细节

### 核心目录结构

对于现有项目的修改，只显示需要修改的文件：

```
frontend/src/components/ui/
└── WaveStack.tsx  # 修改：调整动画关键帧和动画参数
```

### 关键代码结构

**动画关键帧定义**：需要将 translateX 改为 translateY，调整动画路径以模拟真实波浪起伏。

```typescript
// 修改前的水平移动动画
@keyframes wave-move-scale {
  0% { transform: translateX(0) scaleX(var(--scale-x, 1)); }
  100% { transform: translateX(-50%) scaleX(var(--scale-x, 1)); }
}

// 修改后的垂直波动动画
@keyframes wave-vertical {
  0%, 100% { transform: translateY(0) scaleX(var(--scale-x, 1)); }
  50% { transform: translateY(-20px) scaleX(var(--scale-x, 1)); }
}
```

**波浪层级参数**：保持现有的多层波浪差异化参数。

```typescript
const scaleX = 1 + index * 0.1;  // 水平缩放
const animationDuration = 8 + index * 4;  // 动画时长：8s, 12s, 16s
const bottomPosition = -(index * 20);  // 垂直位置偏移
const opacity = 1 - index * 0.15;  // 透明度递减
```

### 技术实现方案

**问题1：如何实现垂直波动动画**

- 将 keyframes 中的 translateX 改为 translateY
- 使用 0% → 50% → 100% 的三阶段关键帧，实现先上后下的波动效果
- 通过不同的 translateY 值控制波动幅度

**问题2：如何保持多层波浪的层叠效果**

- 保持各层波浪不同的 animationDuration（8s、12s、16s）
- 通过 duration 差异自然产生相位偏移
- 保持各层不同的 scaleX、opacity 和 bottomPosition 参数

**问题3：如何优化视觉真实感**

- 调整 translateY 的波动幅度，避免过于夸张
- 保持波浪的透明度递减，增强深度感
- 确保动画曲线使用 ease-in-out 使波动更自然

**实现步骤**：

1. 修改 CSS keyframes，将 translateX 改为 translateY
2. 调整动画名称引用，从 wave-move-scale 改为新的动画名
3. 测试动画效果，调整波动幅度和时长参数
4. 验证主题切换和多层叠加效果

**测试策略**：

- 浅色主题下验证白色波浪的垂直波动效果
- 深色主题下验证渐变波浪的垂直波动效果
- 检查多层波浪的同步性和层次感
- 确认动画在不同浏览器中的兼容性

### 技术考虑

**性能优化**

- 使用 transform 属性实现动画，触发 GPU 加速
- 避免使用 position 或 margin 等会引起重排的属性
- 动画时长较长（8-16秒），减少频繁重绘

**兼容性**

- CSS transform: translateY 广泛支持现代浏览器
- 使用标准的 CSS keyframes 语法
- 保留原有的 fallback 样式结构

**可维护性**

- 保持组件接口不变，仅调整内部实现
- 保留动画参数的可配置性（waveCount、className）
- 代码结构清晰，易于后续调整参数