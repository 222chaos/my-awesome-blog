# 音乐馆页面设计方案 - macOS 风格

## 一、设计理念

严格遵循 Apple Human Interface Guidelines，结合 macOS 原生应用的设计语言，打造与 Apple Music 一致的音乐体验。

### macOS Human Interface Guidelines 核心原则

#### 1. 清晰 Clarity
- **文字可读性**: 使用 SF Pro 字体系统，确保所有文本清晰易读
- **视觉层次**: 通过字号、颜色、间距建立清晰的信息层级
- **对比度**: 遵循 WCAG AA 标准，文本与背景对比度 ≥ 4.5:1
- **语义化颜色**: 使用系统标准颜色，避免过度装饰

#### 2. 依从性 Deference
- **融入系统**: 使用系统标准控件和模式
- **内容优先**: 让用户关注内容而非界面本身
- **毛玻璃效果**: 使用半透明模糊，营造层次感而非遮挡内容
- **标准动画**: 使用系统缓动曲线，避免过度动画

#### 3. 深度 Depth
- **分层设计**: 通过阴影、模糊、缩放建立空间关系
- **z-index 规范**: 固定元素 < 浮动面板 < 模态框 < 通知
- **层次反馈**: 悬停、激活、禁用状态有明显的视觉差异
- **3D 效果**: 适度使用 3D 变换，如专辑封面倾斜

#### 4. 一致性 Consistency
- **系统一致**: 使用 macOS 标准的图标、颜色、字体
- **应用一致**: 整个音乐馆使用统一的交互模式
- **跨平台一致**: 与移动端保持核心体验一致
- **隐喻一致**: 使用音乐播放器通用的视觉隐喻

### macOS 风格核心要素

#### 视觉元素
- **圆角美学**: 使用 macOS 标准圆角值（4pt-20pt），专辑封面使用 8pt
- **毛玻璃效果**: `backdrop-blur-2xl` 配合 70-80% 透明度背景
- **柔和阴影**: 5 级 elevation 阴影系统，营造深度
- **精致动画**: 使用 macOS 标准缓动曲线（ease-out, ease-in-out, spring）
- **侧边栏导航**: 经典的三栏布局（260px 侧边栏 + 内容 + 播放器）

#### 交互设计
- **触摸目标**: 最小 44x44px，符合人机工程学
- **即时反馈**: 所有交互在 100ms 内提供视觉反馈
- **流畅过渡**: 使用 200-300ms 标准过渡时长
- **手势支持**: 支持滑动、捏合等 macOS 手势

### 配色方案

#### Apple Music 主色调
```
主色: #fa2d2f (Apple Music 红)
次级红: #ff3b30 (系统红)
悬停红: #ff6961
激活红: #d32f2f
播放按钮: #fa2d2f
```

#### 系统灰度 - Light Mode
```
背景色: #F5F5F7 (浅灰背景)
表面色: #FFFFFF (白色卡片)
边框色: rgba(0,0,0,0.08)
主要文字: #1D1D1F (深灰)
次要文字: rgba(0,0,0,0.6) (60% 不透明)
第三级文字: rgba(0,0,0,0.4)
禁用文字: rgba(0,0,0,0.3)
```

#### 系统灰度 - Dark Mode
```
背景色: #000000 (纯黑)
表面色: #1C1C1E (深灰)
边框色: rgba(255,255,255,0.08)
主要文字: #FFFFFF
次要文字: rgba(255,255,255,0.6)
第三级文字: rgba(255,255,255,0.4)
禁用文字: rgba(255,255,255,0.3)
```

#### 毛玻璃效果
```
Light 模式: bg-white/80 backdrop-blur-2xl
Dark 模式: bg-[#1C1C1E]/80 backdrop-blur-2xl
```

#### 强调色系统
```
Cyan (保留现有 tech-cyan): #32ADE6
系统蓝: #007AFF
系统绿: #34C759
系统橙: #FF9500
系统黄: #FFCC00
系统紫: #AF52DE
```

---

## 二、字体系统 Typography

### SF Pro 字体层级

macOS 使用 SF Pro 字体系统，分为 Display 和 Text 两个子系列，分别用于展示型和正文内容。

#### SF Pro Display (用于大标题、展示型文本)

| 样式 | 字号 | 字重 | 字间距 | 行高 | 使用场景 |
|------|------|------|--------|------|----------|
| Title 1 | 34pt | Semibold (600) | -0.5px | 1.2 | 页面主标题 |
| Title 2 | 28pt | Semibold (600) | -0.5px | 1.2 | 区块标题 |
| Title 3 | 22pt | Semibold (600) | -0.5px | 1.25 | 子区块标题 |
| Large Title | 34pt | Bold (700) | 0.5px | 1.3 | Hero 区域大标题 |

#### SF Pro Text (用于正文、UI 元素)

| 样式 | 字号 | 字重 | 字间距 | 行高 | 使用场景 |
|------|------|------|--------|------|----------|
| Headline | 17pt | Semibold (600) | -0.5px | 1.4 | 列表项标题、卡片标题 |
| Body | 17pt | Regular (400) | -0.5px | 1.4 | 正文内容 |
| Callout | 16pt | Regular (400) | -0.5px | 1.45 | 次要信息 |
| Subhead | 15pt | Regular (400) | -0.5px | 1.5 | 说明文字 |
| Footnote | 13pt | Regular (400) | -0.5px | 1.55 | 辅助信息 |
| Caption 1 | 12pt | Regular (400) | 0px | 1.6 | 标签、徽章 |
| Caption 2 | 11pt | Regular (400) | 0px | 1.65 | 极小文字 |

### Tailwind 配置

```javascript
// tailwind.config.js
const fontFamily = {
  'sf-pro-display': [
    '"SF Pro Display"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif'
  ],
  'sf-pro-text': [
    '"SF Pro Text"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif'
  ]
}

const fontSize = {
  // SF Pro Display
  'title-1': ['2.125rem', { lineHeight: '2.5625rem', letterSpacing: '-0.5px', fontWeight: '600' }],
  'title-2': ['1.75rem', { lineHeight: '2.1rem', letterSpacing: '-0.5px', fontWeight: '600' }],
  'title-3': ['1.375rem', { lineHeight: '1.71875rem', letterSpacing: '-0.5px', fontWeight: '600' }],
  'large-title': ['2.125rem', { lineHeight: '2.7625rem', letterSpacing: '0.5px', fontWeight: '700' }],
  
  // SF Pro Text
  'headline': ['1.0625rem', { lineHeight: '1.4875rem', letterSpacing: '-0.5px', fontWeight: '600' }],
  'body': ['1.0625rem', { lineHeight: '1.4875rem', letterSpacing: '-0.5px', fontWeight: '400' }],
  'callout': ['1rem', { lineHeight: '1.45rem', letterSpacing: '-0.5px', fontWeight: '400' }],
  'subhead': ['0.9375rem', { lineHeight: '1.40625rem', letterSpacing: '-0.5px', fontWeight: '400' }],
  'footnote': ['0.8125rem', { lineHeight: '1.259375rem', letterSpacing: '-0.5px', fontWeight: '400' }],
  'caption-1': ['0.75rem', { lineHeight: '1.2rem', letterSpacing: '0', fontWeight: '400' }],
  'caption-2': ['0.6875rem', { lineHeight: '1.13125rem', letterSpacing: '0', fontWeight: '400' }]
}
```

