'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface ParallaxSectionProps {
  imageSrc: string;
  imageAlt: string;
  children?: React.ReactNode;
  speed?: number;
  overlay?: boolean;
}

export default function ParallaxSection({
  imageSrc,
  imageAlt,
  children,
  speed = 0.6,
  overlay = true,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <div ref={ref} className="relative h-[70vh] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
          quality={85}
        />
      </motion.div>
      
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-amber-900/20 to-amber-900/60" />
      )}
      
      {children && (
        <motion.div
          style={{ opacity }}
          className="relative z-10 h-full flex items-center justify-center"
        >
          <div className="text-center text-white px-6 max-w-4xl">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  );
}