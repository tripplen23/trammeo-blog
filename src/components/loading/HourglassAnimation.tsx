'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Animation timing constants
const ANIMATION_CONFIG = {
  SAND_FLOW_DURATION: 2500,
  PAUSE_DURATION: 500,
  FLIP_DURATION: 800,
};

// Nordic-inspired color palette
const COLORS = {
  SAND_PRIMARY: '#C4A77D',
  SAND_SECONDARY: '#A68B5B',
  GLASS_STROKE: 'rgba(255, 255, 255, 0.4)',
  FRAME_PRIMARY: '#2C2C2C',
  FRAME_SECONDARY: '#1A1A1A',
  ACCENT_GOLD: '#B8956E',
};

// Geometry constants - viewBox is 100x160
const GEOMETRY = {
  TOP_CENTER_Y: 45,
  TOP_RADIUS_Y: 25,
  TOP_RADIUS_X: 28,
  BOTTOM_CENTER_Y: 115,
  BOTTOM_RADIUS_Y: 25,
  BOTTOM_RADIUS_X: 28,
  NECK_TOP: 70,
  NECK_BOTTOM: 90,
  CENTER_Y: 80, // Center point for rotation
};

interface HourglassAnimationProps {
  size?: number;
  reducedMotion?: boolean;
}

type HourglassPhase = 'flowing' | 'paused' | 'flipping';