### 使用规范

#### 标题层级
```tsx
<h1 className="font-sf-pro-display text-title-1">音乐馆</h1>
<h2 className="font-sf-pro-display text-title-2">推荐歌单</h2>
<h3 className="font-sf-pro-display text-title-3">今日精选</h3>
```

#### 正文内容
```tsx
<p className="font-sf-pro-text text-body">正文内容使用 body 样式</p>
<span className="font-sf-pro-text text-subhead">次要信息使用 subhead</span>
<small className="font-sf-pro-text text-caption-1">标签使用 caption-1</small>
```

#### 音乐特有
```tsx
// 歌曲名
<span className="font-sf-pro-text text-headline">歌曲名称</span>

// 歌手名
<span className="font-sf-pro-text text-body text-white/60">歌手名</span>

// 专辑名
<span className="font-sf-pro-text text-subhead text-white/40">专辑名称</span>

// 播放数
<span className="font-sf-pro-text text-caption-1">1.2万次播放</span>
```

---

## 三、圆角系统 Corner Radius

macOS 标准圆角值，基于 8pt 网格系统。

### 标准圆角值

| 名称 | 值 | Tailwind 类 | 使用场景 |
|------|-----|------------|----------|
| xs | 4pt (8px) | rounded-lg | 小按钮、标签、徽章 |
| sm | 6pt (12px) | rounded-xl | 输入框、卡片小元素 |
| md | 8pt (16px) | rounded-2xl | 标准卡片、对话框 |
| lg | 10pt (20px) | rounded-3xl | 大卡片、面板 |
| xl | 12pt (24px) | rounded-[24px] | 模态框、大面板 |
| 2xl | 16pt (32px) | rounded-[32px] | Hero 区域 |
| 3xl | 20pt (40px) | rounded-[40px] | 特大卡片 |

### Apple Music 特有圆角

| 组件 | 圆角值 | Tailwind 类 |
|------|--------|------------|
| 专辑封面 | 8pt | rounded-2xl |
| 歌单卡片 | 8pt | rounded-2xl |
| 歌手头像 | 50% | rounded-full |
| 播放列表项 | 6pt | rounded-xl |
| 侧边栏菜单项 | 6pt | rounded-xl |
| 播放按钮 | 50% | rounded-full |
| Hero Banner | 16pt | rounded-3xl |
| 排行榜卡片 | 12pt | rounded-3xl |
| 底部播放器 | 0 | none |

### 圆角组合

```tsx
// 专辑封面 + 播放按钮
<div className="relative rounded-2xl overflow-hidden">
  <img src="cover.jpg" alt="专辑封面" />
  <button className="absolute bottom-2 right-2 w-12 h-12 bg-red-500 rounded-full">
    <PlayIcon />
  </button>
</div>

// 歌手卡片
<div className="rounded-full overflow-hidden">
  <img src="avatar.jpg" alt="歌手头像" className="w-24 h-24" />
</div>

// 侧边栏菜单项
<button className="w-full px-3 py-3 rounded-xl hover:bg-white/5">
  <MenuIcon />
</button>
```

---

## 四、间距系统 Spacing

macOS 使用基于 8pt 的网格系统，确保视觉一致性。

### 8pt 网格系统

| 值 | 像素 | Tailwind 类 | 使用场景 |
|----|------|------------|----------|
| 0 | 0px | p-0, m-0 | 无间距 |
| 0.5 | 4px | p-1, m-1 | 极小间距 |
| 1 | 8px | p-2, m-2 | 基础单位 |
| 1.5 | 12px | p-3, m-3 | 小间距 |
| 2 | 16px | p-4, m-4 | 标准间距 |
| 2.5 | 20px | p-5, m-5 | 中间距 |
| 3 | 24px | p-6, m-6 | 大间距 |
| 4 | 32px | p-8, m-8 | 较大间距 |
| 5 | 40px | p-10, m-10 | 很大间距 |
| 6 | 48px | p-12, m-12 | 超大间距 |
| 8 | 64px | p-16, m-16 | 极大间距 |
| 10 | 80px | p-20, m-20 | 页面级间距 |
| 12 | 96px | p-24, m-24 | 全屏间距 |

### 组件间距规范

#### 内部间距
- 组件内元素: 8-12px (p-2, p-3)
- 卡片内边距: 16px (p-4)
- 按钮内边距: 12px horizontal, 8px vertical (px-3 py-2)

#### 相关组件间
- 相关卡片间距: 12-16px (gap-3, gap-4)
- 列表项间距: 0 (border-b 分隔)
- 歌曲行间距: 0 (斑马纹背景)

#### 独立区块间
- 区块标题与内容: 16px (mb-4)
- 独立区块间距: 24-32px (mb-6, mb-8)

#### 主要区块间
- 大区块间距: 32-48px (mb-8, mb-12)

#### 页面边距
- 移动端: 24px (px-6)
- 平板: 32px (px-8)
- 桌面: 32px (px-8)

### 侧边栏规范

#### 尺寸
- 标准宽度: 260px
- 紧凑宽度: 200px
- 最小宽度: 180px
- 收缩宽度: 64px (仅图标)

#### 导航项
- 高度: 44px (触摸目标)
- 内边距: 12px horizontal, 8px vertical (px-3 py-2)
- 图标与文字间距: 12px (gap-3)
- 分组间距: 8px (gap-2)

#### 侧边栏内边距
- 顶部: 16px (pt-4)
- 左右: 12px (px-3)
- 底部: 16px (pb-4)

### 布局示例

