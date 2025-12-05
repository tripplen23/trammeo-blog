'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import VideoCard, { type VideoCardVideo } from './VideoCard';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { getVideoKey } from '@/lib/videoDuplication';
import FilmFrame from './FilmFrame';
import FilmGrainOverlay from './FilmGrainOverlay';

// Sprocket hole component - authentic 35mm film perforations
// Real film has rectangular holes with slightly rounded corners
const SprocketHole = () => (
  <div className="relative">
    <div className="w-3.5 h-5 rounded-[2px] bg-black border border-gray-600/60 shadow-inner" />
    {/* Inner shadow for depth */}
    <div className="absolute inset-0.5 rounded-[1px] bg-gradient-to-b from-gray-900 to-black" />
  </div>
);

// Pre-generate sprocket holes array for performance
const SPROCKET_HOLES_DESKTOP = Array.from({ length: 100 }, (_, i) => i);
const SPROCKET_HOLES_MOBILE = Array.from({ length: 60 }, (_, i) => i);

// Film edge markings that appear between sprocket holes
const EDGE_MARKS = ['◀', '▶', '●', '○', '■'];

// Generate sprocket holes for the film strip with edge markings
function SprocketStrip({ count = 100 }: { count?: number }) {
  const holes = SPROCKET_HOLES_DESKTOP;
  return (
    <div className="flex flex-col items-center gap-4 py-4 will-change-transform">
      {holes.slice(0, count).map((i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <SprocketHole />
          {/* Edge marking every 4th hole */}
          {i % 4 === 0 && (
            <span className="text-[6px] text-amber-600/30 font-mono">
              {EDGE_MARKS[i % EDGE_MARKS.length]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Mobile sprocket strip - smaller and authentic
function MobileSprocketStrip() {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      {SPROCKET_HOLES_MOBILE.map((i) => (
        <div key={i} className="relative">
          <div className="w-2.5 h-3.5 rounded-[1px] bg-black border border-gray-600/50" />
          <div className="absolute inset-0.5 rounded-[1px] bg-gradient-to-b from-gray-900 to-black" />
        </div>
      ))}
    </div>
  );
}

interface ParallaxScrollContainerProps {
  leftColumnVideos: VideoCardVideo[];
  rightColumnVideos: VideoCardVideo[];
  onVideoSelect: (video: VideoCardVideo) => void;
}

export default function ParallaxScrollContainer({
  leftColumnVideos,
  rightColumnVideos,
  onVideoSelect,
}: ParallaxScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  // Track virtual scroll position (not actual page scroll)
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1000);
  
  // Initial offsets for columns - key fix for UX
  // Left column starts with negative offset (positioned above viewport)
  // So when scrolling down, videos from above appear
  const [leftInitialOffset, setLeftInitialOffset] = useState(0);
  const [rightInitialOffset, setRightInitialOffset] = useState(0);
  
  // Touch tracking for tablet/touch devices
  const touchStartY = useRef<number | null>(null);
  const lastTouchY = useRef<number | null>(null);

  // Smooth spring animation for scroll
  const smoothScroll = useSpring(scrollPosition, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Left column: starts at negative offset, moves down (toward 0 and beyond) when scrolling
  const leftColumnY = useTransform(smoothScroll, (value) => leftInitialOffset + value);

  // Right column: starts at positive offset, moves up (toward 0 and beyond negative) when scrolling
  const rightColumnY = useTransform(smoothScroll, (value) => rightInitialOffset - value);

  // Progress bar width - must be defined at top level (not in JSX)
  const progressWidth = useTransform(smoothScroll, [0, maxScroll], ['0%', '100%']);

  // Calculate initial offsets and max scroll based on content height
  // Key constraint: both columns must always have videos visible in viewport
  useEffect(() => {
    const calculateOffsetsAndMaxScroll = () => {
      if (leftColumnRef.current && rightColumnRef.current) {
        const leftHeight = leftColumnRef.current.scrollHeight;
        const rightHeight = rightColumnRef.current.scrollHeight;
        const viewportHeight = window.innerHeight - 72; // Account for header
        
        // Calculate safe offsets that ensure both columns have content visible
        // Left column: starts with negative offset (above viewport)
        // At scroll=0, left column should show some videos
        const leftOffset = -leftHeight * 0.3;
        setLeftInitialOffset(leftOffset);
        
        // Right column: starts with positive offset (below initial view)
        const rightOffset = rightHeight * 0.2;
        setRightInitialOffset(rightOffset);
        
        // Calculate max scroll that keeps both columns with visible content
        // Left column position: leftOffset + scrollValue
        // Right column position: rightOffset - scrollValue
        
        // For left column to stay visible: leftOffset + scroll < leftHeight - viewportHeight
        // Max scroll for left: leftHeight - viewportHeight - leftOffset
        const maxScrollLeft = leftHeight - viewportHeight + leftOffset;
        
        // For right column to stay visible: rightOffset - scroll > -(rightHeight - viewportHeight)
        // Max scroll for right: rightOffset + rightHeight - viewportHeight
        const maxScrollRight = rightOffset + rightHeight - viewportHeight;
        
        // Use the smaller of the two to ensure both columns always have content
        const safeMaxScroll = Math.min(maxScrollLeft, maxScrollRight) * 0.7;
        setMaxScroll(Math.max(safeMaxScroll, 300));
      }
    };

    calculateOffsetsAndMaxScroll();
    window.addEventListener('resize', calculateOffsetsAndMaxScroll);

    // Recalculate after images load
    const timer = setTimeout(calculateOffsetsAndMaxScroll, 1000);

    return () => {
      window.removeEventListener('resize', calculateOffsetsAndMaxScroll);
      clearTimeout(timer);
    };
  }, [leftColumnVideos.length, rightColumnVideos.length]);

  // Handle wheel event - prevent default scroll, use custom animation
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isDesktop) return;

      e.preventDefault();

      const delta = e.deltaY;
      const sensitivity = 1.5; // Adjust scroll speed

      setScrollPosition((prev) => {
        const newPosition = prev + delta * sensitivity;
        // Clamp between 0 and maxScroll
        return Math.max(0, Math.min(newPosition, maxScroll));
      });
    },
    [isDesktop, maxScroll]
  );

  // Handle touch events for tablet/touch devices (iPad, etc.)
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isDesktop) return;
    touchStartY.current = e.touches[0].clientY;
    lastTouchY.current = e.touches[0].clientY;
  }, [isDesktop]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDesktop || lastTouchY.current === null) return;
    
    e.preventDefault(); // Prevent default scroll
    
    const currentY = e.touches[0].clientY;
    const delta = lastTouchY.current - currentY; // Positive = scroll down
    const sensitivity = 1.5;
    
    setScrollPosition((prev) => {
      const newPosition = prev + delta * sensitivity;
      return Math.max(0, Math.min(newPosition, maxScroll));
    });
    
    lastTouchY.current = currentY;
  }, [isDesktop, maxScroll]);

  const handleTouchEnd = useCallback(() => {
    touchStartY.current = null;
    lastTouchY.current = null;
  }, []);

  // Attach wheel and touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isDesktop) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd, isDesktop]);

  // Update spring target when scrollPosition changes
  useEffect(() => {
    smoothScroll.set(scrollPosition);
  }, [scrollPosition, smoothScroll]);

  // Combine all videos for mobile single column view
  const allVideos = [...leftColumnVideos, ...rightColumnVideos];

  // Mobile: Film strip themed single column with sprocket holes
  if (!isDesktop) {
    return (
      <div
        ref={containerRef}
        className="relative min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-y-auto"
        data-testid="parallax-container"
        data-mobile="true"
      >
        {/* Film grain overlay - lighter for mobile */}
        <div 
          className="fixed inset-0 pointer-events-none z-40 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        <div className="flex min-h-screen">
          {/* Left sprocket strip */}
          <div className="w-5 flex-shrink-0 flex flex-col items-center bg-gray-800/30 border-r border-gray-700/20">
            <MobileSprocketStrip />
          </div>

          {/* Main content column */}
          <div className="flex-1 flex flex-col gap-3 px-2 py-6 pb-24">
            <div
              className="w-full flex flex-col gap-3"
              data-testid="mobile-single-column"
            >
              {allVideos.map((video, index) => (
                <FilmFrame key={getVideoKey(video)} frameNumber={index + 1} showFrameNumber={true}>
                  <VideoCard
                    video={video}
                    onClick={onVideoSelect}
                  />
                </FilmFrame>
              ))}
            </div>
          </div>

          {/* Right sprocket strip */}
          <div className="w-5 flex-shrink-0 flex flex-col items-center bg-gray-800/30 border-l border-gray-700/20">
            <MobileSprocketStrip />
          </div>
        </div>

        {/* Film brand watermark */}
        <div className="fixed bottom-4 right-6 font-mono text-[8px] text-amber-500/40 tracking-widest z-50">
          TRAMMEO 400
        </div>
      </div>
    );
  }

  // Desktop: Two columns moving in opposite directions with film strip theme
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 top-[72px] bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden"
      data-testid="parallax-container"
      data-mobile="false"
      style={{ cursor: 'grab' }}
    >
      {/* Film grain overlay for vintage aesthetic */}
      <FilmGrainOverlay />

      {/* Two film strip columns container */}
      <div className="flex h-full">
        {/* Left Film Strip Column */}
        <div className="flex-1 flex">
          {/* Left sprocket strip - authentic film edge with perforations */}
          <motion.div
            style={{ y: leftColumnY, willChange: 'transform' }}
            className="w-8 flex-shrink-0 flex flex-col items-center bg-gradient-to-r from-gray-900 via-gray-800/80 to-gray-900/60 border-r border-gray-600/30"
          >
            <SprocketStrip count={80} />
          </motion.div>

          {/* Left video column */}
          <motion.div
            ref={leftColumnRef}
            style={{ y: leftColumnY, willChange: 'transform' }}
            className="flex-1 flex flex-col gap-3 py-4 px-2"
            data-testid="parallax-left-column"
          >
            {leftColumnVideos.map((video, index) => (
              <FilmFrame key={getVideoKey(video)} frameNumber={index + 1}>
                <VideoCard
                  video={video}
                  onClick={onVideoSelect}
                />
              </FilmFrame>
            ))}
          </motion.div>
        </div>

        {/* Center divider - film edge */}
        <div className="w-px bg-gradient-to-b from-transparent via-gray-700/30 to-transparent" />

        {/* Right Film Strip Column */}
        <div className="flex-1 flex">
          {/* Right video column */}
          <motion.div
            ref={rightColumnRef}
            style={{ y: rightColumnY, willChange: 'transform' }}
            className="flex-1 flex flex-col gap-3 py-4 px-2"
            data-testid="parallax-right-column"
          >
            {rightColumnVideos.map((video, index) => (
              <FilmFrame key={getVideoKey(video)} frameNumber={leftColumnVideos.length + index + 1}>
                <VideoCard
                  video={video}
                  onClick={onVideoSelect}
                />
              </FilmFrame>
            ))}
          </motion.div>

          {/* Right sprocket strip - authentic film edge with perforations */}
          <motion.div
            style={{ y: rightColumnY, willChange: 'transform' }}
            className="w-8 flex-shrink-0 flex flex-col items-center bg-gradient-to-l from-gray-900 via-gray-800/80 to-gray-900/60 border-l border-gray-600/30"
          >
            <SprocketStrip count={80} />
          </motion.div>
        </div>
      </div>

      {/* Film counter - styled like vintage film camera counter */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {/* Film reel icon */}
        <div className="w-4 h-4 rounded-full border-2 border-amber-600/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-600/40" />
        </div>
        
        {/* Progress bar */}
        <div className="w-32 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-700/40">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600/70 to-amber-500/50 rounded-full"
            style={{ width: progressWidth }}
          />
        </div>
        
        {/* Film reel icon */}
        <div className="w-4 h-4 rounded-full border-2 border-amber-600/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-600/40" />
        </div>
      </div>

      {/* Film brand watermark - more authentic */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-0.5">
        <div className="font-mono text-[10px] text-amber-600/40 tracking-[0.2em]">
          TRAMMEO
        </div>
        <div className="font-mono text-[8px] text-amber-600/30 tracking-widest">
          VISION 400T
        </div>
      </div>
      
      {/* DX code simulation - left side */}
      <div className="fixed bottom-6 left-6 flex items-center gap-1">
        {[1,0,1,1,0,1].map((bit, i) => (
          <div 
            key={i} 
            className={`w-1 h-3 ${bit ? 'bg-amber-600/30' : 'bg-gray-800/50'}`} 
          />
        ))}
      </div>
    </div>
  );
}
