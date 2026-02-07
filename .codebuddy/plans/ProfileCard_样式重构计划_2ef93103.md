---
name: ProfileCard 样式重构计划
overview: 使用 ImageTrail 鼠标轨迹图片特效风格重构个人资料卡片，将原有功能与新的视觉效果融合
design:
  architecture:
    framework: react
  styleKeywords:
    - 现代科技
    - 深色主题
    - 霓虹光效
    - 玻璃态
    - 极简主义
    - 动态交互
  fontSystem:
    fontFamily: Inter
    heading:
      size: 24px
      weight: 700
    subheading:
      size: 16px
      weight: 600
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#06b6d4"
      - "#8b5cf6"
      - "#3b82f6"
    background:
      - "#0a0a0f"
      - "#111118"
      - rgba(255,255,255,0.05)
    text:
      - "#ffffff"
      - "#94a3b8"
      - "#64748b"
    functional:
      - "#22c55e"
      - "#ef4444"
      - "#f59e0b"
todos:
  - id: remove-old-styles
    content: 删除 ProfileCard 原有样式和复杂动画效果
    status: completed
  - id: implement-image-trail-style
    content: 使用 GSAP 实现 ImageTrail 风格的鼠标跟随光效背景
    status: completed
    dependencies:
      - remove-old-styles
  - id: redesign-ui-layout
    content: 重新设计简化版 UI 布局，保留核心信息展示
    status: completed
    dependencies:
      - implement-image-trail-style
  - id: add-gsap-animations
    content: 为头像、统计数据添加 GSAP 悬浮动画效果
    status: completed
    dependencies:
      - redesign-ui-layout
  - id: integrate-realtime-stats
    content: 集成实时访客统计和数字动画效果
    status: completed
    dependencies:
      - add-gsap-animations
---

## 产品概述

重新设计个人资料卡片组件 ProfileCard，移除原有的所有样式和布局，采用 ImageTrail 组件的视觉风格进行全新设计。

## 核心功能

- 保留用户核心信息展示：头像、用户名、个人简介
- 保留统计数据：文章数、访问量、友站数
- 保留实时访客统计功能
- 引入 ImageTrail 风格的动态视觉效果：鼠标跟随、GSAP 动画、图片轨迹
- 使用深色玻璃态背景与霓虹色点缀的现代科技风格

## 技术栈

- **框架**: Next.js + React + TypeScript
- **动画库**: GSAP (GreenSock Animation Platform)
- **UI 库**: Tailwind CSS + Framer Motion
- **现有组件**: GlassCard (玻璃态卡片组件)

## 实现方案

### 架构设计

将 ProfileCard 重新设计为具有 ImageTrail 风格的交互式卡片：

- 背景层：深色渐变 + 玻璃态效果
- 交互层：GSAP 驱动的鼠标跟随光效轨迹
- 内容层：简化布局，突出核心信息

### 关键技术决策

1. **动画引擎**: 使用 GSAP 替代部分 framer-motion 动画，实现更流畅的鼠标轨迹效果
2. **视觉风格**: 采用 ImageTrail 的深色主题 + 霓虹色点缀，营造科技感
3. **性能优化**: 使用 `will-change` 和 `transform` 属性确保动画流畅，使用 `requestAnimationFrame` 进行节流

### 实现细节

- 删除原有的 3D 倾斜效果、粒子效果、进度环等复杂样式
- 引入 GSAP 驱动的鼠标跟随光效作为背景装饰
- 简化统计数据的展示形式，使用更清晰的数字展示
- 保留用户头像的悬浮动画效果，但采用 ImageTrail 风格的发光边框

## 目录结构

```
frontend/src/components/home/
└── ProfileCard.tsx          # [MODIFY] 完全重写 ProfileCard 组件
```

## 设计风格

采用 ImageTrail 风格的现代科技美学设计：

### 视觉特征

- **深色主题**: 深蓝黑色背景 (#0a0a0f) 搭配玻璃态半透明效果
- **霓虹光效**: 青色 (#06b6d4) 和紫色 (#8b5cf6) 的渐变发光效果
- **动态交互**: 鼠标移动时产生 GSAP 驱动的光效轨迹
- **极简布局**: 去除冗余装饰，聚焦核心信息

### 布局结构

1. **背景层**: 深色渐变 + 动态光效轨迹
2. **头像区域**: 圆形头像带发光边框，悬浮时放大
3. **信息区域**: 用户名使用渐变文字，简介简洁展示
4. **统计区域**: 三列统计数字，悬浮时显示光效
5. **访客条**: 底部实时访客指示器

### 交互动效

- 鼠标进入卡片时触发背景光效动画
- 鼠标移动产生跟随光点轨迹（GSAP 实现）
- 头像和统计项悬浮时有轻微放大和发光效果
- 数字变化时有平滑过渡动画