"use client";

import { useEffect, useState } from "react";

/**
 * Framer Motion still runs JS-driven animations regardless of Tailwind's
 * `motion-reduce:` variant (that only affects CSS transitions/animations),
 * so components that animate via `motion.*` props need this to actually
 * respect the OS-level accessibility setting.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}
