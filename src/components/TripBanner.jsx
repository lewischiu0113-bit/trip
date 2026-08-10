import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, PackageCheck, Sparkles, Edit, Clock, Umbrella, Wind } from 'lucide-react';
import { getCalculatedStatus, renderStatusBadge } from './Header';
import { fetchTripWeather } from '../lib/weather';

const DEFAULT_BANNER_IMAGE = 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=80';

export default function TripBanner({ activeTrip, itineraries, expenses, packing, onOpenEditTripModal }) {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    if (!activeTrip) return;
    async function loadWeather() {
      setWeatherLoading(true);
      const data = await fetchTripWeather(activeTrip.name);
      setWeather(data);
      setWeatherLoading(false);
    }
    loadWeather();
  }, [activeTrip?.name]);

  if (!activeTrip) return null;

  const totalStops = itineraries.length;
  const uniqueDays = new Set(itineraries.map(i => i.day_label)).size || 1;
  const totalTwd = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0) +
    itineraries.reduce((sum, i) => sum + (parseFloat(i.cost_twd) || 0), 0);

  const totalPacking = packing.length;
  const packedCount = packing.filter(p => p.is_packed).length;
  const packingPercent = totalPacking > 0 ? Math.round((packedCount / totalPacking) * 100) : 0;

  const status = getCalculatedStatus(activeTrip.start_date, activeTrip.end_date);
  const bannerImage = activeTrip.cover_image || DEFAULT_BANNER_IMAGE;

  const WeatherIcon = weather?.WeatherIcon;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm mb-6 glass-card border border-slate-200/80 dark:border-slate-800">
      {/* Cover Image Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
        <img
          src={bannerImage}
          alt={activeTrip.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-90"
          onError={(e) => {
            if (e.target.src !== DEFAULT_BANNER_IMAGE) {
              e.target.src = DEFAULT_BANNER_IMAGE;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        {/* Top Header Bar inside Banner (RWD Protected) */}
        <div className="absolute top-3 left-3 right-3 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between gap-2 flex-wrap z-10">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap max-w-[70%]">
            <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-md shadow-sm flex items-center gap-1 border border-slate-200/50 truncate">
              <Sparkles className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="truncate">{activeTrip.name} 探索總覽</span>
            </span>
            {renderStatusBadge(status)}
          </div>

          <button
            onClick={() => onOpenEditTripModal(activeTrip)}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1 shadow-sm border border-slate-200/50 shrink-0"
          >
            <Edit className="w-3.5 h-3.5" /> 編輯行程
          </button>
        </div>

        {/* Bottom Banner Info & Real-Time Weather Widget */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 text-white z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-outfit text-white drop-shadow-md">
                  {activeTrip.name}
                </h1>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-orange-500 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {activeTrip.start_date ? `${activeTrip.start_date} ~ ${activeTrip.end_date || ''}` : '自由行程'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-2xl font-medium drop-shadow-sm">
                {activeTrip.description || '精心規劃的特色景點、美食饗宴、行前行李清單與實時費用帳簿。'}
              </p>
            </div>

            {/* Weather Badge Widget */}
            {weather && (
              <div className="px-3.5 py-2 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg transition-all flex items-center gap-3 shrink-0">
                {WeatherIcon && (
                  <div className="p-2 rounded-xl bg-white/10 shrink-0">
                    <WeatherIcon className={`w-6 h-6 ${weather.color}`} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                    <span className="text-orange-400 font-extrabold">{weather.cityName}實時天氣</span>
                    <span className="bg-orange-500/80 px-1.5 py-0.2 rounded text-[10px]">{weather.weatherLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mt-0.5">
                    <span className="text-lg font-black text-white font-outfit">{weather.temp}°C</span>
                    <span className="text-[10px] text-slate-300">({weather.minTemp}° ~ {weather.maxTemp}°C)</span>
                    <span className="flex items-center gap-0.5 text-[10px] text-sky-300 font-bold" title="降雨機率">
                      <Umbrella className="w-3 h-3 text-sky-400" /> 降雨機率 {weather.pop}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        
        {/* Stat 1 */}
        <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400">總景點 / 站數</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 font-outfit">
              {totalStops} <span className="text-xs font-normal text-slate-400">個</span>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400">預計天數</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 font-outfit">
              {uniqueDays} <span className="text-xs font-normal text-slate-400">天</span>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold shrink-0">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400">累計花費 (TWD)</div>
            <div className="text-base sm:text-lg font-extrabold text-orange-600 dark:text-orange-400 font-outfit">
              ${totalTwd.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
            <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-semibold text-slate-400 mb-1">
              <span>行李進度</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{packingPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-purple-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${packingPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
