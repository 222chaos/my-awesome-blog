## 问题分析

`Module not found: Can't resolve 'react-window'` 错误原因是：

在 [VirtualMessageList.tsx](file:///E:\A_Project\my-awesome-blog\frontend\src\components\messages\VirtualMessageList.tsx#L4) 中使用了 `react-window` 包来实现虚拟化列表，但该包**未安装在 frontend/package.json 中**。

`react-window` 的作用：
- 虚拟化长列表/网格，只渲染可见区域的项目
- 大幅提高大量数据渲染时的性能
- 提供 `FixedSizeGrid` 组件用于网格布局

## 修复方案

安装缺失的 npm 依赖：

```bash
cd frontend
npm install react-window
```

这样 VirtualMessageList 组件就能正常使用虚拟化网格来高效渲染留言列表了。