'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if a media query matches
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Always start with false on server to avoid hydration mismatch
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set actual value after mount
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handler);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  // Return false during SSR and initial render to avoid hydration mismatch
  if (!mounted) return false;
  
  return matches;
}

/**
 * Hook to check if viewport is desktop/tablet (>= 768px)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

/**
 * Hook to check if viewport is mobile (< 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
