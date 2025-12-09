/**
 * Carousel utility functions for ImageCarousel component
 * These pure functions are separated for testability without Sanity dependencies
 */

/**
 * Navigation state for carousel
 * Used for property testing
 */
export interface CarouselNavigationState {
  currentIndex: number;
  totalImages: number;
}

/**
 * Calculates the next index when navigating forward
 * Property 7: Carousel navigation bounds
 * Validates: Requirements 5.3, 5.4, 5.5, 5.6
 *
 * @param state - Current carousel navigation state
 * @returns New index after navigating next (clamped to bounds)
 */
export function navigateNext(state: CarouselNavigationState): number {
  const { currentIndex, totalImages } = state;
  if (totalImages <= 0) return 0;
  return Math.min(currentIndex + 1, totalImages - 1);
}

/**
 * Calculates the previous index when navigating backward
 * Property 7: Carousel navigation bounds
 * Validates: Requirements 5.3, 5.4, 5.5, 5.6
 *
 * @param state - Current carousel navigation state
 * @returns New index after navigating previous (clamped to bounds)
 */
export function navigatePrevious(state: CarouselNavigationState): number {
  const { currentIndex } = state;
  return Math.max(currentIndex - 1, 0);
}

/**
 * Checks if navigation to next is possible
 *
 * @param state - Current carousel navigation state
 * @returns true if can navigate to next image
 */
export function canNavigateNext(state: CarouselNavigationState): boolean {
  const { currentIndex, totalImages } = state;
  return totalImages > 0 && currentIndex < totalImages - 1;
}

/**
 * Checks if navigation to previous is possible
 *
 * @param state - Current carousel navigation state
 * @returns true if can navigate to previous image
 */
export function canNavigatePrevious(state: CarouselNavigationState): boolean {
  const { currentIndex } = state;
  return currentIndex > 0;
}

/**
 * Gets the count of carousel indicators to display
 * Property 6: Carousel indicator count accuracy
 * Validates: Requirements 5.1
 *
 * @param images - Array of images in the carousel
 * @returns Number of indicators to display (equals images array length)
 */
export function getIndicatorCount(images: unknown[]): number {
  if (!Array.isArray(images)) return 0;
  return images.length;
}
