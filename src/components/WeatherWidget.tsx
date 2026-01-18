import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Wind, Droplets, Eye, Gauge } from 'lucide-react';

interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'drizzle';
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  location: string;
  forecast: DayForecast[];
}

interface DayForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: any;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 42,
    feelsLike: 38,
    condition: 'cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 30.12,
    location: 'Boston, MA',
    forecast: [
      { day: 'Mon', high: 45, low: 32, condition: 'Partly Cloudy', icon: Cloud },
      { day: 'Tue', high: 48, low: 35, condition: 'Sunny', icon: Sun },
      { day: 'Wed', high: 41, low: 30, condition: 'Rain', icon: CloudRain },
      { day: 'Thu', high: 38, low: 28, condition: 'Snow', icon: CloudSnow },
      { day: 'Fri', high: 43, low: 31, condition: 'Cloudy', icon: Cloud },
    ]
  });

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="w-16 h-16 text-yellow-400" />;
      case 'rainy': return <CloudRain className="w-16 h-16 text-blue-400" />;
      case 'snowy': return <CloudSnow className="w-16 h-16 text-cyan-200" />;
      case 'drizzle': return <CloudDrizzle className="w-16 h-16 text-blue-300" />;
      default: return <Cloud className="w-16 h-16 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{weather.temp}°F</h3>
          <p className="text-purple-200 text-sm">{weather.location}</p>
          <p className="text-purple-300 text-xs">Feels like {weather.feelsLike}°F</p>
        </div>
        <div>
          {getWeatherIcon()}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-white font-bold text-sm">{weather.humidity}%</div>
          <div className="text-purple-300 text-xs">Humidity</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <Wind className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <div className="text-white font-bold text-sm">{weather.windSpeed} mph</div>
          <div className="text-purple-300 text-xs">Wind</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <Gauge className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-white font-bold text-sm">{weather.pressure}</div>
          <div className="text-purple-300 text-xs">Pressure</div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-white font-bold text-sm mb-3">5-Day Forecast</h4>
        <div className="grid grid-cols-5 gap-2">
          {weather.forecast.map((day) => {
            const Icon = day.icon;
            return (
              <div key={day.day} className="text-center">
                <div className="text-purple-300 text-xs mb-2">{day.day}</div>
                <Icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-white text-xs font-bold">{day.high}°</div>
                <div className="text-purple-300 text-xs">{day.low}°</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
