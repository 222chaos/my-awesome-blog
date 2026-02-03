## 实施计划：LogoLoop 技术栈展示

### 1. 创建 LogoLoop 组件
- 在 `frontend/src/components/ui/` 目录下创建 `LogoLoop.tsx`
- 从 logo.md 文档中复制完整的 LogoLoop 组件代码
- 包含所有类型定义、Hooks 和动画逻辑

### 2. 更新 TechStack 组件
- 配置技术栈数据，使用 react-icons 中的图标：
  - React (SiReact)
  - Next.js (SiNextdotjs)
  - TypeScript (SiTypescript)
  - Tailwind CSS (SiTailwindcss)
  - Python (SiPython)
  - PostgreSQL (SiPostgresql)
  - FastAPI (自定义或替代图标)
  - Docker (SiDocker)
  - Git (SiGit)
  - Node.js (SiNodedotjs)

- 应用 LogoLoop 组件配置：
  - `speed={120}` - 滚动速度
  - `direction="left"` - 向左滚动
  - `logoHeight={60}` - Logo 高度
  - `gap={60}` - Logo 间距
  - `hoverSpeed={0}` - 悬停时暂停
  - `scaleOnHover` - 悬停时缩放
  - `fadeOut` - 边缘淡出效果

### 3. 应用玻璃态设计
- 保持 GlassCard 容器
- 添加渐变背景和模糊效果
- 使用项目的 tech-cyan 作为主色调
- 确保深色/浅色模式兼容

### 4. 响应式优化
- 在小屏幕上减小 logo 高度和间距
- 添加容器高度自适应
- 确保移动端和桌面端都有良好的显示效果

### 5. 无障碍优化
- 添加适当的 ARIA 标签
- 确保键盘导航支持
- 添加 hover 状态的视觉反馈