## 修复全局CSS导入路径错误

### 问题分析
`chat/layout.tsx`位于`frontend/src/app/chat/`目录，而`globals.css`位于`frontend/src/styles/`目录。

当前错误的相对路径：`'../styles/globals.css'`
正确的相对路径：`'../../styles/globals.css'`

### 解决方案
修改 `frontend/src/app/chat/layout.tsx` 第1行的导入路径

```tsx
// 修改前
import '../styles/globals.css';

// 修改后
import '../../styles/globals.css';
```