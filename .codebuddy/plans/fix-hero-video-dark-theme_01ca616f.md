---
name: fix-hero-video-dark-theme
overview: 修复 Hero 组件深色主题视频无法播放的问题，通过改进视频加载检测逻辑，添加超时机制，并修复事件监听器管理问题。
todos:
  - id: use-callback-handlers
    content: 使用 useCallback 创建稳定的视频加载和错误处理函数
    status: completed
  - id: add-timeout-mechanism
    content: 添加视频加载超时机制（5秒超时）
    status: completed
    dependencies:
      - use-callback-handlers
  - id: improve-load-events
    content: 将 loadeddata 事件替换为 canplaythrough 事件
    status: completed
    dependencies:
      - use-callback-handlers
  - id: fix-listener-cleanup
    content: 修复事件监听器清理逻辑
    status: completed
    dependencies:
      - add-timeout-mechanism
      - improve-load-events
  - id: optimize-theme-switch
    content: 优化主题切换时的视频状态管理
    status: completed
    dependencies:
      - fix-listener-cleanup
---

## 产品概述

修复 Hero 组件深色主题视频播放功能，确保深色和浅色主题下的视频都能正常加载和播放。

## 核心功能

- 改进视频加载检测逻辑，使用更可靠的视频加载事件（canplaythrough）
- 添加视频加载超时机制，避免长时间等待
- 修复事件监听器管理问题，使用 useCallback 确保正确的监听器引用
- 优化主题切换时的视频状态管理，避免闪烁
- 增强视频资源可用性检测，确保只有真正可用的视频才会显示

## 技术栈

- 前端框架: Next.js 14 + React 18
- 编程语言: TypeScript
- 样式方案: Tailwind CSS

## 架构设计

### 系统架构

采用 React Hooks + Event Listeners 的组件架构，通过 useEffect 管理视频资源的生命周期。

### 数据流

```
主题切换 → 更新 backgroundVideo → 触发 useEffect 
→ 创建隐藏 video 元素 → 添加事件监听器 → 等待 canplaythrough 或超时 
→ 更新 videoExists 状态 → 渲染视频或降级背景
```

## 实现细节

### 核心代码结构

**主要修改文件**:

```
frontend/src/components/home/HeroSection.tsx
```

### 关键代码改进

**1. 使用 useCallback 创建稳定的事件处理函数**

```typescript
const handleLoad = useCallback(() => {
  setVideoExists(true);
  if (timeoutId) clearTimeout(timeoutId);
}, []);

const handleError = useCallback(() => {
  setVideoExists(false);
  if (timeoutId) clearTimeout(timeoutId);
}, []);
```

**2. 添加超时机制**

```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    setVideoExists(false);
  }, 5000); // 5秒超时
  
  // 添加监听器和清理逻辑
  
  return () => {
    clearTimeout(timeoutId);
    // 清理其他资源
  };
}, [backgroundVideo]);
```

**3. 使用更可靠的视频加载事件**

```typescript
// 使用 canplaythrough 而不是 loadeddata
video.addEventListener('canplaythrough', handleLoad);
video.addEventListener('error', handleError);
```

**4. 修复事件监听器清理**

```typescript
return () => {
  video.removeEventListener('canplaythrough', handleLoad);
  video.removeEventListener('error', handleError);
  clearTimeout(timeoutId);
};
```

### 技术实现方案

**问题1: 事件监听器无法正确移除**

- 解决方案: 使用 useCallback 创建稳定的函数引用，确保 addEventListener 和 removeEventListener 使用相同的函数实例
- 关键技术: React useCallback Hook

**问题2: 深色主题视频无法播放**

- 解决方案: 改进视频加载检测逻辑，从 loadeddata 改为 canplaythrough 事件，添加初始加载检查
- 关键技术: HTML5 Video API

**问题3: 缺少超时机制**

- 解决方案: 添加 5 秒超时，超时后自动降级到静态背景
- 关键技术: setTimeout + clearTimeout

**问题4: 主题切换时的状态闪烁**

- 解决方案: 优化初始化状态和状态更新逻辑，确保主题切换时平滑过渡
- 关键技术: React state management

## 技术考虑

### 性能优化

- 避免重复创建 video 元素和事件监听器
- 及时清理 timeout 和事件监听器防止内存泄漏
- 使用 useCallback 优化函数引用

### 错误处理

- 捕获视频加载失败事件
- 超时后自动降级到静态背景
- 确保组件卸载时清理所有资源

### 兼容性

- 保持现有的视频文件路径不变
- 向后兼容浅色主题的视频加载逻辑
- 不影响其他组件功能

# Agent Extensions

本任务不涉及使用 Agent 扩展，因此省略扩展标签。