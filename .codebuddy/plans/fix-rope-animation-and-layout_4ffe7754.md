---
name: fix-rope-animation-and-layout
overview: 修复hover动画重置和绳子布局问题：1)使用单一动画避免duration变化导致重置；2)调整布局让绳子从顶部开始连接到底部
todos:
  - id: fix-hover-animation
    content: 修复hover动画重置问题，保持恒定动画时长
    status: completed
  - id: fix-rope-layout
    content: 调整绳索布局，让绳子从顶部开始延伸
    status: completed
  - id: test-animation-smooth
    content: 测试hover动画平滑过渡
    status: completed
    dependencies:
      - fix-hover-animation
  - id: test-layout-position
    content: 测试绳子位置和摇摆效果
    status: completed
    dependencies:
      - fix-rope-layout
---

## 问题概述

修复绳索主题切换器的两个问题：

1. Hover时动画重置：CSS变量--swing-duration从4s变为2s导致动画重新开始
2. 绳索布局未从顶部延伸：绳子应从导航栏顶部开始连接到底部，当前从底部开始

## 核心功能

- 保持动画时长恒定，避免duration变化导致重置
- 通过transform叠加增加hover时的摇摆强度
- 调整布局让绳子从顶部开始延伸到底部

## 技术栈

- 前端框架：React + TypeScript
- 样式：Tailwind CSS + 自定义CSS动画

## 修复方案

### 问题1：动画重置修复

**问题分析**：

- `rope-theme-toggler.tsx`第146行动态修改`--swing-duration`（4s↔2s）
- CSS动画时长改变会触发动画重置
- `globals.css`第491-492行使用该变量控制摇摆动画

**解决方案**：

1. 保持`--swing-duration`恒定为4s
2. 在hover时增加`--swing-angle`的变化范围（-3deg → -5deg）
3. 通过角度变化增强hover时的摇摆效果，而非改变速度

### 问题2：布局调整修复

**问题分析**：

- `rope-theme-toggler.tsx`第132行使用`justify-end`让绳子靠底
- `Navbar.tsx`第108行使用`absolute top-16`定位在导航栏下方
- 绳子固定点应从顶部开始向下延伸

**解决方案**：

1. 移除`rope-container`的`justify-end`类
2. 改为`justify-start`或使用默认布局
3. 确保`transform-origin: top center`生效，让摇摆从顶部固定点开始
4. 调整容器位置让绳子顶部与导航栏底部对齐

## 实现细节

### 核心修改点

**rope-theme-toggler.tsx**：

- 第132行：修改布局类
- 第146行：移除duration变化，只保留angle变化
- 第145行：调整angle的hover变化范围

**Navbar.tsx**：

- 第108行：调整位置让绳子顶部对齐导航栏底部

**globals.css**：

- 第491-492行：确保animation正确应用变量