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
      <div className="glass-card p-6 bg-gradient-to-tr from-orange-500/10 via-amber-500/10 to-purple-500/10 border-orange-200 dark:border-orange-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                行李與行前準備清單
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              隨時點擊勾選打包狀態，自動即時同步雲端進度
            </p>
          </div>

          <div className="w-full md:w-64 space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>準備完成度</span>
              <span className="text-orange-500 font-extrabold">{progressPercent}% ({packedCount}/{total})</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
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
          className="flex-1 px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
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
          className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
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
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{cat}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {catPacked} / {items.length} 妥當
                </span>
              </div>

              <div className="space-y-1.5">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTogglePack(item)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-sm transition-all text-left ${
                      item.is_packed
                        ? 'bg-orange-50/60 dark:bg-orange-950/40 text-slate-400 dark:text-slate-500 line-through'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.is_packed ? (
                        <CheckSquare className="w-5 h-5 text-orange-500 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                      )}
                      <span className="font-medium">{item.item_name}</span>
                    </div>
                    {item.is_packed && (
                      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 no-underline">
                        OK
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
