---
name: fix-hydration-error-glass-cards
overview: 修复 GlassCard 和 FriendLinkCard 组件的 hydration 错误，通过使用 CSS 变量替代条件 className，确保服务器端和客户端渲染一致性。
todos:
  - id: fix-glasscard
    content: 修改 GlassCard.tsx 使用 CSS 变量替代条件 className
    status: completed
  - id: fix-friendlinkcard
    content: 修改 FriendLinkCard.tsx 使用 CSS 变量替代条件 className
    status: completed
---

## 产品概述

修复博客项目中 GlassCard 和 FriendLinkCard 组件的 hydration 错误问题，确保服务器端渲染和客户端渲染的一致性。

## 核心功能

- 修复 GlassCard 组件的 className 不匹配问题
- 修复 FriendLinkCard 组件的 className 不匹配问题
- 使用 CSS 变量替代条件渲染的 className，避免 SSR/CSR 不一致
- 保持原有的视觉效果和功能

## 技术栈

- 前端框架: React + TypeScript
- UI 库: Tailwind CSS
- 主题系统: 自定义 Context API 主题管理

## 技术架构

### 问题分析

当前问题源于两个因素：

1. **主题上下文初始化不一致**: theme-context.tsx 中 resolvedTheme 服务端硬编码为 'dark'，客户端可能实际为 'light'
2. **条件 className 渲染**: GlassCard 和 FriendLinkCard 根据 resolvedTheme 动态设置不同的背景不透明度（70% vs 80%）

这导致 SSR 渲染的 HTML 与 CSR 重新渲染的 className 不匹配，触发 Next.js hydration 错误。

### 解决方案

使用 CSS 变量替代条件 className，因为 CSS 变量由主题类控制，在 SSR 时能正确应用到 HTML 元素上。

**CSS 变量定义**（已存在于 globals.css）:

```css
/* 浅色模式 */
--glass-default: rgba(255, 255, 255, 0.7);

/* 深色模式 */
--glass-default: rgba(17, 17, 17, 0.7);
```

### 修改范围

仅需修改两个组件文件，删除条件背景类逻辑，统一使用 `bg-glass` 类名。

## 实施细节

### 核心代码变更

**GlassCard.tsx**:

- 删除第 26-31 行的条件 className 逻辑
- 将 `backgroundClass` 改为固定值 `'bg-glass backdrop-blur-xl'`

**FriendLinkCard.tsx**:

- 删除第 35-40 行的条件 className 逻辑
- 将 `backgroundClass` 改为固定值 `'bg-glass backdrop-blur-xl'`

### 验证策略

- 确保服务端和客户端渲染的 className 一致
- 验证主题切换时背景透明度正确响应
- 确认不再出现 hydration 错误

### 技术要点

- CSS 变量在 SSR 时作为静态值渲染，避免不匹配
- 保留 `backdrop-blur-xl` 等固定样式类
- 不需要修改 theme-context.tsx，保持现有逻辑