```tsx
// 歌单卡片网格
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  <PlaylistCard />
</div>

// 歌曲列表
<div className="flex flex-col">
  {songs.map((song, index) => (
    <SongRow key={song.id} song={song} />
  ))}
</div>

// 侧边栏导航
<nav className="flex flex-col gap-2 p-3">
  <NavItem icon={MusicIcon} label="发现音乐" />
  <NavItem icon={HeartIcon} label="我喜欢的音乐" />
</nav>
```

---

## 五、阴影系统 Shadows

macOS 使用分层阴影系统，营造视觉深度。

### Elevation 阴影系统

| 级别 | 阴影值 | Tailwind 类 | 使用场景 |
|------|--------|------------|----------|
| Level 1 | `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)` | shadow-sm | 浮动按钮、小卡片悬停 |
| Level 2 | `0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)` | shadow-md | 标准卡片、对话框 |
| Level 3 | `0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)` | shadow-lg | 模态框、下拉菜单 |
| Level 4 | `0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)` | shadow-xl | 侧边栏、大面板 |
| Level 5 | `0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)` | shadow-2xl | 播放器固定栏 |

### 毛玻璃专用阴影

| 级别 | 阴影值 | 使用场景 |
|------|--------|----------|
| Glass Level 1 | `0 8px 32px rgba(0,0,0,0.04)` | 浮动毛玻璃卡片 |
| Glass Level 2 | `0 8px 32px rgba(0,0,0,0.08)` | 标准毛玻璃面板 |
| Glass Level 3 | `0 8px 32px rgba(0,0,0,0.12)` | 毛玻璃模态框 |

### 内阴影

| 类型 | 阴影值 | 使用场景 |
|------|--------|----------|
| Inset | `inset 0 2px 4px rgba(0,0,0,0.06)` | 输入框、按钮按下状态 |

### Tailwind 配置

```javascript
// tailwind.config.js
const boxShadow = {
  'sm': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  'md': '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
  'lg': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  'xl': '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  '2xl': '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
  'glass-1': '0 8px 32px rgba(0,0,0,0.04)',
  'glass-2': '0 8px 32px rgba(0,0,0,0.08)',
  'glass-3': '0 8px 32px rgba(0,0,0,0.12)',
  'inset': 'inset 0 2px 4px rgba(0,0,0,0.06)'
}
```

### 使用示例

```tsx
// 播放按钮
<button className="w-12 h-12 bg-red-500 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200">
  <PlayIcon />
</button>

// 歌单卡片
<div className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
  <PlaylistCard />
</div>

// 毛玻璃侧边栏
<div className="bg-white/80 backdrop-blur-2xl shadow-glass-2">
  <Sidebar />
</div>

// 底部播放器
<div className="bg-white/90 backdrop-blur-2xl shadow-2xl">
  <PlayerBar />
</div>
```

---

## 六、动画系统 Animation

macOS 标准动画曲线和时长，确保流畅自然的交互体验。

### 标准缓动曲线

| 曲线名称 | cubic-bezier 值 | 使用场景 |
|----------|----------------|----------|
| ease-out | `cubic-bezier(0.0, 0.0, 0.2, 1)` | 元素进入、滑入 |
| ease-in-out | `cubic-bezier(0.4, 0.0, 0.2, 1)` | 状态切换、展开/收起 |
| spring | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | 按钮点击、弹跳效果 |
| linear | `cubic-bezier(0.0, 0.0, 1.0, 1.0)` | 进度条、匀速动画 |
| custom-A | `cubic-bezier(0.25, 0.1, 0.25, 1)` | 卡片悬停、播放按钮 |
| custom-B | `cubic-bezier(0.4, 0, 0.2, 1)` | 页面切换、过渡 |

### 动画时长

| 类型 | 时长 | 使用场景 |
|------|------|----------|
| 微交互 | 150-200ms | 按钮悬停、小元素变化 |
| 标准过渡 | 250-300ms | 卡片进入、常规状态切换 |
| 复杂过渡 | 400-500ms | 页面切换、大元素动画 |
| 慢速过渡 | 500-600ms | Hero 区域进入 |

### 预定义动画

#### 入场动画
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

#### 播放器特有动画
```css
/* 播放器滑入 */
@keyframes playerSlideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 播放按钮弹跳 */
@keyframes buttonBounce {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

/* 音波动画 */
@keyframes soundWave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

/* 进度条脉冲 */
@keyframes progressPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
```

#### 悬停效果
```css
/* 卡片悬停 */
.card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  transition: all 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* 播放按钮滑入 */
.play-button {
  transform: translateY(100%);
  opacity: 0;
}
.card:hover .play-button {
  transform: translateY(0);
  opacity: 1;
  transition: all 200ms ease-out;
}

/* 当前播放项高亮 */
.playing-row {
  background: linear-gradient(90deg, rgba(250, 45, 47, 0.1) 0%, transparent 100%);
  border-left: 3px solid #fa2d2f;
}
```

### Tailwind 配置

```javascript
// tailwind.config.js
const extend = {
  animation: {
    'fade-in': 'fadeIn 300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
    'slide-up': 'slideUp 300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
    'slide-down': 'slideDown 300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
    'slide-left': 'slideLeft 300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
    'slide-right': 'slideRight 300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
    'scale-in': 'scaleIn 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'scale-out': 'scaleOut 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'player-slide-up': 'playerSlideUp 400ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    'button-bounce': 'buttonBounce 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'sound-wave': 'soundWave 1s ease-in-out infinite',
    'progress-pulse': 'progressPulse 2s ease-in-out infinite'
  },
  transitionTimingFunction: {
    'ease-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'custom-a': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'custom-b': 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
```

### 使用示例

```tsx
// 卡片悬停
<div className="rounded-2xl hover:-translate-y-1 hover:scale-102 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
  <Card />
</div>

// 播放按钮点击动画
<button className="animate-button-bounce">
  <PlayIcon />
</button>

// 音波图标（播放中）
<div className="flex gap-1">
  <div className="w-1 h-4 bg-red-500 animate-sound-wave"></div>
  <div className="w-1 h-6 bg-red-500 animate-sound-wave delay-100"></div>
  <div className="w-1 h-3 bg-red-500 animate-sound-wave delay-200"></div>
</div>

// 页面进入
<div className="animate-slide-up">
  <PageContent />
</div>
```

---

## 七、图标系统 Icons

遵循 SF Symbols 设计原则，确保图标与 macOS 原生体验一致。

### SF Symbols 设计原则

#### 基本规范
- **线条粗细**: 2px (24x24 视口)
- **端点样式**: round (圆角端点)
- **连接样式**: round (圆角连接)
- **填充风格**: 主要使用 Fill (填充) 风格
- **一致性**: 所有图标使用统一的视觉语言

#### 图标尺寸

