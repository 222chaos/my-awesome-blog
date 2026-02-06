## 修复 Label 组件导入大小写问题

### 问题
文件 `Label.tsx` 存在，但导入使用的是小写 `@/components/ui/label`，导致 Turbopack 构建失败。

### 修复方案
将以下文件中的导入语句从 `@/components/ui/label` 改为 `@/components/ui/Label`：

1. `src/app/profile/components/ProfileView.tsx`
2. `src/app/profile/components/SettingsView.tsx`
3. `src/app/profile/components/EditModeForm.tsx`

### 预期结果
- 构建错误消失
- Profile 页面正常加载