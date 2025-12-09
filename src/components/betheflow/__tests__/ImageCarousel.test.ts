import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getIndicatorCount,
  navigateNext,
  navigatePrevious,
  canNavigateNext,
  canNavigatePrevious,
  CarouselNavigationState,
} from '@/lib/carouselUtils';

/**
 * **Feature: gallery-categories, Property 6: Carousel indicator count accuracy**
 * **Validates: Requirements 5.1**
 *
 * For any gallery post displayed as a Photo_Card, the number of carousel indicators
 * shown must equal the length of the images array.
 */
describe('Property 6: Carousel indicator count accuracy', () => {
  it('indicator count equals images array length for valid arrays (1-10 images)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (length) => {
          const images = Array.from({ length }, (_, i) => ({ id: i, _type: 'image' }));
          expect(getIndicatorCount(images)).toBe(length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('indicator count equals array length for any non-negative length', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 100 }),
        (length) => {
          const images = Array.from({ length }, (_, i) => ({ id: i }));
          expect(getIndicatorCount(images)).toBe(length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns 0 for empty arrays', () => {
    expect(getIndicatorCount([])).toBe(0);
  });

  it('returns 0 for non-array inputs', () => {
    expect(getIndicatorCount(null as unknown as unknown[])).toBe(0);
    expect(getIndicatorCount(undefined as unknown as unknown[])).toBe(0);
    expect(getIndicatorCount('string' as unknown as unknown[])).toBe(0);
    expect(getIndicatorCount(123 as unknown as unknown[])).toBe(0);
  });
});

/**
 * **Feature: gallery-categories, Property 7: Carousel navigation bounds**
 * **Validates: Requirements 5.3, 5.4, 5.5, 5.6**
 *
 * For any carousel with N images, navigating next from index i (where i < N-1)
 * should result in index i+1, and navigating previous from index i (where i > 0)
 * should result in index i-1. Navigation should not exceed array bounds.
 */
describe('Property 7: Carousel navigation bounds', () => {
  // Arbitrary for generating valid carousel navigation state
  const carouselStateArb = fc
    .integer({ min: 1, max: 10 })
    .chain((totalImages) =>
      fc.integer({ min: 0, max: totalImages - 1 }).map((currentIndex) => ({
        currentIndex,
        totalImages,
      }))
    ) as fc.Arbitrary<CarouselNavigationState>;

  describe('navigateNext', () => {
    it('increments index by 1 when not at last image', () => {
      fc.assert(
        fc.property(carouselStateArb, (state) => {
          // Only test when not at the last image
          fc.pre(state.currentIndex < state.totalImages - 1);

          const result = navigateNext(state);
          expect(result).toBe(state.currentIndex + 1);
        }),
        { numRuns: 100 }
      );
    });

    it('stays at last index when already at last image', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (totalImages) => {
            const state: CarouselNavigationState = {
              currentIndex: totalImages - 1,
              totalImages,
            };
            const result = navigateNext(state);
            expect(result).toBe(totalImages - 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('never exceeds totalImages - 1', () => {
      fc.assert(
        fc.property(carouselStateArb, (state) => {
          const result = navigateNext(state);
          expect(result).toBeLessThan(state.totalImages);
          expect(result).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('navigatePrevious', () => {
    it('decrements index by 1 when not at first image', () => {
      fc.assert(
        fc.property(carouselStateArb, (state) => {
          // Only test when not at the first image
          fc.pre(state.currentIndex > 0);

          const result = navigatePrevious(state);
          expect(result).toBe(state.currentIndex - 1);
        }),
        { numRuns: 100 }
      );
    });

    it('stays at index 0 when already at first image', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (totalImages) => {
            const state: CarouselNavigationState = {
              currentIndex: 0,
              totalImages,
            };
            const result = navigatePrevious(state);
            expect(result).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('never goes below 0', () => {
      fc.assert(
        fc.property(carouselStateArb, (state) => {
          const result = navigatePrevious(state);
          expect(result).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('canNavigateNext', () => {
    it('returns true when not at last image', () => {
      fc.assert(
        fc.property(carouselStateArb, (state) => {
          fc.pre(state.currentIndex < state.totalImages - 1);
          expect(canNavigateNext(state)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('returns false when at last image', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (totalImages) => {
            const state: CarouselNavigationState = {
              currentIndex: totalImages - 1,
              totalImages,
            };
            expect(canNavigateNext(state)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns false for empty carousel', () => {
      const state: CarouselNavigationState = { currentIndex: 0, totalImages: 0 };
      expect(canNavigateNext(state)).toBe(false);
    });
  });

  describe('canNavigatePrevious', () => {
    it('returns true when not at first image', () => {
      fc.assert(
        fc.property(carouselStateArb, (state) => {
          fc.pre(state.currentIndex > 0);
          expect(canNavigatePrevious(state)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('returns false when at first image', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (totalImages) => {
            const state: CarouselNavigationState = {
              currentIndex: 0,
              totalImages,
            };
            expect(canNavigatePrevious(state)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Navigation round-trip properties', () => {
    it('navigating next then previous returns to original index (when possible)', () => {
      fc.assert(
        fc.property(carouselStateArb, (state) => {
          // Only test when we can navigate next
          fc.pre(state.currentIndex < state.totalImages - 1);

          const afterNext = navigateNext(state);
          const afterPrevious = navigatePrevious({
            currentIndex: afterNext,
            totalImages: state.totalImages,
          });

          expect(afterPrevious).toBe(state.currentIndex);
        }),
        { numRuns: 100 }
      );
    });

    it('navigating previous then next returns to original index (when possible)', () => {
      fc.assert(
        fc.property(carouselStateArb, (state) => {
          // Only test when we can navigate previous
          fc.pre(state.currentIndex > 0);

          const afterPrevious = navigatePrevious(state);
          const afterNext = navigateNext({
            currentIndex: afterPrevious,
            totalImages: state.totalImages,
          });

          expect(afterNext).toBe(state.currentIndex);
        }),
        { numRuns: 100 }
      );
    });
  });
});
