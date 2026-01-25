---
name: modify-hero-section-styles
overview: 修改 HeroSection 的卡片样式：减小尺寸、浅灰色背景、白色字体、移除边框、增强模糊效果
design:
  architecture:
    framework: react
  styleKeywords:
    - Minimalism
    - Flat Design
    - Glassmorphism
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 32px
      weight: 600
    subheading:
      size: 18px
      weight: 500
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#FFFFFF"
    background:
      - "#E5E7EB"
    text:
      - "#FFFFFF"
    functional:
      - "#FFFFFF"
todos:
  - id: read-hero-section
    content: 读取 HeroSection.tsx 文件内容，了解当前卡片样式实现
    status: completed
  - id: modify-card-styles
    content: 修改卡片样式：减小尺寸、浅灰色背景、白色字体、移除边框、增强模糊效果
    status: completed
    dependencies:
      - read-hero-section
  - id: verify-styles
    content: 验证样式修改效果，确保符合需求
    status: completed
    dependencies:
      - modify-card-styles
---

## 产品概述

修改 HeroSection 组件中的卡片样式，优化视觉呈现效果

## 核心功能

- 调整 HeroSection 中卡片的尺寸，使其更紧凑
- 将卡片背景色改为浅灰色
- 将卡片内的字体颜色改为白色
- 移除卡片的边框样式
- 增强卡片的模糊效果，提升视觉层次

## 技术栈

- 前端框架: Next.js (React)
- 样式方案: Tailwind CSS
- 目标文件: frontend/src/components/home/HeroSection.tsx

## 架构设计

这是一个样式微调任务，不涉及架构变更。直接修改 HeroSection 组件中的 Tailwind CSS 类名和内联样式。

## 实现细节

### 修改范围

修改 `frontend/src/components/home/HeroSection.tsx` 文件中的卡片组件样式：

1. **尺寸调整**: 减小卡片 width、height、padding 等尺寸属性
2. **背景色**: 将背景从当前颜色改为浅灰色（如 bg-gray-200/gray-300 或 hex 值）
3. **字体颜色**: 将文本颜色改为白色（text-white）
4. **移除边框**: 删除 border、border-width、border-color 相关类名
5. **增强模糊效果**: 增加 backdrop-blur 值或添加额外的模糊效果（如 blur-sm、blur-md、backdrop-blur-md 等）

### 实现方案

```typescript
// 示例样式调整（具体实现需根据当前代码调整）
<div className="
  w-auto h-auto p-4              // 减小尺寸
  bg-gray-200                    // 浅灰色背景
  text-white                     // 白色字体
  backdrop-blur-lg blur-md       // 增强模糊效果
  // 移除所有 border 相关类名
">
```

## 设计说明

这是一个样式微调任务，不是创建新UI。设计方向为：

- 更紧凑的卡片布局
- 柔和的浅灰色背景搭配白色文字
- 移除边框后的扁平化风格
- 增强的模糊效果营造现代感