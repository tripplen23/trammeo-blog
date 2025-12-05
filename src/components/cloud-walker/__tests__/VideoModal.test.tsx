import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import VideoModal from '../VideoModal';
import type { VideoCardVideo } from '../VideoCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      onClick,
      className,
      'data-testid': testId,
    }: React.ComponentProps<'div'> & { 'data-testid'?: string }) => (
      <div onClick={onClick} className={className} data-testid={testId}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  X: () => <span data-testid="close-icon">X</span>,
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

describe('VideoModal', () => {
  let mockOnClose: () => void;
  let mockPause: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnClose = vi.fn();
    mockPause = vi.fn();

    // Mock HTMLVideoElement methods
    Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
      configurable: true,
      value: mockPause,
    });
    Object.defineProperty(HTMLVideoElement.prototype, 'play', {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 11: Click Opens Modal**
   * **Validates: Requirements 4.1**
   *
   * For any VideoCard click event, the Video_Modal SHALL open with the clicked video's data.
   */
  it('Property 11: modal displays video data when open', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const { unmount, container } = render(
          <VideoModal video={video} isOpen={true} onClose={mockOnClose} />
        );

        // Modal should be visible
        const backdrop = container.querySelector('[data-testid="video-modal-backdrop"]');
        expect(backdrop).toBeInTheDocument();

        // Video title should be displayed in h2
        const titleElement = container.querySelector('h2');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement?.textContent).toBe(video.title);

        // Video element should have correct src
        const videoElement = container.querySelector('video');
        expect(videoElement).toHaveAttribute('src', video.videoUrl);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 12: Modal Autoplay with Audio**
   * **Validates: Requirements 4.3**
   *
   * For any Video_Modal in open state, the video element SHALL have autoplay=true and muted=false.
   */
  it('Property 12: modal video has autoplay enabled and is not muted', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const { unmount, container } = render(
          <VideoModal video={video} isOpen={true} onClose={mockOnClose} />
        );

        const videoElement = container.querySelector('video') as HTMLVideoElement;

        // Video should have autoplay attribute
        expect(videoElement).toHaveAttribute('autoplay');

        // Video should NOT be muted (audio enabled)
        expect(videoElement.muted).toBe(false);

        // Video should have controls for volume adjustment
        expect(videoElement).toHaveAttribute('controls');

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: nguoi-di-tren-may, Property 13: Modal Close Behavior**
   * **Validates: Requirements 4.4, 4.5**
   *
   * For any Video_Modal in open state, clicking the backdrop, close button,
   * or pressing Escape key SHALL close the modal and stop video playback.
   */
  it('Property 13a: clicking close button calls onClose', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const onClose = vi.fn();
        const { unmount, container } = render(
          <VideoModal video={video} isOpen={true} onClose={onClose} />
        );

        const closeButton = container.querySelector('[data-testid="video-modal-close"]');
        expect(closeButton).toBeInTheDocument();

        fireEvent.click(closeButton!);
        expect(onClose).toHaveBeenCalledTimes(1);

        onClose.mockClear();
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13b: clicking backdrop calls onClose', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const onClose = vi.fn();
        const { unmount, container } = render(
          <VideoModal video={video} isOpen={true} onClose={onClose} />
        );

        const backdrop = container.querySelector('[data-testid="video-modal-backdrop"]');
        expect(backdrop).toBeInTheDocument();

        // Click directly on backdrop (not on content)
        fireEvent.click(backdrop!);
        expect(onClose).toHaveBeenCalledTimes(1);

        onClose.mockClear();
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13c: pressing Escape key calls onClose', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const onClose = vi.fn();
        const { unmount } = render(<VideoModal video={video} isOpen={true} onClose={onClose} />);

        // Simulate Escape key press
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);

        onClose.mockClear();
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('modal does not render when isOpen is false', () => {
    fc.assert(
      fc.property(videoArbitrary, (video) => {
        const { unmount, container } = render(
          <VideoModal video={video} isOpen={false} onClose={mockOnClose} />
        );

        const backdrop = container.querySelector('[data-testid="video-modal-backdrop"]');
        expect(backdrop).not.toBeInTheDocument();

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('modal does not render when video is null', () => {
    const { container } = render(<VideoModal video={null} isOpen={true} onClose={mockOnClose} />);

    const backdrop = container.querySelector('[data-testid="video-modal-backdrop"]');
    expect(backdrop).not.toBeInTheDocument();
  });
});
