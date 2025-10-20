'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

const descriptions = [
  '"Tôi hay ví cuộc sống mình như một chuyến tàu, \n tới trạm dừng chân, sẽ có người lên, xuống và ở lại. Việc của tôi là trưởng tàu của chính đời mình: mong mang lại bình yên, tình yêu và cả một trái tim nhiệt huyết, để những ai vô tình chạm, cảm và lắng nghe; ít nhiều, họ cũng thấy được cuộc sống này thật đẹp, trên chuyến tàu của tôi." - Trammeo',
];

export default function AboutStory() {
  const container = useRef<HTMLDivElement>(null);
  const imageContainer = useRef<HTMLDivElement>(null);

  return (
    <div ref={container} className="relative text-white h-screen flex items-center p-[10%] bg-black">
      <div className="flex h-[700px] justify-between gap-[5%] w-full">
        <div 
          ref={imageContainer} 
          className={`relative h-full w-[40%] bg-gradient-to-br transition-all duration-500 rounded-lg`}
        >
        <Image 
            src={'/images/image1.webp'}
            fill={true}
            alt="background image"
            priority={true}
            className="object-cover"
        />
        </div>
        <div className="flex h-full w-[50%] text-[1.8vw]">
          <p>{descriptions[0]}</p>
        </div>
      </div>
    </div>
  );
}

