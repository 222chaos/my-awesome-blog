## 后端天气模块接入方案

### 技术选型
使用 **ALAPI** 天气服务
- API 地址：`https://v3.alapi.cn/api/tianqi`
- 请求参数：`token`（从环境变量读取）, `city`（城市名称）

### 实现计划

#### 1. 配置文件修改 (`app/core/config.py`)
添加 ALAPI 配置项：
```python
ALAPI_TOKEN: str = Field(default="", description="ALAPI 天气服务密钥")
```

#### 2. 创建天气数据 Schema (`app/schemas/weather.py`)
定义天气数据的 Pydantic 模型：
- `WeatherResponse` - API 响应结构
- `WeatherData` - 当前天气数据
- `WeatherForecast` - 预报数据

#### 3. 创建天气服务 (`app/services/weather_service.py`)
实现天气 API 调用逻辑：
- 调用 ALAPI 获取天气数据
- 城市名称标准化处理
- 缓存机制（可选）
- 错误处理

#### 4. 创建天气 API 端点 (`app/api/v1/endpoints/weather.py`)
定义 API 路由：
- `GET /api/v1/weather/current?city=杭州` - 获取当前天气
- 支持多个城市查询

#### 5. 注册路由 (`app/api/v1/router.py`)
将天气路由添加到 API 路由器

### API 响应示例
```json
{
  "data": {
    "city": "杭州",
    "weather": "晴",
    "temperature": "25°C",
    "humidity": "60%",
    "wind": "3级",
    "update_time": "2024-01-01 12:00"
  }
}
```