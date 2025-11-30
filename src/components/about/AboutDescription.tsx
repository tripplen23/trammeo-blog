'use client';

import React, { useLayoutEffect, useRef, useMemo } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';

// Register GSAP ScrollTrigger plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutDescription() {
  const t = useTranslations('about.descriptionPhrases');

  const phrases = useMemo(() => [
    t('line1'),
    t('line2'),
    t('line3'),
    t('line4'),
    t('line5'),
    t('line6'),
    t('line7'),
  ], [t]);

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
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useLayoutEffect(() => {
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
        markers: false,
      },
      opacity: 1,
      x: 0,
      ease: 'power3.out',
    });

    animationRef.current = animation;

    // Store ScrollTrigger reference
    const triggers = ScrollTrigger.getAll();
    scrollTriggerRef.current = triggers.find(t => t.trigger === element) || null;

    // Cleanup function to prevent memory leaks
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill(true);
        scrollTriggerRef.current = null;
      }

      // Additional cleanup
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill(true);
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