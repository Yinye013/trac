"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollTriggerOptions {
  onIntersect: () => void;
  enabled: boolean;
  /** Start fetching this far before the sentinel actually enters the viewport. */
  rootMargin?: string;
}

/**
 * Attaches an IntersectionObserver to the returned ref. When that sentinel
 * element (rendered at the bottom of the list) scrolls into view, fires
 * `onIntersect` — the infinite-scroll trigger, without any scroll-position
 * math or library dependency.
 */
export function useInfiniteScrollTrigger({
  onIntersect,
  enabled,
  rootMargin = "400px",
}: UseInfiniteScrollTriggerOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onIntersectRef = useRef(onIntersect);
  onIntersectRef.current = onIntersect;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersectRef.current();
        }
      },
      { rootMargin },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
}
