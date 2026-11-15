import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  Search,
  ImageOff,
  Sparkles,
  Tag,
  X,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['全部', '美妝保養', '藥妝日用', '零食伴手禮', '購物攻略', '其他'];
const FORM_CATEGORIES = ['美妝保養', '藥妝日用', '零食伴手禮', '購物攻略', '其他'];

const WASHI_TAPE_STYLES = [
  'bg-rose-300/75 dark:bg-rose-500/45 -rotate-2',
  'bg-amber-300/75 dark:bg-amber-500/45 rotate-2',
  'bg-sky-300/75 dark:bg-sky-500/45 -rotate-1',
  'bg-emerald-300/75 dark:bg-emerald-500/45 rotate-1',
];

function getCategoryBadgeClass(cat) {
  switch (cat) {
    case '美妝保養':
      return 'bg-[#FCE7F3] text-[#DB2777] dark:bg-pink-950 dark:text-pink-300';
    case '藥妝日用':
      return 'bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950 dark:text-sky-300';
    case '零食伴手禮':
      return 'bg-[#FFF3CD] text-[#D97706] dark:bg-amber-950 dark:text-amber-300';
    case '購物攻略':
      return 'bg-[#D1FAE5] text-[#059669] dark:bg-emerald-950 dark:text-emerald-300';
    default:
      return 'bg-amber-100 text-amber-800 dark:bg-slate-800 dark:text-slate-300';
  }
}

const EMPTY_FORM = {
  id: '',
  name: '',
  category: '美妝保養',
  price_note: '',
  description: '',
  image_url: '',
  source_url: '',
  sort_order: 0,
};

