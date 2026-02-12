## 根据 ALAPI 实际返回结构重写 Schema

### 实际返回字段分析
ALAPI 返回的 `data` 字段与我们定义的完全不匹配：
- `weather` (不是 `wea`)
- `temp` (数字类型，不是字符串）
- `min_temp`、`max_temp` (不是 `tem1`、`tem2`)
- `wind_power` (不是 `win_meter`)
- `humidity`、`visibility`、`pressure` 直接是数字
- 没有 `current`、`country`、`wea_img` 等字段
- 有嵌套的 `aqi` 对象

### 修复计划
1. **重写 `app/schemas/weather.py`** - 根据 ALAPI 实际返回创建 `WeatherCurrent` 模型
2. **更新 `app/services/weather_update_service.py`** - 使用正确的字段名
3. **更新前端接口** `backendWeatherService.ts` - 匹配实际返回
4. **更新前端组件** `WeatherCard.tsx` - 显示正确的字段名和类型