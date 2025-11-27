'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface EntryScreenProps {
  onEnter: () => void;
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

const dotVariants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: 100,
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
    },
  },
};

const circleVariants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: 100,
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
    },
  },
};

const dotVariantsReduced = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: 1,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut' as const,
    },
  },
};

const circleVariantsReduced = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: 1,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut' as const,
    },
  },
};

const backgroundVariants = {
  initial: {
    backgroundColor: '#ffffff',
  },
  animate: {
    backgroundColor: '#000000',
    transition: {
      duration: 0.8,
      ease: 'easeInOut' as const,
    },
  },
};

const backgroundVariantsReduced = {
  initial: {
    backgroundColor: '#ffffff',
  },
  animate: {
    backgroundColor: '#000000',
    transition: {
      duration: 0.3,
      ease: 'easeInOut' as const,
    },
  },
};

export default function EntryScreen({ onEnter, isAnimating, onAnimationComplete }: EntryScreenProps) {
  const dotRef = useRef<HTMLButtonElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detect user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to the preference
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Apply will-change when animation starts (only for full animation)
    if (isAnimating && !prefersReducedMotion && dotRef.current) {
      dotRef.current.style.willChange = 'transform';
    }
  }, [isAnimating, prefersReducedMotion]);

  const handleAnimationComplete = () => {
    // Only trigger completion callback if we're actually animating
    if (!isAnimating) return;

    // Remove will-change after animation completes
    if (dotRef.current) {
      dotRef.current.style.willChange = 'auto';
    }
    onAnimationComplete();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAnimating) return;

    // Trigger animation on Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent space from scrolling
      onEnter();
    }
  };

  // Select appropriate variants based on motion preference
  const selectedDotVariants = prefersReducedMotion ? dotVariantsReduced : dotVariants;
  const selectedCircleVariants = prefersReducedMotion ? circleVariantsReduced : circleVariants;
  const selectedBackgroundVariants = prefersReducedMotion ? backgroundVariantsReduced : backgroundVariants;

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      variants={selectedBackgroundVariants}
      initial="initial"
      animate={isAnimating ? 'animate' : 'initial'}
      style={{
        pointerEvents: isAnimating ? 'none' : 'auto',
      }}
    >
      {/* Outer circle border */}
      <motion.div
        className="absolute rounded-full border-[3px] border-black pointer-events-none"
        style={{
          width: 'min(600px, 85vw, 60vh)',
          height: 'min(600px, 85vw, 60vh)',
        }}
        variants={selectedCircleVariants}
        initial="initial"
        animate={isAnimating ? 'animate' : 'initial'}
      />

      <motion.button
        ref={dotRef}
        role="button"
        tabIndex={0}
        aria-label="Enter About page"
        onClick={onEnter}
        onKeyDown={handleKeyDown}
        disabled={isAnimating}
        className="relative h-8 w-8 rounded-full bg-black cursor-pointer transition-transform duration-200 ease-out hover:scale-125 focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-opacity-50"
        variants={selectedDotVariants}
        initial="initial"
        animate={isAnimating ? 'animate' : 'initial'}
        onAnimationComplete={handleAnimationComplete}
        whileHover={!isAnimating ? { scale: 1.25 } : undefined}
        whileTap={!isAnimating ? { scale: 0.95 } : undefined}
      >
        <span className="sr-only">Enter About page</span>
      </motion.button>
    </motion.div>
  );
}