export default function MustBuyView({ items = [], tripId, onSaveItem, onDeleteItem }) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  // Add / Edit Modal State
  const [editorOpen, setEditorOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const markImageFailed = (id) => {
    setFailedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = selectedCategory === '全部' || item.category === selectedCategory;
      const matchSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.price_note && item.price_note.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const openCreateModal = () => {
    const maxOrder = items.reduce((max, item) => Math.max(max, Number(item.sort_order) || 0), 0);
    setFormData({
      ...EMPTY_FORM,
      id: `mb-${Date.now()}`,
      sort_order: maxOrder + 1,
    });
    setEditorOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({
      id: item.id,
      name: item.name || '',
      category: item.category || '美妝保養',
      price_note: item.price_note || '',
      description: item.description || '',
      image_url: item.image_url || '',
      source_url: item.source_url || '',
      sort_order: item.sort_order ?? 0,
    });
    setSelectedItem(null);
    setEditorOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const payload = {
        id: formData.id,
        trip_id: tripId,
        name: formData.name.trim(),
        category: formData.category || '美妝保養',
        price_note: formData.price_note.trim() || null,
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
        source_url: formData.source_url.trim() || null,
        sort_order: Number(formData.sort_order) || 0,
      };
      await onSaveItem(payload);
      // Clear previous failed-image state if URL was updated
      setFailedImages((prev) => {
        const next = { ...prev };
        delete next[payload.id];
        return next;
      });
      setEditorOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`確定要刪除「${item.name}」嗎？`)) return;
    await onDeleteItem(item.id);
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#FDE68A] dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF5A5F]" />
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1E293B] dark:text-white">
                必買清單
              </h2>
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              自由整理想買的商品、價格備註與參考圖片網址（僅儲存文字與圖片連結，不將圖片存入資料庫）。
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#FF5A5F] text-white hover:bg-[#e54d52] shadow-sm transition-colors self-start sm:self-center whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>新增項目</span>
          </button>
        </div>

        {/* Search & Category Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between pt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋品名、店家、關鍵字..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-amber-50/50 dark:bg-slate-800/80 border border-[#FDE68A] dark:border-slate-700 text-sm text-[#1E293B] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/40"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FF5A5F] text-white shadow-sm'
                      : 'bg-amber-50/70 dark:bg-slate-800 text-[#64748B] dark:text-slate-300 hover:bg-amber-100/70 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#FDE68A] dark:border-slate-800 p-10 text-center space-y-3">
          <p className="text-sm text-[#64748B] dark:text-slate-400">
            {items.length === 0
              ? '目前還沒有必買清單資料，可點擊右上角「新增項目」或先匯入 SQL 資料表。'
              : '找不到符合條件的必買項目，試著換個關鍵字或分類看看！'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {filteredItems.map((item, idx) => {
            const hasValidImage = item.image_url && !failedImages[item.id];
            const tapeStyle = WASHI_TAPE_STYLES[idx % WASHI_TAPE_STYLES.length];
            const tiltClass = idx % 2 === 0 ? 'hover:-rotate-[1deg]' : 'hover:rotate-[1deg]';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                onClick={() => setSelectedItem(item)}
                className={`relative bg-white dark:bg-slate-900 p-3 pb-4 rounded-2xl border-2 border-[#FDE68A] dark:border-slate-800 shadow-md hover:shadow-xl group cursor-pointer transition-all duration-300 hover:-translate-y-1 ${tiltClass} flex flex-col justify-between`}
              >
                {/* Washi Tape */}
                <div
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 rounded-xs backdrop-blur-[1px] shadow-xs border border-white/40 dark:border-white/10 pointer-events-none z-10 ${tapeStyle}`}
                  aria-hidden="true"
                />

                <div>
                  {/* Image or Fallback Area */}
                  <div className="relative h-48 rounded-xl bg-amber-50/80 dark:bg-slate-800 overflow-hidden border border-amber-100 dark:border-slate-700">
                    {hasValidImage ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={() => markImageFailed(item.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center gap-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900">
                        {item.image_url ? (
                          <ImageOff className="w-8 h-8 text-amber-400 dark:text-slate-500" />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-[#FFB800]" />
                        )}
                        <span className="text-xs font-bold text-[#64748B] dark:text-slate-400">
                          {item.image_url
                            ? '圖片連結已失效或受限'
                            : item.source_url
                            ? '無圖片網址，可點參考連結'
                            : '純文字筆記項目'}
                        </span>
                      </div>
                    )}

                    {/* Category Badge */}
                    <span
                      className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category || '其他'}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="pt-3 px-1 space-y-1.5">
                    <h3 className="font-extrabold text-sm text-[#1E293B] dark:text-slate-100 group-hover:text-[#FF5A5F] transition-colors line-clamp-2">
                      {item.name}
                    </h3>

                    {item.price_note && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-[#FF5A5F] dark:text-rose-300 text-[11px] font-bold">
                        <Tag className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{item.price_note}</span>
                      </div>
                    )}

                    {item.description && (
                      <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer: Edit/Delete + Reference Link */}
                <div className="pt-3 mt-2 px-1 border-t border-amber-100/80 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(item);
                      }}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-[#1E293B] dark:text-slate-400 dark:hover:text-white font-semibold"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>編輯</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-semibold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>刪除</span>
                    </button>
                  </div>

                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-bold text-[#FF5A5F] hover:underline shrink-0"
                    >
                      <span>參考連結</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#FDE68A] dark:border-slate-700 max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-amber-50 dark:bg-slate-800 max-h-80 flex items-center justify-center overflow-hidden">
              {selectedItem.image_url && !failedImages[selectedItem.id] ? (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  referrerPolicy="no-referrer"
                  onError={() => markImageFailed(selectedItem.id)}
                  className="w-full max-h-80 object-contain"
                />
              ) : (
                <div className="py-12 px-6 flex flex-col items-center gap-2 text-center">
                  <ShoppingBag className="w-10 h-10 text-[#FFB800]" />
                  <p className="text-xs font-bold text-[#64748B] dark:text-slate-400">
                    {selectedItem.image_url
                      ? '圖片連結已失效或受限，可透過「編輯」更換圖片網址'
                      : '尚未設定圖片網址'}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${getCategoryBadgeClass(
                    selectedItem.category
                  )}`}
                >
                  {selectedItem.category || '其他'}
                </span>
                <h3 className="text-lg font-extrabold text-[#1E293B] dark:text-white">
                  {selectedItem.name}
                </h3>
              </div>

              {selectedItem.price_note && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#FF5A5F] dark:text-rose-300 text-xs font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{selectedItem.price_note}</span>
                </div>
              )}

              {selectedItem.description && (
                <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedItem.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-amber-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(selectedItem)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-slate-800 text-[#1E293B] dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>編輯內文</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedItem)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>刪除</span>
                  </button>
                </div>

                {selectedItem.source_url && (
                  <a
                    href={selectedItem.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5A5F] text-white hover:bg-[#e54d52] transition-colors"
                  >
                    <span>查看參考連結</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditorOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#FDE68A] dark:border-slate-700 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#1E293B] dark:text-white">
                {items.some((i) => i.id === formData.id) ? '編輯必買項目' : '新增必買項目'}
              </h3>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-amber-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-amber-100 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-slate-300 mb-1">
                  商品 / 項目名稱 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：IHADA 敏感肌清透防護蜜粉餅"
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-[#FDE68A] dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-slate-300 mb-1">
                    分類
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-[#FDE68A] dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/40"
                  >
                    {FORM_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-slate-300 mb-1">
                    價格 / 購買地點備註
                  </label>
                  <input
                    type="text"
                    value={formData.price_note}
                    onChange={(e) => setFormData({ ...formData, price_note: e.target.value })}
                    placeholder="例如：OS Drug 含稅 ¥844"
                    className="w-full px-3.5 py-2 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-[#FDE68A] dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-slate-300 mb-1">
                  心得 / 內文備註
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="輸入商品特色、朋友推薦原因或注意事項..."
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-[#FDE68A] dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/40 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-slate-300 mb-1">
                  圖片網址（僅存 URL，不存圖片檔案）
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-[#FDE68A] dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-slate-300 mb-1">
                  參考連結（選填）
                </label>
                <input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-[#FDE68A] dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-amber-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-[#64748B] hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-[#FF5A5F] text-white hover:bg-[#e54d52] disabled:opacity-50 transition-colors"
                >
                  {isSaving ? '儲存中...' : '儲存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
