## 实施计划：在留言页面应用 Loading 组件

### 1. 分析现有代码
- 留言页面目前使用本地 `isLoading` 状态
- 加载时显示简单的旋转加载器
- 项目已有完整的 Loading 系统（LoadingProvider + Loader 组件）

### 2. 修改留言页面 (page.tsx)
- **导入 LoadingProvider 和 Loader 组件**
  ```tsx
  import { LoadingProvider, useLoading } from '@/context/loading-context'
  import Loader from '@/components/loading/Loader'
  ```

- **替换本地加载状态为全局加载状态**
  - 删除 `const [isLoading, setIsLoading] = useState(true)`
  - 使用 `const { showLoading, hideLoading } = useLoading()`

- **更新 loadData 函数**
  - 开始加载时调用 `showLoading()`
  - 完成加载时调用 `hideLoading()`

- **移除条件渲染的加载器**
  - 删除 `if (isLoading)` 返回简单加载器的代码
  - 使用 LoadingProvider 包裹整个组件内容

- **应用 LoadingProvider**
  - 用 `<LoadingProvider>` 包裹整个页面内容

### 3. 改进效果
- 从简单旋转器升级为可爱的猫动画加载器
- 使用全局加载状态管理，便于跨组件共享
- 保持 Framer Motion 的平滑动画效果