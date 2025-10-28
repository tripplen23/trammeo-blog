'use client';

import { useRef, useEffect } from 'react';

export default function MaskAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const stickyMask = useRef<HTMLDivElement>(null);

  const initialMaskSize = 0.5;
  const targetMaskSize = 20;
  const easing = 0.15;
  let easedScrollProgress = 0;

  const getScrollProgress = () => {
    if (!stickyMask.current || !container.current) return 0;
    
    const scrollProgress =
      stickyMask.current.offsetTop /
      (container.current.getBoundingClientRect().height - window.innerHeight);
    const delta = scrollProgress - easedScrollProgress;
    easedScrollProgress += delta * easing;
    return easedScrollProgress;
  };

  const animate = () => {
    const maskSizeProgress = targetMaskSize * getScrollProgress();
    if (stickyMask.current) {
      stickyMask.current.style.webkitMaskSize = (initialMaskSize + maskSizeProgress) * 100 + '%';
    }
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mb-[100vh]">
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
          <video autoPlay muted loop className="h-full w-full object-cover">
            <source src="/medias/flow-intro.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </main>
  );
}