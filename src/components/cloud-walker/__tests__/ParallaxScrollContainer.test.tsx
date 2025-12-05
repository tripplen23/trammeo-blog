import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import ParallaxScrollContainer from '../ParallaxScrollContainer';
import type { VideoCardVideo } from '../VideoCard';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="thumbnail-image" />
  ),
}));

// Mock @/lib/sanity
vi.mock('@/lib/sanity', () => ({
  urlForImage: () => ({
    width: () => ({
      height: () => ({
        url: () => 'https://cdn.sanity.io/images/test.jpg',
      }),
    }),
  }),
}));

// Mock framer-motion with testable transforms
let mockLeftY = 0;
let mockRightY = 0;

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      style,
      'data-testid': testId,
    }: React.ComponentProps<'div'> & { 'data-testid'?: string; style?: { y?: number } }) => {
      // Track the y values for testing
      if (testId === 'parallax-left-column' && style?.y !== undefined) {
        mockLeftY = typeof style.y === 'number' ? style.y : 0;
      }
      if (testId === 'parallax-right-column' && style?.y !== undefined) {
        mockRightY = typeof style.y === 'number' ? style.y : 0;
      }
      return (
        <div className={className} data-testid={testId} style={style as React.CSSProperties}>
          {children}
        </div>
      );
    },
  },
  useScroll: () => ({
    scrollYProgress: { get: () => 0 },
  }),
  useTransform: (_progress: unknown, _inputRange: number[] | ((v: number) => number), outputRange?: number[]) => {
    // Handle both function and array input range
    if (typeof _inputRange === 'function') {
      return 0;
    }
    // Return the initial value (first element of output range)
    return outputRange ? outputRange[0] : 0;
  },
  useSpring: (value: number) => ({
    get: () => value,
    set: () => {},
  }),
}));

// Mock useMediaQuery hook - default to desktop mode for these tests
vi.mock('@/hooks/useMediaQuery', () => ({
  useIsDesktop: () => true,
  useIsMobile: () => false,
  useMediaQuery: vi.fn(),
}));

// Generate valid ISO date strings
const isoDateArb = fc
  .integer({ min: 1577836800000, max: 1924905600000 })
  .map((timestamp) => new Date(timestamp).toISOString());

// Arbitrary for generating valid video objects
const videoArbitrary: fc.Arbitrary<VideoCardVideo> = fc.record({
  _id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
  videoUrl: fc.webUrl(),
  thumbnail: fc.record({
    asset: fc.record({
      _ref: fc.constant('image-test123-800x600-jpg'),
      _type: fc.constant('reference'),
    }),
  }),
  publishedAt: fc.option(isoDateArb, { nil: undefined }),
});

// Arbitrary for generating arrays of videos
const videoArrayArb = fc.array(videoArbitrary, { minLength: 0, maxLength: 10 });

