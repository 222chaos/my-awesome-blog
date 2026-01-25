---
name: add-typewriter-component
overview: 安装 gsap 依赖，在首页创建打字机组件并替换 HeroSection 中的欢迎文本
todos:
  - id: install-gsap
    content: 安装 gsap、@gsap/react 和 @gsap/text 依赖
    status: completed
  - id: create-typewriter
    content: 创建 TextType 打字机组件
    status: completed
    dependencies:
      - install-gsap
  - id: integrate-hero
    content: 在 HeroSection 中集成打字机组件替换欢迎文本
    status: completed
    dependencies:
      - create-typewriter
---

## 产品概述

在首页 HeroSection 中添加打字机动画效果，用于展示欢迎文本，增强页面的动态交互体验。

## 核心功能

- 安装 GSAP 动画库依赖
- 创建自定义打字机组件 TextType
- 替换 HeroSection 中的欢迎文本为打字机效果
- 支持多文本循环打字/删除动画
- 使用主题系统颜色变量确保深浅色主题兼容

## 技术栈

- 动画库：GSAP (GreenSock Animation Platform)
- 集成方式：@gsap/react (官方 React Hooks 封装)
- 文本插件：@gsap/text (TextPlugin，用于打字机效果)

## 技术架构

### 系统架构

基于现有的 Next.js + React 组件架构，通过 GSAP 实现文本动画效果。

```
HeroSection
    └── TextType (新增组件)
            ├── GSAP Timeline (控制动画序列)
            ├── TextPlugin (处理打字/删除效果)
            └── Theme System (使用 CSS 变量)
```

### 模块划分

- **TextType 组件**：可复用的打字机组件，支持自定义文本、速度和样式
- **HeroSection 集成**：将 TextType 组件集成到现有的 HeroSection 中

## 实现细节

### 核心目录结构

```
frontend/
├── src/
│   └── components/
│       └── home/
│           ├── TextType.tsx      # 新增：打字机组件
│           └── HeroSection.tsx   # 修改：集成打字机组件
├── package.json                  # 修改：添加 gsap 依赖
```

### 关键代码结构

**TextType 组件接口**：

```typescript
interface TextTypeProps {
  texts: string[];              // 要循环显示的文本数组
  typingSpeed?: number;         // 打字速度（字符/秒）
  deletingSpeed?: number;       // 删除速度（字符/秒）
  delayBetweenTexts?: number;   // 文本切换延迟（秒）
  cursor?: boolean;             // 是否显示光标
  className?: string;           // 自定义样式类名
  loop?: boolean;               // 是否循环播放
}
```

**GSAP 动画配置**：

```typescript
// 使用 gsap.timeline 控制动画序列
const timeline = gsap.timeline({ repeat: -1, repeatDelay: delayBetweenTexts });

// 打字效果
timeline.to(textRef.current, {
  text: { value: text, delimiter: "" },
  duration: text.length / typingSpeed,
  ease: "none"
});

// 删除效果
timeline.to(textRef.current, {
  text: { value: "", delimiter: "" },
  duration: text.length / deletingSpeed,
  ease: "none"
});
```

### 主题系统集成

- 使用 `--tech-lightcyan` CSS 变量设置文本颜色
- 使用 `text-tech-lightcyan` Tailwind 类名
- 支持深浅色主题自动切换

### 技术实现计划

#### 1. GSAP 依赖安装

**问题**：当前项目未安装 GSAP 相关依赖
**解决方案**：使用 npm 安装 gsap、@gsap/react 和 @gsap/text
**关键依赖**：

- `gsap`: GSAP 核心库
- `@gsap/react`: React Hooks 封装，简化 React 组件中的 GSAP 使用
- `@gsap/text`: TextPlugin，专门用于文本打字/删除效果

**实施步骤**：

1. 在 frontend 目录执行 `npm install gsap @gsap/react @gsap/text`
2. 验证依赖正确安装（检查 package.json）

#### 2. TextType 组件开发

**问题**：需要创建可复用的打字机组件
**解决方案**：使用 GSAP 的 TextPlugin 实现打字/删除动画
**关键实现**：

- 使用 `useGSAP` hook 管理 GSAP 实例生命周期
- 使用 `TextPlugin` 的 `text` 属性控制文本内容
- 支持多文本循环播放
- 光标闪烁效果

#### 3. HeroSection 集成

**问题**：替换现有静态文本为打字机效果
**解决方案**：在 HeroSection 的 h1 标签位置使用 TextType 组件
**替换内容**：

- 原标题："欢迎来到我的技术博客" → 改为打字机效果
- 保持原有的样式和布局不变
- 支持后续自定义文本内容

### 集成点

- **与 HeroSection 集成**：替换第70-73行的静态 h1 文本
- **与主题系统集成**：使用主题系统的 CSS 变量确保深浅色兼容
- **与 Tailwind 集成**：使用 tech-* 类名而非硬编码颜色

## 技术考虑

### 性能优化

- 使用 `useGSAP` hook 自动清理动画实例，避免内存泄漏
- 在组件卸载时正确清理 GSAP timeline
- 使用 `will-change` CSS 属性优化动画性能

### 注意事项

- GSAP TextPlugin 需要显式注册：`gsap.registerPlugin(TextPlugin)`
- 确保服务端渲染（SSR）兼容性，使用 'use client' 指令
- 打字机文本应保持与原设计相同的字体大小和粗细