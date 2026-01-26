---
name: fix-hero-section-position
overview: 调整HeroSection组件位置，移除负边距使其从页面顶部开始，同时确保导航栏在HeroComponent上层
todos:
  - id: remove-negative-margin
    content: 移除HeroSection组件第17行的-mt-16负边距
    status: completed
  - id: verify-layout
    content: 验证页面布局和导航栏层级显示效果
    status: completed
    dependencies:
      - remove-negative-margin
---

## 产品概述

修复HeroSection组件的定位问题，确保页面布局正确显示。

## 核心功能

- 移除HeroSection组件的负边距（-mt-16）
- 确保HeroSection从页面顶部开始显示，而不是向上偏移
- 保持导航栏在HeroComponent上层的显示效果（z-index已正确设置）

## 技术栈

- 前端框架：React + TypeScript
- 样式方案：Tailwind CSS
- 目标组件：frontend/src/components/home/HeroSection.tsx

## 架构设计

### 系统架构

修改范围限定在单个组件，不涉及架构变更。

### 修改说明

当前HeroSection组件存在负边距导致定位偏移问题：

- **问题位置**：HeroSection.tsx 第17行的className包含`-mt-16`
- **影响**：组件向上偏移64px（16 * 4px），导致布局错位
- **解决方案**：移除`-mt-16`类名，保留其他样式

### 层级关系

- Navbar（z-[100]）：导航栏保持在最上层
- HeroSection（无z-index）：主区域不设置层级，使用相对定位
- Hero内容区域（z-20）：内容区域确保在视频背景之上

## 实施细节

### 核心目录结构

```
frontend/src/components/home/
└── HeroSection.tsx  # 修改目标文件
```

### 关键代码结构

**修改前的className（第17行）**：

```
className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-start pt-24 overflow-hidden -mt-16"
```

**修改后的className**：

```
className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-start pt-24 overflow-hidden"
```

### 技术实施计划

1. **问题分析**：定位负边距的具体位置和影响范围
2. **代码修改**：移除HeroSection第17行的`-mt-16`类名
3. **验证测试**：检查页面布局是否正确，导航栏是否保持在上层

### 集成点

- 无外部依赖
- 不影响其他组件
- 纯样式层面修改

## 技术考量

### 性能优化

- 无性能影响，纯样式修改

### 安全措施

- 不涉及安全性问题

### 可扩展性

- 移除负边距后，组件定位更加清晰和可维护