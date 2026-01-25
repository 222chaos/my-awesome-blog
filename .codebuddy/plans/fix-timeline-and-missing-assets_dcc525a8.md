---
name: fix-timeline-and-missing-assets
overview: 修复Timeline组件的ref使用错误以及缺失的SVG logo文件404问题
todos:
  - id: fix-timeline-ref
    content: 使用React.forwardRef重构TimelineItem组件以正确处理ref
    status: completed
  - id: create-public-dir
    content: 创建frontend/public目录结构
    status: completed
  - id: add-svg-logos
    content: 添加4个SVG logo文件到public/assets目录
    status: completed
    dependencies:
      - create-public-dir
  - id: verify-fixes
    content: 验证Timeline组件警告已消除且SVG资源正常加载
    status: completed
    dependencies:
      - fix-timeline-ref
      - add-svg-logos
---

## 产品概述

修复博客应用中的两个技术问题：Timeline组件ref使用错误和缺失的SVG logo文件404错误

## 核心功能

- 修复TimelineItem函数组件的ref传递问题，解决React警告
- 创建public目录和assets子目录
- 添加4个SVG logo文件到public/assets目录
- 确保FriendLinks组件能正确显示合作伙伴logo

## 技术栈

- 前端框架：Next.js 14 + React 18 + TypeScript
- 静态资源管理：Next.js Public目录
- 现有项目技术保持不变

## 架构设计

### 修复方案

#### Timeline组件修复

- 问题：TimelineItem函数组件接收ref作为prop导致React警告
- 解决方案：使用React.forwardRef包装TimelineItem组件，正确处理ref转发

#### SVG文件修复

- 问题：public目录不存在，导致/assets/*.svg文件返回404
- 解决方案：

1. 创建frontend/public目录
2. 创建frontend/public/assets子目录
3. 添加4个SVG logo文件（nextjs-logo.svg, vercel-logo.svg, tailwind-logo.svg, radix-logo.svg）

### 文件结构

```
frontend/
├── public/
│   └── assets/
│       ├── nextjs-logo.svg
│       ├── vercel-logo.svg
│       ├── tailwind-logo.svg
│       └── radix-logo.svg
├── src/
│   └── components/
│       └── home/
│           └── Timeline.tsx  # 修改：使用forwardRef包装TimelineItem
```

## 实现细节

### Timeline组件修复要点

**问题分析**：

- 第61-67行：尝试将ref作为prop传递给TimelineItem
- 第76-81行：TimelineItem props中定义了ref字段
- React函数组件不能直接接收ref作为prop

**修复策略**：

```typescript
// 使用React.forwardRef包装TimelineItem
const TimelineItem = React.forwardRef<
  HTMLDivElement,
  { event: TimelineEvent; isLeft: boolean; inView: boolean }
>(({ event, isLeft, inView }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-start mb-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* 组件内容保持不变 */}
    </div>
  );
});

// 给组件添加displayName以利于调试
TimelineItem.displayName = 'TimelineItem';
```

### SVG文件创建要点

**文件位置**：

- frontend/public/assets/nextjs-logo.svg
- frontend/public/assets/vercel-logo.svg
- frontend/public/assets/tailwind-logo.svg
- frontend/public/assets/radix-logo.svg

**SVG内容设计**：

- 每个SVG使用官方品牌标志
- 尺寸：64x64像素
- 格式：optimized SVG
- 内联样式确保一致性

## 技术注意事项

### React Ref规范

- 函数组件默认无法接收ref作为prop
- 使用React.forwardRef来包装需要接收ref的函数组件
- forwardRef返回的组件可以接收ref并转发到内部DOM元素

### Next.js静态资源

- public目录下的文件可以通过/开头的路径直接访问
- 静态资源在构建时会被复制到.output/public或.next/static
- 适合存放图片、字体、favicon等静态文件