| 尺寸 | 视口 | 使用场景 |
|------|------|----------|
| Small | 16x16px | 按钮内小图标、标签图标 |
| Medium | 20x20px | 导航图标、菜单图标 |
| Large | 24x24px | 标准图标、按钮图标 |
| Extra Large | 28x28px | 大按钮图标、Hero 区域 |

#### Tailwind 类名
- 16x16: `w-4 h-4`
- 20x20: `w-5 h-5`
- 24x24: `w-6 h-6`
- 28x28: `w-7 h-7`

### 图标颜色规范

#### 状态颜色
| 状态 | 颜色 | Tailwind 类 |
|------|------|------------|
| 主要操作 | 继承文本颜色 | text-current |
| 次要操作 | 60% 不透明度 | text-white/60 |
| 禁用 | 30% 不透明度 | text-white/30 |
| 激活 | 强调色 | text-[#fa2d2f] |
| 悬停 | 80% 不透明度 | text-white/80 |

#### Dark Mode
| 状态 | 颜色 | Tailwind 类 |
|------|------|------------|
| 主要操作 | white | text-white |
| 次要操作 | rgba(255,255,255,0.6) | text-white/60 |
| 禁用 | rgba(255,255,255,0.3) | text-white/30 |
| 激活 | #fa2d2f | text-[#fa2d2f] |

#### Light Mode
| 状态 | 颜色 | Tailwind 类 |
|------|------|------------|
| 主要操作 | #1D1D1F | text-[#1D1D1F] |
| 次要操作 | rgba(0,0,0,0.6) | text-black/60 |
| 禁用 | rgba(0,0,0,0.3) | text-black/30 |
| 激活 | #fa2d2f | text-[#fa2d2f] |

### SF Symbols 动画类型

SF Symbols 支持三种动画类型，可以通过 CSS 实现：

#### 1. Bounce (弹跳)
```tsx
<Icon className="animate-bounce" />
```

#### 2. Pulse (脉冲)
```tsx
<Icon className="animate-pulse" />
```

#### 3. Scale (缩放)
```tsx
<Icon className="hover:scale-110 transition-transform duration-200" />
```

### 音乐播放器图标集

#### 播放控制
| 图标 | 名称 | 使用场景 |
|------|------|----------|
| ▶️ | Play | 播放按钮 |
| ⏸️ | Pause | 暂停按钮 |
| ⏮️ | Backward | 上一首 |
| ⏭️ | Forward | 下一首 |

#### 播放模式
| 图标 | 名称 | 使用场景 |
|------|------|----------|
| 🔁 | Repeat | 列表循环 |
| 🔂 | Repeat One | 单曲循环 |
| 🔀 | Shuffle | 随机播放 |

#### 音量控制
| 图标 | 名称 | 使用场景 |
|------|------|----------|
| 🔊 | Speaker | 音量图标 |
| 🔈 | Speaker Low | 低音量 |
| 🔇 | Mute | 静音 |

#### 功能按钮
| 图标 | 名称 | 使用场景 |
|------|------|----------|
| ❤️ | Heart | 喜欢 |
| 💔 | Heart Fill | 已喜欢 |
| ⬇️ | Download | 下载 |
| ⋯ | More | 更多选项 |
| 📋 | List | 播放列表 |
| 📝 | Plus | 创建歌单 |
| 🔍 | Search | 搜索 |

#### 导航
| 图标 | 名称 | 使用场景 |
|------|------|----------|
| 🎵 | Music | 发现音乐 |
| 🎧 | Headphones | 私人 FM |
| 📺 | Video | 视频 |
| 🎤 | Microphone | 电台 |
| 💿 | Compact Disc | 本地音乐 |
| ❤️ | Heart | 我喜欢的音乐 |

#### 音乐信息
| 图标 | 名称 | 使用场景 |
|------|------|----------|
| 🎤 | Artist | 歌手 |
| 💿 | Album | 专辑 |
| ⏱️ | Clock | 时长 |
| 🎵 | Music Note | 歌曲 |
| 📀 | Vinyl Record | 黑胶封面 |
| 🎧 | Headphones | 播放中 |

### 图标使用示例

```tsx
// 播放按钮
<button className="w-12 h-12 bg-[#fa2d2f] rounded-full flex items-center justify-center text-white hover:bg-[#ff3b30] transition-colors duration-200">
  <PlayIcon className="w-6 h-6" />
</button>

// 导航项
<button className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors duration-200">
  <MusicIcon className="w-5 h-5 text-white" />
  <span className="font-sf-pro-text text-body text-white">发现音乐</span>
</button>

// 喜欢按钮
<button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-[#fa2d2f] transition-colors duration-200">
  <HeartIcon className="w-5 h-5" />
</button>

// 音波图标（播放中）
<div className="flex items-center gap-0.5">
  <div className="w-1 h-3 bg-[#fa2d2f] rounded-full animate-sound-wave"></div>
  <div className="w-1 h-4 bg-[#fa2d2f] rounded-full animate-sound-wave delay-75"></div>
  <div className="w-1 h-3 bg-[#fa2d2f] rounded-full animate-sound-wave delay-150"></div>
</div>
```

---

## 九、组件详细设计

### 1. 侧边栏 Sidebar

```typescript
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  playlists: Playlist[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}
```

#### 尺寸规范
- 标准宽度: 260px (默认)
- 紧凑宽度: 200px
- 最小宽度: 180px
- 收缩宽度: 64px (仅图标模式)
- 高度: 100vh (全屏高度)

#### 视觉设计

**背景与边框:**
```tsx
// Light Mode
className="bg-white/80 backdrop-blur-2xl border-r border-black/8"

// Dark Mode
className="bg-[#1C1C1E]/80 backdrop-blur-2xl border-r border-white/8"
```

**阴影:** `shadow-glass-2`

**内边距:**
- 顶部: 16px (pt-4)
- 左右: 12px (px-3)
- 底部: 16px (pb-4)

#### 导航项规范

**尺寸:**
- 高度: 44px (触摸目标最小尺寸)
- 内边距: 12px horizontal, 8px vertical (px-3 py-2)
- 圆角: 6pt (rounded-xl)

**图标:**
- 尺寸: 20x20px (w-5 h-5)
- 与文字间距: 12px (gap-3)
- 颜色: text-white (主要) / text-white/60 (次要)

**文字:**
- 字体: SF Pro Text, Body 样式
- 大小: 17pt (text-body)
- 字重: Regular (400)
- 字间距: -0.5px

**分组间距:**
- 导航项之间: 8px (gap-2)
- 分组之间: 24px (gap-6)

#### 状态设计

**默认状态:**
```tsx
<button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors duration-200">
  <MusicIcon className="w-5 h-5 text-white" />
  <span className="font-sf-pro-text text-body text-white">发现音乐</span>
</button>
```

**选中状态:**
```tsx
<button className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#fa2d2f]/10 text-[#fa2d2f]">
  <MusicIcon className="w-5 h-5" />
  <span className="font-sf-pro-text text-body font-semibold">发现音乐</span>
</button>
```

**悬停状态:**
```tsx
hover:bg-white/5 (Dark Mode)
hover:bg-black/5 (Light Mode)
```

**收缩模式:**
```tsx
<button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/5">
  <MusicIcon className="w-5 h-5" />
</button>
```

#### 交互规范
- 悬停: 背景色过渡 200ms ease-out
- 点击: 无延迟反馈
- 激活: 状态持久化
- 滚动: 独立滚动区域，平滑滚动

---

### 2. Hero Banner 轮播区

```typescript
interface HeroBannerProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
}

interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description?: string;
  type: 'playlist' | 'album' | 'artist';
  targetId: string;
  gradient: string; // 渐变配色
  coverImage?: string; // 专辑封面
}
```

#### 尺寸规范
- 标准高度: 360px (桌面端)
- 最小高度: 280px (移动端)
- 宽度: 100%
- 内边距: 32px (px-8)

#### 视觉设计

**整体容器:**
```tsx
<div className="relative w-full h-90 rounded-3xl overflow-hidden shadow-lg">
  <BannerContent />
</div>
```

**背景:**
- 渐变: 90deg linear-gradient, 从半透明到透明
- 模糊背景图: `bg-cover bg-center blur-3xl scale-110`
- 叠加: 半透明遮罩层

**圆角:** 16pt (rounded-3xl)

**阴影:** Level 3 (shadow-lg)

#### 内容布局

**左侧文字区域:**
```tsx
<div className="relative z-10 max-w-lg">
  <h1 className="font-sf-pro-display text-title-1 mb-4">
    {banner.title}
  </h1>
  <p className="font-sf-pro-text text-body text-white/80 mb-6">
    {banner.subtitle}
  </p>
  <button className="bg-[#fa2d2f] text-white px-6 py-3 rounded-xl font-sf-pro-text text-body font-semibold">
    立即播放
  </button>
</div>
```

**右侧专辑封面 (3D 效果):**
```tsx
<div className="relative w-50 h-50 perspective-1000">
  <div 
    className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 ease-out"
    style={{
      transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)'
    }}
  >
    <img 
      src={banner.coverImage} 
      alt="专辑封面"
      className="w-full h-full object-cover"
    />
  </div>
</div>
```

#### 指示器规范

**尺寸:**
- 默认: 8px 直径 (w-2 h-2)
- 当前项: 10px 直径 (w-2.5 h-2.5)
- 间距: 8px (gap-2)

**样式:**
```tsx
// 默认状态
<div className="w-2 h-2 rounded-full bg-white/40 transition-all duration-300" />

// 当前状态
<div className="w-2.5 h-2.5 rounded-full bg-[#fa2d2f] scale-125 transition-all duration-300" />
```

**位置:** 底部中央，距离底部 24px

#### 切换箭头

**尺寸:**
- 按钮: 48x48px (w-12 h-12)
- 图标: 24x24px (w-6 h-6)

**样式:**
```tsx
<button className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200">
  <ChevronLeftIcon className="w-6 h-6" />
</button>
```

**位置:**
- 左箭头: left-4
- 右箭头: right-4

**显示条件:** 鼠标悬停时显示

#### 交互规范

**自动轮播:**
- 间隔: 5000ms
- 过渡动画: 300ms ease-out
- 悬停暂停: true

**切换动画:**
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

**3D 封面交互:**
- 鼠标移动时跟随倾斜
- 倾斜范围: -10deg 到 10deg
- 恢复动画: 300ms ease-out

#### 响应式适配

| 断点 | 高度 | 封面显示 | 布局 |
|------|------|----------|------|
| Mobile | 240px | 隐藏 | 单列，文字居中 |
| Tablet | 280px | 显示 (缩小) | 两列，左文右图 |
| Laptop | 320px | 显示 (标准) | 两列，左文右图 |
| Desktop | 360px | 显示 (放大) | 两列，左文右图 |

---

### 3. 歌单卡片 PlaylistCard

```typescript
interface PlaylistCardProps {
  playlist: {
    id: string;
    name: string;
    coverImg: string;
    playCount: number;
    trackCount: number;
    creator?: string;
    description?: string;
  };
  size?: 'small' | 'medium' | 'large';
  showPlayCount?: boolean;
}
```

**视觉设计:**
- 封面: 圆角 `rounded-2xl`，阴影 `shadow-lg`
- 播放按钮: 右下角悬浮，hover 时从下方滑入
- 播放数: 右上角小标签，带耳机图标
- 文字: 歌单名 14px 加粗，描述 12px 灰色

**交互:**
- hover: 封面轻微放大 (scale-105)，播放按钮滑入
- 点击: 进入歌单详情页
- 右键: 显示上下文菜单（添加到播放队列等）

---

### 4. 歌曲列表 SongList

```typescript
interface SongListProps {
  songs: Song[];
  showHeader?: boolean;
  showAlbum?: boolean;
  showDuration?: boolean;
  onSongClick?: (song: Song) => void;
  currentSong?: Song;
  isPlaying?: boolean;
}

interface Song {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration: number;
  mv?: boolean;
  sq?: boolean; // 无损音质标识
}
```

**视觉设计:**
- 表头: 灰色背景 `bg-white/5`，文字 `text-white/60`
- 行高: 56px，斑马纹交替背景
- 当前播放: 左侧红色竖条指示器 + 音波动画图标
- 悬停: 背景变为 `bg-white/10`，显示操作按钮（喜欢、下载、更多）

**交互:**
- 双击: 播放歌曲
- 悬停: 显示播放按钮（替换序号）
- 拖拽: 支持拖拽排序（我的歌单内）

---

### 5. 底部播放器 PlayerBar

```typescript
interface PlayerBarProps {
  currentSong?: Song;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playMode: 'list' | 'random' | 'single';
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (progress: number) => void;
  onVolumeChange: (volume: number) => void;
  onModeChange: (mode: PlayMode) => void;
  onShowPlaylist?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}
```

#### 尺寸规范
- 标准高度: 88px (包含边框)
- 展开高度: 400px (全屏播放器)
- 左右内边距: 16px (px-4)
- 固定位置: bottom-0, left-0, right-0

#### 视觉设计

**整体容器:**
```tsx
// Light Mode
<div className="fixed bottom-0 left-0 right-0 h-22 bg-white/90 backdrop-blur-2xl border-t border-black/8 shadow-2xl">

// Dark Mode
<div className="fixed bottom-0 left-0 right-0 h-22 bg-[#1C1C1E]/90 backdrop-blur-2xl border-t border-white/8 shadow-2xl">
```

**阴影:** Level 5 (shadow-2xl)

**z-index:** 100 (高于所有内容)

#### 布局比例

| 区域 | 宽度 | 内容 |
|------|------|------|
| 左侧 (歌曲信息) | 30% | 封面 + 歌曲名 + 歌手名 |
| 中间 (控制) | 40% | 播放控制 + 进度条 |
| 右侧 (功能) | 30% | 音量 + 播放列表 + 展开按钮 |

#### 左侧区域 - 歌曲信息

**封面图:**
```tsx
<div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
  <img 
    src={currentSong?.album.cover} 
    alt="专辑封面"
    className="w-full h-full object-cover"
  />
</div>
```

**尺寸:** 48x48px (w-12 h-12)

**圆角:** 6pt (rounded-xl)

**阴影:** Level 2 (shadow-md)

**文字信息:**
```tsx
<div className="ml-3 flex-1 min-w-0">
  <h3 className="font-sf-pro-text text-headline text-white truncate">
    {currentSong?.name}
  </h3>
  <p className="font-sf-pro-text text-body text-white/60 truncate">
    {currentSong?.artists.map(a => a.name).join(', ')}
  </p>
</div>
```

**字体:**
- 歌曲名: SF Pro Text, Headline, text-white
- 歌手名: SF Pro Text, Body, text-white/60

#### 中间区域 - 播放控制

**控制按钮组:**
```tsx
<div className="flex items-center justify-center gap-4">
  <button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200">
    <ShuffleIcon className="w-5 h-5" />
  </button>
  
  <button className="w-10 h-10 flex items-center justify-center text-white hover:text-[#fa2d2f] transition-colors duration-200">
    <BackwardIcon className="w-6 h-6" />
  </button>
  
  <button 
    className="w-12 h-12 bg-[#fa2d2f] rounded-full flex items-center justify-center text-white hover:bg-[#ff3b30] transition-all duration-200"
    onClick={isPlaying ? onPause : onPlay}
  >
    {isPlaying ? <PauseIcon /> : <PlayIcon />}
  </button>
  
  <button className="w-10 h-10 flex items-center justify-center text-white hover:text-[#fa2d2f] transition-colors duration-200">
    <ForwardIcon className="w-6 h-6" />
  </button>
  
  <button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200">
    <RepeatIcon className="w-5 h-5" />
  </button>
</div>
```

**播放按钮:**
- 尺寸: 48x48px (w-12 h-12)
- 圆角: 50% (rounded-full)
- 背景: #fa2d2f
- 图标: 24x24px (w-6 h-6)
- 悬停: scale-1.05, bg-[#ff3b30]
- 按下: scale-0.95

**导航按钮:**
- 尺寸: 40x40px (w-10 h-10)
- 图标: 24x24px (w-6 h-6)
- 颜色: text-white/60 → text-white

**功能按钮:**
- 尺寸: 32x32px (w-8 h-8)
- 图标: 20x20px (w-5 h-5)
- 颜色: text-white/60 → text-white

#### 进度条设计

**整体结构:**
```tsx
<div className="mt-2 flex items-center gap-3">
  <span className="font-sf-pro-text text-caption-1 text-white/60 w-10 text-right">
    {formatTime(progress)}
  </span>
  
  <div className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer group relative">
    <div 
      className="h-full bg-[#fa2d2f] rounded-full relative"
      style={{ width: `${(progress / duration) * 100}%` }}
    >
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm" />
    </div>
  </div>
  
  <span className="font-sf-pro-text text-caption-1 text-white/60 w-10">
    {formatTime(duration)}
  </span>
</div>
```

**轨道:**
- 高度: 4px (h-1)
- 背景: bg-white/20
- 圆角: rounded-full

**已播放部分:**
- 颜色: #fa2d2f
- 圆角: rounded-full
- 发光效果: box-shadow: 0 0 8px rgba(250, 45, 47, 0.5)

**拖拽点:**
- 尺寸: 12x12px (w-3 h-3)
- 颜色: white
- 圆角: 50%
- 阴影: shadow-sm
- 默认隐藏，悬停显示: opacity-0 → opacity-100

**时间显示:**
- 字体: SF Pro Text, Caption 1
- 颜色: text-white/60
- 宽度: 40px (w-10)

#### 右侧区域 - 功能控制

**音量控制:**
```tsx
<div className="flex items-center gap-2">
  <button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200">
    <SpeakerIcon className="w-5 h-5" />
  </button>
  
  <div className="w-24 h-1 bg-white/20 rounded-full cursor-pointer">
    <div 
      className="h-full bg-white/80 rounded-full"
      style={{ width: `${volume * 100}%` }}
    />
  </div>
</div>
```

**播放列表按钮:**
```tsx
<button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200">
  <ListIcon className="w-5 h-5" />
</button>
```

**展开按钮:**
```tsx
<button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200">
  <ChevronUpIcon className="w-5 h-5" />
</button>
```

#### 状态设计

**播放中:**
- 播放按钮显示暂停图标
- 音波动画显示
- 进度条实时更新

**暂停:**
- 播放按钮显示播放图标
- 音波动画隐藏
- 进度条暂停

**拖拽进度:**
- 拖拽点放大: scale-1.2
- 阴影增强: shadow-lg
- 时间显示高亮

#### 动画规范

**进入动画:**
```css
@keyframes playerSlideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

**时长:** 400ms ease-out

**悬停效果:**
```tsx
// 播放按钮
hover:scale-105 transition-transform duration-200

// 图标按钮
hover:text-white transition-colors duration-200

// 拖拽点
group-hover:opacity-100 transition-opacity duration-200
```

#### 响应式适配

| 断点 | 高度 | 布局调整 |
|------|------|----------|
| Mobile | 72px | 隐藏音量，简化控制 |
| Tablet | 80px | 完整布局 |
| Laptop | 88px | 完整布局 |
| Desktop | 88px | 完整布局 |

---

### 6. 排行榜组件 RankingCard

```typescript
interface RankingCardProps {
  ranking: {
    id: string;
    name: string;
    coverImg: string;
    updateTime: string;
    tracks: Song[];
  };
  showTop?: number; // 默认显示前3首
}
```

**视觉设计:**
- 卡片: 白色背景，圆角 `rounded-2xl`
- 封面: 左侧 1/3，带序号标签
- 歌曲列表: 右侧 2/3，显示前3首
- 查看更多: 底部链接

---

### 7. 歌手卡片 ArtistCard

```typescript
interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    avatar: string;
    fans?: number;
  };
  shape?: 'circle' | 'rounded';
}
```

**视觉设计:**
- 圆形头像: `rounded-full`，hover 时轻微放大
- 姓名: 居中显示，14px
- 粉丝数: 次要文字，12px

---

## 十一、页面布局代码结构

```tsx
// app/music/page.tsx
export default function MusicHallPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex">
      {/* 侧边栏 - 260px 标准宽度 */}
      <aside className="hidden md:flex md:w-65 lg:w-65 xl:w-65 2xl:w-70 h-screen flex-shrink-0">
        <MusicSidebar />
      </aside>
      
      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto pb-22 md:pb-22">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
          {/* Hero Banner - 360px 标准高度 */}
          <section className="mb-8">
            <HeroBanner />
          </section>
          
          {/* 推荐歌单 */}
          <section className="mb-12">
            <Section 
              title="推荐歌单" 
              titleClassName="font-sf-pro-display text-title-2"
              moreLink="/music/playlists"
            >
              <PlaylistScroll list={recommendedPlaylists} />
            </Section>
          </section>
          
          {/* 排行榜 */}
          <section className="mb-12">
            <Section 
              title="排行榜" 
              titleClassName="font-sf-pro-display text-title-2"
              moreLink="/music/ranking"
            >
              <RankingGrid rankings={rankings} />
            </Section>
          </section>
          
          {/* 歌手推荐 */}
          <section className="mb-12">
            <Section 
              title="热门歌手" 
              titleClassName="font-sf-pro-display text-title-2"
              moreLink="/music/artists"
            >
              <ArtistScroll artists={hotArtists} />
            </Section>
          </section>
          
          {/* 最新音乐 */}
          <section className="mb-12">
            <Section 
              title="最新音乐" 
              titleClassName="font-sf-pro-display text-title-2"
            >
              <SongList songs={newSongs} />
            </Section>
          </section>
        </div>
      </main>
      
      {/* 底部播放器 - 88px 标准高度 */}
      <PlayerBar />
      
      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-2xl border-t border-black/8 dark:border-white/8">
        <div className="flex items-center justify-around h-full">
          <NavItem icon={MusicIcon} label="发现" active />
          <NavItem icon={HeartIcon} label="喜欢" />
          <NavItem icon={SearchIcon} label="搜索" />
          <NavItem icon={UserIcon} label="我的" />
        </div>
      </nav>
    </div>
  );
}

