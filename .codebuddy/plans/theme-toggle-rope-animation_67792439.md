---
name: theme-toggle-rope-animation
overview: 在导航栏右侧添加绳子下拉动画的主题切换器，实现点击后绳子下拉并切换主题的交互效果。
design:
  architecture:
    framework: react
  fontSystem:
    fontFamily: Inter
    heading:
      size: 16px
      weight: 600
    subheading:
      size: 14px
      weight: 500
    body:
      size: 12px
      weight: 400
  colorSystem:
    primary:
      - "#06B6D4"
      - "#22D3EE"
      - "#0EA5E9"
    background:
      - rgba(15, 23, 42, 0.5)
      - rgba(255, 255, 255, 0.7)
    text:
      - "#FFFFFF"
      - "#F8FAFC"
    functional:
      - rgba(6, 182, 212, 0.3)
      - rgba(34, 211, 238, 0.6)
todos:
  - id: create-rope-component
    content: 创建 RopeThemeToggler 组件实现绳子悬挂效果
    status: completed
  - id: add-rope-animations
    content: 添加绳子摆动和下拉动画的 CSS 样式
    status: completed
    dependencies:
      - create-rope-component
  - id: update-navbar
    content: 在 Navbar.tsx 中替换 AnimatedThemeToggler 为 RopeThemeToggler
    status: completed
    dependencies:
      - create-rope-component
  - id: test-theme-switch
    content: 测试主题切换功能和动画效果
    status: completed
    dependencies:
      - update-navbar
  - id: responsive-adjust
    content: 调整响应式布局确保移动端正常显示
    status: completed
    dependencies:
      - test-theme-switch
---

## Product Overview

在导航栏右侧添加绳子下拉动画的主题切换器，替代现有的 AnimatedThemeToggler 组件。主题切换器采用绳子悬挂设计，从导航栏右侧垂直向下延伸，末端绑定主题切换按钮。点击后触发绳子下拉动画并切换主题，同时保持与现有主题管理系统（light/dark/auto 三种模式）的兼容性。

## Core Features

- 绳子悬挂样式的主题切换器，从导航栏顶部垂下
- 点击触发绳子下拉动画效果
- 下拉后切换主题（light/dark 互切）
- 绳子使用渐变色和动态效果增强视觉效果
- 保持 View Transitions API 的主题切换动画
- 支持自动检测系统主题（auto 模式）
- 悬停时绳子轻微摆动效果
- 响应式设计，适配不同屏幕尺寸

## Tech Stack

- 前端框架：Next.js 14 + React + TypeScript
- 样式系统：Tailwind CSS
- 动画：CSS Animations + React Hooks
- 状态管理：React Context API（现有 theme-context.tsx）
- 主题切换：View Transitions API

## Tech Architecture

### 系统架构

继承现有架构模式，复用 theme-context.tsx 的主题管理逻辑，仅替换 UI 层的 AnimatedThemeToggler 组件。

### 模块划分

- **RopeThemeToggler 组件**：新的绳子样式主题切换器，负责视觉呈现和交互
- **主题上下文**：复用现有 theme-context.tsx，管理主题状态
- **动画系统**：CSS Animations 实现绳子摆动和下拉效果
- **主题切换逻辑**：复用 View Transitions API 实现平滑过渡

### 数据流

用户点击绳子按钮 → 触发下拉动画 → 调用 setTheme() 更新主题 → View Transitions API 执行过渡动画 → 更新 DOM 和 localStorage

## Implementation Details

### 核心目录结构

```
frontend/src/
├── components/
│   ├── ui/
│   │   ├── rope-theme-toggler.tsx      # 新增：绳子样式主题切换器组件
│   │   └── animated-theme-toggler.tsx  # 保留：原主题切换器（可选保留）
│   └── navigation/
│       └── Navbar.tsx                   # 修改：替换主题切换器引用
└── styles/
    └── globals.css                       # 修改：添加绳子动画样式
```

### 关键代码结构

**RopeThemeToggler 组件接口**：

```typescript
interface RopeThemeTogglerProps {
  ropeLength?: number;        // 绳子长度（像素）
  ropeColor?: string;         // 绳子颜色
  ropeWidth?: number;         // 绳子宽度
  animationDuration?: number; // 动画时长
}
```

**CSS 动画关键帧**：

```css
@keyframes rope-swing {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

@keyframes rope-pull {
  0% { height: var(--rope-length); }
  50% { height: calc(var(--rope-length) + 30px); }
  100% { height: var(--rope-length); }
}
```

### 技术实现方案

1. **绳子渲染**：使用 CSS 绘制垂直线条，添加渐变色和纹理效果
2. **摆动动画**：使用 CSS transform-origin 设置旋转基点，实现自然摆动
3. **下拉交互**：点击时临时增加绳子高度，模拟拉绳效果
4. **主题切换**：保持与 AnimatedThemeToggler 相同的切换逻辑
5. **响应式适配**：移动端缩短绳子长度，避免遮挡内容

### 集成点

- 与 theme-context.tsx 的 useTheme Hook 集成
- 与 Navbar.tsx 的玻璃态设计保持视觉一致性
- 使用 globals.css 中现有的颜色变量和动画类

## 设计风格

采用现代科技感与趣味性结合的设计风格，绳子主题切换器为导航栏增添动态交互元素。整体设计遵循项目的玻璃态美学，使用渐变色和柔和的动画效果。

## 设计内容描述

### 组件外观

- **绳子主体**：从导航栏顶部右侧垂直向下悬挂，宽度 2-3px，使用渐变色（从 #06B6D4 到 #22D3EE）
- **绳子纹理**：添加微妙的纹理效果，增强真实感
- **绳子末端**：绑定圆形主题切换按钮，直径 36px，玻璃态设计
- **按钮图标**：显示当前主题图标（Sun/Moon），白色填充
- **绳结装饰**：绳子与按钮连接处添加小绳结装饰元素

### 交互效果

- **默认状态**：绳子缓慢左右摆动（周期 4s，幅度 ±5deg），营造悬挂感
- **悬停状态**：绳子摆动加快（周期 2s，幅度 ±8deg），按钮发光增强
- **点击动作**：绳子向下拉伸 30px（模拟拉绳效果），持续 300ms，然后回弹
- **主题切换**：在绳子弹回过程中触发主题切换，View Transitions API 执行过渡动画

### 布局设计

- 桌面端：绳子长度 120px，在导航栏右侧区域占据固定空间
- 移动端：绳子长度 80px，避免遮挡导航内容
- 定位方式：使用 absolute 定位，相对于 Navbar 容器右侧边缘

### 视觉细节

- 绳子使用 linear-gradient 创建光泽感
- 按钮采用玻璃态设计（backdrop-blur），悬停时发光增强
- 绳子顶端添加固定点装饰，模拟挂载在横梁上的效果
- 主题切换时按钮图标平滑切换，支持旋转过渡动画