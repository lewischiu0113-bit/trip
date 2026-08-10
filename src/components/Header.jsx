import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  ChevronDown, 
  Plus, 
  Sun, 
  Moon, 
  Menu, 
  X,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

// Helper to calculate status dynamically based on current date vs trip start/end date
export function getCalculatedStatus(startDate, endDate) {
  if (!startDate) return 'Not started';
  const today = new Date().toISOString().slice(0, 10);
  const start = startDate.slice(0, 10);
  const end = (endDate || startDate).slice(0, 10);

  if (today > end) return 'Done'; // 已完成
  if (today >= start && today <= end) return 'In progress'; // 進行中
  return 'Not started'; // 未開始
}

export function renderStatusBadge(status) {
  switch (status) {
    case 'Done':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
          <CheckCircle2 className="w-3 h-3" /> 已完成
        </span>
      );
    case 'In progress':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200 dark:border-orange-800 animate-pulse shrink-0">
          <Clock className="w-3 h-3 text-orange-500" /> 進行中
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
          未開始
        </span>
      );
  }
}

export default function Header({ 
  trips, 
  activeTrip, 
  onSelectTrip, 
  onOpenNewTripModal, 
  darkMode, 
  onToggleDarkMode
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sort trips descending by start_date (newest trip at the top)
  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => {
      const dateA = a.start_date || '';
      const dateB = b.start_date || '';
      return dateB.localeCompare(dateA);
    });
  }, [trips]);

  const activeStatus = activeTrip ? getCalculatedStatus(activeTrip.start_date, activeTrip.end_date) : 'Not started';

  const formatDropdownDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.replace(/-/g, '/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-card rounded-none border-t-0 border-x-0 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Left: 旅遊筆記 Brand Logo (RWD Protected) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
          </div>
          <div className="whitespace-nowrap">
            <div className="flex items-center gap-1 font-extrabold text-lg sm:text-xl tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap">
              <span className="text-orange-500">旅遊</span>筆記
            </div>
            <p className="hidden sm:flex text-[11px] text-slate-500 dark:text-slate-400 items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-amber-500" /> 旅遊規劃與記帳平台
            </p>
          </div>
        </div>

        {/* Center: Trip Selector Dropdown */}
        <div className="relative min-w-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-all text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
            <span className="max-w-[75px] xs:max-w-[110px] sm:max-w-[200px] truncate">
              {activeTrip ? activeTrip.name : '選擇行程'}
            </span>
            <div className="hidden xs:block shrink-0">
              {renderStatusBadge(activeStatus)}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 glass-card p-2 shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>切換旅遊行程 (最新至最舊)</span>
                <span className="text-[10px] text-slate-400">共 {sortedTrips.length} 個</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 py-1">
                {sortedTrips.map((t) => {
                  const status = getCalculatedStatus(t.start_date, t.end_date);
                  const isSelected = activeTrip?.id === t.id;

                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTrip(t);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm transition-all ${
                        isSelected
                          ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
                        <span className="truncate font-bold">{t.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] sm:text-[11px] font-mono ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                          {formatDropdownDate(t.start_date)}
                        </span>
                        {renderStatusBadge(status)}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenNewTripModal();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-600 dark:text-orange-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> 新增旅遊行程
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewTripModal}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> 新增行程
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-orange-500" />}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-orange-500" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card rounded-none border-x-0 border-t-0 p-4 space-y-3 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenNewTripModal();
            }}
            className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" /> 新增旅遊行程
          </button>
        </div>
      )}
    </header>
  );
}
