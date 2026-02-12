import httpx
from typing import Optional
from app.core.config import settings
from app.schemas.weather import WeatherResponse
from app.utils.logger import app_logger


class WeatherService:
    ALAPI_BASE_URL = "https://v3.alapi.cn/api/tianqi"

    def __init__(self):
        if not settings.ALAPI_TOKEN:
            app_logger.warning("ALAPI_TOKEN is not configured in environment variables")

    async def get_weather(self, city: str) -> WeatherResponse:
        if not settings.ALAPI_TOKEN:
            raise ValueError("ALAPI_TOKEN 未配置，请检查环境变量")

        if not city or len(city.strip()) == 0:
            raise ValueError("城市名称不能为空")

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                body = {
                    "token": settings.ALAPI_TOKEN,
                    "city": city.strip()
                }
                
                app_logger.info(f"Requesting weather data for city: {city}")
                
                response = await client.post(
                    self.ALAPI_BASE_URL,
                    json=body
                )
                response.raise_for_status()
                
                result = response.json()
                
                if not result.get("success", False):
                    error_msg = result.get("message", "获取天气数据失败")
                    app_logger.error(f"ALAPI error: {error_msg}")
                    raise ValueError(error_msg)
                
                app_logger.success(f"Successfully fetched weather data for {city}")
                return WeatherResponse(**result)
                
        except httpx.HTTPStatusError as e:
            app_logger.error(f"HTTP error fetching weather data: {e.response.status_code}")
            raise ValueError(f"天气服务请求失败: HTTP {e.response.status_code}")
        except httpx.TimeoutException:
            app_logger.error("Timeout fetching weather data from ALAPI")
            raise ValueError("天气服务请求超时")
        except httpx.RequestError as e:
            app_logger.error(f"Request error fetching weather data: {e}")
            raise ValueError("天气服务请求错误")
        except Exception as e:
            app_logger.error(f"Unexpected error fetching weather data: {e}")
            raise ValueError(f"获取天气数据时发生错误: {str(e)}")


weather_service = WeatherService()
