"use client";

import { useEffect, useState } from "react";

/**
 * 미디어 쿼리 매칭 여부를 추적하는 Hook
 * @param query - CSS 미디어 쿼리 문자열 (예: '(max-width: 767px)')
 * @returns 미디어 쿼리 매칭 여부
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query, mounted]);

  return matches;
}
