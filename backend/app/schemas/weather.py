from typing import Optional, List, Any
from pydantic import BaseModel, Field


class WeatherAQI(BaseModel):
    air: str = Field(description="空气质量指数")
    air_level: str = Field(description="空气质量等级")
    air_tips: str = Field(description="空气质量提示")
    pm25: str = Field(description="PM2.5浓度")
    pm10: str = Field(description="PM10浓度")
    co: str = Field(description="CO浓度")
    no2: str = Field(description="NO2浓度")
    so2: str = Field(description="SO2浓度")
    o3: str = Field(description="O3浓度")


class WeatherCurrent(BaseModel):
    city: str = Field(description="城市名称")
    city_en: str = Field(description="城市英文名")
    province: str = Field(description="省份")
    province_en: str = Field(description="省份英文名")
    city_id: str = Field(description="城市ID")
    date: str = Field(description="日期")
    update_time: str = Field(description="更新时间")
    weather: str = Field(description="天气状况")
    weather_code: str = Field(description="天气代码")
    temp: float = Field(description="温度")
    min_temp: float = Field(description="最低温度")
    max_temp: float = Field(description="最高温度")
    wind: str = Field(description="风向")
    wind_speed: str = Field(description="风速")
    wind_power: str = Field(description="风力等级")
    rain: str = Field(description="降雨量")
    rain_24h: str = Field(description="24小时降雨量")
    humidity: str = Field(description="相对湿度")
    visibility: str = Field(description="能见度")
    pressure: str = Field(description="气压")
    tail_number: str = Field(description="尾号")
    air: str = Field(description="空气质量")
    air_pm25: str = Field(description="PM2.5")
    sunrise: str = Field(description="日出时间")
    sunset: str = Field(description="日落时间")
    aqi: WeatherAQI = Field(description="AQI详情")
    index: List[Any] = Field(description="生活指数")
    alarm: List[Any] = Field(description="预警信息")
    hour: List[Any] = Field(description="24小时预报")


class WeatherResponse(BaseModel):
    request_id: str = Field(description="请求ID")
    success: bool = Field(description="请求是否成功")
    message: str = Field(description="响应消息")
    code: int = Field(description="响应代码")
    data: Optional[WeatherCurrent] = Field(default=None, description="当前天气数据")
    time: int = Field(description="响应时间戳")
    usage: int = Field(description="API调用次数")


class WeatherRequest(BaseModel):
    city: str = Field(description="城市名称", min_length=1, max_length=50)
