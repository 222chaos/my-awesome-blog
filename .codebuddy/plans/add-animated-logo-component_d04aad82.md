---
name: add-animated-logo-component
overview: 创建一个带动画效果的Logo组件，使用自定义SVG图标，显示完整网站名称"Awesome Blog"和副标题，并替换Navbar中的现有Logo
design:
  architecture:
    framework: react
    component: shadcn
  styleKeywords:
    - 现代精致
    - 玻璃态效果
    - 金色主题
    - 流畅动画
    - 优雅奢华
  fontSystem:
    fontFamily: Montserrat
    heading:
      size: 18px
      weight: 700
    subheading:
      size: 12px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#bd9f67"
      - "#d4af37"
      - "#f4d03f"
    background:
      - "#243137"
      - "#2c3e50"
    text:
      - "#FFFFFF"
      - "#bd9f67"
    functional:
      - "#2563eb"
      - "#22c55e"
      - "#ef4444"
todos:
  - id: create-animated-logo
    content: 创建AnimatedLogo组件，包含SVG图标、主标题和副标题
    status: completed
  - id: add-css-animations
    content: 在globals.css中添加Logo动画的keyframes和样式类
    status: completed
    dependencies:
      - create-animated-logo
  - id: implement-logo-styles
    content: 实现Logo组件的所有动画效果和Tailwind样式
    status: completed
    dependencies:
      - add-css-animations
  - id: integrate-navbar
    content: 在Navbar组件中引入并使用AnimatedLogo替换现有Logo
    status: completed
    dependencies:
      - implement-logo-styles
  - id: test-responsive-design
    content: 测试不同屏幕尺寸下的显示效果和动画性能
    status: completed
    dependencies:
      - integrate-navbar
---

## 产品概述

为网站导航栏创建一个带有动态动画效果的Logo组件，使用自定义SVG图标，显示完整网站名称"Awesome Blog"和副标题，并替换Navbar中的现有Logo。

## 核心功能

- 创建新的AnimatedLogo组件，包含自定义SVG图标、主标题"Awesome Blog"和副标题
- 实现多种动画效果：hover时缩放、Logo展开动画、边框旋转、文字渐显和字母间距动画、trail扫光效果
- 使用Tailwind CSS实现所有动画（不使用styled-components）
- 在Navbar组件中替换第89-96行的现有Logo
- 支持颜色主题：#bd9f67（金色）和#243137（深色背景）
- 响应式设计，在不同屏幕尺寸下保持良好的显示效果

## 技术栈

- 前端框架：Next.js 14 + TypeScript
- 样式方案：Tailwind CSS（不使用styled-components）
- 动画实现：Tailwind CSS动画类 + 自定义CSS keyframes
- 图标：自定义SVG路径

## 技术架构

### 系统架构

组件层级：Navbar → AnimatedLogo（新组件）→ SVG图标 + 文本内容

### 模块划分

- **AnimatedLogo组件**：独立的Logo组件，包含SVG图标、主标题和副标题
- **Navbar组件**：修改现有导航栏，引入新的AnimatedLogo组件

### 数据流

Navbar组件渲染 → AnimatedLogo组件显示 → 用户hover交互 → 触发动画效果

## 实现细节

### 核心目录结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── AnimatedLogo.tsx  # 新：带动画效果的Logo组件
│   │   │   └── Navbar.tsx         # 修改：引入AnimatedLogo组件
│   └── styles/
│       └── globals.css            # 修改：添加Logo相关的CSS动画
```

### 关键代码结构

**AnimatedLogo组件接口**：定义Logo组件的属性和配置

```typescript
interface AnimatedLogoProps {
  className?: string;
  subtitle?: string;
}
```

**主要动画效果**：

- Logo展开动画：图标和文字从不同方向淡入
- 边框旋转：使用conic-gradient和rotate动画
- Hover缩放：transform scale transition
- 文字渐显：opacity和letter-spacing动画
- Trail扫光：background-position移动动画

### 技术实现方案

#### 1. Logo组件设计

- **SVG图标**：创建自定义的"A"字形图标，使用金色#bd9f67
- **主标题**："Awesome Blog"，使用渐变色
- **副标题**：可配置，如"分享技术与生活"

#### 2. 动画实现

使用Tailwind CSS和自定义keyframes实现所有动画效果：

**关键帧动画定义**：

```css
@keyframes logo-expand {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes border-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes text-reveal {
  0% { opacity: 0; letter-spacing: -5px; }
  100% { opacity: 1; letter-spacing: 0; }
}

@keyframes trail-shine {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

#### 3. Tailwind CSS类组合

- 使用`group`和`group-hover`实现交互效果
- 使用`transition-all duration-300 ease-in-out`实现平滑过渡
- 使用`backdrop-blur`实现玻璃态效果

#### 4. 响应式设计

- 小屏幕：只显示图标和主标题
- 中等屏幕：显示完整Logo
- 大屏幕：显示完整Logo和副标题

### 集成点

- AnimatedLogo组件导出给Navbar使用
- 保持与现有主题系统的兼容性
- 支持深色/浅色主题切换

## 技术考虑

### 性能优化

- 使用CSS动画而非JavaScript动画（利用GPU加速）
- 合理设置will-change属性优化动画性能
- 使用transform和opacity属性实现动画（避免重排）

### 响应式设计

- 使用Tailwind的响应式前缀（sm:、md:、lg:、xl:）
- 小屏幕隐藏副标题，只显示图标和主标题
- 合理调整字体大小和间距

### 兼容性

- 确保动画在减少动画偏好设置的用户设备上禁用
- 使用标准的CSS属性，确保浏览器兼容性
- 提供降级方案（在不支持CSS动画的浏览器中正常显示）

### 主题适配

- 使用CSS变量定义颜色，支持主题切换
- 确保在深色/浅色主题下都有良好的对比度
- 使用现有的tech-cyan和gold色系

## 设计风格

采用现代精致的设计风格，结合玻璃态效果和流畅动画，创建高端、专业且吸引人的Logo组件。使用金色(#bd9f67)作为主色调，搭配深色背景(#243137)，营造优雅奢华的视觉效果。

## 设计内容

### Logo容器设计

- 基础容器：使用flex布局，水平排列图标和文字
- 边框效果：金色渐变边框，带旋转动画
- 背景：半透明玻璃态背景，带模糊效果
- 尺寸：自适应，最大宽度200px

### SVG图标设计

- 图标形状：优雅的"A"字形，使用自定义SVG路径
- 颜色：金色渐变(#bd9f67到更浅的金色)
- 尺寸：40x40px
- 动画：从中心展开的scale动画，带轻微旋转

### 文字设计

- 主标题："Awesome Blog"，加粗，渐变色
- 副标题：较小字号，金色，位于主标题下方
- 字体：使用Montserrat或Roboto
- 动画：字母间距从负值到正常值的展开效果

### 交互设计

- Hover效果：整体容器轻微缩放(1.05)，边框发光增强
- Trail扫光：金色光效从左到右扫过
- 过渡：所有效果使用300-500ms的缓动过渡

### 动画时序

- 初始加载：图标先展开，然后主标题从左滑入，副标题从下淡入
- Hover触发：边框旋转加速，扫光效果开始
- 动画时长：展开动画0.6s，旋转动画3s无限循环，扫光动画2s