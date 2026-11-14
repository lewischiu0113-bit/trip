import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import HorizontalScrollStrip from './HorizontalScrollStrip';
import { 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  Trash2, 
  Edit, 
  Maximize2, 
  X,
  Grid,
  ListFilter,
  ExternalLink,
  ImageOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';

// Helper to parse description into clean prose text + extracted link objects
function parseDescriptionAndLinks(text) {
  if (!text) return { cleanText: '', links: [] };
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const links = [];
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1];
    const isMap = /maps\.app\.goo\.gl|goo\.gl\/maps|google\.com\/maps/i.test(url);
    links.push({ url, isMap });
  }
  const cleanText = text
    .replace(urlRegex, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { cleanText, links };
}

// Helper to parse day label like "12/17 (四)" into { dateText, weekdayText }
function parseDaySticker(dayStr) {
  const match = dayStr.match(/(\d{1,2}\/\d{1,2})\s*\(([^)]+)\)/);
  if (match) {
    return { dateText: match[1], weekdayText: `週${match[2]}` };
  }
  return { dateText: dayStr, weekdayText: '行程' };
}

// Helper to sort day pills in chronological month/day order (e.g. 7/28 -> 7/29 -> 7/30 -> 8/1)
function sortDayPills(daysList) {
  return [...daysList].sort((a, b) => {
    const matchA = a.match(/(\d{1,2})\/(\d{1,2})/);
    const matchB = b.match(/(\d{1,2})\/(\d{1,2})/);
    if (matchA && matchB) {
      const mA = parseInt(matchA[1], 10);
      const dA = parseInt(matchA[2], 10);
      const mB = parseInt(matchB[1], 10);
      const dB = parseInt(matchB[2], 10);
      if (mA !== mB) return mA - mB;
      return dA - dB;
    }
    return a.localeCompare(b);
  });
}

