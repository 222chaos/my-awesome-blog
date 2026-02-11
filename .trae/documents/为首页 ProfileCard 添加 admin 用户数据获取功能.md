## 实施计划

**修改文件**: `frontend/src/components/home/ProfileCard.tsx`

1. **导入 API 函数**
   - 添加 `getAdminUserApi` 从 `@/lib/api/auth`

2. **添加加载和错误状态**
   - 添加 `isLoading` 状态用于显示加载中状态
   - 添加 `error` 状态用于处理错误情况

3. **添加 useEffect 获取 admin 用户数据**
   - 在组件挂载时调用 `getAdminUserApi()`
   - 成功时：更新 `userName`, `userBio`, `userAvatar` 状态
   - 失败时：保持默认值并记录错误

4. **数据映射**
   - `full_name` → `userName` (如果不存在则使用 `username`)
   - `bio` → `userBio`
   - `avatar_url` → `userAvatar`

5. **加载状态处理**
   - 在加载期间显示占位符或禁用交互