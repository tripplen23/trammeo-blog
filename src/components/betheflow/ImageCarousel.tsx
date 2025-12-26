'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { urlForImage } from '@/lib/sanity';
import {
  navigateNext,
  navigatePrevious,
  canNavigateNext,
  canNavigatePrevious,
  getIndicatorCount,
  CarouselNavigationState,
} from '@/lib/carouselUtils';

// Re-export types and functions for convenience
export type { CarouselNavigationState } from '@/lib/carouselUtils';
export {
  navigateNext,
  navigatePrevious,
  canNavigateNext,
  canNavigatePrevious,
  getIndicatorCount,
} from '@/lib/carouselUtils';

/**
 * Props for the ImageCarousel component
 */
export interface ImageCarouselProps {
  images: SanityImageSource[];
  alt?: string;
}

// Swipe threshold in pixels
const SWIPE_THRESHOLD = 50;

/**
 * ImageCarousel Component
 * Instagram-style image carousel with navigation arrows and dot indicators
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 */
export default function ImageCarousel({ images, alt = 'Gallery image' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalImages = images.length;
  const navigationState: CarouselNavigationState = { currentIndex, totalImages };

  const handleNext = useCallback(() => {
    if (canNavigateNext(navigationState)) {
      setCurrentIndex(navigateNext(navigationState));
    }
  }, [navigationState]);

  const handlePrevious = useCallback(() => {
    if (canNavigatePrevious(navigationState)) {
      setCurrentIndex(navigatePrevious(navigationState));
    }
  }, [navigationState]);

  const handleDotClick = useCallback((index: number) => {
    if (index >= 0 && index < totalImages) {
      setCurrentIndex(index);
    }
  }, [totalImages]);

  // Handle swipe gestures for touch devices
  // Requirements: 5.7
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset } = info;

      if (offset.x < -SWIPE_THRESHOLD && canNavigateNext(navigationState)) {
        // Swiped left - go to next
        setCurrentIndex(navigateNext(navigationState));
      } else if (offset.x > SWIPE_THRESHOLD && canNavigatePrevious(navigationState)) {
        // Swiped right - go to previous
        setCurrentIndex(navigatePrevious(navigationState));
      }
    },
    [navigationState]
  );

  if (totalImages === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const showNavigation = totalImages > 1;
  const canGoPrevious = canNavigatePrevious(navigationState);
  const canGoNext = canNavigateNext(navigationState);

  return (
    <div className="relative w-full h-full">
      {/* Image Container with Swipe Support */}
      <motion.div
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        drag={showNavigation ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            <Image
              src={urlForImage(images[currentIndex]).width(1200).height(1200).quality(90).url()}
              alt={`${alt} ${currentIndex + 1} of ${totalImages}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation Arrows - Requirements: 5.2, 5.3, 5.4, 5.5, 5.6 */}
      {showNavigation && (
        <>
          {/* Previous Arrow */}
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md transition-all duration-200 z-10 ${
              canGoPrevious
                ? 'hover:bg-white hover:scale-110 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md transition-all duration-200 z-10 ${
              canGoNext
                ? 'hover:bg-white hover:scale-110 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label="Next image"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>
        </>
      )}

      {/* Dot Indicators - Requirements: 5.1 */}
      {showNavigation && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: getIndicatorCount(images) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                currentIndex === idx
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${idx + 1}`}
              aria-current={currentIndex === idx ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {showNavigation && (
        <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded z-10">
          {currentIndex + 1} / {totalImages}
        </div>
      )}
    </div>
  );
}
