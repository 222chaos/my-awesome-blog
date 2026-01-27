---
name: fix-svg-props-naming
overview: 修复 PostCard.tsx 中 SVG 属性的命名问题，将 kebab-case 格式的 stroke-linejoin 和 stroke-linecap 改为 React 驼峰命名格式
todos:
  - id: fix-svg-props
    content: 修复 PostCard.tsx 第 80 和 86 行的 SVG 属性命名问题
    status: completed
---

## Product Overview

修复 PostCard.tsx 组件中的 React 警告，解决 SVG 属性命名问题。

## Core Features

- 将 stroke-linejoin 属性从 kebab-case 格式改为 React 驼峰命名 strokeLinejoin
- 将 stroke-linecap 属性从 kebab-case 格式改为 React 驼峰命名 strokeLinecap
- 修复第 80 行（点赞图标 SVG）的属性命名
- 修复第 86 行（评论图标 SVG）的属性命名
- 消除 React 控制台的无效 DOM 属性警告

## Tech Stack

- Frontend framework: Next.js 14 + React 18
- Language: TypeScript

## Implementation Details

### Code Modification

修复文件：`frontend/src/components/blog/PostCard.tsx`

**第 80 行修改：**

```
// 修改前
<svg ... stroke-linecap="round" stroke-linejoin="round" ...>

// 修改后
<svg ... strokeLinecap="round" strokeLinejoin="round" ...>
```

**第 86 行修改：**

```
// 修改前
<svg ... stroke-linecap="round" stroke-linejoin="round" ...>

// 修改后
<svg ... strokeLinecap="round" strokeLinejoin="round" ...>
```

### Technical Notes

- 在 React 中，所有 DOM 属性必须使用驼峰命名
- stroke-linecap 和 stroke-linejoin 是 SVG 的标准属性，在 React 中需要转换为 strokeLinecap 和 strokeLinejoin
- 这是 React 属性命名规范的要求，使用 kebab-case 会导致 React 发出警告