'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ProjectGallery from './ProjectGallery';

export default function AboutExploreMore() {
  const t = useTranslations('about');
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  return (
    <div ref={container} className="relative h-screen w-full overflow-hidden bg-black">
      <motion.div
        style={{ scale, rotate, opacity }}
        className="relative w-full h-full"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/intro.webp"
            alt="Final section background"
            fill
            className="object-cover"
            loading="lazy"
            quality={85}
            sizes="100vw"
          />
        </div>

        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-[10%] z-10">
          <h2 className="text-[4vw] font-bold text-center drop-shadow-lg">
            {t('exploreMore.title')}
          </h2>
          <br />
          <br />
          {/* Project Gallery */}
          <ProjectGallery />
        </div>
      </motion.div>
    </div>
  );
}