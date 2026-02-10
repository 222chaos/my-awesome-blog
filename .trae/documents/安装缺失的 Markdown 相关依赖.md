## 问题分析

`Module not found: Can't resolve 'react-markdown'` 错误原因是：

在 [MarkdownRenderer.tsx](file:///E:\A_Project\my-awesome-blog\frontend\src\components\ui\MarkdownRenderer.tsx) 中使用了以下 npm 包，但它们**未安装在 frontend/package.json 中**：
- `react-markdown` - React Markdown 渲染器
- `remark-gfm` - GitHub Flavored Markdown 支持
- `rehype-sanitize` - HTML 安全过滤
- `rehype-raw` - 允许原始 HTML

## 修复方案

安装缺失的 npm 依赖：

```bash
cd frontend
npm install react-markdown remark-gfm rehype-sanitize rehype-raw
```

这些包的作用：
- `react-markdown`: 将 Markdown 渲染为 React 组件
- `remark-gfm`: 添加 GitHub Flavored Markdown 支持（表格、删除线等）
- `rehype-sanitize`: 清理 HTML 防止 XSS 攻击
- `rehype-raw`: 允许在 Markdown 中使用原始 HTML 标签