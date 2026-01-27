---
name: friend-link-corner-expand-animation
overview: 修改友情链接卡片动画，实现角部扩展效果并适配项目主题
design:
  architecture:
    framework: react
  styleKeywords:
    - Tech Modern
    - Corner Expansion
    - Glassmorphism
    - Smooth Transition
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 16px
      weight: 500
    subheading:
      size: 14px
      weight: 400
    body:
      size: 12px
      weight: 400
  colorSystem:
    primary:
      - "#2563EB"
      - "#3B82F6"
    background:
      - rgba(255, 255, 255, 0.7)
      - rgba(0, 0, 0, 0.7)
    text:
      - "#FFFFFF"
    functional:
      - "#60A5FA"
todos:
  - id: explore-css-patterns
    content: 使用 [subagent:code-explorer] 探索项目中的动画和样式组织模式
    status: completed
  - id: update-component-interface
    content: 修改 FriendLinkCard 组件，添加 cornerAnimation prop 并移除 animatedBackground 相关代码
    status: completed
    dependencies:
      - explore-css-patterns
  - id: add-corner-styles
    content: 在 globals.css 中添加角部扩展动画样式定义
    status: completed
    dependencies:
      - update-component-interface
  - id: implement-component-logic
    content: 在 FriendLinkCard 组件中实现角部动画的条件渲染和类名应用
    status: completed
    dependencies:
      - add-corner-styles
  - id: test-animation
    content: 测试角部扩展动画在不同主题下的视觉效果
    status: completed
    dependencies:
      - implement-component-logic
---

## Product Overview

修改友情链接卡片的动画效果，将当前的渐变、流光和扫光效果替换为角部扩展动画，实现更加独特的视觉交互体验。

## Core Features

- 使用 ::before 和 ::after 伪元素实现角部扩展动画
- 右上角和左下角初始显示20%大小的装饰元素
- 悬停时角部元素扩展至100%并填满卡片
- ::after 元素悬停时显示"HELLO"文本
- 保持玻璃态效果、悬停上移和发光效果
- 适配深色/浅色模式和科技主题色

## Tech Stack

- 前端框架: Next.js + React + TypeScript
- 样式方案: Tailwind CSS + CSS Module
- 组件位置: `frontend/src/components/ui/FriendLinkCard.tsx`

## Tech Architecture

### System Architecture

组件采用单层架构，通过 CSS 伪元素实现角部扩展动画效果。使用 Tailwind CSS 类名和自定义 CSS 样式相结合的方式。

### Module Division

- **FriendLinkCard 组件**: 主要卡片容器，负责基础布局和样式
- **CSS 动画样式**: 角部扩展动画的核心实现
- **主题适配**: 根据深色/浅色模式调整动画颜色

### Data Flow

组件 props → CSS 类名组合 → 伪元素动画 → 视觉效果

## Implementation Details

### Core Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── FriendLinkCard.tsx  # 修改：添加角部扩展动画实现
│   └── styles/
│       └── globals.css              # 修改：添加角部扩展动画样式
```

### Key Code Structures

**角部扩展动画样式定义**:

```css
/* ::before 元素 - 右上角 */
.friend-link-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 20%;
  background: var(--tech-cyan);
  border-radius: 0 0 0 100%;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

/* ::after 元素 - 左下角 + 文本 */
.friend-link-card::after {
  content: 'HELLO';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 20%;
  height: 20%;
  background: var(--tech-sky);
  border-radius: 100% 0 0 0;
  color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

/* 悬停状态 */
.friend-link-card:hover::before {
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
}

.friend-link-card:hover::after {
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  color: white;
}
```

### Technical Implementation Plan

1. **问题陈述**: 将现有的 animatedBackground 渐变流光效果替换为角部扩展动画
2. **解决方案**: 使用 CSS 伪元素实现角部扩展，配合 Tailwind 类名管理
3. **关键实现**: 

- 移除现有的 animatedBackground 渲染逻辑
- 添加 cornerAnimation prop
- 使用 CSS 类控制角部动画
- 确保内容 z-index 高于伪元素

4. **实现步骤**:

- 修改 FriendLinkCard 组件接口，添加 cornerAnimation prop
- 移除 animatedBackground 相关的 JSX 代码
- 添加条件类名实现角部动画
- 在 globals.css 中添加角部扩展动画样式
- 添加深色/浅色模式的颜色适配

5. **测试策略**:

- 验证悬停时角部正确扩展
- 检查文本"HELLO"正确显示
- 确保深色/浅色模式下颜色适配正确
- 测试动画过渡流畅性

### Integration Points

- 保持与现有组件 API 兼容
- 继续支持 hoverEffect 和 glowEffect
- 与主题系统集成，使用 CSS 变量动态调整颜色

## Design Style

采用现代科技感设计，结合玻璃态效果与动态角部扩展动画。动画风格简洁而富有科技感，通过角部元素的渐进扩展展现独特的视觉层次。

### 角部扩展动画设计

- 初始状态：右上角和左下角各有一个小三角形装饰，尺寸为卡片的20%
- 角落形状：右上角使用 `border-radius: 0 0 0 100%`，左下角使用 `border-radius: 100% 0 0 0`
- 悬停交互：两个角落同时扩展至100%大小，圆角变为卡片圆角(0.75rem)
- 文本揭示：左下角扩展时显示"HELLO"文本，白色高对比度
- 过渡效果：使用 `cubic-bezier(0.4, 0, 0.2, 1)` 缓动函数，持续0.5秒
- 颜色适配：深色模式下使用更亮的主题色，浅色模式使用标准主题色

### 视觉层次

- 伪元素层级(z-index: 0)：作为背景动画层
- 内容层级(z-index: 10)：确保链接图标和文字始终可见
- 扩展时伪元素作为全屏背景，内容浮于上层

### 主题适配

- 浅色模式：右上角使用 tech-cyan (#2563eb)，左下角使用 tech-sky (#3b82f6)
- 深色模式：使用更亮的变体，tech-lightcyan (#60a5fa) 和 tech-cyan (#2563eb)
- 保持玻璃态效果：背景透明度和模糊效果与现有设计一致

## Agent Extensions

- **code-explorer**
- Purpose: 探索项目现有的 CSS 动画模式和样式组织结构
- Expected outcome: 了解当前动画实现方式，确保新动画与现有样式系统兼容