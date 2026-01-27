---
name: separate-friendlink-flip-card
overview: 将友站链接单独做成翻转卡片，个人资料卡片改为普通卡片无动画
design:
  architecture:
    framework: react
    component: shadcn
  styleKeywords:
    - Glassmorphism
    - Flip Animation
    - Card Stack
    - Data Visualization
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 24px
      weight: 700
    subheading:
      size: 18px
      weight: 600
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#2563eb"
      - "#60a5fa"
    background:
      - "#ffffff"
      - rgba(255, 255, 255, 0.7)
    text:
      - "#0a0a0a"
      - "#4a5568"
    functional:
      - "#22c55e"
      - "#ef4444"
todos:
  - id: refactor-profile-card
    content: 重构 ProfileCard 为普通卡片，移除翻转动画相关代码
    status: completed
  - id: create-friendlink-card
    content: 创建 FriendLinkCard 翻转卡片组件，实现正面统计和背面友链列表
    status: completed
  - id: update-stats-panel-layout
    content: 调整 StatsPanel 布局，左侧列垂直堆叠两个卡片
    status: completed
    dependencies:
      - refactor-profile-card
      - create-friendlink-card
  - id: add-friendlink-data
    content: 添加友链模拟数据和统计类型定义
    status: completed
    dependencies:
      - create-friendlink-card
---

## 产品概述

重构博客首页的统计面板组件，将个人资料卡片和友站链接功能分离为两个独立的卡片。

## 核心功能

- **个人资料卡片**：普通静态卡片，无翻转动画，显示头像、网站名称、简介、文章数/访问量统计数据
- **友站链接翻转卡片**：独立翻转卡片组件
- 正面：显示友站统计数字（友站数量、总访问量等）
- 背面：显示友链列表，包含网站名称、简介和链接
- 悬停触发翻转动画效果

## 技术栈

- **框架**: React + TypeScript
- **样式**: Tailwind CSS + 现有 globals.css 翻转动画
- **组件库**: 项目现有的 shadcn/ui 组件

## 技术架构

### 模块划分

- **ProfileCard 组件**: 重构为普通卡片，移除 flip-card 相关类名
- **FriendLinkCard 组件**: 新建翻转卡片组件，复用现有 flip-card CSS 动画
- **StatsPanel 组件**: 调整布局，在左侧列同时放置两个卡片

### 数据结构

```typescript
interface FriendLink {
  id: number;
  name: string;
  description: string;
  url: string;
  avatar?: string;
}

interface FriendLinkStats {
  totalCount: number;
  totalVisits: number;
}
```

### 布局调整

左侧列从单个卡片改为垂直堆叠的两个卡片：

```
┌─────────────────┬──────────────────────┐
│  ProfileCard    │                      │
│  (普通卡片)      │   ArticleList        │
├─────────────────┤   (文章列表)          │
│ FriendLinkCard  │                      │
│ (翻转卡片)       │                      │
└─────────────────┴──────────────────────┘
```

## 设计架构

### 页面布局调整

**左侧列垂直堆叠设计**：

1. **个人资料卡片（上部）**：保持现有视觉风格，移除翻转交互

- 圆形头像 + 在线状态指示器
- 网站名称 POETIZE + 简介
- 三列统计数据（文章/访问量）
- 玻璃拟态卡片背景

2. **友站链接卡片（下部）**：翻转卡片设计

- **正面**：大号友站数量展示 + 辅助统计
- **背面**：友链列表网格布局，每个友链显示头像、名称、简介

### 设计细节

- **ProfileCard**: 保留 glass-card、渐变头像、悬停效果，移除 flip-card 容器
- **FriendLinkCard**: 继承原有扫光动画背面效果，正面采用数据可视化风格
- **间距**: 两个卡片之间保持 1.5rem (gap-6) 间距
- **高度**: ProfileCard 自适应内容高度，FriendLinkCard 固定 min-height 保证翻转效果