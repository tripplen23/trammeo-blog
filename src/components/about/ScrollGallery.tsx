'use client';

import { motion, useSpring } from 'framer-motion';
import Image from 'next/image';

interface GalleryItemProps {
  mousePosition: {
    x: any;
    y: any;
  };
  backgroundImage: string;
  vignetteImage: string;
}

function GalleryItem({ mousePosition, backgroundImage, vignetteImage }: GalleryItemProps) {
  const { x, y } = mousePosition;

  return (
    <div className="h-[120vh] [clip-path:polygon(0_0,0_100%,100%_100%,100%_0)]">
      {/* Background Image */}
      <div className="w-full h-full relative">
        <Image
          src={backgroundImage}
          alt="background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Vignette - Following Mouse */}
      <motion.div
        className="h-[30vw] w-[25vw] fixed top-0 rounded-[1.5vw] overflow-hidden pointer-events-none z-10"
        style={{ x, y }}
      >
        <Image
          src={vignetteImage}
          alt="vignette"
          fill
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}

interface ScrollGalleryProps {
  items?: Array<{
    background: string;
    vignette: string;
  }>;
}

export default function ScrollGallery({ items }: ScrollGalleryProps) {

  const spring = {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  };

  const springX = useSpring(0, spring);
  const springY = useSpring(0, spring);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const targetX = clientX - (window.innerWidth / 2) * 0.25;
    const targetY = clientY - (window.innerWidth / 2) * 0.30;
    springX.set(targetX);
    springY.set(targetY);
  };

  // Default items using available images
  const defaultItems = [
    {
      background: '/images/bg1.webp',
      vignette: '/images/image6.webp',
    },
    {
      background: '/images/bg2.webp',
      vignette: '/images/image7.webp',
    },
    {
      background: '/images/bg3.webp',
      vignette: '/images/image5.webp',
    },
  ];

  const galleryItems = items || defaultItems;

  return (
    <div onMouseMove={handleMouseMove} className="relative">
      {galleryItems.map((item, index) => (
        <GalleryItem
          key={index}
          mousePosition={{ x: springX, y: springY }}
          backgroundImage={item.background}
          vignetteImage={item.vignette}
        />
      ))}
    </div>
  );
}

