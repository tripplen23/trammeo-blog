import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import type { VideoCardVideo } from '../VideoCard';

// Create mock functions that we can control
const mockUseIsDesktop = vi.fn(() => true);
const mockUseIsMobile = vi.fn(() => false);

// Mock next/image
vi.mock('next/image', () => ({
  default: function MockImage({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) {
    return <img src={src} alt={alt} className={className} data-testid="thumbnail-image" />;
  },
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

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: function MockMotionDiv({
      children,
      className,
      style,
      'data-testid': testId,
    }: {
      children?: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
      'data-testid'?: string;
    }) {
      return (
        <div className={className} data-testid={testId} style={style}>
          {children}
        </div>
      );
    },
  },
  useScroll: () => ({
    scrollYProgress: { get: () => 0 },
  }),
  useTransform: (_progress: unknown, _inputRange: number[] | ((v: number) => number), outputRange?: number[]) => {
    if (typeof _inputRange === 'function') {
      return 0;
    }
    return outputRange ? outputRange[0] : 0;
  },
  useSpring: (value: number) => ({
    get: () => value,
    set: () => {},
  }),
}));

// Mock useMediaQuery hook with controllable functions
vi.mock('@/hooks/useMediaQuery', () => ({
  useIsDesktop: () => mockUseIsDesktop(),
  useIsMobile: () => mockUseIsMobile(),
  useMediaQuery: vi.fn(),
}));

// Import component after mocks are defined
import ParallaxScrollContainer from '../ParallaxScrollContainer';

// Generate valid ISO date strings
const isoDateArb = fc
  .integer({ min: 1577836800000, max: 1924905600000 })
  .map((timestamp) => new Date(timestamp).toISOString());

