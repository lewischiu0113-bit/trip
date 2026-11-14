import React, { useState } from 'react';
import { Maximize2, X, ExternalLink } from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80';

function renderDescriptionWithLinks(text) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-orange-600 dark:text-orange-400 hover:text-orange-500 underline font-medium break-all inline-flex items-center gap-1"
        >
          {part}
          <ExternalLink className="w-3 h-3 shrink-0 inline" />
        </a>
      );
    }
    return part;
  });
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
      
      {/* Grid of Places */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-2">
        {filteredPlaceItems.map((place) => {
          const imgUrl = place.image_url || DEFAULT_FALLBACK_IMAGE;

          return (
            <div
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              className="glass-card overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Preview */}
                <div className="relative h-48 bg-slate-800 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={place.location_name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      if (e.target.src !== DEFAULT_FALLBACK_IMAGE) {
                        e.target.src = DEFAULT_FALLBACK_IMAGE;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-md">
                    {place.category || '⛱ 景點'}
                  </span>
                </div>

                {/* Title & snippet */}
                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-orange-500 transition-colors">
                    {place.location_name}
                  </h3>
                  {place.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {renderDescriptionWithLinks(place.description)}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 pt-0 text-xs font-semibold text-orange-500 flex items-center gap-1 justify-end">
                <span>查看筆記細節</span>
                <Maximize2 className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPlace(null)}
        >
          <div 
            className="glass-card w-full max-w-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
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
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
                    title="在新分頁開啟原始圖片"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                  {selectedPlace.category || '⛱ 景點'}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {selectedPlace.day_label}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {selectedPlace.location_name}
              </h2>

              {selectedPlace.description && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {renderDescriptionWithLinks(selectedPlace.description)}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
