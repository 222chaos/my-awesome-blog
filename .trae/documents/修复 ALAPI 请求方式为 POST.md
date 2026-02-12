## 修复 ALAPI 天气 API 请求方式

### 问题分析
ALAPI 期望的请求格式是 POST JSON body：
```json
{
  "token": "pcvu1klslticemot9ybghx77upizgj",
  "city": "杭州"
}
```

但当前代码使用 GET 请求的查询参数格式，导致 400 Bad Request。

### 修复计划
修改 `app/services/weather_service.py`：
1. 将 `client.get()` 改为 `client.post()`
2. 将 `params` 改为 `json` body
3. 保持其他逻辑不变

这样 ALAPI 就能正确处理请求了。