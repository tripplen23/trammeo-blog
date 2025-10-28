'use client';

import { RefObject, useRef } from 'react';
import { useScroll, useTransform, motion, type MotionValue } from 'framer-motion';
import Image from 'next/image';

export default function AboutExploreMore() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container as RefObject<HTMLElement>,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={container} className="relative h-[200vh]">
      <StorySection scrollYProgress={scrollYProgress} />
      <FinalSection scrollYProgress={scrollYProgress} />
    </div>
  );
}

interface SectionProps {
  scrollYProgress: MotionValue<number>;
}

const StorySection = ({ scrollYProgress }: SectionProps) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.div
      style={{ scale, rotate }}
      // @ts-expect-error - framer-motion v12 type inference issue with className
      className="sticky top-0 h-screen"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/benria-bg.webp"
          alt="Story section background"
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-[10%] z-10">
        <h2 className="text-[2.5vw] font-bold text-center drop-shadow-lg">
          Một khoảng không nhỏ, nơi một trái tim vẫn có nhịp đập, vẫn còn ấm áp, hiện hữu và vẫn còn tin vào những điều kỳ diệu nhỏ bé giữa cuộc sống rộng lớn này,
        </h2>
      </div>
    </motion.div>
  );
};

const FinalSection = ({ scrollYProgress }: SectionProps) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  return (
    <motion.div
      style={{ scale, rotate }}
      // @ts-expect-error - framer-motion v12 type inference issue with className
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
        <h2 className="text-[2vw] font-bold text-center drop-shadow-lg">
          “Tôi tin rằng, yêu là để cho đi, không cần phải để nhận lại gì cả, mà để trái tim mình hiểu rằng nó đã sống một đời ý nghĩa. Đó là cách tôi yêu cuộc sống này, trong đó, có bạn.” - Trammeo

        </h2>
      </div>
    </motion.div>
  );
};