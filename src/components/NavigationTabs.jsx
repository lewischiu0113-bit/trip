import React from 'react';
import { Calendar, Receipt, PackageCheck, Map } from 'lucide-react';

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
    <div className="flex items-center justify-start sm:justify-center border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto no-scrollbar">
      <nav className="flex gap-1.5 sm:gap-3 p-1 min-w-max">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onChangeTab(t.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 relative whitespace-nowrap ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                  isActive 
                    ? 'bg-orange-200/60 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
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
