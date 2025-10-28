'use client';

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { useRef, useMemo, RefObject } from 'react';
import Image from 'next/image';

interface Picture {
  src: string;
  scale: MotionValue<number>;
  position: {
    top?: string;
    left?: string;
    width: string;
    height: string;
  };
}

export default function ZoomParallax() {
  const container = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container as RefObject<HTMLElement>,
    offset: ['start start', 'end end']
  });

  // Reduced scale values for better performance
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 3]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 3.5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 5.5]);

  const pictures: Picture[] = useMemo(() => [
    {
      src: '/images/aurora.webp',
      scale: scale4,
      position: {
        width: '25vw',
        height: '25vh',
      }
    },
    {
        src: '/images/sky.webp',
        scale: scale5,
        position: {
        top: '-30vh',
        left: '5vw',
        width: '35vw',
        height: '30vh',
      }
    },
    {
      src: '/images/buildingdoc.webp',
      scale: scale6,
      position: {
        top: '-10vh',
        left: '-25vw',
        width: '20vw',
        height: '45vh',
      }
    },
    {
      src: '/images/temple.webp',
      scale: scale5,
      position: {
        left: '27.5vw',
        width: '25vw',
        height: '25vh',
      }
    },
    {
      src: '/images/view.webp',
      scale: scale6,
      position: {
        top: '27.5vh',
        left: '5vw',
        width: '20vw',
        height: '25vh',
      }
    },
    {
      src: '/images/ruong.webp',
      scale: scale8,
      position: {
        top: '27.5vh',
        left: '-22.5vw',
        width: '30vw',
        height: '25vh',
      }
    },
    {
      src: '/images/image7.webp',
      scale: scale9,
      position: {
        top: '22.5vh',
        left: '25vw',
        width: '15vw',
      height: '15vh',
    }
  }
  ], [scale4, scale5, scale6, scale8, scale9]);

  return (
    <div ref={container} className="h-[200vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#F5F5F0]">
        {pictures.map((picture, index) => (
          <motion.div
            key={index}
            style={{ 
              scale: picture.scale,
              willChange: 'transform'
            }}
            className="w-full h-full absolute top-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="relative will-change-transform"
              style={{
                top: picture.position.top,
                left: picture.position.left,
                width: picture.position.width,
                height: picture.position.height,
              }}
            >
              <Image
                src={picture.src}
                fill
                alt={`Parallax image ${index + 1}`}
                className="object-cover rounded-lg"
                priority={index < 2}
                loading={index >= 2 ? 'lazy' : undefined}
                quality={75}
                sizes="(max-width: 768px) 50vw, 35vw"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