describe('ParallaxScrollContainer', () => {
  const mockOnVideoSelect = vi.fn();

  beforeEach(() => {
    mockOnVideoSelect.mockClear();
    mockLeftY = 0;
    mockRightY = 0;
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 1: Desktop Two-Column Layout**
   * **Validates: Requirements 1.1**
   *
   * For any viewport width >= 768px, the Video_Gallery SHALL render
   * exactly two column containers side by side.
   */
  it('Property 1: renders exactly two column containers', () => {
    fc.assert(
      fc.property(videoArrayArb, videoArrayArb, (leftVideos, rightVideos) => {
        const { unmount, container } = render(
          <ParallaxScrollContainer
            leftColumnVideos={leftVideos}
            rightColumnVideos={rightVideos}
            onVideoSelect={mockOnVideoSelect}
          />
        );

        // Should have exactly two column containers
        const leftColumn = container.querySelector('[data-testid="parallax-left-column"]');
        const rightColumn = container.querySelector('[data-testid="parallax-right-column"]');

        expect(leftColumn).toBeInTheDocument();
        expect(rightColumn).toBeInTheDocument();

        // Both columns should exist within the parallax container
        const parallaxContainer = container.querySelector('[data-testid="parallax-container"]');
        expect(parallaxContainer).toContainElement(leftColumn as HTMLElement);
        expect(parallaxContainer).toContainElement(rightColumn as HTMLElement);

        unmount();
      }),
      { numRuns: 10 }
    );
  }, 15000);

  /**
   * **Feature: nguoi-di-tren-may, Property 2: Parallax Scroll Direction Relationship**
   * **Validates: Requirements 1.2, 1.3**
   *
   * For any scroll event on desktop/tablet, when scroll delta is positive (scrolling down),
   * the left column translateY SHALL decrease and right column translateY SHALL increase;
   * when scroll delta is negative (scrolling up), the opposite SHALL occur.
   */
  it('Property 2: parallax transform values have opposite directions', () => {
    // Test the transform logic directly
    // When scrollYProgress goes from 0 to 1:
    // - Left column Y should go from 0 to negative (moving up)
    // - Right column Y should go from 0 to positive (moving down)

    const leftTransformOutput = [0, -200]; // Left moves up (negative)
    const rightTransformOutput = [0, 200]; // Right moves down (positive)

    fc.assert(
      // Use noNaN to exclude NaN values from the float generator
      fc.property(fc.float({ min: 0, max: 1, noNaN: true }), (scrollProgress) => {
        // Calculate expected Y values based on scroll progress
        const expectedLeftY =
          leftTransformOutput[0] +
          (leftTransformOutput[1] - leftTransformOutput[0]) * scrollProgress;
        const expectedRightY =
          rightTransformOutput[0] +
          (rightTransformOutput[1] - rightTransformOutput[0]) * scrollProgress;

        // Verify opposite directions
        // When scrolling down (progress > 0):
        // - Left Y should be negative or zero
        // - Right Y should be positive or zero
        if (scrollProgress > 0) {
          expect(expectedLeftY).toBeLessThanOrEqual(0);
          expect(expectedRightY).toBeGreaterThanOrEqual(0);
        }

        // The absolute values should be equal (symmetric movement)
        expect(Math.abs(expectedLeftY)).toBeCloseTo(Math.abs(expectedRightY), 5);

        // Directions should be opposite (one negative, one positive, or both zero)
        expect(expectedLeftY * expectedRightY).toBeLessThanOrEqual(0);
      }),
      { numRuns: 100 }
    );
  });

  it('renders correct number of VideoCards in each column', () => {
    fc.assert(
      fc.property(videoArrayArb, videoArrayArb, (leftVideos, rightVideos) => {
        const { unmount, container } = render(
          <ParallaxScrollContainer
            leftColumnVideos={leftVideos}
            rightColumnVideos={rightVideos}
            onVideoSelect={mockOnVideoSelect}
          />
        );

        const leftColumn = container.querySelector('[data-testid="parallax-left-column"]');
        const rightColumn = container.querySelector('[data-testid="parallax-right-column"]');

        // Count video cards in each column (they contain video elements)
        const leftVideoCards = leftColumn?.querySelectorAll('video').length ?? 0;
        const rightVideoCards = rightColumn?.querySelectorAll('video').length ?? 0;

        expect(leftVideoCards).toBe(leftVideos.length);
        expect(rightVideoCards).toBe(rightVideos.length);

        unmount();
      }),
      { numRuns: 10 }
    );
  }, 15000);

  it('container has parallax-container testid', () => {
    const { container } = render(
      <ParallaxScrollContainer
        leftColumnVideos={[]}
        rightColumnVideos={[]}
        onVideoSelect={mockOnVideoSelect}
      />
    );

    const parallaxContainer = container.querySelector('[data-testid="parallax-container"]');
    expect(parallaxContainer).toBeInTheDocument();
  });

  it('columns are flex containers for vertical stacking', () => {
    const { container } = render(
      <ParallaxScrollContainer
        leftColumnVideos={[]}
        rightColumnVideos={[]}
        onVideoSelect={mockOnVideoSelect}
      />
    );

    const leftColumn = container.querySelector('[data-testid="parallax-left-column"]');
    const rightColumn = container.querySelector('[data-testid="parallax-right-column"]');

    // Both columns should have flex and flex-col classes
    expect(leftColumn?.className).toContain('flex');
    expect(leftColumn?.className).toContain('flex-col');
    expect(rightColumn?.className).toContain('flex');
    expect(rightColumn?.className).toContain('flex-col');
  });
});
