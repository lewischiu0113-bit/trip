import React, { useState } from 'react';
import { Maximize2, X, ExternalLink, Clock } from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80';

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

  function getCategoryBadgeClass(cat) {
    if (cat?.includes('吃喝')) return 'bg-[#FFF3CD] text-[#D97706] dark:bg-amber-950 dark:text-amber-300';
    if (cat?.includes('住宿')) return 'bg-[#F3E8FF] text-[#7E22CE] dark:bg-purple-950 dark:text-purple-300';
    if (cat?.includes('移動')) return 'bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950 dark:text-sky-300';
    if (cat?.includes('購物')) return 'bg-[#FCE7F3] text-[#DB2777] dark:bg-pink-950 dark:text-pink-300';
    return 'bg-[#D1FAE5] text-[#059669] dark:bg-emerald-950 dark:text-emerald-300';
  }

  export default function PlaceNotesView({ itineraries }) {
    const [selectedPlace, setSelectedPlace] = useState(null);

    // Filter items to ONLY show 景點 (Attractions), 吃喝 (Dining), and 購物 (Shopping)
    // Exclude 🚗 移動 (Transportation) and 🏡 住宿 (Lodging)
    const filteredPlaceItems = itineraries.filter(i => {
      const cat = i.category || '';
      const isTransportOrLodging = cat.includes('移動') || cat.includes('住宿') || i.location_name.includes('抵達') || i.location_name.includes('前往');
      const isAttractionDiningShopping = cat.includes('景點') || cat.includes('吃喝') || cat.includes('購物') || !cat;
      return isAttractionDiningShopping && !isTransportOrLodging;
    });

    return (
      <div className="space-y-6">

            {/* Polaroid Grid of Places */ }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
              {filteredPlaceItems.map((place, idx) => {
                const imgUrl = place.image_url || DEFAULT_FALLBACK_IMAGE;
                const { cleanText } = parseDescriptionAndLinks(place.description);
                const tiltClass = idx % 2 === 0 ? 'hover:-rotate-[1.5deg]' : 'hover:rotate-[1.5deg]';

                return (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className={`bg-white dark:bg-slate-900 p-3 pb-4 rounded-2xl border-2 border-[#FDE68A] dark:border-slate-800 shadow-md hover:shadow-xl group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${tiltClass} flex flex-col justify-between`}
                  >
                    <div>
                        {/* Polaroid Photo Frame */}
                        <div className="relative h-48 rounded-xl bg-amber-50 dark:bg-slate-800 overflow-hidden border border-amber-100 dark:border-slate-700">
                          <img
                            src={imgUrl}
                            alt={place.location_name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              if (e.target.src !== DEFAULT_FALLBACK_IMAGE) {
                                e.target.src = DEFAULT_FALLBACK_IMAGE;
                              }
                            }}
                          />
                            <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${getCategoryBadgeClass(place.category)}`}>
                              {place.category || '⛱ 景點'}
                            </span>
                        </div>

                        {/* Title & snippet */}
                            <div className="pt-3 px-1 space-y-1.5">
                              <h3 className="font-extrabold text-[#1E293B] dark:text-slate-100 text-sm group-hover:text-[#FF5A5F] transition-colors line-clamp-2">
                                {place.location_name}
                              </h3>
                                  {cleanText && (
                                    <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-2 leading-relaxed">
                                      {cleanText}
                                    </p>
                                  )}
                                </div>
              </div>

                              <div className="pt-3 px-1 mt-2 border-t border-amber-100/80 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#64748B] dark:text-slate-400 flex items-center gap-1 tabular-nums">
                                  <Clock className="w-3 h-3 text-[#FFB800]" />
                                  {place.day_label}
                                </span>
                                <span className="text-xs font-bold text-[#FF5A5F] flex items-center gap-1">
                                  查看筆記細節
                                  <Maximize2 className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                            );
        })}
                        </div>

                        {/* Place Detail Modal */}
                            {selectedPlace && (() => {
                              const { cleanText, links } = parseDescriptionAndLinks(selectedPlace.description);
                              return (
                                <div
                                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                                  onClick={() => setSelectedPlace(null)}
                                >
                                        <div
                                          className="glass-card w-full max-w-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border-2 border-[#FDE68A] dark:border-slate-800"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {/* Modal Image */}
                                          {selectedPlace.image_url && (
                                            <div className="relative h-64 sm:h-80 bg-slate-900">
                                              <img
                                                src={selectedPlace.image_url}
                                                alt={selectedPlace.location_name}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  if (e.target.src !== DEFAULT_FALLBACK_IMAGE) {
                                                    e.target.src = DEFAULT_FALLBACK_IMAGE;
                                                  }
                                                }}
                                              />
                                              <div className="absolute top-4 right-4 flex items-center gap-2">
                                                <a
                                                  href={selectedPlace.image_url}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="p-2 rounded-full bg-black/50 hover:bg-[#FF5A5F] text-white backdrop-blur-md transition-colors"
                                                  title="在新分頁開啟原始圖片"
                                                >
                                                  <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                  onClick={() => setSelectedPlace(null)}
                                                  className="p-2 rounded-full bg-black/50 hover:bg-[#FF5A5F] text-white backdrop-blur-md transition-colors"
                                                >
                                                  <X className="w-5 h-5" />
                                                </button>
                                              </div>
                                            </div>
                                          )}

                                          {/* Modal Body */}
                                          <div className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryBadgeClass(selectedPlace.category)}`}>
                                                {selectedPlace.category || '⛱ 景點'}
                                              </span>
                                              <span className="text-xs font-bold text-[#64748B] tabular-nums">
                                                {selectedPlace.day_label}
                                              </span>
                                            </div>

                                            <h2 className="text-2xl font-extrabold text-[#1E293B] dark:text-slate-100">
                                              {selectedPlace.location_name}
                                            </h2>

                                            {cleanText && (
                                              <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-slate-800/60 border border-amber-200/70 dark:border-slate-700 text-sm text-[#1E293B] dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                {cleanText}
                                              </div>
                                            )}

                                            {links.length > 0 && (
                                              <div className="flex items-center gap-2 flex-wrap">
                                                {links.map((linkObj, lIdx) => (
                                                  <a
                                                    key={lIdx}
                                                    href={linkObj.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-sky-50 hover:bg-[#00B4D8] text-[#00B4D8] hover:text-white border border-sky-200 transition-all"
                                                  >
                                                    <span>{linkObj.isMap ? '📍 Google 地圖導航' : '🔗 開啟相關連結'}</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                  </a>
                                                ))}
                                              </div>
                                            )}

                                            <div className="pt-2 flex justify-end">
                                              <button
                                                onClick={() => setSelectedPlace(null)}
                                                className="px-5 py-2 rounded-full bg-[#FF5A5F] hover:bg-[#E8484D] text-white font-bold text-xs sticker-btn-shadow transition-all"
                                              >
                                                關閉
                                              </button>
                                            </div>
                                          </div>
                                          </div>
                                        </div>
                                      );
      })()}
                                    </div>
                                  );
}
