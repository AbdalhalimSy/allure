"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HorizontalCarouselItem<T> {
  key: string | number;
  data: T;
}

interface HorizontalCarouselProps<T> {
  items: HorizontalCarouselItem<T>[];
  renderItem: (item: HorizontalCarouselItem<T>) => React.ReactNode;
  className?: string;
  itemGap?: number; // px
  autoScroll?: boolean;
  autoScrollPxPerSecond?: number; // speed
  pauseOnHover?: boolean;
  arrows?: boolean;
  loop?: boolean; // duplicate items for seamless loop
}

export default function HorizontalCarousel<T = unknown>({
  items = [],
  renderItem,
  className = "",
  itemGap = 24,
  autoScroll = true,
  autoScrollPxPerSecond = 60,
  pauseOnHover = true,
  arrows = true,
  loop = true,
}: HorizontalCarouselProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [isPaused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Prepare loop items if needed
  const displayItems = loop ? [...items, ...items] : items;

  const step = autoScrollPxPerSecond / 60; // px per frame at ~60fps

  const animate = useCallback(() => {
    const tick = () => {
      if (!autoScroll || isPaused) return;
      const el = scrollRef.current;
      if (!el) return;
      el.scrollLeft += step;
      if (loop) {
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      } else if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        el.scrollLeft = 0;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, [autoScroll, isPaused, step, loop]);

  useEffect(() => {
    if (autoScroll) {
      frameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [animate, autoScroll]);

  const scrollBy = (dx: number) => {
    setPaused(true);
    const el = scrollRef.current;
    if (!el) return;
    // If looping, ensure seamless wrap when navigating with arrows
    if (loop) {
      const halfWidth = el.scrollWidth / 2;
      // Wrap from the start to the cloned set when moving left
      if (dx < 0 && el.scrollLeft + dx <= 0) {
        el.scrollLeft = el.scrollLeft + halfWidth;
      }
      // Wrap from the end back to original when moving right
      if (dx > 0 && el.scrollLeft + dx >= halfWidth) {
        el.scrollLeft = el.scrollLeft - halfWidth;
      }
    }
    el.scrollBy({ left: dx, behavior: "smooth" });
    // Resume after short delay
    setTimeout(() => setPaused(false), 2500);
  };

  const handleScroll = useCallback(() => {
    if (!loop) return;
    const el = scrollRef.current;
    if (!el) return;
    const halfWidth = el.scrollWidth / 2;
    // Seamless wrap for manual/user scroll
    if (el.scrollLeft >= halfWidth) {
      el.scrollLeft -= halfWidth;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += halfWidth;
    }
  }, [loop]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setPaused(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (pauseOnHover) setPaused(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setPaused(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    el.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={handleMouseLeave}
    >
      {arrows && (
        <>
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy(-480)}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white md:block dark:bg-black/50 dark:hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy(480)}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white md:block dark:bg-black/50 dark:hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      <div
        ref={scrollRef}
        className="no-scrollbar flex overflow-x-auto scroll-px-6 py-2 cursor-grab active:cursor-grabbing" // Ensures no native scrollbar is visible
        style={{ gap: itemGap, userSelect: isDragging ? "none" : "auto" }}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {displayItems.map((item, idx) => {
          const duplicateIndex =
            loop && idx >= items.length ? idx - items.length : idx;
          const keySuffix = loop
            ? `-${idx >= items.length ? "clone" : "orig"}-${duplicateIndex}`
            : "";
          return (
            <div key={`${item.key}${keySuffix}`} className="shrink-0">
              {renderItem(item)}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .no-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  );
}
