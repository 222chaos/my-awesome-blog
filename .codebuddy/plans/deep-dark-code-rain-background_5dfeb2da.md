---
name: deep-dark-code-rain-background
overview: 为深色主题添加代码雨动态背景效果，只在深色模式下显示，参考提供的 LetterGlitch 组件实现。
design:
  architecture:
    framework: react
  styleKeywords:
    - Matrix风格
    - 代码雨
    - 深色主题
    - 科技感
    - 绿色系
  fontSystem:
    fontFamily: Roboto
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
      - "#059669"
      - "#10b981"
      - "#000000"
    background:
      - "#000000"
    text:
      - "#10b981"
      - "#059669"
    functional:
      - rgba(5, 150, 105, 0.8)
      - rgba(16, 185, 129, 0.5)
todos:
  - id: create-matrix-rain
    content: 创建 MatrixCodeRain 组件实现代码雨背景效果
    status: completed
  - id: integrate-to-theme
    content: 将 MatrixCodeRain 集成到 ThemeWrapper 中
    status: completed
    dependencies:
      - create-matrix-rain
---

## 产品概述

为博客的深色主题页面添加代码雨（Matrix风格）动态背景效果

## 核心功能

- 创建代码雨背景组件，使用 Canvas 绘制动态下落的字符效果
- 仅在深色主题下显示代码雨背景
- 代码雨颜色与深色主题的绿色系保持一致
- 性能优化：仅在深色主题下渲染 Canvas
- 响应式：自动适配屏幕尺寸变化

## 技术栈

- 前端框架：Next.js 14 + React 18
- 编程语言：TypeScript
- 样式方案：Tailwind CSS
- 动画实现：HTML5 Canvas API

## 实现方案

### 核心策略

创建一个 MatrixCodeRain 组件，使用 Canvas 绘制矩阵风格的代码雨效果。组件通过 useTheme hook 监听主题变化，仅在深色主题时渲染 Canvas，并在浅色主题时销毁 Canvas 资源以节省性能。

### 关键技术决策

- **Canvas 实现**：使用 requestAnimationFrame 实现流畅动画，避免 setInterval 性能问题
- **主题响应**：使用 resolvedTheme 状态，仅在 'dark' 时激活 Canvas
- **资源管理**：组件卸载或切换到浅色主题时清理 Canvas 上下文和事件监听
- **颜色一致性**：使用深色主题的 tech-cyan (#059669) 和 tech-lightcyan (#10b981) 作为代码雨颜色
- **响应式设计**：监听 resize 事件，窗口大小变化时重新初始化 Canvas

### 性能与可靠性

- **惰性渲染**：深色主题未激活时不渲染 Canvas，减少资源占用
- **动画帧控制**：使用 requestAnimationFrame 确保动画流畅度
- **防抖 resize**：窗口调整大小时使用防抖避免频繁重绘
- **内存管理**：组件卸载时清理所有事件监听和定时器

## 实现细节

### 核心目录结构

```
e:/A_Project/my-awesome-blog/frontend/src/
├── components/
│   ├── background/
│   │   └── MatrixCodeRain.tsx  # [NEW] 代码雨背景组件
│   └── theme-wrapper.tsx        # [MODIFY] 集成代码雨组件
```

### 数据流

主题切换 → ThemeProvider 更新 resolvedTheme → MatrixCodeRain 响应主题变化 → 深色主题时初始化 Canvas 并启动动画 → 浅色主题时销毁 Canvas

### 组件设计

- **MatrixCodeRain 组件**：
- 使用 useRef 管理 Canvas 元素
- 使用 useTheme 获取当前主题
- 实现字符下落逻辑：每列维护当前字符位置，随机重置到顶部
- 使用绿色系字符，模拟 Matrix 效果
- **集成方式**：在 ThemeWrapper 中添加 MatrixCodeRain 作为固定背景层

## 设计风格

采用 Matrix 风格的代码雨效果，与博客深色主题的绿色科技风格保持一致。

### 视觉效果

- 代码雨字符：使用日文片假名、数字、拉丁字母混合，模仿 Matrix 电影效果
- 颜色方案：使用深色主题的 tech-cyan (#059669) 作为主色，tech-lightcyan (#10b981) 作为高亮色
- 字符下落速度：不同列有随机速度，营造自然流动感
- 尾迹效果：使用半透明黑色背景覆盖，形成字符逐渐消失的尾迹

### 交互设计

- 仅在深色主题下显示
- 自动适配屏幕尺寸
- 无交互干扰，作为纯背景装饰
- 确保不影响前景内容的可读性（使用适当透明度）

### 性能设计

- 深色主题未激活时不渲染 Canvas
- 使用 requestAnimationFrame 保证动画流畅
- 响应式重绘，避免内存泄漏