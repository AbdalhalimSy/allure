"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { useI18n } from "@/contexts/I18nContext";

export interface HorizontalCarouselItem<T> {
  key: string | number;
  data: T;
}

type Direction = "left" | "right";

interface HorizontalCarouselProps<T> {
  items: HorizontalCarouselItem<T>[];
  renderItem: (item: HorizontalCarouselItem<T>) => React.ReactNode;
  className?: string;
  gap?: number;
  speedPxPerSecond?: number;
  direction?: Direction;
  pauseOnHover?: boolean;
  isDraggable?: boolean;
  autoPlay?: boolean;
  gradientFades?: boolean;
  ariaLabel?: string;
}

export default function HorizontalCarousel<T = unknown>({
  items,
  renderItem,
  className = "",
  gap = 24,
  speedPxPerSecond = 80,
  direction,
  pauseOnHover = true,
  isDraggable = true,
  autoPlay = true,
  gradientFades = false,
  ariaLabel,
}: HorizontalCarouselProps<T>) {
  const { locale } = useI18n();
  const isRTL = locale === "ar";
  
  // Auto-detect direction based on RTL/LTR if not explicitly provided
  const effectiveDirection = direction ?? (isRTL ? "right" : "left");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const [segmentWidth, setSegmentWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Keep animation state in refs to avoid rerenders
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const visibleRef = useRef(true);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  const [cursorState, setCursorState] = useState<"grab" | "grabbing" | "">("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Measure the width of a single set of items
  useEffect(() => {
    if (!isMounted) return;

    const measure = () => {
      const width = primaryRef.current?.scrollWidth ?? 0;
      setSegmentWidth(width);
    };

    measure();

    const handleResize = () => measure();
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && primaryRef.current) {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(primaryRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [items, gap, isMounted]);

  // Pause animation when out of view
  useEffect(() => {
    if (!autoPlay || !isMounted) return;
    if (!containerRef.current || typeof IntersectionObserver === "undefined") {
      visibleRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [autoPlay, isMounted]);

  // Animation loop
  useEffect(() => {
    if (!trackRef.current || segmentWidth <= 0 || !isMounted) return;

    const loopDistance = segmentWidth + gap;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!trackRef.current) return;

      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const active =
        autoPlay &&
        !pausedRef.current &&
        !isDragging &&
        visibleRef.current &&
        items.length > 0;

      if (active) {
        const directionSign = effectiveDirection === "left" ? -1 : 1;

        offsetRef.current += speedPxPerSecond * delta * directionSign;

        while (offsetRef.current <= -loopDistance)
          offsetRef.current += loopDistance;
        while (offsetRef.current >= loopDistance)
          offsetRef.current -= loopDistance;
      }

      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    autoPlay,
    segmentWidth,
    gap,
    speedPxPerSecond,
    effectiveDirection,
    isMounted,
    isDragging,
    items.length,
  ]);

  // Dragging
  const startDrag = useCallback(
    (clientX: number) => {
      if (!isDraggable) return;

      setIsDragging(true);
      setCursorState("grabbing");
      dragStartXRef.current = clientX;
      dragStartOffsetRef.current = offsetRef.current;

      if (containerRef.current) {
        containerRef.current.style.userSelect = "none";
      }
    },
    [isDraggable]
  );

  const moveDrag = useCallback(
    (clientX: number) => {
      if (!isDragging || !isDraggable) return;

      const loopDistance = segmentWidth + gap;
      const delta = clientX - dragStartXRef.current;
      let nextOffset = dragStartOffsetRef.current + delta;

      while (nextOffset <= -loopDistance) nextOffset += loopDistance;
      while (nextOffset >= loopDistance) nextOffset -= loopDistance;

      offsetRef.current = nextOffset;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${nextOffset}px, 0, 0)`;
      }
    },
    [isDragging, isDraggable, segmentWidth, gap]
  );

  const endDrag = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    setCursorState(isDraggable ? "grab" : "");

    if (containerRef.current) {
      containerRef.current.style.userSelect = "";
    }
  }, [isDragging, isDraggable]);

  // Mouse events
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      startDrag(e.clientX);
    },
    [startDrag]
  );

  // Global window listeners use DOM event types to avoid React synthetic mismatch
  const handleWindowMouseMove = useCallback(
    (e: globalThis.MouseEvent) => moveDrag(e.clientX),
    [moveDrag]
  );

  const handleWindowMouseUp = useCallback(() => endDrag(), [endDrag]);

  // Touch events
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX);
      }
    },
    [startDrag]
  );

  const handleWindowTouchMove = useCallback(
    (e: globalThis.TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        moveDrag(e.touches[0].clientX);
      }
    },
    [moveDrag]
  );

  const handleWindowTouchEnd = useCallback(() => endDrag(), [endDrag]);

  // Global listeners while dragging
  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    window.addEventListener("touchmove", handleWindowTouchMove, {
      passive: false,
    });
    window.addEventListener("touchend", handleWindowTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      window.removeEventListener("touchmove", handleWindowTouchMove);
      window.removeEventListener("touchend", handleWindowTouchEnd);
    };
  }, [
    isDragging,
    handleWindowMouseMove,
    handleWindowMouseUp,
    handleWindowTouchMove,
    handleWindowTouchEnd,
  ]);

  // Hover pause
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover && autoPlay) pausedRef.current = true;
    if (isDraggable && !isDragging) setCursorState("grab");
  }, [pauseOnHover, autoPlay, isDraggable, isDragging]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover && autoPlay) pausedRef.current = false;
    if (!isDragging) setCursorState("");
    endDrag();
  }, [pauseOnHover, autoPlay, isDragging, endDrag]);

  if (items.length === 0) return null;

  const cursorClass =
    cursorState === "grab"
      ? "cursor-grab"
      : cursorState === "grabbing"
      ? "cursor-grabbing"
      : "";

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      aria-label={ariaLabel}
      role="region"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {gradientFades && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-white via-white/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-white via-white/70 to-transparent" />
        </>
      )}

      <div
        ref={trackRef}
        data-carousel-track
        className={`flex ${cursorClass}`}
        style={{ gap: `${gap}px`, willChange: "transform" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {Array.from({ length: autoPlay ? 2 : 1 }).map((_, segmentIndex) => (
          <div
            key={`segment-${segmentIndex}`}
            ref={segmentIndex === 0 ? primaryRef : undefined}
            aria-hidden={segmentIndex > 0 && autoPlay}
            className="flex items-stretch"
            style={{ gap: `${gap}px` }}
          >
            {items.map((item) => (
              <div
                key={`${item.key}-${segmentIndex}`}
                className="shrink-0 select-none"
                draggable={false}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
