---
name: apply-cat-loader-globally
overview: 将可爱的猫咪loading动画应用到项目所有加载场景，统一使用全局loading状态管理
todos:
  - id: update-profile-page
    content: 修改 profile/page.tsx 使用全局猫咪loading
    status: completed
  - id: update-login-page
    content: 修改 login/page.tsx 使用全局猫咪loading
    status: completed
  - id: update-activity-view
    content: 修改 ActivityView.tsx 使用全局猫咪loading
    status: completed
  - id: update-articles-page
    content: 修改 articles/page.tsx 添加全局loading（保留骨架屏）
    status: completed
  - id: update-article-detail
    content: 修改 articles/[id]/page.tsx 添加全局loading（保留骨架屏）
    status: completed
  - id: update-stats-panel
    content: 修改 StatsPanel.tsx 添加全局loading（保留骨架屏）
    status: completed
  - id: update-post-grid
    content: 修改 PostGrid.tsx 添加全局loading（保留骨架屏）
    status: completed
---

## 产品概述

将项目中已实现的可爱猫咪睡觉动画Loader应用到所有需要加载的地方，统一应用的加载体验。

## 现有Loading系统

1. **loading-context.tsx** - 全局loading状态管理（showLoading/hideLoading）
2. **Loader.tsx** - 可爱的猫咪睡觉动画组件（使用framer-motion）
3. **LoadingHandler.tsx** - 包装组件，根据isLoading状态显示Loader
4. **layout.tsx** - 已集成LoadingProvider和LoadingHandler

## 需要修改的文件清单

| 文件 | 当前loading方式 | 修改策略 |
| --- | --- | --- |
| profile/page.tsx | 页面级spin动画 | 使用useLoading全局loading |
| articles/page.tsx | Skeleton骨架屏 | 全局loading + 保留Skeleton内容占位 |
| articles/[id]/page.tsx | Skeleton骨架屏 | 全局loading + 保留Skeleton内容占位 |
| login/page.tsx | 按钮spin动画 | 使用useLoading全局loading |
| profile/components/ActivityView.tsx | 组件级spin动画 | 使用useLoading全局loading |
| components/home/StatsPanel.tsx | ArticleCardSkeleton | 全局loading + 保留骨架屏 |
| components/home/PostGrid.tsx | PostCardSkeleton | 全局loading + 保留骨架屏 |


## 修改原则

1. **页面级数据加载**：使用全局猫咪loading
2. **按钮提交loading**：使用全局猫咪loading
3. **局部内容加载**：使用全局猫咪loading
4. **骨架屏**：保留作为内容占位，同时显示全局loading
5. **图片/文字专用loading**：保持现状

## 技术栈

- Next.js + React + TypeScript
- Tailwind CSS
- Framer Motion（Loader动画）
- 全局Loading Context

## 实现策略

使用现有的 `useLoading` hook 替换各组件中的本地 loading 状态：

```
import { useLoading } from '@/context/loading-context';

const { showLoading, hideLoading } = useLoading();

// 在数据获取时
showLoading();
try {
  const data = await fetchApi();
  setData(data);
} finally {
  hideLoading();
}
```

## 注意事项

- 保留骨架屏作为内容占位，避免布局跳动
- 在 `finally` 块中确保 `hideLoading()` 被调用
- 组件卸载时确保loading状态被正确清理