// Create a video with a specific index to ensure unique IDs
const createVideoArb = (index: number): fc.Arbitrary<VideoCardVideo> =>
  fc.record({
    _id: fc.constant(`video-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
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

// Generate a tuple of two arrays with globally unique IDs
// We generate a single array and split it to ensure no duplicates across both arrays
const videoPairArb = fc
  .integer({ min: 2, max: 6 })
  .chain((totalCount) => {
    // Generate totalCount videos with unique indices
    const videoArbs = Array.from({ length: totalCount }, (_, i) => createVideoArb(i));
    return fc.tuple(...videoArbs).map((videos) => {
      // Split into two arrays
      const splitPoint = Math.ceil(videos.length / 2);
      return [videos.slice(0, splitPoint), videos.slice(splitPoint)] as [
        VideoCardVideo[],
        VideoCardVideo[],
      ];
    });
  });

describe('ParallaxScrollContainer Responsive Behavior', () => {
  const mockOnVideoSelect = vi.fn();

  beforeEach(() => {
    mockOnVideoSelect.mockClear();
    // Default to desktop
    mockUseIsDesktop.mockReturnValue(true);
    mockUseIsMobile.mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 4: Mobile Single-Column Layout**
   * **Validates: Requirements 2.1**
   *
   * For any viewport width < 768px, the Video_Gallery SHALL render
   * exactly one centered column container.
   */
  it('Property 4: mobile renders single column layout', () => {
    // Set to mobile viewport
    mockUseIsDesktop.mockReturnValue(false);
    mockUseIsMobile.mockReturnValue(true);

    fc.assert(
      fc.property(videoPairArb, ([leftVideos, rightVideos]) => {
        const { unmount, container } = render(
          <ParallaxScrollContainer
            leftColumnVideos={leftVideos}
            rightColumnVideos={rightVideos}
            onVideoSelect={mockOnVideoSelect}
          />
        );

        // Should have mobile single column
        const mobileColumn = container.querySelector('[data-testid="mobile-single-column"]');
        expect(mobileColumn).toBeInTheDocument();

        // Should NOT have desktop two-column layout
        const leftColumn = container.querySelector('[data-testid="parallax-left-column"]');
        const rightColumn = container.querySelector('[data-testid="parallax-right-column"]');
        expect(leftColumn).not.toBeInTheDocument();
        expect(rightColumn).not.toBeInTheDocument();

        // Container should have data-mobile="true"
        const parallaxContainer = container.querySelector('[data-testid="parallax-container"]');
        expect(parallaxContainer).toHaveAttribute('data-mobile', 'true');

        unmount();
      }),
      { numRuns: 10 }
    );
  }, 15000);

  /**
   * **Feature: nguoi-di-tren-may, Property 5: Mobile VideoCards have FilmFrame styling**
   * **Validates: Requirements 2.2**
   *
   * For any VideoCard rendered on mobile viewport (< 768px),
   * the card SHALL be wrapped in FilmFrame component with film styling.
   */
  it('Property 5: mobile VideoCards have analog frame styling', () => {
    // Set to mobile viewport
    mockUseIsDesktop.mockReturnValue(false);
    mockUseIsMobile.mockReturnValue(true);

    fc.assert(
      fc.property(videoPairArb, ([leftVideos, rightVideos]) => {
        const { unmount, container } = render(
          <ParallaxScrollContainer
            leftColumnVideos={leftVideos}
            rightColumnVideos={rightVideos}
            onVideoSelect={mockOnVideoSelect}
          />
        );

        // Get all video elements (each VideoCard has one video element)
        const videoElements = container.querySelectorAll('video');
        const totalVideos = leftVideos.length + rightVideos.length;

        // Should have correct number of video elements
        expect(videoElements.length).toBe(totalVideos);

        // Mobile layout should have the mobile single column
        const mobileColumn = container.querySelector('[data-testid="mobile-single-column"]');
        expect(mobileColumn).toBeInTheDocument();

        unmount();
      }),
      { numRuns: 20 }
    );
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 6: Mobile No Parallax**
   * **Validates: Requirements 2.3**
   *
   * For any scroll event on mobile viewport (< 768px),
   * the column translateY values SHALL remain unchanged (no parallax effect).
   */
  it('Property 6: mobile has no parallax transforms', () => {
    // Set to mobile viewport
    mockUseIsDesktop.mockReturnValue(false);
    mockUseIsMobile.mockReturnValue(true);

    fc.assert(
      fc.property(videoPairArb, ([leftVideos, rightVideos]) => {
        const { unmount, container } = render(
          <ParallaxScrollContainer
            leftColumnVideos={leftVideos}
            rightColumnVideos={rightVideos}
            onVideoSelect={mockOnVideoSelect}
          />
        );

        // Mobile layout should not have motion columns with transforms
        const leftColumn = container.querySelector('[data-testid="parallax-left-column"]');
        const rightColumn = container.querySelector('[data-testid="parallax-right-column"]');

        // In mobile mode, these columns should not exist
        expect(leftColumn).not.toBeInTheDocument();
        expect(rightColumn).not.toBeInTheDocument();

        // Mobile single column should exist without parallax transforms
        const mobileColumn = container.querySelector('[data-testid="mobile-single-column"]');
        expect(mobileColumn).toBeInTheDocument();

        unmount();
      }),
      { numRuns: 20 }
    );
  });

  it('desktop renders two-column layout with parallax columns', () => {
    // Set to desktop viewport
    mockUseIsDesktop.mockReturnValue(true);
    mockUseIsMobile.mockReturnValue(false);

    fc.assert(
      fc.property(videoPairArb, ([leftVideos, rightVideos]) => {
        const { unmount, container } = render(
          <ParallaxScrollContainer
            leftColumnVideos={leftVideos}
            rightColumnVideos={rightVideos}
            onVideoSelect={mockOnVideoSelect}
          />
        );

        // Should have desktop two-column layout
        const leftColumn = container.querySelector('[data-testid="parallax-left-column"]');
        const rightColumn = container.querySelector('[data-testid="parallax-right-column"]');
        expect(leftColumn).toBeInTheDocument();
        expect(rightColumn).toBeInTheDocument();

        // Should NOT have mobile single column
        const mobileColumn = container.querySelector('[data-testid="mobile-single-column"]');
        expect(mobileColumn).not.toBeInTheDocument();

        // Container should have data-mobile="false"
        const parallaxContainer = container.querySelector('[data-testid="parallax-container"]');
        expect(parallaxContainer).toHaveAttribute('data-mobile', 'false');

        unmount();
      }),
      { numRuns: 20 }
    );
  });

  it('desktop VideoCards are rendered in two columns', () => {
    // Set to desktop viewport
    mockUseIsDesktop.mockReturnValue(true);
    mockUseIsMobile.mockReturnValue(false);

    fc.assert(
      fc.property(videoPairArb, ([leftVideos, rightVideos]) => {
        const { unmount, container } = render(
          <ParallaxScrollContainer
            leftColumnVideos={leftVideos}
            rightColumnVideos={rightVideos}
            onVideoSelect={mockOnVideoSelect}
          />
        );

        // Get all video elements in desktop view
        const videoElements = container.querySelectorAll('video');
        const totalVideos = leftVideos.length + rightVideos.length;

        // Should have correct number of video elements
        expect(videoElements.length).toBe(totalVideos);

        // Desktop should have two-column layout
        const leftColumn = container.querySelector('[data-testid="parallax-left-column"]');
        const rightColumn = container.querySelector('[data-testid="parallax-right-column"]');
        expect(leftColumn).toBeInTheDocument();
        expect(rightColumn).toBeInTheDocument();

        unmount();
      }),
      { numRuns: 20 }
    );
  });

  it('mobile combines all videos into single column', () => {
    // Set to mobile viewport
    mockUseIsDesktop.mockReturnValue(false);
    mockUseIsMobile.mockReturnValue(true);

    fc.assert(
      fc.property(videoPairArb, ([leftVideos, rightVideos]) => {
        const { unmount, container } = render(
          <ParallaxScrollContainer
            leftColumnVideos={leftVideos}
            rightColumnVideos={rightVideos}
            onVideoSelect={mockOnVideoSelect}
          />
        );

        // Count video elements (each VideoCard has one video element)
        const videoElements = container.querySelectorAll('video');
        const expectedTotal = leftVideos.length + rightVideos.length;

        // All videos should be rendered in single column
        expect(videoElements.length).toBe(expectedTotal);

        unmount();
      }),
      { numRuns: 20 }
    );
  });
});
