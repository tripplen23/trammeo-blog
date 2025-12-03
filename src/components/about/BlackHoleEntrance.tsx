'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EntryScreen from './EntryScreen';
import { useAboutEntrance } from '@/contexts/AboutEntranceContext';

interface BlackHoleEntranceProps {
  children: React.ReactNode;
}

export default function BlackHoleEntrance({ children }: BlackHoleEntranceProps) {
  const { hasEntered, setHasEntered } = useAboutEntrance();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Reset hasEntered when component mounts (navigating to about page)
    setHasEntered(false);
    // Mark component as mounted to avoid hydration mismatch
    setIsMounted(true);

    if (typeof window === 'undefined') return;

    // Detect user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to the preference
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setHasEntered]);

  const handleEnter = () => {
    // Prevent multiple clicks during animation
    if (isAnimating) return;
    setIsAnimating(true);
  };

  const onAnimationComplete = () => {
    // Mark as entered and reset animation state (updates context)
    setHasEntered(true);
    setIsAnimating(false);
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: 0.6,
      },
    },
  };

  const contentVariantsReduced = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 0,
      },
    },
  };

  // Select appropriate variants based on motion preference
  const selectedContentVariants = prefersReducedMotion ? contentVariantsReduced : contentVariants;

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!hasEntered && (
          <EntryScreen 
            key="entry-screen"
            onEnter={handleEnter}
            isAnimating={isAnimating}
            onAnimationComplete={onAnimationComplete}
          />
        )}
      </AnimatePresence>

      {hasEntered && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={selectedContentVariants}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}