export function HourglassAnimation({
  size = 140,
  reducedMotion = false,
}: HourglassAnimationProps) {
  const [phase, setPhase] = useState<HourglassPhase>('flowing');
  const [sandLevel, setSandLevel] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [visualRotation, setVisualRotation] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Animation loop
  useEffect(() => {
    if (reducedMotion || !isMounted) return;

    let isActive = true;

    const runCycle = async () => {
      while (isActive && isMounted) {
        // Phase 1: Sand flowing
        setPhase('flowing');
        setSandLevel(0);

        const flowStartTime = Date.now();

        await new Promise<void>((resolve) => {
          const flowInterval = setInterval(() => {
            if (!isActive) {
              clearInterval(flowInterval);
              resolve();
              return;
            }

            const elapsed = Date.now() - flowStartTime;
            const progress = Math.min(
              elapsed / ANIMATION_CONFIG.SAND_FLOW_DURATION,
              1
            );
            const easedProgress = 1 - Math.pow(1 - progress, 2);
            setSandLevel(easedProgress * 100);

            if (progress >= 1) {
              clearInterval(flowInterval);
              resolve();
            }
          }, 16);
        });

        if (!isActive) break;
        setSandLevel(100);

        // Phase 2: Pause
        setPhase('paused');
        await new Promise((resolve) =>
          setTimeout(resolve, ANIMATION_CONFIG.PAUSE_DURATION)
        );

        if (!isActive) break;

        // Phase 3: Flip - animate rotation and update flip count
        setPhase('flipping');
        
        // Animate the visual rotation
        const startRotation = visualRotation;
        const targetRotation = startRotation + 180;
        const flipStartTime = Date.now();
        
        await new Promise<void>((resolve) => {
          const flipInterval = setInterval(() => {
            if (!isActive) {
              clearInterval(flipInterval);
              resolve();
              return;
            }
            
            const elapsed = Date.now() - flipStartTime;
            const progress = Math.min(elapsed / ANIMATION_CONFIG.FLIP_DURATION, 1);
            // Ease in-out
            const eased = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            setVisualRotation(startRotation + (180 * eased));
            
            if (progress >= 1) {
              clearInterval(flipInterval);
              resolve();
            }
          }, 16);
        });

        if (!isActive) break;
        
        setVisualRotation(targetRotation);
        setFlipCount((prev) => prev + 1);
        setSandLevel(0);
      }
    };

    runCycle();

    return () => {
      isActive = false;
    };
  }, [reducedMotion, isMounted, visualRotation]);

  // Determine which bulb is currently on top based on flip count
  // Even flip count = original orientation (top bulb has sand initially)
  // Odd flip count = flipped (bottom bulb is now on top)
  const isFlipped = flipCount % 2 === 1;

  // Sand calculations - always relative to CURRENT gravity
  // "Source" bulb = the one currently on top (has sand draining)
  // "Target" bulb = the one currently on bottom (accumulating sand)
  const sandRemaining = 100 - sandLevel; // % remaining in source
  const sandAccumulated = sandLevel; // % accumulated in target

  // Calculate sand positions for the SOURCE bulb (currently on top, draining)
  // Sand sits at bottom of this bulb (near neck) due to gravity
  const sourceBulbNeckY = isFlipped
    ? GEOMETRY.NECK_BOTTOM + 2 // If flipped, "bottom" bulb is on top, its neck is at NECK_BOTTOM
    : GEOMETRY.NECK_TOP - 2; // Normal: top bulb's neck is at NECK_TOP
  const sourceSandMaxHeight = 38;
  const sourceSandHeight = sourceSandMaxHeight * (sandRemaining / 100);
  const sourceSandY = isFlipped
    ? sourceBulbNeckY - sourceSandHeight // Flipped: sand above neck
    : sourceBulbNeckY - sourceSandHeight; // Normal: sand above neck

  // Calculate sand positions for the TARGET bulb (currently on bottom, accumulating)
  // Sand accumulates at the very bottom of this bulb
  const targetBulbBottomY = isFlipped
    ? GEOMETRY.TOP_CENTER_Y + GEOMETRY.TOP_RADIUS_Y - 2 // Flipped: top bulb is now at bottom
    : GEOMETRY.BOTTOM_CENTER_Y + GEOMETRY.BOTTOM_RADIUS_Y - 2; // Normal: bottom bulb
  const targetSandMaxHeight = 38;
  const targetSandHeight = targetSandMaxHeight * (sandAccumulated / 100);
  const targetSandY = targetBulbBottomY - targetSandHeight;

  // Clip paths and positions
  const sourceClipId = isFlipped ? 'bottomBulbClip' : 'topBulbClip';
  const targetClipId = isFlipped ? 'topBulbClip' : 'bottomBulbClip';

  // Particle positions
  const particleStartY = isFlipped ? GEOMETRY.NECK_TOP : GEOMETRY.NECK_BOTTOM;
  const particleLandingY = Math.max(targetSandY - 1, (isFlipped ? GEOMETRY.NECK_TOP - 5 : GEOMETRY.NECK_BOTTOM + 5));

  return (
    <div
      style={{
        width: size,
        height: size * 1.6,
        position: 'relative',
      }}
    >
      <svg
        viewBox="0 0 100 160"
        width={size}
        height={size * 1.6}
        style={{ 
          overflow: 'visible',
          transform: `rotate(${visualRotation}deg)`,
          transformOrigin: 'center center',
          transition: phase === 'flipping' ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <defs>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.12)" />
          </linearGradient>

          <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.SAND_PRIMARY} />
            <stop offset="100%" stopColor={COLORS.SAND_SECONDARY} />
          </linearGradient>

          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.FRAME_PRIMARY} />
            <stop offset="100%" stopColor={COLORS.FRAME_SECONDARY} />
          </linearGradient>

          <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.ACCENT_GOLD} />
            <stop offset="50%" stopColor="#D4A574" />
            <stop offset="100%" stopColor={COLORS.ACCENT_GOLD} />
          </linearGradient>

          <clipPath id="topBulbClip">
            <ellipse cx="50" cy={GEOMETRY.TOP_CENTER_Y} rx={GEOMETRY.TOP_RADIUS_X} ry={GEOMETRY.TOP_RADIUS_Y} />
          </clipPath>
          <clipPath id="bottomBulbClip">
            <ellipse cx="50" cy={GEOMETRY.BOTTOM_CENTER_Y} rx={GEOMETRY.BOTTOM_RADIUS_X} ry={GEOMETRY.BOTTOM_RADIUS_Y} />
          </clipPath>
        </defs>

        {/* === FRAME === */}
        <rect x="15" y="8" width="70" height="8" rx="1" fill="url(#frameGradient)" />
        <rect x="15" y="16" width="70" height="2" fill="url(#goldAccent)" opacity="0.8" />

        <rect x="15" y="144" width="70" height="8" rx="1" fill="url(#frameGradient)" />
        <rect x="15" y="142" width="70" height="2" fill="url(#goldAccent)" opacity="0.8" />

        <rect x="18" y="18" width="4" height="124" fill="url(#frameGradient)" />
        <rect x="17" y="20" width="6" height="3" rx="0.5" fill="url(#goldAccent)" opacity="0.9" />
        <rect x="17" y="137" width="6" height="3" rx="0.5" fill="url(#goldAccent)" opacity="0.9" />

        <rect x="78" y="18" width="4" height="124" fill="url(#frameGradient)" />
        <rect x="77" y="20" width="6" height="3" rx="0.5" fill="url(#goldAccent)" opacity="0.9" />
        <rect x="77" y="137" width="6" height="3" rx="0.5" fill="url(#goldAccent)" opacity="0.9" />

        {/* === GLASS BULBS === */}
        <ellipse
          cx="50" cy={GEOMETRY.TOP_CENTER_Y} rx={GEOMETRY.TOP_RADIUS_X} ry={GEOMETRY.TOP_RADIUS_Y}
          fill="url(#glassGradient)"
          stroke={COLORS.GLASS_STROKE}
          strokeWidth="1.5"
        />

        <ellipse
          cx="50" cy={GEOMETRY.BOTTOM_CENTER_Y} rx={GEOMETRY.BOTTOM_RADIUS_X} ry={GEOMETRY.BOTTOM_RADIUS_Y}
          fill="url(#glassGradient)"
          stroke={COLORS.GLASS_STROKE}
          strokeWidth="1.5"
        />

        {/* Neck */}
        <path
          d="M 38 68 Q 50 80 62 68 L 62 92 Q 50 80 38 92 Z"
          fill="url(#glassGradient)"
          stroke={COLORS.GLASS_STROKE}
          strokeWidth="1"
        />

        {/* === SAND IN SOURCE BULB (currently on top, draining) === */}
        <g clipPath={`url(#${sourceClipId})`}>
          {sandRemaining > 0 && (
            <rect
              x={22}
              y={sourceSandY}
              width={56}
              height={sourceSandHeight + 5}
              fill="url(#sandGradient)"
            />
          )}
        </g>

        {/* === SAND IN TARGET BULB (currently on bottom, accumulating) === */}
        <g clipPath={`url(#${targetClipId})`}>
          {sandAccumulated > 0 && (
            <rect
              x={22}
              y={targetSandY}
              width={56}
              height={targetSandHeight + 5}
              fill="url(#sandGradient)"
            />
          )}
        </g>

        {/* === SAND STREAM THROUGH NECK === */}
        {phase === 'flowing' && !reducedMotion && sandRemaining > 2 && (
          <motion.line
            x1="50" y1={GEOMETRY.NECK_TOP}
            x2="50" y2={GEOMETRY.NECK_BOTTOM}
            stroke={COLORS.SAND_PRIMARY}
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        )}

        {/* === FALLING SAND PARTICLES === */}
        {phase === 'flowing' && !reducedMotion && sandRemaining > 2 && (
          <>
            <motion.circle
              cx="50"
              r="1.8"
              fill={COLORS.SAND_PRIMARY}
              initial={{ cy: particleStartY }}
              animate={{
                cy: [particleStartY, particleLandingY],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                ease: 'easeIn',
              }}
            />
            <motion.circle
              cx="49"
              r="1.2"
              fill={COLORS.SAND_SECONDARY}
              initial={{ cy: particleStartY + 2 }}
              animate={{
                cy: [particleStartY + 2, particleLandingY],
                cx: [49, 47],
                opacity: [0.9, 0.7, 0],
              }}
              transition={{
                duration: 0.45,
                repeat: Infinity,
                ease: 'easeIn',
                delay: 0.12,
              }}
            />
            <motion.circle
              cx="51"
              r="1.2"
              fill={COLORS.SAND_SECONDARY}
              initial={{ cy: particleStartY + 1 }}
              animate={{
                cy: [particleStartY + 1, particleLandingY],
                cx: [51, 53],
                opacity: [0.9, 0.7, 0],
              }}
              transition={{
                duration: 0.42,
                repeat: Infinity,
                ease: 'easeIn',
                delay: 0.25,
              }}
            />
          </>
        )}

        {/* === GLASS REFLECTIONS === */}
        <ellipse cx="40" cy="38" rx="8" ry="6" fill="rgba(255, 255, 255, 0.15)" />
        <ellipse cx="40" cy="108" rx="8" ry="6" fill="rgba(255, 255, 255, 0.12)" />
      </svg>
    </div>
  );
}

export default HourglassAnimation;
