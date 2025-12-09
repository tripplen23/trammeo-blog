// Types for Gallery Categories feature
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Gallery category values matching Sanity schema
 */
export type GalleryCategory = 'littleLifeAtArt' | 'theHomeCafe';

/**
 * Category filter type including "all" option for UI filtering
 */
export type CategoryFilter = 'all' | GalleryCategory;

/**
 * Human-readable labels for category filters
 */
export const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: 'All',
  littleLifeAtArt: 'Little life at Art',
  theHomeCafe: 'The home cafe',
};

/**
 * Gallery post interface matching updated Sanity schema
 * Requirements: 1.1, 2.1, 3.1
 */
export interface GalleryPost {
  _id: string;
  images: SanityImageSource[];
  category: GalleryCategory;
  portfolioLink?: string;
  caption: string;
  location?: string;
  date?: string;
}

/**
 * Validation constraints for gallery posts
 */
export const GALLERY_CONSTRAINTS = {
  MIN_IMAGES: 1,
  MAX_IMAGES: 10,
} as const;

/**
 * Validates that an images array has valid bounds (1-10 images)
 * Property 1: Image array bounds validation
 * Validates: Requirements 2.2, 2.3
 *
 * @param images - Array of images to validate
 * @returns true if array length is between 1 and 10 inclusive
 */
export function validateImageArrayBounds(images: unknown[]): boolean {
  return (
    Array.isArray(images) &&
    images.length >= GALLERY_CONSTRAINTS.MIN_IMAGES &&
    images.length <= GALLERY_CONSTRAINTS.MAX_IMAGES
  );
}

/**
 * Validates that a string is a properly formatted URL (http:// or https://)
 * Property 3: URL format validation
 * Validates: Requirements 3.2
 *
 * @param url - String to validate as URL
 * @returns true if string is a valid http/https URL
 */
export function validatePortfolioUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Checks if a category value is valid
 *
 * @param category - Category value to validate
 * @returns true if category is a valid GalleryCategory
 */
export function isValidCategory(category: string): category is GalleryCategory {
  return category === 'littleLifeAtArt' || category === 'theHomeCafe';
}

/**
 * Checks if a filter value is valid
 *
 * @param filter - Filter value to validate
 * @returns true if filter is a valid CategoryFilter
 */
export function isValidCategoryFilter(filter: string): filter is CategoryFilter {
  return filter === 'all' || isValidCategory(filter);
}

/**
 * Filters gallery posts by category
 * Property 4: Category filtering correctness
 * Validates: Requirements 4.2, 4.3
 *
 * @param posts - Array of gallery posts to filter
 * @param filter - Category filter to apply ('all' returns all posts)
 * @returns Filtered array of posts matching the category, or all posts if filter is 'all'
 */
export function filterPostsByCategory(
  posts: GalleryPost[],
  filter: CategoryFilter
): GalleryPost[] {
  if (filter === 'all') {
    return posts;
  }
  return posts.filter((post) => post.category === filter);
}

/**
 * Gallery pagination state
 */
export interface GalleryPaginationState {
  currentPage: number;
  currentFilter: CategoryFilter;
}

/**
 * Handles category filter change and resets pagination when filter changes
 * Property 5: Pagination reset on filter change
 * Validates: Requirements 4.4
 *
 * @param currentState - Current pagination state
 * @param newFilter - New category filter being applied
 * @returns New pagination state with page reset to 0 if filter changed
 */
export function handleFilterChange(
  currentState: GalleryPaginationState,
  newFilter: CategoryFilter
): GalleryPaginationState {
  if (newFilter !== currentState.currentFilter) {
    return {
      currentPage: 0,
      currentFilter: newFilter,
    };
  }
  return currentState;
}

/**
 * Image with identifier for order preservation testing
 */
export interface ImageWithId {
  _key?: string;
  _type?: string;
  asset?: { _ref: string };
  [key: string]: unknown;
}

/**
 * Extracts image identifiers from an array to verify order preservation
 * Property 2: Image order preservation
 * Validates: Requirements 2.4
 *
 * @param images - Array of images with identifiers
 * @returns Array of identifiers in the same order as input
 */
export function extractImageOrder(images: ImageWithId[]): string[] {
  if (!Array.isArray(images)) {
    return [];
  }
  return images.map((img, index) => {
    // Use _key if available, otherwise use asset._ref, otherwise use index
    return img._key || img.asset?._ref || `index-${index}`;
  });
}

/**
 * Verifies that two image arrays have the same order
 * Property 2: Image order preservation
 * Validates: Requirements 2.4
 *
 * @param source - Source array of images
 * @param displayed - Displayed array of images
 * @returns true if the order is preserved
 */
export function verifyImageOrderPreserved(
  source: ImageWithId[],
  displayed: ImageWithId[]
): boolean {
  const sourceOrder = extractImageOrder(source);
  const displayedOrder = extractImageOrder(displayed);

  if (sourceOrder.length !== displayedOrder.length) {
    return false;
  }

  return sourceOrder.every((id, index) => id === displayedOrder[index]);
}

/**
 * Determines if a portfolio link should be rendered
 * Property 8: Portfolio link conditional rendering
 * Validates: Requirements 6.1, 6.3
 *
 * @param portfolioLink - The portfolio link value from a gallery post
 * @returns true if the link should be rendered (defined and non-empty)
 */
export function shouldRenderPortfolioLink(portfolioLink: string | undefined | null): boolean {
  if (portfolioLink === undefined || portfolioLink === null) {
    return false;
  }
  return portfolioLink.trim() !== '';
}
