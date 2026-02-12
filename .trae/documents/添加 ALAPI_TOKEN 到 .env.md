## 配置 ALAPI_TOKEN 到后端环境变量

### 操作内容
在 `backend/.env` 文件中添加 ALAPI_TOKEN 配置项：

```env
# Weather API (ALAPI)
ALAPI_TOKEN=pcvu1klslticemot9ybghx77upizgj
```

这个配置会被 `app/core/config.py` 中的 `ALAPI_TOKEN` 字段读取，用于调用 ALAPI 天气服务。