// Section 组件
interface SectionProps {
  title: string;
  titleClassName?: string;
  children: React.ReactNode;
  moreLink?: string;
}

export function Section({ title, titleClassName, children, moreLink }: SectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={cn('font-sf-pro-display text-title-2', titleClassName)}>
          {title}
        </h2>
        {moreLink && (
          <Link 
            href={moreLink}
            className="font-sf-pro-text text-body text-[#fa2d2f] hover:text-[#ff3b30] transition-colors duration-200"
          >
            查看全部
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

// NavItem 组件 (移动端)
interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

export function NavItem({ icon: Icon, label, active }: NavItemProps) {
  return (
    <button className="flex flex-col items-center gap-1">
      <Icon className={cn(
        'w-6 h-6 transition-colors duration-200',
        active ? 'text-[#fa2d2f]' : 'text-black/60 dark:text-white/60'
      )} />
      <span className={cn(
        'font-sf-pro-text text-caption-1 transition-colors duration-200',
        active ? 'text-[#fa2d2f] font-semibold' : 'text-black/60 dark:text-white/60'
      )}>
        {label}
      </span>
    </button>
  );
}
```

---

## 十二、响应式断点

基于 macOS 和 iPad 设备规范定义响应式断点。

### 断点定义

| 断点名称 | 屏幕宽度 | 对应设备 | Tailwind 前缀 |
|----------|----------|----------|---------------|
| Mobile | < 768px | iPhone SE, iPhone 12/13/14/15, iPhone Pro Max | `default` |
| Tablet | 768px - 1024px | iPad Mini, iPad (9.7"), iPad Air (10.9") | `md:` |
| Laptop | 1024px - 1280px | MacBook Air/Pro 13" | `lg:` |
| Desktop | 1280px - 1536px | MacBook Pro 14"/16" | `xl:` |
| Large Desktop | > 1536px | iMac, Studio Display | `2xl:` |

### 布局适配策略

#### Mobile (< 768px)

**侧边栏:**
- 完全隐藏
- 使用底部导航栏替代
- 汉堡菜单打开抽屉式侧边栏

**Hero Banner:**
- 高度: 240px
- 封面: 隐藏
- 布局: 单列，文字居中

**播放器:**
- 高度: 72px
- 布局: 简化控制
- 隐藏: 音量控制

**歌单网格:**
- 列数: 2列 (grid-cols-2)
- 卡片间距: 12px (gap-3)

**页面边距:**
- 左右: 24px (px-6)

**导航:**
- 底部固定导航栏
- 高度: 56px
- 4-5个主要入口

#### Tablet (768px - 1024px)

**侧边栏:**
- 宽度: 可折叠 260px / 64px
- 默认: 展开状态
- 支持手势收起

**Hero Banner:**
- 高度: 280px
- 封面: 显示 (缩小版)
- 布局: 两列，左文右图

**播放器:**
- 高度: 80px
- 布局: 完整布局

**歌单网格:**
- 列数: 3-4列 (grid-cols-3 md:grid-cols-4)
- 卡片间距: 16px (gap-4)

**页面边距:**
- 左右: 32px (px-8)

#### Laptop (1024px - 1280px)

**侧边栏:**
- 宽度: 260px (标准)
- 状态: 始终展开

**Hero Banner:**
- 高度: 320px
- 封面: 显示 (标准)
- 布局: 两列，左文右图

**播放器:**
- 高度: 88px
- 布局: 完整布局

**歌单网格:**
- 列数: 4-5列 (lg:grid-cols-4 xl:grid-cols-5)
- 卡片间距: 16px (gap-4)

**页面边距:**
- 左右: 32px (px-8)

#### Desktop (1280px - 1536px)

**侧边栏:**
- 宽度: 260px (标准)
- 状态: 始终展开

**Hero Banner:**
- 高度: 360px
- 封面: 显示 (放大)
- 布局: 两列，左文右图

**播放器:**
- 高度: 88px
- 布局: 完整布局

**歌单网格:**
- 列数: 5-6列 (xl:grid-cols-5 2xl:grid-cols-6)
- 卡片间距: 16px (gap-4)

**页面边距:**
- 左右: 32px (px-8)

#### Large Desktop (> 1536px)

**侧边栏:**
- 宽度: 280px (加宽)
- 状态: 始终展开

**Hero Banner:**
- 高度: 400px
- 封面: 显示 (最大)
- 布局: 两列，左文右图

**播放器:**
- 高度: 88px
- 布局: 完整布局

**歌单网格:**
- 列数: 6-7列 (2xl:grid-cols-6)
- 卡片间距: 20px (gap-5)

**页面边距:**
- 左右: 40px (px-10)

### Tailwind 响应式示例

```tsx
// 侧边栏响应式
<div className="hidden md:flex md:w-64 lg:w-65 xl:w-65 2xl:w-70">
  <Sidebar />
</div>

// Hero Banner 响应式
<div className="h-60 md:h-70 lg:h-80 xl:h-90 2xl:h-100">
  <HeroBanner />
</div>

// 歌单网格响应式
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
  {playlists.map(playlist => (
    <PlaylistCard key={playlist.id} playlist={playlist} />
  ))}
</div>

// 播放器响应式
<div className="h-18 md:h-20 lg:h-22">
  <PlayerBar />
</div>
```

### 移动端底部导航

**布局:**
```tsx
<nav className="fixed bottom-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-2xl border-t border-black/8 md:hidden">
  <div className="flex items-center justify-around h-full">
    <NavItem icon={MusicIcon} label="发现" active />
    <NavItem icon={HeartIcon} label="喜欢" />
    <NavItem icon={SearchIcon} label="搜索" />
    <NavItem icon={UserIcon} label="我的" />
  </div>
</nav>
```

**规范:**
- 高度: 56px (h-14)
- 背景: bg-white/90 backdrop-blur-2xl
- 边框: border-t border-black/8
- 图标尺寸: 24x24px (w-6 h-6)
- 文字尺寸: Caption 1 (text-caption-1)
- 间距: 均匀分布

### 横屏适配

#### 横屏 Mobile (Landscape)

**侧边栏:**
- 宽度: 200px (紧凑)
- 位置: 左侧

**Hero Banner:**
- 高度: 200px
- 封面: 显示

**歌单网格:**
- 列数: 4-5列

#### 横屏 Tablet (Landscape)

**侧边栏:**
- 宽度: 260px (标准)

**Hero Banner:**
- 高度: 280px

**歌单网格:**
- 列数: 5-6列

### 打印适配

**打印样式:**
```css
@media print {
  .sidebar, .player-bar, .bottom-nav {
    display: none;
  }
  
  .main-content {
    padding: 0;
  }
  
  .playlist-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 可访问性

**触摸目标:**
- 最小尺寸: 44x44px
- 间距: 至少 8px

**键盘导航:**
- Tab 顺序: 侧边栏 → 主内容 → 播放器
- Focus 指示器: 2px 蓝色边框

**屏幕阅读器:**
- ARIA 标签完整
- 语义化 HTML 结构
- 跳过导航链接

---

## 十四、API 接口设计

```typescript
// 获取推荐歌单
GET /api/music/recommend/playlists?limit=10

// 获取排行榜
GET /api/music/rankings

// 获取歌单详情
GET /api/music/playlists/:id

// 获取歌曲详情
GET /api/music/songs/:id

// 搜索
GET /api/music/search?keywords=:q&type=song

// 获取歌词
GET /api/music/lyrics/:songId
```

---

## 十五、文件结构

```
frontend/src/app/music/
├── page.tsx                    # 主页面
├── layout.tsx                  # 音乐馆布局（固定播放器）
├── globals.css                 # 音乐馆专属样式
├── components/
│   ├── MusicSidebar.tsx        # 侧边栏
│   ├── HeroBanner.tsx          # 轮播横幅
│   ├── PlaylistCard.tsx        # 歌单卡片
│   ├── PlaylistScroll.tsx      # 横向滚动歌单列表
│   ├── SongList.tsx            # 歌曲列表
│   ├── SongRow.tsx             # 歌曲行项
│   ├── RankingCard.tsx         # 排行榜卡片
│   ├── RankingGrid.tsx         # 排行榜网格
│   ├── ArtistCard.tsx          # 歌手卡片
│   ├── ArtistScroll.tsx        # 歌手横向滚动
│   ├── PlayerBar.tsx           # 底部播放器
│   ├── PlayerControls.tsx      # 播放控制
│   ├── ProgressBar.tsx         # 进度条
│   ├── VolumeControl.tsx       # 音量控制
│   ├── Section.tsx             # 区块标题组件
│   └── ContextMenu.tsx         # 右键菜单
├── hooks/
│   ├── useMusicPlayer.ts       # 播放器逻辑
│   ├── usePlaylist.ts          # 歌单管理
│   └── useAudio.ts             # 音频控制
├── types/
│   └── music.ts                # TypeScript 类型定义
└── utils/
    └── format.ts               # 时间格式化等工具函数
```

---

## 十六、核心功能清单

### Phase 1: 基础展示
- [x] 页面布局和侧边栏
- [x] Hero Banner 轮播
- [x] 推荐歌单展示
- [x] 排行榜展示
- [x] 歌手推荐

### Phase 2: 播放功能
- [ ] 底部播放器 UI
- [ ] 音频播放控制
- [ ] 播放队列管理
- [ ] 播放模式切换

### Phase 3: 交互增强
- [ ] 歌曲列表交互
- [ ] 歌单详情页
- [ ] 搜索功能
- [ ] 歌词显示

### Phase 4: 高级功能
- [ ] 用户歌单管理
- [ ] 收藏/喜欢功能
- [ ] 播放历史
- [ ] 个性化推荐

---

## 十三、参考截图

### 网易云音乐参考
- 发现页: 横幅 + 推荐歌单 + 排行榜
- 歌单页: 封面 + 歌曲列表 + 评论
- 播放页: 全屏封面 + 歌词 + 相似推荐

### macOS 风格参考
- Apple Music: 侧边栏 + 内容区 + 底部播放栏
- 圆角、毛玻璃、微妙阴影
- 精致的动画和过渡

---

*设计完成时间: 2024年*
*版本: v2.0 - macOS 风格完全对齐*
