import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  Snowflake, 
  CloudFog 
} from 'lucide-react';

// Coordinates mapping for travel destinations
export const CITY_COORDS = {
  '名古屋': { lat: 35.1815, lng: 136.9066 },
  '沖繩': { lat: 26.2124, lng: 127.6809 },
  '釜山': { lat: 35.1796, lng: 129.0756 },
  '花蓮': { lat: 23.9871, lng: 121.6016 },
  '東京': { lat: 35.6762, lng: 139.6503 },
  '大阪': { lat: 34.6937, lng: 135.5023 },
  '京都': { lat: 35.0116, lng: 135.7681 },
  '福岡': { lat: 33.5904, lng: 130.4017 },
  '首爾': { lat: 37.5665, lng: 126.9780 },
  '台北': { lat: 25.0330, lng: 121.5654 }
};

// Map WMO Weather Codes to human-readable text and icon components
export function getWeatherInfo(code) {
  if (code === 0) {
    return { label: '晴朗無雲', Icon: Sun, color: 'text-amber-500' };
  }
  if (code >= 1 && code <= 3) {
    return { label: '多雲時晴', Icon: CloudSun, color: 'text-orange-400' };
  }
  if (code === 45 || code === 48) {
    return { label: '霧氣微濃', Icon: CloudFog, color: 'text-slate-400' };
  }
  if (code >= 51 && code <= 57) {
    return { label: '毛毛細雨', Icon: CloudDrizzle, color: 'text-sky-400' };
  }
  if (code >= 61 && code <= 67) {
    return { label: '陣雨降水', Icon: CloudRain, color: 'text-blue-500' };
  }
  if (code >= 71 && code <= 77) {
    return { label: '局部飄雪', Icon: Snowflake, color: 'text-indigo-300' };
  }
  if (code >= 80 && code <= 82) {
    return { label: '豪雨特報', Icon: CloudRain, color: 'text-blue-600' };
  }
  if (code >= 95) {
    return { label: '雷陣雨', Icon: CloudLightning, color: 'text-purple-500' };
  }

  return { label: '舒適宜人', Icon: CloudSun, color: 'text-amber-400' };
}

// Fetch real-time weather data from Open-Meteo API
export async function fetchTripWeather(cityName) {
  const coords = CITY_COORDS[cityName] || CITY_COORDS['名古屋'];
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    
    const data = await res.json();
    const current = data.current_weather || {};
    const daily = data.daily || {};

    const code = current.weathercode ?? 0;
    const weatherInfo = getWeatherInfo(code);

    return {
      success: true,
      cityName,
      temp: current.temperature ? Math.round(current.temperature) : 26,
      maxTemp: daily.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : 30,
      minTemp: daily.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : 22,
      pop: daily.precipitation_probability_max?.[0] ?? 20,
      windSpeed: current.windspeed ? Math.round(current.windspeed) : 8,
      weatherCode: code,
      weatherLabel: weatherInfo.label,
      WeatherIcon: weatherInfo.Icon,
      color: weatherInfo.color
    };
  } catch (err) {
    console.warn('Weather API fetch fallback:', err);
    const weatherInfo = getWeatherInfo(1);
    return {
      success: false,
      cityName,
      temp: 27,
      maxTemp: 31,
      minTemp: 23,
      pop: 15,
      windSpeed: 10,
      weatherCode: 1,
      weatherLabel: '多雲時晴',
      WeatherIcon: weatherInfo.Icon,
      color: weatherInfo.color
    };
  }
}
