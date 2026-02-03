# 文章页面 UI/UX 现代化实施方案

## 目标
根据 [articles-uiux-improvement-plan.md](file:///e:/A_Project/my-awesome-blog/docs/articles-uiux-improvement-plan.md) 和后端 API，将文章列表页面重构为"赛博杂志"风格。

## 实施步骤

### 第一阶段：创建核心组件
1. **FeaturedCarousel (3D 精选轮播)**
   - 使用后端 `/api/v1/articles/featured` 获取精选文章
   - 实现 3D Cover Flow 效果
   - 动态背景随当前文章主题色变化

2. **CommandBar (悬浮命令栏)**
   - 集成搜索、分类筛选、标签云入口、视图切换
   - 使用 `useSearchParams` 同步 URL 参数
   - 桌面端底部悬浮，移动端顶部吸附

3. **HoloCard (全息文章卡片)**
   - 玻璃拟态基底 + 全息边框
   - 3D Tilt 效果
   - 点击展开全屏阅读模态框
   - 替代现有的 PostCard

4. **ArchiveDrawer (归档抽屉)**
   - 右侧滑出式抽屉
   - 包含分类导航、标签云、热门文章
   - 使用 Framer Motion 实现滑入/滑出动画

### 第二阶段：重构页面布局
5. **重构 articles/page.tsx**
   - 移除 MediaPlayer Hero 区域
   - 添加 FeaturedCarousel 顶部轮播
   - 替换传统筛选栏为 CommandBar
   - 主内容区使用 MasonryGrid 布局（Bento Grid）
   - 替换常驻侧边栏为 ArchiveDrawer
   - 使用后端 `/api/v1/articles/cursor-paginated` 实现光标分页

### 第三阶段：优化与测试
6. **性能优化**
   - 图片懒加载
   - 虚拟滚动（如需要）
   - 流光骨架屏

7. **响应式适配**
   - 移动端 CommandBar 顶部吸附
   - 移动端抽屉全屏显示
   - 触摸手势优化

## 文件清单
**新建组件**：
- `frontend/src/components/articles/FeaturedCarousel.tsx`
- `frontend/src/components/articles/CommandBar.tsx`
- `frontend/src/components/articles/HoloCard.tsx`
- `frontend/src/components/articles/ArchiveDrawer.tsx`

**修改文件**：
- `frontend/src/app/articles/page.tsx` (主要重构)

**保留文件**：
- `frontend/src/app/articles/components/ArticleSidebar.tsx` (可能部分复用)

## 技术栈
- **动画**: Framer Motion
- **3D 效果**: CSS 3D Transforms / React-Tilt
- **分页**: Cursor-based pagination (后端已支持)
- **状态管理**: useSearchParams (Next.js 原生)

是否开始实施？