import React, { useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import BrandLogo from './BrandLogo';
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
  Sparkles,
  LogOut,
  User
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-[#FFF3CD] text-[#D97706] dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shrink-0">
          <Clock className="w-3 h-3 text-[#FFB800]" /> 進行中
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
  onToggleDarkMode,
  currentUser,
  onLogout
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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 30, restDelta: 0.001 });

  const formatDropdownDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.replace(/-/g, '/');
  };

  return (
    <>
      {/* Top Sunny Reading Progress Line */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF5A5F] via-[#FFB800] to-[#00B4D8] origin-left z-50 pointer-events-none"
      />

      <header className="sticky top-2 sm:top-2.5 z-40 w-full px-2.5 sm:px-6 lg:px-8 pointer-events-none">
        <div className="pointer-events-auto max-w-7xl mx-auto rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-amber-200/80 dark:border-slate-800 shadow-[0_6px_20px_-4px_rgba(255,184,0,0.14),0_2px_8px_-2px_rgba(30,41,59,0.04)] transition-all">
          <div className="px-3.5 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Left: 旅遊筆記 Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <BrandLogo className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs hover:scale-105 transition-transform" />
          <div className="whitespace-nowrap">
            <div className="flex items-center gap-1 font-extrabold text-lg sm:text-xl tracking-tight text-[#1E293B] dark:text-slate-100 whitespace-nowrap">
              <span className="text-[#FF5A5F]">旅遊</span>筆記
            </div>
            <p className="hidden sm:flex text-[11px] text-[#64748B] dark:text-slate-400 items-center gap-1 whitespace-nowrap font-medium">
              <Sparkles className="w-3 h-3 text-[#FFB800]" /> Pop &amp; Sunny Travel Zine
            </p>
          </div>
        </div>

        {/* Center: Trip Selector Dropdown */}
        <div className="relative min-w-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-50/75 hover:bg-amber-100/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-amber-200/90 dark:border-slate-700/60 transition-all text-xs sm:text-sm font-bold text-[#1E293B] dark:text-slate-100 shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5A5F] shrink-0" />
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
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 glass-card p-2.5 shadow-xl border border-amber-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-between">
                <span>切換旅遊行程 (最新至最舊)</span>
                <span className="text-[10px] tabular-nums">共 {sortedTrips.length} 個</span>
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
                      className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm transition-all ${
                        isSelected
                          ? 'bg-[#FF5A5F] text-white font-semibold sticker-btn-shadow'
                          : 'hover:bg-amber-50/80 dark:hover:bg-slate-800/80 text-[#1E293B] dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#FF5A5F]'}`} />
                        <span className="truncate font-bold">{t.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] sm:text-[11px] font-mono tabular-nums ${isSelected ? 'text-white/90' : 'text-[#64748B]'}`}>
                          {formatDropdownDate(t.start_date)}
                        </span>
                        {renderStatusBadge(status)}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-amber-100 dark:border-slate-800 mt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenNewTripModal();
                  }}
                  className="w-full py-2 px-3 rounded-full bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-[#FF5A5F] dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> 新增旅遊行程
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNewTripModal}
            className="px-4 py-2 rounded-full bg-[#FF5A5F] hover:bg-[#E8484D] text-white text-xs font-bold sticker-btn-shadow flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> 新增行程
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full bg-white hover:bg-amber-50 border border-amber-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#64748B] dark:text-slate-300 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#FFB800]" /> : <Moon className="w-4 h-4 text-[#FF5A5F]" />}
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-amber-200/80 dark:border-slate-800">
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-[#1E293B] dark:text-slate-200 text-xs font-bold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#FF5A5F]" /> {currentUser || 'test'}
            </span>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-rose-50 dark:hover:bg-red-950 text-[#64748B] hover:text-[#FF5A5F] transition-colors"
              title="登出系統"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full bg-white border border-amber-200 dark:border-slate-700 dark:bg-slate-800 text-[#64748B] dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#FFB800]" /> : <Moon className="w-4 h-4 text-[#FF5A5F]" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-white border border-amber-200 dark:border-slate-700 dark:bg-slate-800 text-[#1E293B] dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 pt-3 space-y-3 border-t border-amber-100 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100 dark:border-slate-800">
            <span className="text-xs font-bold text-[#64748B] dark:text-slate-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#FF5A5F]" /> 當前帳號: {currentUser || 'test'}
            </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="px-3 py-1 rounded-full bg-rose-100 dark:bg-red-950 text-[#FF5A5F] dark:text-red-300 text-xs font-bold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> 登出
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenNewTripModal();
            }}
            className="w-full py-2.5 rounded-full bg-[#FF5A5F] hover:bg-[#E8484D] text-white font-bold text-sm flex items-center justify-center gap-2 sticker-btn-shadow"
          >
            <Plus className="w-4 h-4" /> 新增旅遊行程
          </button>
        </div>
      )}
        </div>
      </header>
    </>
  );
}
