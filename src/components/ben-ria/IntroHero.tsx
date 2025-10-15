'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export default function IntroHero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "150vh"]);

  return (
    <div ref={container} className='h-screen overflow-hidden relative'>
      <motion.div style={{ y }} className='relative h-full'>
        {/* Natural earthy gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5D866C] via-[#C2A68C] to-[#E6D8C3]" />
        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-6">
            <h1 className="text-7xl md:text-8xl font-bold mb-4 drop-shadow-2xl">
              Bên Rìa Thế Giới
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-lg opacity-90">
              Những suy nghĩ văn học và viết lách sáng tạo
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}