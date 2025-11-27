'use client';

import { useRef, useEffect } from 'react';

export default function MaskAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const stickyMask = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const easedScrollProgressRef = useRef(0);

  const initialMaskSize = 0.5;
  const targetMaskSize = 20;
  const easing = 0.15;

  useEffect(() => {
    const getScrollProgress = () => {
      if (!stickyMask.current || !container.current) return 0;

      const scrollProgress =
        stickyMask.current.offsetTop /
        (container.current.getBoundingClientRect().height - window.innerHeight);
      const delta = scrollProgress - easedScrollProgressRef.current;
      easedScrollProgressRef.current += delta * easing;
      return easedScrollProgressRef.current;
    };

    const animate = () => {
      if (!stickyMask.current) return;

      const maskSizeProgress = targetMaskSize * getScrollProgress();
      const newSize = (initialMaskSize + maskSizeProgress) * 100 + '%';
      
      // Only update if value changed significantly (reduce repaints)
      if (stickyMask.current.style.webkitMaskSize !== newSize) {
        stickyMask.current.style.webkitMaskSize = newSize;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  return (
    <main>
      <div ref={container} className="relative h-[300vh] bg-white">
        <div
          ref={stickyMask}
          className="flex overflow-hidden sticky top-0 h-screen items-center justify-center"
          style={{
            maskImage: "url('/medias/mask.svg')",
            maskPosition: '52.35% center',
            maskRepeat: 'no-repeat',
            maskSize: '80%',
            WebkitMaskImage: "url('/medias/mask.svg')",
            WebkitMaskPosition: '52.35% center',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: '80%',
          }}
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          >
            <source src="/medias/flow-intro.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </main>
  );
}