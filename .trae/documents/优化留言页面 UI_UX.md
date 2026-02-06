## 优化留言页面 UI/UX - Cyberpunk 增强版

### 设计方向
基于现有的 Cyberpunk 主题，融合 Glassmorphism、Dimensional Layering 和 Bento Grid，打造大胆前卫的交互体验。

### 新增组件

1. **InteractiveCursor** - 交互式磁力光标
   - 自定义圆形光标
   - 悬停时磁性吸附效果
   - 点击反馈动画
   - 光标轨迹效果

2. **HoloCard** - 全息卡片组件
   - Glassmorphism + 霓虹边框
   - 3D 倾斜效果（跟随鼠标）
   - 扫描线动画
   - 悬停时发光增强

3. **DataVisualization** - 数据可视化组件
   - 实时活动热力图
   - 留言趋势波浪图
   - 用户分布雷达图
   - 动态统计数字

4. **UserLevelBadge** - 用户等级徽章
   - 等级进度条
   - 成就图标
   - 动态光环效果

5. **RealTimeIndicator** - 实时状态指示器
   - 在线用户数（模拟 WebSocket）
   - 实时留言通知
   - 脉冲动画

6. **MessageReactions** - 留言反应系统
   - 表情反应
   - 动态统计
   - 粒子爆炸效果

### 页面布局改造

**Bento Grid 布局：**
```
┌─────────────────────────────────────────────┐
│  Header (Glitch Title)                │
├─────────────┬──────────────┬───────────┤
│  Input     │  Trending    │  Stats    │
│  (2x1)     │  (1x1)        │  (1x2)   │
├─────────────┴──────────────┴───────────┤
│  Message Stream (Masonry Grid)          │
└─────────────────────────────────────────────┘
```

### 动画增强

1. **弹幕系统升级**
   - 多层弹幕（不同速度/透明度）
   - 碰撞检测（避免重叠）
   - 彩虹渐变模式
   - 弹幕暂停/播放控制

2. **页面进入动画**
   - 元素交错淡入
   - 弹幕从右侧飞入
   - 统计图表动态增长

3. **交互动画**
   - 卡片悬停 3D 倾斜
   - 点赞爱心爆炸
   - 删除时收缩动画
   - 发送成功脉冲波纹

### 颜色系统优化

基于现有主题增强：
- Primary: `#00D9FF` (Tech Cyan) - 保持
- Secondary: `#7C3AED` (Tech Purple) - 增强
- Accent: `#F43F5E` (Tech Pink) - 增强
- 新增 Gradient: 霓虹渐变组合
- 新增 Glow: 多层光晕效果

### 新增功能

1. **留言过滤/排序**
   - 最新 | 热门 | 弹幕
   - 按时间/点赞排序

2. **实时预览**
   - Markdown 渲染
   - @用户提及高亮
   - URL 自动链接

3. **快捷操作**
   - 键盘快捷键
   - 快速回复预设
   - 一键收藏

### 文件清单

新建组件：
- `components/ui/InteractiveCursor.tsx`
- `components/ui/HoloCard.tsx`
- `components/messages/UserLevelBadge.tsx`
- `components/messages/MessageReactions.tsx`
- `components/messages/RealTimeStats.tsx`
- `components/messages/EnhancedDanmaku.tsx`

修改文件：
- `app/messages/page.tsx` - 重构布局和添加新组件
- `tailwind.config.js` - 添加自定义动画和颜色