'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

const phrases = [
  '"Tôi hay ví cuộc sống mình như một chuyến tàu,',
  'tới trạm dừng chân, sẽ có người lên, xuống và ở lại.',
  'Việc của tôi là trưởng con tàu của cuộc đời mình:',
  'tử tế, tình yêu, và biết ơn là kim chỉ nam',
  'để những ai vô tình chạm, cảm và lắng nghe;',
  'ít nhiều, họ cũng thấy được cuộc sống này thật đẹp,',
  'trên chuyến tàu của tôi" - Trammeo'
];

export default function AboutDescription() {
  return (
    <div className="relative text-white text-[4vw] md:text-[2.4vw] uppercase mt-[30vw] pb-[50vh] ml-[8vw] md:ml-[18vw]">
      {phrases.map((phrase, index) => {
        return <AnimatedText key={index}>{phrase}</AnimatedText>;
      })}
    </div>
  );
}

function AnimatedText({ children }: { children: string }) {
  const text = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const element = text.current;
    if (!element) return;

    // Set initial state
    gsap.set(element, {
      opacity: 0,
      x: -200,
    });

    // Create animation
    const animation = gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        scrub: true,
        start: 'top bottom',
        end: 'bottom+=400px bottom',
        markers: false, // Set to true for debugging
      },
      opacity: 1,
      x: 0,
      ease: 'power3.out',
    });

    // Cleanup function to prevent memory leaks and rerendering issues
    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <p ref={text} className="ml-0 relative">
      {children}
    </p>
  );
}