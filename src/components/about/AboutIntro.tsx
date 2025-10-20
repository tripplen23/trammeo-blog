'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

export default function AboutIntro() {
  const background = useRef<HTMLDivElement>(null);
  const introImage = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: true,
        start: 'top',
        end: '+=500px',
      },
    });

    timeline
      .from(background.current, { clipPath: `inset(15%)` })
      .to(introImage.current, { height: '200px' }, 0);
  }, []);

  return (
    <div className="relative w-full flex justify-center">
      <div
        ref={background}
        className="w-full h-[140vh] absolute brightness-[0.6] overflow-hidden"
      >
        <Image 
            src={'/images/background.webp'}
            fill={true}
            alt="background image"
            priority={true}
            className="object-cover"
        />
      </div>
      <div className="flex justify-center items-center relative h-screen">
        <div
          ref={introImage}
          data-scroll
          data-scroll-speed="0.3"
          className="brightness-[0.7] w-[350px] h-[475px] absolute"
        >
          <Image
            src={'/images/intro.webp'}
            alt="intro image"
            fill={true} 
            priority={true}
            className="object-cover"
          />
        </div>
        <h1
          data-scroll
          data-scroll-speed="0.7"
          className="text-white text-[3vw] z-[3]  whitespace-nowrap"
        >
          About me, 
        </h1>
      </div>
    </div>
  );
}

