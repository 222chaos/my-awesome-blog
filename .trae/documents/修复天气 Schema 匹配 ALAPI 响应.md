## 修复 ALAPI 天气 Schema 错误

### 问题分析
ALAPI 返回的数据结构与我们定义的 Schema 不匹配。从错误日志看，ALAPI 实际返回的字段包括：
- 顶层字段：`request_id`, `usage`, `time`
- data 下的实际字段与我们定义的不一致

### 修复计划
更新 `app/schemas/weather.py` 中的 `WeatherResponse` 和 `WeatherCurrent` 模型，使其匹配 ALAPI 实际响应结构：
1. 添加顶层字段：`request_id`, `usage`, `time`
2. 修正 `data` 中的字段定义，使其与实际 API 响应匹配
3. 调整 `WeatherCurrent` 中的字段类型和约束

这样可以解决 Pydantic 验证错误。