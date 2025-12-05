'use client';

import { motion } from 'framer-motion';

// Animation timing
const ANIMATION_CONFIG = {
  SWIRL_ROTATION_DURATION: 12000, // Slower, more elegant rotation
};

// Elegant color palette - warm gold/amber with deep charcoal
// Matches the Nordic hourglass aesthetic
const COLORS = {
  PRIMARY: '#B8956E', // Warm gold (matches hourglass accents)
  SECONDARY: '#8B7355', // Muted bronze
  ACCENT: '#D4A574', // Light gold
  DARK: '#1a1a1a', // Deep charcoal
};

interface PsychedelicSwirlProps {
  size?: number;
  reducedMotion?: boolean;
}

export function PsychedelicSwirl({
  size = 280,
  reducedMotion = false,
}: PsychedelicSwirlProps) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        position: 'absolute',
        borderRadius: '50%',
      }}
      animate={reducedMotion ? {} : { rotate: -360 }}
      transition={
        reducedMotion
          ? {}
          : {
              duration: ANIMATION_CONFIG.SWIRL_ROTATION_DURATION / 1000,
              repeat: Infinity,
              ease: 'linear',
            }
      }
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Elegant radial gradient - gold to transparent */}
          <radialGradient id="elegantGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.ACCENT} stopOpacity="0.15" />
            <stop offset="30%" stopColor={COLORS.PRIMARY} stopOpacity="0.1" />
            <stop offset="60%" stopColor={COLORS.SECONDARY} stopOpacity="0.05" />
            <stop offset="100%" stopColor={COLORS.DARK} stopOpacity="0" />
          </radialGradient>

          {/* Soft glow filter */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle noise texture */}
          <filter id="subtleNoise" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Background glow - very subtle */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#elegantGradient)"
          opacity="0.6"
        />

        {/* Elegant flowing curves */}
        <g filter="url(#subtleNoise)" opacity="0.5">
          {/* Primary gold curve */}
          <path
            d="M100 100 Q145 55 165 85 Q175 115 150 145 Q115 170 85 150"
            fill="none"
            stroke={COLORS.PRIMARY}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#softGlow)"
            opacity="0.6"
          />
          
          {/* Secondary bronze curve */}
          <path
            d="M100 100 Q55 145 35 115 Q25 85 50 55 Q85 30 115 50"
            fill="none"
            stroke={COLORS.SECONDARY}
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#softGlow)"
            opacity="0.5"
          />
          
          {/* Accent light gold curve */}
          <path
            d="M100 100 Q130 145 110 175 Q75 185 50 160 Q35 125 60 100"
            fill="none"
            stroke={COLORS.ACCENT}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#softGlow)"
            opacity="0.4"
          />
          
          {/* Fourth curve - subtle */}
          <path
            d="M100 100 Q70 55 90 25 Q125 15 150 40 Q165 75 140 100"
            fill="none"
            stroke={COLORS.PRIMARY}
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#softGlow)"
            opacity="0.35"
          />
        </g>

        {/* Elegant concentric rings - very subtle */}
        <g opacity="0.25">
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke={COLORS.ACCENT}
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke={COLORS.PRIMARY}
            strokeWidth="0.5"
            strokeDasharray="3 9"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={COLORS.SECONDARY}
            strokeWidth="0.5"
            strokeDasharray="4 12"
          />
        </g>

        {/* Outer ring - elegant gold border */}
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke={COLORS.PRIMARY}
          strokeWidth="0.8"
          opacity="0.2"
          filter="url(#softGlow)"
        />
      </svg>
    </motion.div>
  );
}

export default PsychedelicSwirl;
