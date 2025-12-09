import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateImageArrayBounds,
  validatePortfolioUrl,
  GALLERY_CONSTRAINTS,
  isValidCategory,
  isValidCategoryFilter,
  filterPostsByCategory,
  handleFilterChange,
  extractImageOrder,
  verifyImageOrderPreserved,
  shouldRenderPortfolioLink,
  GalleryPost,
  GalleryCategory,
  CategoryFilter,
  GalleryPaginationState,
  ImageWithId,
} from '../galleryTypes';

/**
 * **Feature: gallery-categories, Property 1: Image array bounds validation**
 * **Validates: Requirements 2.2, 2.3**
 *
 * For any gallery post, the images array length must be between 1 and 10 inclusive.
 * Arrays with 0 images or more than 10 images should be rejected by validation.
 */
describe('Gallery Types - Property Tests', () => {
  describe('Property 1: Image array bounds validation', () => {
    it('accepts arrays with 1-10 elements', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: GALLERY_CONSTRAINTS.MIN_IMAGES, max: GALLERY_CONSTRAINTS.MAX_IMAGES }),
          (length) => {
            const images = Array.from({ length }, (_, i) => ({ id: i }));
            expect(validateImageArrayBounds(images)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects empty arrays (0 images)', () => {
      expect(validateImageArrayBounds([])).toBe(false);
    });

    it('rejects arrays with more than 10 elements', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: GALLERY_CONSTRAINTS.MAX_IMAGES + 1, max: 100 }),
          (length) => {
            const images = Array.from({ length }, (_, i) => ({ id: i }));
            expect(validateImageArrayBounds(images)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: gallery-categories, Property 3: URL format validation**
   * **Validates: Requirements 3.2**
   *
   * For any string provided as a portfolio link, the system should accept only
   * properly formatted URLs (starting with http:// or https://) and reject malformed strings.
   */
  describe('Property 3: URL format validation', () => {
    it('accepts valid http URLs', () => {
      fc.assert(
        fc.property(
          fc.webUrl({ validSchemes: ['http'] }),
          (url) => {
            expect(validatePortfolioUrl(url)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('accepts valid https URLs', () => {
      fc.assert(
        fc.property(
          fc.webUrl({ validSchemes: ['https'] }),
          (url) => {
            expect(validatePortfolioUrl(url)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects non-http/https URLs', () => {
      const invalidSchemes = ['ftp://', 'file://', 'mailto:', 'javascript:', 'data:'];
      invalidSchemes.forEach((scheme) => {
        expect(validatePortfolioUrl(`${scheme}example.com`)).toBe(false);
      });
    });

    it('rejects malformed strings', () => {
      fc.assert(
        fc.property(
          fc.string().filter((s) => {
            // Filter out strings that could be valid URLs
            try {
              const url = new URL(s);
              return url.protocol !== 'http:' && url.protocol !== 'https:';
            } catch {
              return true; // Invalid URL strings pass the filter
            }
          }),
          (invalidUrl) => {
            expect(validatePortfolioUrl(invalidUrl)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects empty strings and null-like values', () => {
      expect(validatePortfolioUrl('')).toBe(false);
      expect(validatePortfolioUrl(null as unknown as string)).toBe(false);
      expect(validatePortfolioUrl(undefined as unknown as string)).toBe(false);
    });
  });

  describe('Category validation helpers', () => {
    it('isValidCategory accepts valid categories', () => {
      expect(isValidCategory('littleLifeAtArt')).toBe(true);
      expect(isValidCategory('theHomeCafe')).toBe(true);
    });

    it('isValidCategory rejects invalid categories', () => {
      fc.assert(
        fc.property(
          fc.string().filter((s) => s !== 'littleLifeAtArt' && s !== 'theHomeCafe'),
          (invalidCategory) => {
            expect(isValidCategory(invalidCategory)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('isValidCategoryFilter accepts all valid filters', () => {
      expect(isValidCategoryFilter('all')).toBe(true);
      expect(isValidCategoryFilter('littleLifeAtArt')).toBe(true);
      expect(isValidCategoryFilter('theHomeCafe')).toBe(true);
    });

    it('isValidCategoryFilter rejects invalid filters', () => {
      fc.assert(
        fc.property(
          fc.string().filter((s) => s !== 'all' && s !== 'littleLifeAtArt' && s !== 'theHomeCafe'),
          (invalidFilter) => {
            expect(isValidCategoryFilter(invalidFilter)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


/**
 * **Feature: gallery-categories, Property 4: Category filtering correctness**
 * **Validates: Requirements 4.2, 4.3**
 *
 * For any set of gallery posts and any selected category filter, the filtered results
 * should contain only posts matching that category when a specific category is selected,
 * or all posts when "all" is selected.
 */
describe('Property 4: Category filtering correctness', () => {
  // Arbitrary for generating valid GalleryCategory
  const categoryArb = fc.constantFrom<GalleryCategory>('littleLifeAtArt', 'theHomeCafe');

  // Arbitrary for generating valid CategoryFilter (includes 'all')
  const categoryFilterArb = fc.constantFrom<CategoryFilter>('all', 'littleLifeAtArt', 'theHomeCafe');

  // Arbitrary for generating a valid GalleryPost
  // Generate date strings directly to avoid Invalid Date issues with toISOString()
  const dateStringArb = fc.tuple(
    fc.integer({ min: 2000, max: 2030 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 }) // Use 28 to avoid month-end edge cases
  ).map(([year, month, day]) => 
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  );
  const galleryPostArb = fc.record({
    _id: fc.uuid(),
    images: fc.array(fc.record({ _type: fc.constant('image'), asset: fc.record({ _ref: fc.uuid() }) }), { minLength: 1, maxLength: 10 }),
    category: categoryArb,
    portfolioLink: fc.option(fc.webUrl(), { nil: undefined }),
    caption: fc.string({ minLength: 1 }),
    location: fc.option(fc.string(), { nil: undefined }),
    date: fc.option(dateStringArb, { nil: undefined }),
  }) as fc.Arbitrary<GalleryPost>;

  it('returns all posts when filter is "all"', () => {
    fc.assert(
      fc.property(
        fc.array(galleryPostArb, { minLength: 0, maxLength: 20 }),
        (posts) => {
          const result = filterPostsByCategory(posts, 'all');
          expect(result).toEqual(posts);
          expect(result.length).toBe(posts.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns only posts matching the selected category', () => {
    fc.assert(
      fc.property(
        fc.array(galleryPostArb, { minLength: 0, maxLength: 20 }),
        categoryArb,
        (posts, selectedCategory) => {
          const result = filterPostsByCategory(posts, selectedCategory);
          
          // All returned posts must have the selected category
          result.forEach((post) => {
            expect(post.category).toBe(selectedCategory);
          });
          
          // Count of returned posts should match count of posts with that category
          const expectedCount = posts.filter(p => p.category === selectedCategory).length;
          expect(result.length).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('preserves post identity - filtered posts are subset of original', () => {
    fc.assert(
      fc.property(
        fc.array(galleryPostArb, { minLength: 0, maxLength: 20 }),
        categoryFilterArb,
        (posts, filter) => {
          const result = filterPostsByCategory(posts, filter);
          
          // Every post in result must exist in original posts
          result.forEach((resultPost) => {
            const found = posts.some(p => p._id === resultPost._id);
            expect(found).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * **Feature: gallery-categories, Property 5: Pagination reset on filter change**
 * **Validates: Requirements 4.4**
 *
 * For any gallery state with a non-zero current page, changing the category filter
 * should reset the current page to 0.
 */
describe('Property 5: Pagination reset on filter change', () => {
  // Arbitrary for generating valid CategoryFilter
  const categoryFilterArb = fc.constantFrom<CategoryFilter>('all', 'littleLifeAtArt', 'theHomeCafe');

  // Arbitrary for generating a valid pagination state
  const paginationStateArb = fc.record({
    currentPage: fc.nat({ max: 100 }),
    currentFilter: categoryFilterArb,
  }) as fc.Arbitrary<GalleryPaginationState>;

  it('resets page to 0 when filter changes', () => {
    fc.assert(
      fc.property(
        paginationStateArb,
        categoryFilterArb,
        (currentState, newFilter) => {
          // Only test when filter actually changes
          fc.pre(newFilter !== currentState.currentFilter);

          const result = handleFilterChange(currentState, newFilter);

          // Page should be reset to 0
          expect(result.currentPage).toBe(0);
          // Filter should be updated to new filter
          expect(result.currentFilter).toBe(newFilter);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('preserves state when filter does not change', () => {
    fc.assert(
      fc.property(
        paginationStateArb,
        (currentState) => {
          const result = handleFilterChange(currentState, currentState.currentFilter);

          // State should remain unchanged
          expect(result.currentPage).toBe(currentState.currentPage);
          expect(result.currentFilter).toBe(currentState.currentFilter);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('always resets to page 0 regardless of current page value when filter changes', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 1000 }), // Any non-negative page number
        categoryFilterArb,
        categoryFilterArb,
        (currentPage, currentFilter, newFilter) => {
          // Only test when filter actually changes
          fc.pre(newFilter !== currentFilter);

          const currentState: GalleryPaginationState = { currentPage, currentFilter };
          const result = handleFilterChange(currentState, newFilter);

          // Page should always be 0 after filter change
          expect(result.currentPage).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * **Feature: gallery-categories, Property 2: Image order preservation**
 * **Validates: Requirements 2.4**
 *
 * For any gallery post with multiple images, the order of images displayed
 * in the carousel must match the order of images in the source array.
 */
describe('Property 2: Image order preservation', () => {
  // Arbitrary for generating an image with unique identifier
  const imageWithIdArb = fc.record({
    _key: fc.uuid(),
    _type: fc.constant('image'),
    asset: fc.record({ _ref: fc.uuid() }),
  }) as fc.Arbitrary<ImageWithId>;

  // Arbitrary for generating an array of images (1-10 as per constraints)
  const imagesArrayArb = fc.array(imageWithIdArb, { minLength: 1, maxLength: 10 });

  describe('extractImageOrder', () => {
    it('extracts identifiers in the same order as input array', () => {
      fc.assert(
        fc.property(imagesArrayArb, (images) => {
          const order = extractImageOrder(images);

          // Length should match
          expect(order.length).toBe(images.length);

          // Each identifier should correspond to the image at that index
          images.forEach((img, idx) => {
            const expectedId = img._key || img.asset?._ref || `index-${idx}`;
            expect(order[idx]).toBe(expectedId);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('returns empty array for non-array inputs', () => {
      expect(extractImageOrder(null as unknown as ImageWithId[])).toEqual([]);
      expect(extractImageOrder(undefined as unknown as ImageWithId[])).toEqual([]);
    });

    it('returns empty array for empty input', () => {
      expect(extractImageOrder([])).toEqual([]);
    });

    it('uses index-based fallback when no _key or asset._ref', () => {
      const imagesWithoutKeys = [
        { _type: 'image' },
        { _type: 'image' },
        { _type: 'image' },
      ] as ImageWithId[];

      const order = extractImageOrder(imagesWithoutKeys);
      expect(order).toEqual(['index-0', 'index-1', 'index-2']);
    });
  });

  describe('verifyImageOrderPreserved', () => {
    it('returns true when source and displayed have same order', () => {
      fc.assert(
        fc.property(imagesArrayArb, (images) => {
          // Same array should have preserved order
          expect(verifyImageOrderPreserved(images, images)).toBe(true);

          // Copy of array should have preserved order
          const copy = [...images];
          expect(verifyImageOrderPreserved(images, copy)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('returns false when arrays have different lengths', () => {
      fc.assert(
        fc.property(
          imagesArrayArb,
          fc.integer({ min: 1, max: 5 }),
          (images, removeCount) => {
            // Only test when we can actually remove items
            fc.pre(images.length > removeCount);

            const shorter = images.slice(0, images.length - removeCount);
            expect(verifyImageOrderPreserved(images, shorter)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns false when order is reversed', () => {
      fc.assert(
        fc.property(
          fc.array(imageWithIdArb, { minLength: 2, maxLength: 10 }),
          (images) => {
            const reversed = [...images].reverse();
            // Only check if reversing actually changes the order
            // (arrays with all same elements would still match)
            const sourceOrder = extractImageOrder(images);
            const reversedOrder = extractImageOrder(reversed);
            const orderChanged = sourceOrder.some((id, idx) => id !== reversedOrder[idx]);

            if (orderChanged) {
              expect(verifyImageOrderPreserved(images, reversed)).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns false when order is shuffled', () => {
      fc.assert(
        fc.property(
          fc.array(imageWithIdArb, { minLength: 3, maxLength: 10 }),
          fc.integer({ min: 0, max: 100 }),
          (images, seed) => {
            // Create a shuffled copy using Fisher-Yates with deterministic seed
            const shuffled = [...images];
            let currentSeed = seed;
            for (let i = shuffled.length - 1; i > 0; i--) {
              currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
              const j = currentSeed % (i + 1);
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            // Check if shuffle actually changed the order
            const sourceOrder = extractImageOrder(images);
            const shuffledOrder = extractImageOrder(shuffled);
            const orderChanged = sourceOrder.some((id, idx) => id !== shuffledOrder[idx]);

            if (orderChanged) {
              expect(verifyImageOrderPreserved(images, shuffled)).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Order preservation in carousel display simulation', () => {
    it('simulated carousel display preserves image order', () => {
      fc.assert(
        fc.property(imagesArrayArb, (sourceImages) => {
          // Simulate what the carousel does: iterate through images by index
          const displayedImages: ImageWithId[] = [];
          for (let i = 0; i < sourceImages.length; i++) {
            displayedImages.push(sourceImages[i]);
          }

          // Order should be preserved
          expect(verifyImageOrderPreserved(sourceImages, displayedImages)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('carousel navigation sequence preserves access order', () => {
      fc.assert(
        fc.property(
          fc.array(imageWithIdArb, { minLength: 2, maxLength: 10 }),
          (images) => {
            // Simulate navigating through carousel from start to end
            const accessedImages: ImageWithId[] = [];
            let currentIndex = 0;

            // Navigate forward through all images
            while (currentIndex < images.length) {
              accessedImages.push(images[currentIndex]);
              currentIndex++;
            }

            // The accessed order should match the source order
            expect(verifyImageOrderPreserved(images, accessedImages)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


/**
 * **Feature: gallery-categories, Property 8: Portfolio link conditional rendering**
 * **Validates: Requirements 6.1, 6.3**
 *
 * For any gallery post, the portfolio link element should be rendered if and only if
 * the portfolioLink field is defined and non-empty.
 */
describe('Property 8: Portfolio link conditional rendering', () => {
  describe('shouldRenderPortfolioLink', () => {
    it('returns true for valid non-empty URLs', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          (url) => {
            expect(shouldRenderPortfolioLink(url)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns true for any non-empty, non-whitespace string', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          (str) => {
            expect(shouldRenderPortfolioLink(str)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns false for undefined', () => {
      expect(shouldRenderPortfolioLink(undefined)).toBe(false);
    });

    it('returns false for null', () => {
      expect(shouldRenderPortfolioLink(null)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(shouldRenderPortfolioLink('')).toBe(false);
    });

    it('returns false for whitespace-only strings', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 10 }).map((arr) => arr.join('')),
          (whitespace) => {
            expect(shouldRenderPortfolioLink(whitespace)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Portfolio link rendering in gallery posts', () => {
    // Arbitrary for generating valid GalleryCategory
    const categoryArb = fc.constantFrom<GalleryCategory>('littleLifeAtArt', 'theHomeCafe');

    // Arbitrary for generating a valid GalleryPost with portfolio link
    const galleryPostWithLinkArb = fc.record({
      _id: fc.uuid(),
      images: fc.array(
        fc.record({ _type: fc.constant('image'), asset: fc.record({ _ref: fc.uuid() }) }),
        { minLength: 1, maxLength: 10 }
      ),
      category: categoryArb,
      portfolioLink: fc.webUrl(),
      caption: fc.string({ minLength: 1 }),
      location: fc.option(fc.string(), { nil: undefined }),
      date: fc.option(fc.string(), { nil: undefined }),
    }) as fc.Arbitrary<GalleryPost>;

    // Arbitrary for generating a valid GalleryPost without portfolio link
    const galleryPostWithoutLinkArb = fc.record({
      _id: fc.uuid(),
      images: fc.array(
        fc.record({ _type: fc.constant('image'), asset: fc.record({ _ref: fc.uuid() }) }),
        { minLength: 1, maxLength: 10 }
      ),
      category: categoryArb,
      portfolioLink: fc.constant(undefined),
      caption: fc.string({ minLength: 1 }),
      location: fc.option(fc.string(), { nil: undefined }),
      date: fc.option(fc.string(), { nil: undefined }),
    }) as fc.Arbitrary<GalleryPost>;

    it('posts with valid portfolio links should render the link', () => {
      fc.assert(
        fc.property(galleryPostWithLinkArb, (post) => {
          expect(shouldRenderPortfolioLink(post.portfolioLink)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('posts without portfolio links should not render the link', () => {
      fc.assert(
        fc.property(galleryPostWithoutLinkArb, (post) => {
          expect(shouldRenderPortfolioLink(post.portfolioLink)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('rendering decision is consistent for the same post', () => {
      fc.assert(
        fc.property(
          fc.oneof(galleryPostWithLinkArb, galleryPostWithoutLinkArb),
          (post) => {
            const firstCheck = shouldRenderPortfolioLink(post.portfolioLink);
            const secondCheck = shouldRenderPortfolioLink(post.portfolioLink);
            expect(firstCheck).toBe(secondCheck);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge cases for portfolio link values', () => {
    it('handles strings with leading/trailing whitespace correctly', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          fc.array(fc.constantFrom(' ', '\t'), { minLength: 0, maxLength: 5 }).map((arr) => arr.join('')),
          fc.array(fc.constantFrom(' ', '\t'), { minLength: 0, maxLength: 5 }).map((arr) => arr.join('')),
          (url, leadingWhitespace, trailingWhitespace) => {
            const paddedUrl = leadingWhitespace + url + trailingWhitespace;
            // Should still render because the trimmed string is non-empty
            expect(shouldRenderPortfolioLink(paddedUrl)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('correctly distinguishes between empty and non-empty after trim', () => {
      // Empty after trim
      expect(shouldRenderPortfolioLink('   ')).toBe(false);
      expect(shouldRenderPortfolioLink('\t\n')).toBe(false);

      // Non-empty after trim
      expect(shouldRenderPortfolioLink(' a ')).toBe(true);
      expect(shouldRenderPortfolioLink('https://example.com')).toBe(true);
    });
  });
});
