import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, PackageCheck, Sparkles, Edit, Clock, Umbrella } from 'lucide-react';
import { getCalculatedStatus, renderStatusBadge } from './Header';
import { fetchTripWeather } from '../lib/weather';
import AnimatedNumber from './AnimatedNumber';

const BANNER_PARTICLES = [
  { left: '8%', size: 4, duration: 7.5, delay: 0 },
  { left: '16%', size: 6, duration: 9.2, delay: 1.4 },
  { left: '24%', size: 3.5, duration: 6.8, delay: 2.8 },
  { left: '33%', size: 5, duration: 8.4, delay: 0.7 },
  { left: '42%', size: 4, duration: 7.9, delay: 3.5 },
  { left: '51%', size: 6, duration: 9.6, delay: 1.1 },
  { left: '60%', size: 3.5, duration: 7.1, delay: 4.2 },
  { left: '69%', size: 5, duration: 8.8, delay: 2.1 },
  { left: '78%', size: 4, duration: 7.4, delay: 0.4 },
  { left: '87%', size: 5.5, duration: 9.0, delay: 3.0 },
  { left: '93%', size: 3.5, duration: 6.5, delay: 1.9 },
];

function extractMonth(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  const ymdMatch = trimmed.match(/^\d{4}[-/](\d{1,2})/);
  if (ymdMatch) return parseInt(ymdMatch[1], 10);
  const mdMatch = trimmed.match(/^(\d{1,2})[-/]/);
  if (mdMatch) return parseInt(mdMatch[1], 10);
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getMonth() + 1;
}

function isWinterTrip(startDate, endDate) {
  const winterMonths = new Set([12, 1, 2]);
  const startMonth = extractMonth(startDate);
  const endMonth = extractMonth(endDate);
  return (startMonth !== null && winterMonths.has(startMonth)) || (endMonth !== null && winterMonths.has(endMonth));
}

const DEFAULT_BANNER_IMAGE = 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=80';

