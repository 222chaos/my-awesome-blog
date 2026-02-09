## 修复侧边栏被导航栏遮挡的问题

### 问题描述
导航栏的 z-index (100) 高于筛选侧边栏的 z-index (50)，导致侧边栏打开时会被导航栏遮挡。

### 修复内容
在 `frontend/src/components/articles/CommandBar.tsx` 中：
- 将筛选侧边栏的 `z-50` 提升为 `z-[110]`，使其高于导航栏的 `z-[100]`
- 确保筛选弹窗的 z-index 也保持高于导航栏

### 修改文件
- `frontend/src/components/articles/CommandBar.tsx`
  - 第 141 行：搜索弹窗的 z-index 从 `z-50` 改为 `z-[110]`
  - 第 211 行：筛选侧边栏的 z-index 从 `z-50` 改为 `z-[110]`
  - 第 57 行：CommandBar 本身的 z-index 保持 `z-40`（低于导航栏是正确的）