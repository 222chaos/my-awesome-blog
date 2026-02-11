## 修复前端API拼写错误

### 问题分析
- 后端端点：`/articles/popular`（第92行）
- 前端调用：`/articles/popular`（第69行）

两者拼写一致（都是popular），所以这不是拼写问题。

### 真正的问题
后端端点名称是 `/popular` 而不是 `/popular`。需要检查后端代码确认。

让我先检查后端端点的实际名称。