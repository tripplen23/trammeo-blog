import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import VideoCard, { VideoCardVideo } from '../VideoCard';

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

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onMouseEnter, onMouseLeave, onClick, className }: React.ComponentProps<'div'>) => (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        className={className}
        data-testid="video-card"
      >
        {children}
      </div>
    ),
  },
}));

// Generate valid ISO date strings
const isoDateArb = fc
  .integer({ min: 1577836800000, max: 1924905600000 }) // 2020-01-01 to 2030-12-31
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

describe('VideoCard Hover Behavior', () => {
  let mockOnSelect: (video: VideoCardVideo) => void;
  let mockPlay: ReturnType<typeof vi.fn>;
  let mockPause: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSelect = vi.fn() as (video: VideoCardVideo) => void;
    mockPlay = vi.fn().mockResolvedValue(undefined);
    mockPause = vi.fn();

    // Mock HTMLVideoElement methods
    Object.defineProperty(HTMLVideoElement.prototype, 'play', {
      configurable: true,
      value: mockPlay,
    });
    Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
      configurable: true,
      value: mockPause,
    });
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 7: Hover Starts Muted Playback**
   * **Validates: Requirements 3.1**
   *
   * For any VideoCard, when a mouseenter event occurs, the video element
   * SHALL have muted=true and play() SHALL be called.
   */
  it('Property 7: hover starts muted video playback', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const { unmount, container } = render(<VideoCard video={video} onSelect={mockOnSelect} />);

        const card = container.querySelector('[data-testid="video-card"]')!;
        const videoElement = container.querySelector('video') as HTMLVideoElement;

        // Verify video has muted property (React renders muted as a property, not attribute)
        expect(videoElement.muted).toBe(true);

        // Trigger mouseenter
        fireEvent.mouseEnter(card);

        // Verify play was called
        expect(mockPlay).toHaveBeenCalled();

        // Reset mocks for next iteration
        mockPlay.mockClear();
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 8: Hover End Pauses Video**
   * **Validates: Requirements 3.2**
   *
   * For any VideoCard, when a mouseleave event occurs, the video element
   * SHALL have pause() called and thumbnail SHALL be visible.
   */
  it('Property 8: hover end pauses video and shows thumbnail', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const { unmount, container } = render(<VideoCard video={video} onSelect={mockOnSelect} />);

        const card = container.querySelector('[data-testid="video-card"]')!;

        // First hover to start playing
        fireEvent.mouseEnter(card);

        // Then leave to pause
        fireEvent.mouseLeave(card);

        // Verify pause was called
        expect(mockPause).toHaveBeenCalled();

        // Verify thumbnail is visible
        const thumbnail = container.querySelector('[data-testid="thumbnail-image"]');
        expect(thumbnail).toBeInTheDocument();

        // Reset mocks for next iteration
        mockPlay.mockClear();
        mockPause.mockClear();
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 9: Video Loops on Hover**
   * **Validates: Requirements 3.3**
   *
   * For any video element playing on hover, the loop attribute SHALL be true.
   */
  it('Property 9: video has loop attribute', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const { unmount, container } = render(<VideoCard video={video} onSelect={mockOnSelect} />);

        const videoElement = container.querySelector('video');

        // Verify video has loop attribute
        expect(videoElement).toHaveAttribute('loop');

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 10: Video Error Fallback**
   * **Validates: Requirements 3.4**
   *
   * For any video that fails to load or play, the VideoCard SHALL display
   * the thumbnail image without throwing an error.
   */
  it('Property 10: video error shows thumbnail fallback', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        // Mock play to reject (simulate error)
        mockPlay.mockRejectedValueOnce(new Error('Video load failed'));

        const { unmount, container } = render(<VideoCard video={video} onSelect={mockOnSelect} />);

        const card = container.querySelector('[data-testid="video-card"]')!;

        // Trigger mouseenter which will cause play error
        fireEvent.mouseEnter(card);

        // Thumbnail should still be visible
        const thumbnail = container.querySelector('[data-testid="thumbnail-image"]');
        expect(thumbnail).toBeInTheDocument();

        // No error should be thrown - component should handle gracefully
        expect(() => {
          fireEvent.mouseLeave(card);
        }).not.toThrow();

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('video element has correct attributes for hover preview', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const { unmount, container } = render(<VideoCard video={video} onSelect={mockOnSelect} />);

        const videoElement = container.querySelector('video') as HTMLVideoElement;

        // Verify all required attributes/properties
        // muted is a property in React, not an attribute
        expect(videoElement.muted).toBe(true);
        expect(videoElement).toHaveAttribute('loop');
        expect(videoElement).toHaveAttribute('playsinline');
        expect(videoElement).toHaveAttribute('src', video.videoUrl);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
