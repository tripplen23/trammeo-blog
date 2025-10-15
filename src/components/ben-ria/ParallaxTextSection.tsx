'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxTextSectionProps {
  title: string;
  subtitle?: string;
  bgColor?: string;
}

export default function ParallaxTextSection({ 
  title, 
  subtitle,
  bgColor = 'from-pink-600 via-rose-500 to-purple-600'
}: ParallaxTextSectionProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div
      ref={container} 
      className='relative flex items-center justify-center h-screen overflow-hidden'
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className='relative z-10 p-8 md:p-20 text-white w-full h-full flex flex-col justify-between'>
        {subtitle && (
          <p className='w-full md:w-[50vw] text-[4vw] md:text-[2vw] self-end uppercase mix-blend-difference leading-tight'>
            {subtitle}
          </p>
        )}
        <p className='text-[8vw] md:text-[5vw] uppercase mix-blend-difference font-bold leading-none'>
          {title}
        </p>
      </div>
      
      <div className='fixed top-[-10vh] left-0 h-[120vh] w-full'>
        <motion.div style={{ y }} className='relative w-full h-full'>
          {/* Placeholder gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${bgColor}`} />
        </motion.div>
      </div>
    </div>
  );
}




