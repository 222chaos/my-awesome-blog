## 前端天气 API 配置方案

### 实现计划

#### 1. 创建后端天气服务 (`services/backendWeatherService.ts`)
- 调用后端 `/api/v1/weather/current` 接口
- TypeScript 类型定义匹配后端响应结构
- 错误处理和重试机制

#### 2. 更新天气组件 (`components/home/WeatherCard.tsx`)
- 改用后端 API 获取天气数据
- 显示后端返回的完整数据：
  - 当前温度、最低/最高温度
  - 天气状况和图标
  - 风向、风速
  - 湿度、能见度、气压
  - 空气质量
  - 更新时间
- 保留 Glassmorphism 设计风格

### 后端 API 响应结构
```typescript
interface BackendWeatherResponse {
  status: string;
  msg: string;
  data: BackendWeatherData | null;
}

interface BackendWeatherData {
  current: string;        // 当前温度
  update_time: string;     // 更新时间
  city: string;
  province: string;
  country: string;
  wea: string;            // 天气状况
  wea_img: string;         // 天气图标URL
  tem: string;             // 温度
  tem1: string;            // 最低温度
  tem2: string;            // 最高温度
  win: string;             // 风向风力
  win_speed: string;       // 风速
  win_meter: string;        // 风速米/秒
  humidity: string;        // 相对湿度
  visibility: string;       // 能见度
  pressure: string;         // 气压
  air: string;             // 空气质量
}
```