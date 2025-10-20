'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion, type MotionValue } from 'framer-motion';
import Image from 'next/image';
import ProjectGallery from './ProjectGallery';

interface AboutExploreMoreProps {
  children: React.ReactNode;
}

export default function AboutExploreMore({ children }: AboutExploreMoreProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={container} className="relative h-[200vh]">
      <StorySection scrollYProgress={scrollYProgress}>{children}</StorySection>
      <FinalSection scrollYProgress={scrollYProgress} />
    </div>
  );
}

interface SectionProps {
  scrollYProgress: MotionValue<number>;
  children?: React.ReactNode;
}

const StorySection = ({ scrollYProgress, children }: SectionProps) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.div
      style={{ scale, rotate }}
      className="sticky top-0 h-screen"
    >
      {children}
    </motion.div>
  );
};

const FinalSection = ({ scrollYProgress }: SectionProps) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  return (
    <motion.div
      style={{ scale, rotate }}
      className="relative h-screen"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/intro.webp"
          alt="Final section background"
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-[10%] z-10">
        <h2 className="text-[4vw] font-bold text-center drop-shadow-lg">
            Khám phá thêm về Trammeo
        </h2>
        <br/>
        <br/>
        {/* Project Gallery */}
        <ProjectGallery />
      </div>
    </motion.div>
  );
};