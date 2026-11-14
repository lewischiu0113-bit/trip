import React from 'react';
import { Calendar, Receipt, PackageCheck, Map } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NavigationTabs({ activeTab, onChangeTab, itineraryCount, expenseCount, packingCount, placeCount }) {
  const tabs = [
    {
      id: 'itinerary',
      label: '每日行程',
      icon: Calendar,
      count: itineraryCount,
    },
    {
      id: 'expenses',
      label: '費用記帳',
      icon: Receipt,
      count: expenseCount,
    },
    {
      id: 'packing',
      label: '行李清單',
      icon: PackageCheck,
      count: packingCount,
    },
    {
      id: 'places',
      label: '景點圖輯筆記',
      icon: Map,
      count: placeCount,
    }
  ];

  return (
    <div className="flex items-center justify-start sm:justify-center mb-6 overflow-x-auto no-scrollbar py-1">
      <nav className="inline-flex gap-1.5 sm:gap-2 p-1.5 rounded-full bg-white dark:bg-slate-900 border border-[#FDE68A] dark:border-slate-800 shadow-sm min-w-max">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onChangeTab(t.id)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-white'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-white hover:bg-amber-50/80 dark:hover:bg-slate-800/80'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#FF5A5F] sticker-btn-shadow"
                />
              )}
              <Icon className={`relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isActive ? 'text-white' : 'text-[#FFB800]'}`} />
              <span className="relative z-10">{t.label}</span>
              {t.count !== undefined && (
                <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tabular-nums transition-colors ${
                  isActive 
                    ? 'bg-white/25 text-white' 
                    : 'bg-amber-50 dark:bg-slate-800 text-[#64748B] dark:text-slate-300'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
