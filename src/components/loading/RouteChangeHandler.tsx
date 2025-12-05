'use client';

import { useRouteChange } from '@/hooks/useRouteChange';

/**
 * Component that handles route change detection and triggers loading state.
 * Must be placed inside LoadingProvider.
 * 
 * This component doesn't render anything - it just sets up the route change
 * detection logic using the useRouteChange hook.
 */
export function RouteChangeHandler() {
  // This hook handles all the route change detection and loading state management
  useRouteChange();
  
  return null;
}
