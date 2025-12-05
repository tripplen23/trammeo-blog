'use client';

import { motion } from 'framer-motion';

// Animation timing constants from design document
const ANIMATION_CONFIG = {
  QUOTE_FADE_IN_DELAY: 300, // ms delay before quote appears
  QUOTE_FADE_IN_DURATION: 400, // ms for quote fade in
};

// Color palette from design document
const COLORS = {
  QUOTE_COLOR: '#FFFFFF',
};

interface QuoteDisplayProps {
  text?: string; // Default: "Thời gian là ảo ảnh"
  fadeInDelay?: number; // Default: 300ms
  reducedMotion?: boolean;
}

export function QuoteDisplay({
  text = 'Thời gian là ảo ảnh',
  fadeInDelay = ANIMATION_CONFIG.QUOTE_FADE_IN_DELAY,
  reducedMotion = false,
}: QuoteDisplayProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              delay: fadeInDelay / 1000,
              duration: ANIMATION_CONFIG.QUOTE_FADE_IN_DURATION / 1000,
              ease: 'easeOut',
            }
      }
      style={{
        color: COLORS.QUOTE_COLOR,
        fontSize: '2.25rem',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: '2.5rem',
        letterSpacing: '0.05em',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      }}
    >
      {text}
    </motion.p>
  );
}

export default QuoteDisplay;