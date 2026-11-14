import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HorizontalScrollStrip({ children, className = '' }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    window.addEventListener('resize', updateScrollState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, children]);

  const scrollByOffset = (offset) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center gap-1.5 min-w-0 flex-1">
      {/* Left Arrow (only when content exists to the left; non-overlapping) */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByOffset(-180)}
          aria-label="向左捲動"
          className="shrink-0 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 shadow-sm text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white transition-all flex items-center justify-center active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable Content with subtle non-blocking edge fades */}
      <div className="relative flex-1 min-w-0">
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 z-10 bg-gradient-to-r from-[#FFFDF7] dark:from-slate-950 to-transparent" />
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className={`flex items-center overflow-x-auto no-scrollbar scroll-smooth ${className}`}
        >
          {children}
        </div>

        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-3 z-10 bg-gradient-to-l from-[#FFFDF7] dark:from-slate-950 to-transparent" />
        )}
      </div>

      {/* Right Arrow (only when content exists to the right; non-overlapping) */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByOffset(180)}
          aria-label="向右捲動查看更多"
          className="shrink-0 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 shadow-sm text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white transition-all flex items-center justify-center active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
