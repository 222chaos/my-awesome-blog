# 主题设计规范

## 概述

本文档定义了项目的深浅色主题设计规范和实现细节。

## 主题定义

### 浅色主题（Light Theme）- 白蓝色调

**主色调：**
- 背景色：`#ffffff` (纯白)
- 前景色：`#0a0a0a` (深黑)
- 主色：`#2563eb` (蓝色)
- 辅助色：`#dbeafe` (浅蓝)

**技术色板（Tech Colors）：**
- `--tech-darkblue`: `#0f172a` (深蓝)
- `--tech-deepblue`: `#1e3a8a` (深蓝)
- `--tech-cyan`: `#0ea5e9` (青蓝)
- `--tech-lightcyan`: `#38bdf8` (天蓝)
- `--tech-sky`: `#0ea5e9` (天空蓝)

**玻璃效果：**
- 默认：`rgba(255, 255, 255, 0.7)` (白色半透明)
- 边框：`rgba(30, 58, 138, 0.15)` (蓝色边框)
- 发光：`rgba(30, 58, 138, 0.2)` (蓝色光晕)

### 深色主题（Dark Theme）- 黑绿色调

**主色调：**
- 背景色：`#0a0a0a` (纯黑)
- 前景色：`#e0f2fe` (浅青)
- 主色：`#0891b2` (青色)
- 辅助色：`#0c4a6e` (深青)

**技术色板（Tech Colors）：**
- `--tech-darkblue`: `#0a0a0a` (纯黑)
- `--tech-deepblue`: `#064e3b` (深绿)
- `--tech-cyan`: `#059669` (绿色)
- `--tech-lightcyan`: `#10b981` (翠绿)
- `--tech-sky`: `#065f46` (墨绿)

**玻璃效果：**
- 默认：`rgba(10, 10, 10, 0.7)` (黑色半透明)
- 边框：`rgba(16, 185, 129, 0.15)` (绿色边框)
- 发光：`rgba(16, 185, 129, 0.2)` (绿色光晕)

## 主题切换机制

### CSS变量系统

所有主题相关的颜色都使用CSS变量定义，位于 `frontend/src/styles/globals.css`：

```css
:root {
  /* 浅色主题变量 */
  --tech-darkblue: #0f172a;
  --tech-deepblue: #1e3a8a;
  --tech-cyan: #0ea5e9;
  --tech-lightcyan: #38bdf8;
  --tech-sky: #0ea5e9;
}

.dark {
  /* 深色主题变量 */
  --tech-darkblue: #0a0a0a;
  --tech-deepblue: #064e3b;
  --tech-cyan: #059669;
  --tech-lightcyan: #10b981;
  --tech-sky: #065f46;
}
```

### Tailwind配置

在 `frontend/tailwind.config.js` 中，tech颜色被配置为引用CSS变量：

```javascript
tech: {
  darkblue: 'var(--tech-darkblue)',
  deepblue: 'var(--tech-deepblue)',
  cyan: 'var(--tech-cyan)',
  lightcyan: 'var(--tech-lightcyan)',
  sky: 'var(--tech-sky)',
}
```

这样，所有使用 `tech-*` 类名的元素都会自动响应主题切换。

### 主题切换API

使用 `class-based` 模式切换主题：

```typescript
// 切换到深色主题
document.documentElement.classList.add('dark')

// 切换到浅色主题
document.documentElement.classList.remove('dark')
```

## 组件使用指南

### 推荐使用方式

**优先使用CSS变量：**
```tsx
// ✅ 推荐 - 使用CSS变量
<div style={{ color: 'var(--tech-cyan)' }}>文本</div>

// ✅ 推荐 - 使用Tailwind类名（自动引用CSS变量）
<div className="text-tech-cyan">文本</div>
```

**避免硬编码颜色：**
```tsx
// ❌ 不推荐 - 硬编码颜色
<div style={{ color: '#0ea5e9' }}>文本</div>

// ❌ 不推荐 - 硬编码Tailwind类
<div className="text-blue-500">文本</div>
```

### 玻璃效果组件

使用 `GlassCard` 组件实现主题感知的玻璃效果：

```tsx
import GlassCard from '@/components/ui/GlassCard';

<GlassCard padding="md" hoverEffect={true} glowEffect={true}>
  内容
</GlassCard>
```

### 主题切换按钮

使用 `RopeThemeToggler` 组件：

```tsx
import { RopeThemeToggler } from '@/components/ui/rope-theme-toggler';

<RopeThemeToggler ropeLength={120} />
```

## 渐变效果

### 文本渐变

```tsx
<span className="text-gradient-primary">渐变文本</span>
```

- 浅色主题：`linear-gradient(135deg, #0ea5e9, #38bdf8, #0ea5e9)` (蓝蓝蓝)
- 深色主题：`linear-gradient(135deg, #10b981, #059669, #10b981)` (绿绿绿)

### 背景渐变

```tsx
<div className="gradient-bg">渐变背景</div>
```

- 浅色主题：`linear-gradient(-45deg, #ffffff, #1e3a8a, #0ea5e9, #38bdf8)`
- 深色主题：`linear-gradient(-45deg, #0a0a0a, #064e3b, #059669, #10b981)`

## 注意事项

### 1. CSS变量命名规范

- 使用 `--` 前缀
- 使用kebab-case命名
- 名称应具有描述性

### 2. Tailwind类名优先级

优先使用 `tech-*` 类名，避免使用固定的颜色类名。

### 3. 主题切换动画

主题切换使用 `View Transitions API` 实现平滑过渡效果，不支持该API的浏览器会降级使用CSS动画。

### 4. 持久化

主题选择会保存到 `localStorage`，页面刷新后保持用户选择。

## 扩展主题

### 添加新的颜色变量

1. 在 `globals.css` 的 `:root` 和 `.dark` 中添加变量
2. 在 `tailwind.config.js` 中添加对应的映射（如需要）
3. 确保两个主题变量都有对应的值

### 测试主题切换

1. 使用主题切换按钮测试
2. 检查所有组件的颜色是否正确响应
3. 验证玻璃效果在不同主题下的表现

## 相关文件

- `frontend/src/styles/globals.css` - CSS变量定义
- `frontend/tailwind.config.js` - Tailwind配置
- `frontend/src/context/theme-context.tsx` - 主题上下文
- `frontend/src/components/ui/rope-theme-toggler.tsx` - 主题切换按钮
- `frontend/src/components/ui/GlassCard.tsx` - 玻璃卡片组件
