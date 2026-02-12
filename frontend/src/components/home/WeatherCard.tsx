'use client';

import { useState, useEffect } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Snowflake, 
  CloudLightning, 
  CloudFog, 
  Loader2,
  MapPin,
  Droplets,
  Wind,
  RefreshCw,
  Thermometer,
  Gauge,
  WindIcon
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { backendWeatherService, type BackendWeatherData } from '@/services/backendWeatherService';
import { cn } from '@/lib/utils';

export default function WeatherCard() {
  const [weather, setWeather] = useState<BackendWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState('杭州');

  const fetchWeather = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await backendWeatherService.getCurrentWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const getWeatherIcon = () => {
    if (!weather) return null;
    const weatherText = weather.weather.toLowerCase();
    
    if (weatherText.includes('晴')) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (weatherText.includes('多云') || weatherText.includes('阴')) return <Cloud className="w-5 h-5 text-gray-300" />;
    if (weatherText.includes('雨')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (weatherText.includes('雪')) return <Snowflake className="w-5 h-5 text-white" />;
    if (weatherText.includes('雷')) return <CloudLightning className="w-5 h-5 text-yellow-500" />;
    if (weatherText.includes('雾')) return <CloudFog className="w-5 h-5 text-gray-400" />;
    
    return <Sun className="w-5 h-5 text-yellow-400" />;
  };

  const getAQILevel = () => {
    if (!weather?.airQuality) return { level: '未知', color: 'text-gray-400' };
    const aqi = parseInt(weather.airQuality.replace(/\D/g, ''));
    
    if (aqi <= 50) return { level: '优', color: 'text-green-400' };
    if (aqi <= 100) return { level: '良', color: 'text-yellow-400' };
    if (aqi <= 150) return { level: '轻度', color: 'text-orange-400' };
    if (aqi <= 200) return { level: '中度', color: 'text-red-400' };
    return { level: '重度', color: 'text-red-600' };
  };

  const formatUpdateTime = () => {
    if (!weather?.updateTime) return '--:--';
    try {
      const timeStr = weather.updateTime.split(' ')[1] || weather.updateTime;
      return timeStr.split(':')[0] + ':' + timeStr.split(':')[1];
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in-up">
      <GlassCard 
        hoverEffect={true}
        className={cn(
          'w-72 sm:w-80 p-4 transition-all duration-300',
          'cursor-pointer'
        )}
        onClick={() => !refreshing && fetchWeather()}
      >
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-8 h-8 text-tech-cyan animate-spin" />
            <p className="text-sm text-muted-foreground mt-3">加载中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <Cloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-2">{error}</p>
            <button 
              onClick={fetchWeather}
              className="text-xs text-tech-cyan hover:text-tech-lightcyan transition-colors"
            >
              重试
            </button>
          </div>
        ) : weather ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getWeatherIcon()}
                <div>
                  <p className="text-3xl font-bold text-white">
                    {weather.temperature}°
                  </p>
                  <p className="text-xs text-muted-foreground">{weather.weather}</p>
                </div>
              </div>
              {refreshing ? (
                <Loader2 className="w-5 h-5 text-tech-cyan animate-spin" />
              ) : (
                <RefreshCw 
                  className={cn(
                    'w-5 h-5 text-muted-foreground transition-all',
                    'hover:text-tech-cyan hover:rotate-180'
                  )} 
                />
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[160px]">
                {weather.city}, {weather.province}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-glass-border/30">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-[10px] text-muted-foreground">温度</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-white">{weather.temperature}°</p>
                    {weather.tempMin && weather.tempMax && (
                      <span className="text-xs text-muted-foreground">
                        {weather.tempMin}° ~ {weather.tempMax}°
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-[10px] text-muted-foreground">风向</p>
                  <p className="text-sm font-semibold text-white">{weather.windDirection}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-glass-border/30">
              <div className="flex flex-col items-center gap-1">
                <WindIcon className="w-3 h-3 text-blue-400" />
                <p className="text-[10px] text-muted-foreground">风速</p>
                <p className="text-sm font-semibold text-white">{weather.windSpeed}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                <p className="text-[10px] text-muted-foreground">湿度</p>
                <p className="text-sm font-semibold text-white">{weather.humidity}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Gauge className="w-3 h-3 text-green-400" />
                <p className="text-[10px] text-muted-foreground">气压</p>
                <p className="text-sm font-semibold text-white">{weather.pressure}</p>
              </div>
            </div>

            {weather.airQuality && (
              <div className="pt-3 border-t border-glass-border/30">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">空气质量</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-white">{weather.airQuality}</span>
                    <span className={cn('text-xs', getAQILevel().color)}>
                      ({getAQILevel().level})
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-glass-border/30 text-[10px] text-muted-foreground">
              <span>
                {weather.isDaytime ? '白天' : '夜间'}
              </span>
              <span>更新: {formatUpdateTime()}</span>
            </div>
          </div>
        ) : null}
      </GlassCard>
    </div>
  );
}
