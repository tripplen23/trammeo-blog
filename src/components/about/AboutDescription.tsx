'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

const phrases = [
  'Ở Phần Lan tại thành phố Turku,',
  'có một cô gái nhỏ người Sài Gòn',
  'mang trong mình dòng máu Việt Nam,',
  'tên là Trammeo.',
  'Cô sống giữa hương cà phê, ',
  'một đời tự do và những câu chuyện chưa kể.',
  'Nhiều vị khách quen thường nói,',
  'cô luôn mỉm cười với cuộc đời,',
  'dù chỉ là trong những điều nhỏ nhất.',
];

export default function AboutDescription() {
  return (
    <div className="relative text-white text-[2.4vw] uppercase mt-[30vw] pb-[50vh] ml-[30vw]">
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