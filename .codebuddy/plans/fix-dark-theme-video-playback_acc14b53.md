---
name: fix-dark-theme-video-playback
overview: 修复Hero组件深色主题视频无法播放的问题，通过优化视频加载检测逻辑、改进超时机制和事件监听器管理来确保视频在深色主题下正常播放。
design:
  architecture:
    framework: react
  styleKeywords:
    - Existing Design
    - Video Background
    - Glassmorphism
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 32px
      weight: 600
    subheading:
      size: 18px
      weight: 500
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#062E9A"
      - "#073AB5"
    background:
      - "#F9FAFB"
      - "#FFFFFF"
    text:
      - "#FFFFFF"
    functional:
      - "#000000"
      - "#FFFFFF"
todos:
  - id: optimize-detection-event
    content: 优化视频检测事件，将canplaythrough替换为loadeddata
    status: completed
  - id: increase-timeout
    content: 增加视频检测超时时间，从5秒调整至15秒
    status: completed
    dependencies:
      - optimize-detection-event
  - id: add-video-state
    content: 添加videoError和retryCount状态，实现错误跟踪
    status: completed
    dependencies:
      - increase-timeout
  - id: add-playback-handler
    content: 为实际渲染的video添加onCanPlay和onError事件处理
    status: completed
    dependencies:
      - add-video-state
  - id: implement-retry-mechanism
    content: 实现视频播放重试机制，最多重试2次
    status: completed
    dependencies:
      - add-playback-handler
  - id: optimize-theme-switch
    content: 优化主题切换时的状态重置，添加key属性强制重新加载
    status: completed
    dependencies:
      - implement-retry-mechanism
---

## 产品概述

修复Hero组件深色主题视频无法播放的问题，通过优化视频加载检测逻辑、改进超时机制和事件监听器管理来确保视频在深色主题下正常播放。

## 核心功能

- 使用更宽松的视频加载事件（loadeddata替代canplaythrough），加速检测流程
- 增加超时时间（从5秒增加到15秒），给大视频文件更多加载时间
- 为实际渲染的视频元素添加播放错误处理和重试机制
- 优化主题切换时的状态管理，确保视频平滑切换
- 添加视频播放状态监控，实时反馈播放情况

## 技术栈

- 前端框架: Next.js 14 + React 18 + TypeScript
- 样式方案: Tailwind CSS

## 技术架构

### 系统架构

采用React Hooks + HTML5 Video API的组件架构，通过预检测 + 实际渲染的双重机制确保视频可用性。

### 数据流

```
主题切换 → 更新backgroundVideo → 创建隐藏video预检测
→ 监听loadeddata/error事件 → 更新videoExists状态 → 渲染实际video
→ 监听实际video播放状态 → 错误时重试或降级
```

### 模块划分

- **视频预检测模块**: 使用隐藏video元素检测视频资源可用性
- **视频渲染模块**: 渲染实际的背景视频，包含播放控制和错误处理
- **状态管理模块**: 管理videoExists、重试次数、播放状态等

### 关键改进

1. **事件策略优化**: 使用loadeddata替代canplaythrough，提前触发检测
2. **超时机制调整**: 超时从5秒增加到15秒
3. **错误处理增强**: 实际渲染video添加onCanPlay/onError回调
4. **重试机制**: 检测失败后自动重试，最多2次

## 实现细节

### 核心代码结构

**修改文件**:

```
frontend/src/components/home/HeroSection.tsx
```

### 关键代码改进

**1. 优化检测事件 - 使用loadeddata**

```typescript
// 使用loadeddata事件（触发更早）替代canplaythrough
video.addEventListener('loadeddata', handleVideoLoad);
video.addEventListener('error', handleVideoError);
```

**2. 增加超时时间**

```typescript
// 超时从5秒增加到15秒
timeoutRef.current = setTimeout(() => {
  setVideoExists(false);
  // 清理监听器
  video.removeEventListener('loadeddata', handleVideoLoad);
  video.removeEventListener('error', handleVideoError);
}, 15000); // 15秒超时
```

**3. 添加实际渲染视频的播放控制**

```typescript
const [videoError, setVideoError] = useState(false);
const [retryCount, setRetryCount] = useState(0);

// 实际渲染的video元素
{videoExists ? (
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
    src={backgroundVideo}
    onCanPlay={() => setVideoError(false)}
    onError={() => {
      setVideoError(true);
      // 重试机制
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => setVideoError(false), 2000);
      }
    }}
    key={backgroundVideo} // 强制重新加载
    aria-hidden="true"
  />
) : (
  // 降级到渐变背景
)}
```

**4. 优化主题切换状态管理**

```typescript
useEffect(() => {
  // 主题变化时重置状态
  setVideoExists(false);
  setVideoError(false);
  setRetryCount(0);
  
  // 预检测逻辑...
}, [backgroundVideo]);
```

### 技术实现方案

**问题1: canplaythrough事件触发过晚**

- 解决方案: 使用loadeddata事件，该事件在媒体数据开始加载时触发
- 关键技术: HTML5 Video API事件链（loadedmetadata → loadeddata → canplay → canplaythrough）

**问题2: 超时时间太短**

- 解决方案: 将超时从5秒增加到15秒，适应大文件加载
- 关键技术: setTimeout + clearTimeout

**问题3: 实际渲染的video没有错误处理**

- 解决方案: 添加onCanPlay和onError回调，实现自动重试
- 关键技术: React事件处理 + 重试计数器

**问题4: 检测和渲染使用不同video元素**

- 解决方案: 为实际渲染的video添加key属性，强制重新加载
- 关键技术: React key属性 + 组件重新渲染

## 技术考虑

### 性能优化

- loadeddata事件触发更早，减少等待时间
- 主题切换时使用key强制重新加载，避免缓存问题
- 及时清理事件监听器和超时，防止内存泄漏

### 错误处理

- 多层错误检测：预检测失败 + 实际播放错误
- 自动重试机制：最多重试2次，间隔2秒
- 优雅降级：所有失败场景都显示渐变背景

### 兼容性

- 保持向后兼容，不改变视频文件路径
- 支持深色和浅色主题的视频切换
- 不影响其他组件功能

## 设计风格

保持现有Hero组件的视觉设计风格，专注于功能修复而非视觉改变。视频背景作为底层元素，上方叠加半透明遮罩层和玻璃态卡片内容。

## 视觉效果

- 深色主题: 渐变背景从深蓝到青色（降级时）或moonlit-clouds-field视频
- 浅色主题: 渐变背景从secondary到accent（降级时）或fantasy-landscape视频
- 播放失败时平滑过渡到渐变背景，无闪烁