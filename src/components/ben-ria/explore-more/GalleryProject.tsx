'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface GalleryProjectProps {
  title: string;
  description?: string;
  route: string;
}

export default function GalleryProject({ 
  title, 
  description = 'Design & Development',
  route,
}: GalleryProjectProps) {
  return (
    <Link href={route} className="block">
      <div
        className="flex w-full justify-between items-center px-8 md:px-16 lg:px-24 py-8 md:py-12 border-t border-white/20 cursor-pointer transition-all duration-200 hover:opacity-50 group"
      >
        <h3 className="text-3xl md:text-5xl lg:text-6xl font-normal m-0 transition-all duration-400 group-hover:-translate-x-2">
          {title}
        </h3>
        <p className="transition-all duration-400 font-light text-sm md:text-base group-hover:translate-x-2">
          {description}
        </p>
      </div>
    </Link>
  );
}

