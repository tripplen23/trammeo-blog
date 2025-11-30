'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function IntroHero() {
  const t = useTranslations('benRia');
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "150vh"]);

  return (
    <div ref={container} className='h-screen overflow-hidden relative'>
      <motion.div style={{ y }} className='relative h-full'>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/benria-bg.webp"
            fill
            alt="Bên Rìa Thế Giới Background"
            className="object-cover"
            priority
            quality={90}
            objectPosition="center 65%"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-6">
            <h1 className="text-7xl md:text-7xl font-bold mb-2 drop-shadow-2xl">
              {t('introHero.header')}
            </h1>
            <h3 className="text-2xl md:text-2xl font-bold mb-4 drop-shadow-2xl">
              {t('introHero.subheader')}
            </h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
}