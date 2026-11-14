import React, { useState, useMemo } from 'react';
import { PackageCheck, CheckSquare, Square, Plus, ShieldCheck } from 'lucide-react';

export default function PackingView({ packing, onSavePackingItem }) {
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('一般');

  const categories = useMemo(() => {
    const set = new Set(packing.map(p => p.category || '一般'));
    return Array.from(set);
  }, [packing]);

  const total = packing.length;
  const packedCount = packing.filter(p => p.is_packed).length;
  const progressPercent = total > 0 ? Math.round((packedCount / total) * 100) : 0;

  const handleTogglePack = (item) => {
    onSavePackingItem({
      ...item,
      is_packed: !item.is_packed
    });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: `pack-${Date.now()}`,
      trip_id: packing[0]?.trip_id || 'trip-1',
      item_name: newItemText.trim(),
      category: newItemCategory,
      is_packed: false
    };

    onSavePackingItem(newItem);
    setNewItemText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="glass-card p-6 bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950 flex items-center justify-center">
                <PackageCheck className="w-5 h-5 text-[#FF5A5F]" />
              </div>
              <h2 className="text-xl font-extrabold text-[#1E293B] dark:text-slate-100">
                行李與行前準備清單
              </h2>
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1.5">
              隨時點擊勾選打包狀態，自動即時同步雲端進度
            </p>
          </div>

          <div className="w-full md:w-64 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-[#1E293B] dark:text-slate-200">
              <span>準備完成度</span>
              <span className="text-[#FF5A5F] font-extrabold tabular-nums">{progressPercent}% ({packedCount}/{total})</span>
            </div>
            <div className="w-full bg-amber-100/80 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#FF5A5F] via-[#FFB800] to-[#10B981] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Packing Item Input */}
      <form onSubmit={handleAddItem} className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="新增準備品項 (如: 萬國插頭, 護照, 藥品...)"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 px-4 py-2 text-sm rounded-full bg-[#FFFDF7] dark:bg-slate-800 border border-amber-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="px-4 py-2 text-sm rounded-full bg-[#FFFDF7] dark:bg-slate-800 border border-amber-200 dark:border-slate-700"
        >
          <option value="證件">證件</option>
          <option value="財務">財務</option>
          <option value="3C用品">3C用品</option>
          <option value="衣物">衣物</option>
          <option value="個人用品">個人用品</option>
          <option value="醫藥">醫藥</option>
          <option value="一般">一般</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2 rounded-full bg-[#FF5A5F] hover:bg-[#E8484D] text-white font-bold text-xs flex items-center justify-center gap-1.5 sticker-btn-shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> 新增品項
        </button>
      </form>

      {/* Categorized List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const items = packing.filter(p => (p.category || '一般') === cat);
          const catPacked = items.filter(i => i.is_packed).length;

          return (
            <div key={cat} className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
                  <h3 className="font-extrabold text-[#1E293B] dark:text-slate-200 text-sm">{cat}</h3>
                </div>
                <span className="text-xs font-bold text-[#64748B] tabular-nums">
                  {catPacked} / {items.length} 妥當
                </span>
              </div>

              <div className="space-y-1.5">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTogglePack(item)}
                    className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-sm transition-all text-left ${
                      item.is_packed
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-[#64748B] dark:text-slate-500'
                        : 'bg-[#FFFDF7] dark:bg-slate-800/60 text-[#1E293B] dark:text-slate-100 hover:bg-amber-50/80 dark:hover:bg-slate-800 border border-amber-100/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.is_packed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-amber-300 dark:text-slate-600 shrink-0" />
                      )}
                      <span className={`font-medium ${item.is_packed ? 'line-through' : ''}`}>{item.item_name}</span>
                    </div>
                    {item.is_packed && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 shrink-0">
                        ✓ OK
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
