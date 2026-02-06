## 修复步骤

### 1. 更新前端 Article 类型定义
- 修正 `articleService.ts` 中的 `Article` 接口，添加缺失的字段
- 确保 `category` 字段正确处理（后端通过 computed_field 提供）

### 2. 修复 Loading 状态管理
- 移除冗余的本地 `loading` 状态
- 统一使用全局 Loading Context
- 确保 `hideLoading()` 在 finally 块中总是被调用

### 3. 添加数据库测试数据
- 检查数据库是否有已发布的文章
- 如果没有，运行测试数据生成脚本创建示例文章

### 4. 添加错误处理和调试日志
- 在 `fetchData` 函数中添加更详细的错误日志
- 确保 API 请求失败时有适当的错误提示

## 预期结果
- 文章列表能够正常加载并显示
- Loading 状态能够正确显示和隐藏
- 能够处理空数据的情况