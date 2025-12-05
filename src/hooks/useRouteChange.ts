'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Custom hook to detect route changes in Next.js App Router
 * and trigger loading state accordingly.
 * 
 * Requirements:
 * - 3.1: Intercept Link component navigation
 * - 3.2: Intercept programmatic navigation (router.push)
 * - 3.3: Intercept browser back/forward navigation
 * - 3.4: Exclude hash-only navigation (same page anchor links)
 */
export interface UseRouteChangeReturn {
  isChanging: boolean;
}

export function useRouteChange(): UseRouteChangeReturn {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startLoading, stopLoading } = useLoading();
  
  const [isChanging, setIsChanging] = useState(false);
  
  // Store previous values to detect changes
  const prevPathname = useRef(pathname);
  const prevSearchParams = useRef(searchParams?.toString() ?? '');
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip first render - no navigation has occurred yet
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPathname.current = pathname;
      prevSearchParams.current = searchParams?.toString() ?? '';
      return;
    }

    const currentSearchParams = searchParams?.toString() ?? '';
    
    // Check if pathname or search params changed (not just hash)
    // Hash changes are handled by the browser and don't trigger usePathname/useSearchParams updates
    const pathnameChanged = prevPathname.current !== pathname;
    const searchParamsChanged = prevSearchParams.current !== currentSearchParams;
    
    if (pathnameChanged || searchParamsChanged) {
      // Route has changed - stop loading (page has loaded)
      setIsChanging(false);
      stopLoading();
    }

    // Update refs for next comparison
    prevPathname.current = pathname;
    prevSearchParams.current = currentSearchParams;
  }, [pathname, searchParams, stopLoading]);

  // Intercept navigation events to start loading
  useEffect(() => {
    // Handle click events on links to start loading before navigation
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href) return;
      
      // Skip external links
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
        return;
      }
      
      // Skip hash-only links (Requirement 3.4)
      if (href.startsWith('#')) {
        return;
      }
      
      // Skip links with target="_blank" or download attribute
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return;
      }
      
      // Skip if modifier keys are pressed (open in new tab)
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      // Parse the href to check if it's a hash-only change on the same page
      try {
        const url = new URL(href, window.location.origin);
        const currentUrl = new URL(window.location.href);
        
        // If only the hash is different, don't show loading (Requirement 3.4)
        if (
          url.pathname === currentUrl.pathname &&
          url.search === currentUrl.search &&
          url.hash !== currentUrl.hash
        ) {
          return;
        }
        
        // If navigating to the exact same URL, don't show loading
        if (
          url.pathname === currentUrl.pathname &&
          url.search === currentUrl.search &&
          url.hash === currentUrl.hash
        ) {
          return;
        }
      } catch {
        // If URL parsing fails, proceed with loading
      }

      // Start loading for valid navigation
      setIsChanging(true);
      startLoading();
    };

    // Handle popstate for browser back/forward (Requirement 3.3)
    const handlePopState = () => {
      setIsChanging(true);
      startLoading();
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [startLoading]);

  return { isChanging };
}
