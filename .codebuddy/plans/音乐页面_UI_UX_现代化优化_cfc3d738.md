---
name: 音乐页面 UI/UX 现代化优化
overview: 为音乐页面实施现代化设计系统：替换emoji图标、添加玻璃拟态效果、优化配色和交互体验
design:
  architecture:
    framework: react
  styleKeywords:
    - Glassmorphism
    - Dark Mode
    - Indigo Gradient
    - Glass Card
    - Modern Minimalist
    - Smooth Transitions
    - Music Streaming
    - Neon Accent
  fontSystem:
    fontFamily: system-ui
    heading:
      size: 1.5rem
      weight: 700
    subheading:
      size: 1.25rem
      weight: 600
    body:
      size: 0.875rem
      weight: 400
  colorSystem:
    primary:
      - "#6366f1"
      - "#4f46e5"
      - "#ec4899"
      - "#f59e0b"
    background:
      - "#0f0f23"
      - "#1a1a2e"
      - "#252542"
      - rgba(255,255,255,0.03)
    text:
      - "#ffffff"
      - rgba(255,255,255,0.7)
      - rgba(255,255,255,0.4)
    functional:
      - "#10b981"
      - "#ef4444"
      - "#f59e0b"
      - "#3b82f6"
todos:
  - id: fix-emoji-icons
    content: 替换所有 emoji 图标为 Lucide 图标 (PlaylistCard, HeroBanner, MobileNav)
    status: completed
  - id: fix-font-classes
    content: 移除所有未定义的 font-sf-pro 字体类，改用标准 Tailwind 字体
    status: completed
  - id: design-playlist-card
    content: 优化 PlaylistCard 组件：玻璃拟态卡片 + Indigo 配色 + 流畅悬停动画
    status: completed
    dependencies:
      - fix-emoji-icons
  - id: optimize-scroll
    content: 优化 PlaylistScroll：添加左右滚动箭头导航 + 渐变遮罩提示
    status: completed
  - id: design-hero-banner
    content: 优化 HeroBanner：替换箭头图标 + 优化配色 + 改进动画
    status: completed
    dependencies:
      - fix-emoji-icons
      - fix-font-classes
  - id: optimize-player-bar
    content: 优化 PlayerBar：移除未定义字体类 + 改进进度条样式
    status: completed
    dependencies:
      - fix-font-classes
  - id: optimize-sidebar
    content: 优化 MusicSidebar：统一配色方案 + 改进选中态样式
    status: completed
  - id: optimize-mobile-nav
    content: 优化 MobileNav：替换 emoji 为 Lucide 图标 + 改进样式
    status: completed
    dependencies:
      - fix-emoji-icons
  - id: optimize-section
    content: 优化 Section 组件：改进标题样式 + 移除未定义字体类
    status: completed
    dependencies:
      - fix-font-classes
  - id: update-globals-css
    content: 更新 globals.css：添加自定义滚动条样式 + 全局动画
    status: completed
---

## 产品概述

对博客项目的音乐页面进行全面的 UI/UX 优化，提升视觉品质和交互体验。

## 当前问题分析

1. **Emoji 图标问题**：使用 🎧▶️◀️❤️🔍 等 emoji 作为 UI 图标，显得不够专业
2. **配色单一**：主要依赖 #fa2d2f 红色，缺乏视觉层次和现代感
3. **自定义字体类未定义**：使用了 font-sf-pro-text、font-sf-pro-display 等未定义的字体类
4. **缺少玻璃拟态效果**：卡片和容器缺少现代化的玻璃质感设计
5. **悬停交互生硬**：过渡动画和微交互不够流畅
6. **布局细节欠佳**：元素间距、圆角、阴影等不够统一

## 核心功能（需优化的组件）

- PlaylistCard - 歌单卡片组件
- PlaylistScroll - 横向滚动区域
- HeroBanner - 轮播图组件
- PlayerBar - 播放器控制栏
- MusicSidebar - 侧边栏导航
- MobileNav - 移动端导航
- Section - 区块标题组件

## 技术栈

- **框架**: Next.js 16 + React 18
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **动画**: Framer Motion（已有）
- **工具类**: cn (clsx + tailwind-merge)

## 设计规范