export default function ItineraryView({ itineraries, onSaveItinerary, onDeleteItinerary, onReorderItineraries }) {
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('timeline');

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Image Lightbox state
  const [previewImage, setPreviewImage] = useState(null);

  // Track images that failed to load
  const [failedImageIds, setFailedImageIds] = useState(new Set());

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    day_label: '7/28 (日)',
    location_name: '',
    category: '構 景點',
    description: '',
    cost_twd: 0,
    cost_foreign: 0,
    currency: 'JPY',
    image_url: ''
  });

  // Extract unique day labels and sort chronologically
  const days = useMemo(() => {
    const set = new Set();
    itineraries.forEach(i => {
      if (i.day_label) set.add(i.day_label.trim());
    });
    return sortDayPills(Array.from(set));
  }, [itineraries]);

  // Categories list
  const categories = ['All', '構 景點', '🧁 吃喝', '🏡 住宿', '🚗 移動', '🛍 購物'];

  // Filtered & Chronologically Sorted Itineraries
  const filteredItineraries = useMemo(() => {
    const filtered = itineraries.filter(item => {
      const matchDay = selectedDay === 'All' || (item.day_label && item.day_label.trim() === selectedDay);
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory || (selectedCategory === '構 景點' && item.category === '⛱ 景點');
      const matchQuery = !searchQuery || 
        item.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDay && matchCategory && matchQuery;
    });

    // Sort chronologically by day label, then by sort_order
    return filtered.sort((a, b) => {
      const matchA = (a.day_label || '').match(/(\d{1,2})\/(\d{1,2})/);
      const matchB = (b.day_label || '').match(/(\d{1,2})\/(\d{1,2})/);
      if (matchA && matchB) {
        const mA = parseInt(matchA[1], 10);
        const dA = parseInt(matchA[2], 10);
        const mB = parseInt(matchB[1], 10);
        const dB = parseInt(matchB[2], 10);
        if (mA !== mB) return mA - mB;
        if (dA !== dB) return dA - dB;
      }
      return (a.sort_order || 0) - (b.sort_order || 0);
    });
  }, [itineraries, selectedDay, selectedCategory, searchQuery]);

  // Shared helper: map a reordered filtered subset back into the full chronologically sorted list
  const commitReorder = (reorderedFiltered) => {
    const fullSorted = [...itineraries].sort((a, b) => {
      const matchA = (a.day_label || '').match(/(\d{1,2})\/(\d{1,2})/);
      const matchB = (b.day_label || '').match(/(\d{1,2})\/(\d{1,2})/);
      if (matchA && matchB) {
        const mA = parseInt(matchA[1], 10);
        const dA = parseInt(matchA[2], 10);
        const mB = parseInt(matchB[1], 10);
        const dB = parseInt(matchB[2], 10);
        if (mA !== mB) return mA - mB;
        if (dA !== dB) return dA - dB;
      }
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

    const filteredIds = new Set(reorderedFiltered.map(item => item.id));
    let filteredCursor = 0;
    const nextMaster = fullSorted.map((item, idx) => {
      const nextItem = filteredIds.has(item.id)
        ? reorderedFiltered[filteredCursor++]
        : item;
      return { ...nextItem, sort_order: idx + 1 };
    });

    if (onReorderItineraries) {
      onReorderItineraries(nextMaster);
    }
  };

  // Drag and Drop Handlers (Desktop Mouse)
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedFiltered = [...filteredItineraries];
    const [movedItem] = reorderedFiltered.splice(draggedIndex, 1);
    reorderedFiltered.splice(targetIndex, 0, movedItem);
    commitReorder(reorderedFiltered);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch Drag Handlers (Mobile Touch Screens)
  const handleTouchStart = (e, index) => {
    setDraggedIndex(index);
  };

  const handleTouchMove = (e, index) => {
    if (draggedIndex === null) return;
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const targetElement = document.elementFromPoint(touchX, touchY);
    if (!targetElement) return;

    const cardElement = targetElement.closest('[data-itin-index]');
    if (cardElement) {
      const targetIndex = parseInt(cardElement.getAttribute('data-itin-index'), 10);
      if (!isNaN(targetIndex) && targetIndex !== dragOverIndex) {
        setDragOverIndex(targetIndex);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const reorderedFiltered = [...filteredItineraries];
      const [movedItem] = reorderedFiltered.splice(draggedIndex, 1);
      reorderedFiltered.splice(dragOverIndex, 0, movedItem);
      commitReorder(reorderedFiltered);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // One-tap Mobile Move Up / Move Down Handlers
  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const reorderedFiltered = [...filteredItineraries];
    const temp = reorderedFiltered[index - 1];
    reorderedFiltered[index - 1] = reorderedFiltered[index];
    reorderedFiltered[index] = temp;
    commitReorder(reorderedFiltered);
  };

  const handleMoveDown = (index) => {
    if (index >= filteredItineraries.length - 1) return;
    const reorderedFiltered = [...filteredItineraries];
    const temp = reorderedFiltered[index + 1];
    reorderedFiltered[index + 1] = reorderedFiltered[index];
    reorderedFiltered[index] = temp;
    commitReorder(reorderedFiltered);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      day_label: days[0] || '7/28 (日)',
      location_name: '',
      category: '構 景點',
      description: '',
      cost_twd: 0,
      cost_foreign: 0,
      currency: 'JPY',
      image_url: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      day_label: item.day_label || '7/28 (日)',
      location_name: item.location_name || '',
      category: (item.category === '構 景點' ? '⛱ 景點' : item.category) || '⛱ 景點',
      description: item.description || '',
      cost_twd: item.cost_twd || 0,
      cost_foreign: item.cost_foreign || 0,
      currency: item.currency || 'JPY',
      image_url: item.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.location_name.trim()) return;

    const newItem = {
      id: editingItem ? editingItem.id : `itin-${Date.now()}`,
      trip_id: editingItem ? editingItem.trip_id : (itineraries[0]?.trip_id || 'trip-1'),
      ...formData,
      category: formData.category === '構 景點' ? '⛱ 景點' : formData.category,
      sort_order: editingItem ? editingItem.sort_order : itineraries.length + 1
    };

    onSaveItinerary(newItem);
    setIsModalOpen(false);
  };

  const handleImageError = (itemId) => {
    setFailedImageIds(prev => new Set(prev).add(itemId));
  };

  const getCategoryBadgeClass = (cat) => {
    if (cat?.includes('吃喝')) return 'bg-[#FFF3CD] text-[#D97706] dark:bg-amber-950 dark:text-amber-300';
    if (cat?.includes('住宿')) return 'bg-[#F3E8FF] text-[#7E22CE] dark:bg-purple-950 dark:text-purple-300';
    if (cat?.includes('移動')) return 'bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950 dark:text-sky-300';
    if (cat?.includes('購物')) return 'bg-[#FCE7F3] text-[#DB2777] dark:bg-pink-950 dark:text-pink-300';
    return 'bg-[#D1FAE5] text-[#059669] dark:bg-emerald-950 dark:text-emerald-300';
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 glass-card p-3.5 sm:p-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB800]" />
          <input
            type="text"
            placeholder="搜尋景點、餐廳名稱或說明..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-[#FFFDF7] dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-[#1E293B] dark:text-slate-100 placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
          />
        </div>

        {/* View Controls & Action Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-full bg-[#FFFDF7] dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-[#FFB800] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> 時間軸
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#FFB800] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> 網格
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-full bg-[#FF5A5F] hover:bg-[#E8484D] text-white text-xs font-bold sticker-btn-shadow flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> 新增行程點
          </button>
        </div>
      </div>

      {/* Filter Pills Row */}
      <div className="space-y-3">
        {/* Sticker Date Cards - Scrollable strip with dynamic left/right cues */}
        <HorizontalScrollStrip className="gap-2.5 py-1.5 px-0.5">
          <button
            onClick={() => setSelectedDay('All')}
            className={`relative overflow-hidden flex flex-col items-center justify-center min-w-[68px] px-3.5 py-2 rounded-2xl border-2 transition-all shrink-0 ${
              selectedDay === 'All'
                ? 'border-[#FF5A5F] text-white scale-105 sticker-btn-shadow'
                : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 text-[#1E293B] dark:text-slate-200 hover:border-[#FFB800]'
            }`}
          >
            {selectedDay === 'All' && (
              <motion.div
                layoutId="day-sticker-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                className="absolute inset-0 bg-[#FF5A5F]"
              />
            )}
            <span className={`relative z-10 text-[10px] font-bold uppercase ${selectedDay === 'All' ? 'text-white/90' : 'text-[#64748B]'}`}>
              ALL
            </span>
            <span className="relative z-10 text-sm font-extrabold">全部</span>
            <span className={`relative z-10 text-[10px] font-bold tabular-nums mt-0.5 px-1.5 rounded-full ${
              selectedDay === 'All' ? 'bg-white/25 text-white' : 'bg-amber-50 dark:bg-slate-800 text-[#FFB800]'
            }`}>
              {itineraries.length}站
            </span>
          </button>

          {days.map((day) => {
            const count = itineraries.filter(i => i.day_label && i.day_label.trim() === day).length;
            const { dateText, weekdayText } = parseDaySticker(day);
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative overflow-hidden flex flex-col items-center justify-center min-w-[72px] px-3.5 py-2 rounded-2xl border-2 transition-all shrink-0 ${
                  isSelected
                    ? 'border-[#FF5A5F] text-white scale-105 sticker-btn-shadow'
                    : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 text-[#1E293B] dark:text-slate-200 hover:border-[#FFB800]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="day-sticker-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    className="absolute inset-0 bg-[#FF5A5F]"
                  />
                )}
                <span className={`relative z-10 text-[10px] font-bold ${isSelected ? 'text-white/90' : 'text-[#64748B] dark:text-slate-400'}`}>
                  {weekdayText}
                </span>
                <span className="relative z-10 text-sm font-extrabold tabular-nums">{dateText}</span>
                <span className={`relative z-10 text-[10px] font-bold tabular-nums mt-0.5 px-1.5 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-amber-50 dark:bg-slate-800 text-[#FFB800]'
                }`}>
                  {count}站
                </span>
              </button>
            );
          })}
        </HorizontalScrollStrip>

        {/* Category Pills - Fixed label (desktop only) + scrollable pills with non-overlapping cues */}
        <div className="flex items-center gap-2 pb-1">
          <span className="hidden sm:inline text-xs font-bold text-[#64748B] uppercase tracking-wider whitespace-nowrap shrink-0">
            類別:
          </span>
          <HorizontalScrollStrip className="gap-2">
            {categories.map((cat) => {
              const isCatSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative shrink-0 overflow-hidden px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap border ${
                    isCatSelected
                      ? 'text-white border-[#FF5A5F] sticker-btn-shadow'
                      : 'bg-white dark:bg-slate-900 text-[#64748B] dark:text-slate-300 border-amber-200/80 dark:border-slate-800 hover:border-[#FFB800]'
                  }`}
                >
                  {isCatSelected && (
                    <motion.div
                      layoutId="category-active-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-[#FF5A5F]"
                    />
                  )}
                  <span className="relative z-10">{cat === '構 景點' ? '⛱ 景點' : cat}</span>
                </button>
              );
            })}
          </HorizontalScrollStrip>
        </div>
      </div>

      {/* Main Itineraries List */}
      {filteredItineraries.length === 0 ? (
        <div className="glass-card p-12 text-center text-[#64748B] space-y-3">
          <MapPin className="w-12 h-12 mx-auto text-[#FFB800] animate-bounce" />
          <p className="text-base font-bold text-[#1E293B] dark:text-slate-200">沒有符合條件的行程記錄</p>
          <button
            onClick={handleOpenAdd}
            className="text-xs text-[#FF5A5F] hover:underline font-bold"
          >
            點此新增第一筆行程景點
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        
        /* Timeline View with Mobile Touch Drag and One-Tap Reordering */
        <div className="timeline-dashed-line ml-4 sm:ml-6 space-y-5 pt-2 pb-6">
          {filteredItineraries.map((item, idx) => {
            const hasImage = Boolean(item.image_url && item.image_url.trim());
            const isFailed = failedImageIds.has(item.id);
            const displayCat = item.category === '構 景點' ? '⛱ 景點' : (item.category || '⛱ 景點');
            const { cleanText, links } = parseDescriptionAndLinks(item.description);

            const isDragging = draggedIndex === idx;
            const isOver = dragOverIndex === idx;

            return (
              <div
                key={item.id}
                data-itin-index={idx}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onTouchStart={(e) => handleTouchStart(e, idx)}
                onTouchMove={(e) => handleTouchMove(e, idx)}
                onTouchEnd={handleTouchEnd}
                className={`relative pl-6 sm:pl-8 group transition-all duration-200 ${
                  isDragging ? 'opacity-40 scale-98' : ''
                } ${isOver ? 'border-t-2 border-[#FF5A5F] pt-2' : ''}`}
              >
                
                {/* Timeline Dot */}
                <div className="absolute -left-[17px] top-5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-[#FFB800] shadow-md flex items-center justify-center text-[#FF5A5F] group-hover:scale-110 group-hover:bg-[#FFB800] group-hover:text-white transition-all cursor-grab active:cursor-grabbing tabular-nums z-10">
                  <span className="text-[11px] font-extrabold">{idx + 1}</span>
                </div>

                {/* Card Container with Staggered Entrance */}
                <motion.div
                  key={`${selectedDay}-${selectedCategory}-${item.id}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: Math.min(idx * 0.04, 0.32), ease: 'easeOut' }}
                  className="glass-card p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300 relative"
                >
                  
                  {/* Drag Handle Icon */}
                  <div 
                    className="absolute left-2 top-5 text-amber-300 hover:text-[#FF5A5F] cursor-grab active:cursor-grabbing touch-none p-1"
                    title="按住拖曳或點擊右上角箭頭排序"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Top-Right Compact Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pl-4 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getCategoryBadgeClass(displayCat)}`}>
                        {displayCat}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border border-[#FFB800]/50 flex items-center gap-1 tabular-nums">
                        <Clock className="w-3 h-3 text-[#FFB800]" /> {item.day_label}
                      </span>
                      {item.cost_twd > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 text-[#FF5A5F] dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 tabular-nums">
                          NT$ {item.cost_twd.toLocaleString()}
                        </span>
                      )}
                      {item.cost_foreign > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800 tabular-nums">
                          {item.cost_foreign.toLocaleString()} {item.currency || 'JPY'}
                        </span>
                      )}
                    </div>

                    {/* Compact Icon Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="w-7 h-7 rounded-full bg-amber-50/80 dark:bg-slate-800 text-[#64748B] dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFB800] hover:text-white transition-colors flex items-center justify-center"
                        title="向上移動"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === filteredItineraries.length - 1}
                        className="w-7 h-7 rounded-full bg-amber-50/80 dark:bg-slate-800 text-[#64748B] dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFB800] hover:text-white transition-colors flex items-center justify-center"
                        title="向下移動"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="w-7 h-7 rounded-full bg-amber-50/80 dark:bg-slate-800 text-[#64748B] dark:text-slate-300 hover:bg-[#FF5A5F] hover:text-white transition-colors flex items-center justify-center"
                        title="編輯行程點"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="w-7 h-7 rounded-full bg-rose-50/80 dark:bg-slate-800 text-rose-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                        title="刪除行程點"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-between pl-4">
                    
                    {/* Info Column */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B] dark:text-slate-100 group-hover:text-[#FF5A5F] transition-colors">
                        {item.location_name}
                      </h3>

                      {cleanText && (
                        <p className="text-sm text-[#64748B] dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {cleanText}
                        </p>
                      )}

                      {links.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {links.map((linkObj, lIdx) => (
                            <a
                              key={lIdx}
                              href={linkObj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="group/map inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 hover:bg-[#00B4D8] text-[#00B4D8] hover:text-white border border-sky-200 dark:bg-sky-950/60 dark:border-sky-800 dark:text-sky-300 transition-all shadow-xs"
                            >
                              {linkObj.isMap ? (
                                <>
                                  <MapPin className="w-3.5 h-3.5 text-[#FF5A5F] group-hover/map:text-white group-hover/map:-translate-y-0.5 transition-transform" />
                                  <span>Google 地圖導航</span>
                                </>
                              ) : (
                                <span>🔗 開啟相關連結</span>
                              )}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Image Column */}
                    {hasImage && (
                      <div className="relative group/img w-full sm:w-36 h-40 sm:h-32 rounded-2xl border-2 border-amber-100 dark:border-slate-700 overflow-hidden bg-amber-50 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                        {isFailed ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center text-[#64748B] space-y-1">
                            <ImageOff className="w-6 h-6 text-amber-400" />
                            <span className="text-[10px] font-medium">圖片無法載入</span>
                            <a
                              href={item.image_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-[#00B4D8] underline flex items-center gap-0.5"
                            >
                              開啟連結 <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        ) : (
                          <>
                            <img
                              src={item.image_url}
                              alt={item.location_name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 cursor-pointer"
                              onClick={() => setPreviewImage(item.image_url)}
                              onError={() => handleImageError(item.id)}
                            />
                            <div className="absolute bottom-2 right-2 flex items-center gap-1">
                              <a
                                href={item.image_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-full bg-black/55 text-white backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-[#FF5A5F]"
                                title="在新分頁開啟原始圖片"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => setPreviewImage(item.image_url)}
                                className="p-1.5 rounded-full bg-black/55 text-white backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-[#FF5A5F]"
                                title="全螢幕預覽"
                              >
                                <Maximize2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                  </div>

                </motion.div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItineraries.map((item) => {
            const hasImage = Boolean(item.image_url && item.image_url.trim());
            const isFailed = failedImageIds.has(item.id);
            const displayCat = item.category === '構 景點' ? '⛱ 景點' : (item.category || '⛱ 景點');
            const { cleanText, links } = parseDescriptionAndLinks(item.description);

            return (
              <div key={item.id} className="glass-card overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div>
                  {hasImage && (
                    <div className="relative h-44 w-full bg-amber-50 dark:bg-slate-800 overflow-hidden cursor-pointer border-b border-amber-100 dark:border-slate-800" onClick={() => setPreviewImage(item.image_url)}>
                      {isFailed ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50 dark:bg-slate-800 text-[#64748B] space-y-1">
                          <ImageOff className="w-6 h-6 text-amber-400" />
                          <span className="text-[10px]">圖片無法載入</span>
                        </div>
                      ) : (
                        <img
                          src={item.image_url}
                          alt={item.location_name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={() => handleImageError(item.id)}
                        />
                      )}
                      <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${getCategoryBadgeClass(displayCat)}`}>
                        {displayCat}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <h4 className="font-extrabold text-[#1E293B] dark:text-slate-100 text-base">
                      {item.location_name}
                    </h4>
                    {cleanText && (
                      <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {cleanText}
                      </p>
                    )}
                    {links.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {links.map((linkObj, lIdx) => (
                          <a
                            key={lIdx}
                            href={linkObj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 hover:bg-[#00B4D8] text-[#00B4D8] hover:text-white border border-sky-200 transition-all"
                          >
                            <span>{linkObj.isMap ? '📍 Google 地圖導航' : '🔗 相關連結'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-3 flex items-center justify-between border-t border-amber-100 dark:border-slate-800 mt-1">
                  <span className="text-xs font-extrabold text-[#FF5A5F] tabular-nums">
                    {item.cost_twd > 0 ? `NT$ ${item.cost_twd.toLocaleString()}` : item.day_label}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(item)} className="w-7 h-7 rounded-full hover:bg-amber-50 flex items-center justify-center text-[#64748B] hover:text-[#FF5A5F]">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(item)} className="w-7 h-7 rounded-full hover:bg-rose-50 flex items-center justify-center text-rose-400 hover:text-red-500" title="刪除行程點">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white z-10"
            onClick={() => setPreviewImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden flex flex-col items-center justify-center">
            <img
              src={previewImage}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <a
              href={previewImage}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-3 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> 在新分頁開啟大圖
            </a>
          </div>
        </div>
      )}

      {/* Add / Edit Itinerary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingItem ? '編輯行程點' : '新增行程點'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    日期標籤 (格式如: 7/28 (日))
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.day_label}
                    onChange={(e) => setFormData({...formData, day_label: e.target.value})}
                    placeholder="如: 7/28 (日)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    類別
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="⛱ 景點">⛱ 景點</option>
                    <option value="🧁 吃喝">🧁 吃喝</option>
                    <option value="🏡 住宿">🏡 住宿</option>
                    <option value="🚗 移動">🚗 移動</option>
                    <option value="🛍 購物">🛍 購物</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  地點 / 景點名稱 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location_name}
                  onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                  placeholder="如: 美麗海水族館, 大須觀音"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  詳細備註 / 時間細節
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="可寫時間規劃、搭車建議或地標提醒..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    預算台幣 (TWD)
                  </label>
                  <input
                    type="number"
                    value={formData.cost_twd}
                    onChange={(e) => setFormData({...formData, cost_twd: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    外幣金額 (JPY/KRW)
                  </label>
                  <input
                    type="number"
                    value={formData.cost_foreign}
                    onChange={(e) => setFormData({...formData, cost_foreign: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  圖片 URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20"
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="glass-card w-full max-w-sm p-6 bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-slate-800 shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-[#1E293B] dark:text-slate-100">
                確定要刪除這個行程點嗎？
              </h3>
              <p className="text-sm font-bold text-[#FF5A5F] line-clamp-2">
                {deleteTarget.location_name}
              </p>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                {deleteTarget.day_label} · 刪除後將無法復原
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#64748B] dark:text-slate-300 font-bold text-xs transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteItinerary(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all"
              >
                確定刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
