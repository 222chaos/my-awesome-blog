---
name: light-theme-blue-colors
overview: 将浅色主题下的强调色和渐变色从绿色系改为蓝色系，包括技术颜色变量、玻璃效果颜色等
todos:
  - id: modify-tech-colors
    content: 修改:root中的技术颜色变量为蓝色系
    status: completed
  - id: modify-glass-colors
    content: 修改:root中的玻璃效果颜色变量为蓝色系
    status: completed
---

## 产品概述

将博客系统浅色主题的强调色和渐变色从绿色系调整为蓝色系，提升整体视觉风格

## 核心功能

- 修改浅色主题(:root)中的技术颜色变量为蓝色系
- 更新玻璃效果相关的颜色变量为蓝色系
- 保持深色主题(.dark)的颜色变量不变

## 技术栈

- CSS变量定义和修改

## 架构设计

### 修改范围

仅修改单个文件：`frontend/src/styles/globals.css`

### 修改策略

- 将浅色主题(:root)中的绿色系CSS变量替换为蓝色系
- 深色主题(.dark)保持现有绿色系不变
- 确保修改后的颜色值在视觉上协调统一

## 实现细节

### 需要修改的颜色变量

**文件位置**: `frontend/src/styles/globals.css` (第6-67行:root部分)

| 变量名 | 当前值(绿色) | 新值(蓝色) | 说明 |
| --- | --- | --- | --- |
| `--tech-deepblue` | #166534 | #1e40af | 深蓝色 |
| `--tech-cyan` | #059669 | #2563eb | 主蓝色 |
| `--tech-lightcyan` | #34d399 | #60a5fa | 浅蓝色 |
| `--tech-sky` | #22c55e | #3b82f6 | 天蓝色 |
| `--glass-border` | rgba(5, 150, 105, 0.15) | rgba(37, 99, 235, 0.15) | 玻璃边框蓝色 |
| `--glass-glow` | rgba(5, 150, 105, 0.2) | rgba(37, 99, 235, 0.2) | 玻璃发光蓝色 |


### 关键代码结构

修改前的代码片段（第44-49行）:

```css
/* 技术颜色变量 - 浅色绿黑主题 */
--tech-darkblue: #0f172a;
--tech-deepblue: #166534;
--tech-cyan: #059669;
--tech-lightcyan: #34d399;
--tech-sky: #22c55e;
```

修改后的代码:

```css
/* 技术颜色变量 - 浅色蓝黑主题 */
--tech-darkblue: #0f172a;
--tech-deepblue: #1e40af;
--tech-cyan: #2563eb;
--tech-lightcyan: #60a5fa;
--tech-sky: #3b82f6;
```

修改前的玻璃效果变量（第39-42行）:

```css
/* 玻璃效果专用变量 - 浅色主题 */
--glass-default: rgba(255, 255, 255, 0.7);
--glass-border: rgba(5, 150, 105, 0.15);
--glass-glow: rgba(5, 150, 105, 0.2);
```

修改后的代码:

```css
/* 玻璃效果专用变量 - 浅色主题 */
--glass-default: rgba(255, 255, 255, 0.7);
--glass-border: rgba(37, 99, 235, 0.15);
--glass-glow: rgba(37, 99, 235, 0.2);
```