### 配色方案

```css
/* 主色调 - Indigo 现代感 */
--primary: #6366f1;
--primary-hover: #4f46e5;
--accent: #ec4899;      /* Pink 活力 */
--accent-warm: #f59e0b; /* Amber 能量 */

/* 背景层次 */
--bg-primary: #0f0f23;   /* 深蓝黑 */
--bg-secondary: #1a1a2e; /* 卡片背景 */
--bg-tertiary: #252542;  /* 浮层背景 */
```

### 字体规范

使用系统字体栈保证性能：

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 玻璃拟态设计

```css
backdrop-blur-xl
bg-white/[0.03] dark:bg-white/[0.03]
border border-white/[0.06]
hover:border-white/[0.12]
shadow-lg shadow-indigo-500/10
```

### 圆角规范

- 卡片: rounded-2xl
- 按钮: rounded-full 或 rounded-xl
- 小元素: rounded-lg

### 过渡动画

- 默认: transition-all duration-300 ease-out
- 悬停: hover:scale-[1.02] hover:-translate-y-0.5
- 播放按钮: translate-y-full group-hover:translate-y-0

## 实现策略

### Phase 1: P0 紧急修复

- 替换所有 emoji 图标为 Lucide 图标
- 修复未定义的字体类（移除 font-sf-pro 系列）
- 修复 cn 导入问题

### Phase 2: P1 高优先级

- 实施玻璃拟态卡片设计
- 统一配色方案（Indigo/Pink/Amber）
- 优化悬停交互和过渡动画

### Phase 3: P2 中优先级

- 优化横向滚动体验（添加导航箭头）
- 完善响应式布局
- 添加微交互动画

## 目录结构

```
frontend/src/components/music/
├── PlaylistCard.tsx      [MODIFY] 玻璃拟态卡片 + Lucide 图标
├── PlaylistScroll.tsx    [MODIFY] 添加滚动导航箭头
├── HeroBanner.tsx        [MODIFY] 替换 emoji 图标 + 优化配色
├── PlayerBar.tsx         [MODIFY] 移除未定义字体类
├── MusicSidebar.tsx      [MODIFY] 优化配色和交互
├── MobileNav.tsx         [MODIFY] 替换 emoji 为 Lucide 图标
├── Section.tsx           [MODIFY] 优化标题样式
└── globals.css           [MODIFY] 添加自定义滚动条样式
```

## 设计风格

采用 **深色主题玻璃拟态 (Dark Glassmorphism)** 设计风格，结合现代化的 Indigo/Pink 渐变色系，打造具有科技感和音乐氛围的流媒体界面。

### 设计原则

1. **玻璃拟态**: 半透明背景 + 背景模糊 + 细腻边框
2. **深色优先**: 深蓝黑背景 (#0f0f23) 减少视觉疲劳
3. **渐变点缀**: 使用 Indigo/Pink 渐变增添活力
4. **层次分明**: 通过阴影和透明度创造深度感
5. **流畅动效**: 所有交互元素都有 200-500ms 的过渡动画

### 页面布局

- **左侧**: 可折叠侧边栏导航（玻璃拟态效果）
- **主内容**: 滚动页面，包含 Hero 轮播、推荐歌单等区块
- **底部**: 固定播放器控制栏（玻璃拟态悬浮效果）
- **移动端**: 底部标签导航栏

### 区块设计

1. **HeroBanner**: 全宽轮播图，3D 倾斜专辑封面，渐变叠加
2. **推荐歌单**: 横向滚动卡片列表，玻璃拟态卡片
3. **播放器**: 底部悬浮，渐变进度条，彩色播放按钮
4. **侧边栏**: 可折叠，选中项高亮带阴影

## Agent Extensions

### Skill

- **[skill:ui-ux-pro-max]**
- Purpose: 提供专业的设计规范和最佳实践指导
- Expected outcome: 确保 UI/UX 优化符合现代化设计标准，包含玻璃拟态、配色、交互等完整设计系统

### SubAgent

- **[subagent:code-explorer]**
- Purpose: 探索音乐页面相关组件的完整结构和依赖关系
- Expected outcome: 全面了解组件间的数据流和依赖，确保优化时不会破坏现有功能