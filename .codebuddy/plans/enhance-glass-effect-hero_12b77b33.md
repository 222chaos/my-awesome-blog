---
name: enhance-glass-effect-hero
overview: 为 HeroSection 的深灰色背景添加精致的边框和光泽效果，增强毛玻璃质感
design:
  architecture:
    framework: react
    component: tdesign
  styleKeywords:
    - Glassmorphism
    - Theme-aware
    - Glow Effect
    - Modern
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 48px
      weight: 700
    subheading:
      size: 24px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#0ea5e9"
      - "#10b981"
    background:
      - rgba(255, 255, 255, 0.7)
      - rgba(10, 10, 10, 0.7)
    text:
      - "#1e3a8a"
      - "#e0f2fe"
    functional:
      - rgba(30, 58, 138, 0.15)
      - rgba(16, 185, 129, 0.15)
todos:
  - id: import-glasscard
    content: 在 HeroSection.tsx 中引入 GlassCard 组件
    status: completed
  - id: replace-container
    content: 将硬编码的 div 替换为 GlassCard 组件，配置 padding="lg" 和 glowEffect={true}
    status: completed
    dependencies:
      - import-glasscard
  - id: verify-effects
    content: 测试浅色和深色主题下的毛玻璃、边框和光泽效果
    status: completed
    dependencies:
      - replace-container
---

## 产品概述

为 HeroSection 组件的深灰色背景添加精致的边框和光泽效果，增强毛玻璃质感，使其更加符合主题设计规范。

## 核心功能

- 将硬编码的 gray-800 背景替换为主题感知的玻璃效果
- 添加精致边框，使用主题色（浅色蓝色，深色绿色）
- 添加光泽发光效果，增强视觉层次
- 保持响应式布局和动画效果
- 确保深浅色主题下都能正确显示

## 技术栈

- 前端框架：Next.js + React + TypeScript
- 样式方案：Tailwind CSS + CSS Variables
- 组件复用：GlassCard 组件

## 技术架构

### 实现方案

采用组件复用方案，使用现有的 GlassCard 组件替换当前的硬编码 div，利用组件已封装好的主题感知玻璃效果、边框和光泽功能。

### 数据流

HeroSection 组件 → GlassCard 组件 → CSS 变量（--glass-default, --glass-border, --glass-glow）→ 渲染主题适配的毛玻璃效果

## 实现细节

### 核心修改

修改 `frontend/src/components/home/HeroSection.tsx` 第 14 行，将当前硬编码的 div 替换为 GlassCard 组件。

**修改前：**

```
<div className="max-w-3xl mx-auto text-center bg-gray-800/80 backdrop-blur-md p-8 md:p-10 rounded-xl shadow-lg">
```

**修改后：**

```
<GlassCard padding="lg" hoverEffect={false} glowEffect={true} className="max-w-3xl mx-auto text-center">
```

### 技术实现计划

1. **问题陈述**：HeroSection 当前使用硬编码的 gray-800 背景色，缺少边框和光泽效果，不符合主题设计规范
2. **解决方案**：使用项目中已有的 GlassCard 组件，它已实现完整的主题感知玻璃效果
3. **关键特性**：

- 支持主题切换（浅色蓝/深色绿）
- 自动应用 CSS 变量（--glass-default, --glass-border, --glass-glow）
- 内置 blur-xl 模糊效果
- 支持光泽效果开关

4. **实现步骤**：

- 引入 GlassCard 组件
- 替换现有 div
- 调整 padding 配置
- 启用 glowEffect

5. **测试策略**：

- 验证浅色主题下的玻璃效果（蓝色边框和光泽）
- 验证深色主题下的玻璃效果（绿色边框和光泽）
- 检查主题切换时的平滑过渡
- 确认响应式布局正常

### 集成点

- 使用 `useTheme` Hook（GlassCard 内部已集成）
- CSS 变量系统（globals.css 中定义）
- Tailwind 类名系统

## 技术考虑

### 性能优化

- GlassCard 已使用 `backdrop-blur-xl`，比当前的 `backdrop-blur-md` 性能稍高但效果更佳
- 使用 CSS 变量减少重复样式计算

### 兼容性

- GlassCard 组件已在项目中广泛使用，稳定性有保障
- CSS 变量和 backdrop-filter 已有降级方案

## 代码变更范围

```
frontend/src/components/home/HeroSection.tsx
  - 引入 GlassCard 组件
  - 替换第 14 行的 div 为 GlassCard
```

## 设计风格

采用 Glassmorphism（毛玻璃）设计风格，增强 HeroSection 的视觉层次感和现代感。

## 设计内容

### 视觉效果

- **背景**：主题感知的半透明背景，浅色主题为白色半透明，深色主题为黑色半透明
- **边框**：精致的细边框，浅色主题为蓝色（rgba(30, 58, 138, 0.15)），深色主题为绿色（rgba(16, 185, 129, 0.15)）
- **光泽**：柔和的光晕效果，增强玻璃质感，浅色主题为蓝色光晕，深色主题为绿色光晕
- **模糊**：backdrop-blur-xl 产生更强的毛玻璃效果

### 交互反馈

- 光泽效果默认启用，提供微妙的视觉吸引力
- 保持原有的淡入上移动画（animate-fade-in-up）
- 响应式布局保持不变