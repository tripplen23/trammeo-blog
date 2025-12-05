'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HourglassAnimation } from './HourglassAnimation';
import { PsychedelicSwirl } from './PsychedelicSwirl';
import { QuoteDisplay } from './QuoteDisplay';
import { useLoading } from '@/contexts/LoadingContext';
import { useMediaQuery, useIsMobile } from '@/hooks/useMediaQuery';

// Animation timing constants from design document
const ANIMATION_CONFIG = {
  FADE_IN_DURATION: 100, // ms for loading screen to appear
  FADE_OUT_DURATION: 500, // ms for loading screen to disappear
};

// Color palette from design document
const COLORS = {
  OVERLAY_BG: 'rgba(0, 0, 0, 0.95)',
};

interface LoadingScreenProps {
  quote?: string; // Default: "Thời gian là ảo ảnh"
}

// Variants for different enter/exit durations
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: ANIMATION_CONFIG.FADE_IN_DURATION / 1000 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: ANIMATION_CONFIG.FADE_OUT_DURATION / 1000 },
  },
};

export function LoadingScreen({ quote = 'Thời gian là ảo ảnh' }: LoadingScreenProps) {
  const { isLoading } = useLoading();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useIsMobile();

  // Responsive sizing: scale down on mobile (< 768px)
  const hourglassSize = isMobile ? 80 : 120;
  const swirlSize = isMobile ? 160 : 240;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="loading-screen"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"

          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: COLORS.OVERLAY_BG,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          role="alert"
          aria-live="assertive"
          aria-busy={isLoading}
        >
          {/* Screen reader announcement */}
          <span className="sr-only">Loading page</span>

          {/* Container for hourglass and swirl - centered */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: swirlSize,
              height: swirlSize,
            }}
          >
            {/* Psychedelic swirl behind hourglass */}
            <PsychedelicSwirl
              size={swirlSize}
              reducedMotion={reducedMotion}
            />

            {/* Hourglass animation centered on top of swirl */}
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HourglassAnimation
                size={hourglassSize}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>

          {/* Quote below hourglass */}
          <QuoteDisplay
            text={quote}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;