export default function TripBanner({ activeTrip, itineraries, expenses, packing, onOpenEditTripModal }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!activeTrip) return;
    async function loadWeather() {
      const data = await fetchTripWeather(activeTrip.name);
      setWeather(data);
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
  const showWinterSnow = isWinterTrip(activeTrip.start_date, activeTrip.end_date);

  const WeatherIcon = weather?.WeatherIcon;

  return (
    <div className="space-y-3 mb-6">
      {/* Magazine Hero Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-[#FDE68A] dark:border-slate-800 bg-slate-900">
        <div className="relative h-60 sm:h-72 w-full overflow-hidden">
          <img
            src={bannerImage}
            alt={activeTrip.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-95"
            onError={(e) => {
              if (e.target.src !== DEFAULT_BANNER_IMAGE) {
                e.target.src = DEFAULT_BANNER_IMAGE;
              }
            }}
          />
          {/* Warm Sunny + Deep Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-amber-500/10" />

          {/* Gentle Winter Snow / Sparkle Particles (auto-enabled for Dec-Feb trips) */}
          {showWinterSnow && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]" aria-hidden="true">
              {BANNER_PARTICLES.map((p, idx) => (
                <span
                  key={idx}
                  className="absolute -top-3 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.85)] animate-snow-fall"
                  style={{
                    left: p.left,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    animationDuration: `${p.duration}s`,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Top Bar inside Banner */}
          <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-6 sm:right-6 flex items-start justify-between gap-2 z-10">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-[#1E293B] dark:text-slate-100 backdrop-blur-md shadow-sm flex items-center gap-1.5 border border-amber-200/80">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                <span className="truncate">{activeTrip.name} · 旅遊手帳</span>
              </span>
              {renderStatusBadge(status)}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Floating Weather Card (Top Right) */}
              {weather && (
                <div className="hidden md:flex px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-sky-200 dark:border-sky-800 text-[#1E293B] dark:text-slate-100 shadow-lg items-center gap-2.5">
                  {WeatherIcon && (
                    <div className="p-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 shrink-0">
                      <WeatherIcon className={`w-5 h-5 ${weather.color}`} />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[11px]">
                      <span className="text-[#00B4D8] font-extrabold">{weather.cityName}</span>
                      <span className="bg-sky-100 dark:bg-sky-900 text-[#0284C7] dark:text-sky-300 px-1.5 py-0.2 rounded-full text-[10px]">
                        {weather.weatherLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold tabular-nums mt-0.5">
                      <span className="text-base font-extrabold text-[#1E293B] dark:text-white">{weather.temp}°C</span>
                      <span className="text-[10px] text-[#64748B] dark:text-slate-400">({weather.minTemp}°~{weather.maxTemp}°)</span>
                      <span className="flex items-center gap-0.5 text-[10px] text-[#00B4D8]">
                        <Umbrella className="w-3 h-3" /> {weather.pop}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => onOpenEditTripModal(activeTrip)}
                className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-[#1E293B] dark:text-slate-200 text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1 shadow-sm border border-amber-200/80 hover:border-[#FF5A5F] shrink-0"
              >
                <Edit className="w-3.5 h-3.5 text-[#FF5A5F]" /> 編輯行程
              </button>
            </div>
          </div>

          {/* Bottom Banner Title & Date */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
              <div>
                <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                    {activeTrip.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#FF5A5F] text-white flex items-center gap-1.5 sticker-btn-shadow tabular-nums">
                    <Calendar className="w-3.5 h-3.5" />
                    {activeTrip.start_date ? `${activeTrip.start_date} ~ ${activeTrip.end_date || ''}` : '自由行程'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100/95 line-clamp-2 max-w-2xl font-medium drop-shadow-sm">
                  {activeTrip.description || '精心規劃的特色景點、美食饗宴、行前行李清單與實時費用帳簿。'}
                </p>
              </div>

              {/* Mobile Weather Pill */}
              {weather && (
                <div className="flex md:hidden px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-sky-200 dark:border-sky-800 text-[#1E293B] dark:text-slate-100 shadow-md items-center gap-2 self-start tabular-nums">
                  {WeatherIcon && <WeatherIcon className={`w-4 h-4 ${weather.color}`} />}
                  <span className="text-xs font-extrabold text-[#00B4D8]">{weather.cityName}</span>
                  <span className="text-sm font-black">{weather.temp}°C</span>
                  <span className="text-[10px] text-[#64748B]">({weather.weatherLabel} · 降雨 {weather.pop}%)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slim Pastel Stat Pills Row */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-2.5 pb-1">
        {/* Pill 1: Total Stops (Coral Pink) */}
        <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl sm:rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 shadow-sm">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5A5F] shrink-0" />
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-300">總景點</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#FF5A5F] tabular-nums"><AnimatedNumber value={totalStops} /> 個</span>
        </div>

        {/* Pill 2: Days (Sunny Amber) */}
        <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl sm:rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800] shrink-0" />
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-300">預計天數</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-400 tabular-nums"><AnimatedNumber value={uniqueDays} /> 天</span>
        </div>

        {/* Pill 3: Total Spend (Soda Sky Blue) */}
        <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl sm:rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/70 shadow-sm">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00B4D8] shrink-0" />
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-300">累計花費</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#00B4D8] tabular-nums">NT$ <AnimatedNumber value={totalTwd} /></span>
        </div>

        {/* Pill 4: Packing Progress (Mint Emerald) */}
        <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-2xl sm:rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 shadow-sm">
          <div className="flex items-center gap-1.5 shrink-0">
            <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-300">行李進度</span>
          </div>
          <div className="hidden sm:block w-16 bg-emerald-200/70 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FF5A5F] via-[#FFB800] to-[#10B981] h-full transition-all duration-500 rounded-full"
              style={{ width: `${packingPercent}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums"><AnimatedNumber value={packingPercent} />%</span>
        </div>
      </div>
    </div>
  );
}
