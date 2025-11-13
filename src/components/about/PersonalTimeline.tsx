'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// TypeScript interfaces
interface TimelineData {
  year: string | number;
  title: string;
  description: string;
  images?: string[];
  position?: 'left' | 'right';
}

interface PersonalTimelineProps {
  items?: TimelineData[];
}

interface TimelineItemProps {
  data: TimelineData;
  index: number;
}

interface YearMarkerProps {
  year: string | number;
  position: 'left' | 'right';
}

interface ContentPanelProps {
  title: string;
  description: string;
  images?: string[];
}

interface MediaGalleryProps {
  images: string[];
}

// YearMarker component
function YearMarker({ year, position }: YearMarkerProps) {
  return (
    <div className="absolute left-1/2 top-0 -translate-x-1/2 flex items-center md:flex hidden">
      {/* Horizontal connector line - left side */}
      {position === 'left' && (
        <div className="w-[calc(50vw-2rem)] h-[2px] bg-white/20" />
      )}
      
      {/* Year display and circle indicator */}
      <div className="flex flex-col items-center gap-2 px-4">
        <div className="text-[4vw] md:text-[2.5vw] font-bold whitespace-nowrap">
          {year}
        </div>
        <div className="w-4 h-4 rounded-full bg-white" />
      </div>
      
      {/* Horizontal connector line - right side */}
      {position === 'right' && (
        <div className="w-[calc(50vw-2rem)] h-[2px] bg-white/20" />
      )}
    </div>
  );
}

// Mobile YearMarker component
function MobileYearMarker({ year }: { year: string | number }) {
  return (
    <div className="absolute left-8 top-0 -translate-x-1/2 flex items-center md:hidden">
      {/* Circle indicator */}
      <div className="w-4 h-4 rounded-full bg-white" />
      
      {/* Horizontal connector line */}
      <div className="w-12 h-[2px] bg-white/20" />
      
      {/* Year display */}
      <div className="text-[4vw] font-bold ml-2">
        {year}
      </div>
    </div>
  );
}

// MediaGallery component
function MediaGallery({ images }: MediaGalleryProps) {
  // Handle empty or undefined images array
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 md:gap-4 mt-4 md:mt-6 overflow-x-auto scrollbar-hide touch-pan-x">
      {images.map((imageSrc, index) => (
        <div
          key={index}
          className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] relative flex-shrink-0 transition-transform duration-300 md:hover:scale-110"
        >
          <Image
            src={imageSrc}
            alt={`Timeline image ${index + 1}`}
            fill
            className="object-cover rounded-md"
            loading="lazy"
            sizes="(max-width: 768px) 100px, 120px"
          />
        </div>
      ))}
    </div>
  );
}

// ContentPanel component
function ContentPanel({ title, description, images }: ContentPanelProps) {
  // Handle multiline descriptions by splitting on \n
  const descriptionLines = description ? description.split('\n') : [];
  
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg max-w-full sm:max-w-[450px] md:max-w-[500px]">
      {/* Milestone title */}
      <h3 className="text-xl sm:text-2xl md:text-[2rem] font-semibold mb-3 md:mb-4">
        {title}
      </h3>
      
      {/* Description with proper line breaks - only render if description exists */}
      {description && description.trim() !== '' && (
        <div className="text-sm sm:text-base md:text-[1.2rem] leading-relaxed opacity-80">
          {descriptionLines.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < descriptionLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      )}
      
      {/* Media Gallery */}
      {images && images.length > 0 && <MediaGallery images={images} />}
    </div>
  );
}

// TimelineItem component
function TimelineItem({ data }: TimelineItemProps) {
  const position = data.position || 'left';
  const itemRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  
  useLayoutEffect(() => {
    if (!itemRef.current) return;
    
    const element = itemRef.current;
    
    // Set initial animation state based on position
    const initialX = position === 'left' ? -100 : 100;
    
    gsap.set(element, {
      opacity: 0,
      x: initialX,
    });
    
    // Create ScrollTrigger animation
    const animation = gsap.to(element, {
      opacity: 1,
      x: 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 30%',
        scrub: true,
        onEnter: () => {
          // Store reference to ScrollTrigger instance
          const triggers = ScrollTrigger.getAll();
          scrollTriggerRef.current = triggers.find(t => t.trigger === element) || null;
        },
      },
    });
    
    // Cleanup function to kill animations and remove ScrollTrigger instances
    return () => {
      // Kill the GSAP animation
      if (animation) {
        animation.kill();
      }
      
      // Kill the specific ScrollTrigger instance for this element
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill(true);
        scrollTriggerRef.current = null;
      }
      
      // Additional safety: find and kill any remaining ScrollTriggers for this element
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill(true);
        }
      });
      
      // Clear any inline styles set by GSAP to prevent style leaks
      gsap.set(element, { clearProps: 'all' });
    };
  }, [position]);
  
  return (
    <div ref={itemRef} className="relative mb-[15vh] last:mb-0">
      {/* Year marker for desktop */}
      <YearMarker year={data.year} position={position} />
      
      {/* Year marker for mobile */}
      <MobileYearMarker year={data.year} />
      
      {/* Content area */}
      <div className={`
        relative
        ${position === 'left' ? 'md:pr-[50%]' : 'md:pl-[50%]'}
        md:flex
        ${position === 'left' ? 'md:justify-end' : 'md:justify-start'}
      `}>
        <div className="pl-12 md:pl-0">
          <ContentPanel 
            title={data.title} 
            description={data.description}
            images={data.images}
          />
        </div>
      </div>
    </div>
  );
}

// Default timeline data
const defaultTimelineData: TimelineData[] = [
  {
    year: 2011,
    title: 'began modelling',
    description: 'top 10 of X Gen Competition\n2nd place in the Lambretta Model Competition\nfashion influencer of Iwer World Young Woman Achiever 2016\nfeatured on various well-known magazine covers, including Rep, ELLE Vietnam, L\'OFFICIEL, Harper\'s Bazaar, and more',
    images: ['/images/timeline/2011-1.jpg'],
  },
  {
    year: 2013,
    title: 'had her first businesses',
    description: 'Heverly Fashion Brand - Heverly Vegan Restaurant\n\nIn 2013, Helly launched Heverly, combining her love for veganism and minimal, elegant fashion.\n\nShe opened a chic vegan restaurant celebrated for its innovative dishes and created a clothing line that embodies simplicity and style. Helly\'s commitment to ethical practices inspires others to embrace a compassionate lifestyle through both food and fashion.',
    images: [
      '/images/timeline/2013-1.jpg',
      '/images/timeline/2013-2.jpg',
      '/images/timeline/2013-3.jpg',
    ],
  },
  {
    year: 2016,
    title: 'Founded The Yen Concept',
    description: 'Inspired by the belief that true happiness comes from within, Helly envisioned The Yen Concept as a sanctuary where individuals can find balance and rejuvenate their spirits after a busy day. The space promotes tranquility and positive energy, reflecting Helly\'s vision of a more harmonious and sustainable world, through green-oriented products and solutions.',
    images: [
      '/images/timeline/2016-1.jpg',
      '/images/timeline/2016-2.jpg',
      '/images/timeline/2016-3.jpg',
      '/images/timeline/2016-4.jpg',
    ],
  },
  {
    year: 2018,
    title: 'Yen Space in 2016',
    description: 'Installation in Indigo Store in Hochiminh City, Vietnam',
    images: [
      '/images/timeline/2018-1.jpg',
      '/images/timeline/2018-2.jpg',
      '/images/timeline/2018-3.jpg',
    ],
  },
];

export default function PersonalTimeline({ items = defaultTimelineData }: PersonalTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Validate and filter timeline items
  const validatedItems = React.useMemo(() => {
    return items.filter((item, index) => {
      // Validate required year property
      if (!item.year && item.year !== 0) {
        console.warn(`Timeline item at index ${index} is missing required 'year' property and will be skipped.`, item);
        return false;
      }
      
      // Validate year is a valid number or string that can be converted to a number
      const yearNum = Number(item.year);
      if (isNaN(yearNum)) {
        console.warn(`Timeline item at index ${index} has invalid 'year' value: "${item.year}". Must be a number or numeric string. Item will be skipped.`, item);
        return false;
      }
      
      return true;
    }).map((item) => {
      // Handle missing optional properties
      const validatedItem = { ...item };
      
      // Add fallback text for missing title
      if (!validatedItem.title || validatedItem.title.trim() === '') {
        console.warn(`Timeline item for year ${item.year} is missing 'title'. Using fallback text.`);
        validatedItem.title = 'Untitled Milestone';
      }
      
      // Handle missing description
      if (!validatedItem.description || validatedItem.description.trim() === '') {
        console.warn(`Timeline item for year ${item.year} is missing 'description'. Using empty string.`);
        validatedItem.description = '';
      }
      
      // Handle invalid images array
      if (validatedItem.images && !Array.isArray(validatedItem.images)) {
        console.warn(`Timeline item for year ${item.year} has invalid 'images' property (not an array). Removing images.`);
        validatedItem.images = undefined;
      } else if (validatedItem.images && validatedItem.images.length > 0) {
        // Filter out invalid image paths (empty strings or non-strings)
        const validImages = validatedItem.images.filter((img) => {
          if (typeof img !== 'string' || img.trim() === '') {
            console.warn(`Timeline item for year ${item.year} contains invalid image path. Removing invalid image.`);
            return false;
          }
          return true;
        });
        validatedItem.images = validImages.length > 0 ? validImages : undefined;
      }
      
      return validatedItem;
    });
  }, [items]);
  
  // Sort timeline items chronologically by year
  const sortedItems = React.useMemo(() => {
    return [...validatedItems].sort((a, b) => Number(a.year) - Number(b.year));
  }, [validatedItems]);

  // Calculate alternating left/right positions
  const itemsWithPositions = React.useMemo(() => {
    return sortedItems.map((item, index) => ({
      ...item,
      position: item.position || (index % 2 === 0 ? 'left' : 'right'),
    }));
  }, [sortedItems]);

  // Global cleanup effect for the entire timeline component
  useLayoutEffect(() => {
    // Update ScrollTrigger on mount to ensure proper integration with SmoothScroll (Lenis)
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    
    // Cleanup function to ensure all ScrollTriggers are removed on unmount
    return () => {
      clearTimeout(timeoutId);
      
      if (containerRef.current) {
        // Find and kill all ScrollTriggers within this container
        const allTriggers = ScrollTrigger.getAll();
        allTriggers.forEach((trigger) => {
          if (containerRef.current?.contains(trigger.trigger as Node)) {
            trigger.kill(true);
          }
        });
      }
      
      // Refresh ScrollTrigger to recalculate positions after cleanup
      // This ensures proper cleanup when working with SmoothScroll (Lenis)
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white py-[20vh]">
      {/* Vertical timeline axis line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/20 -translate-x-1/2 hidden md:block" />
      
      {/* Mobile timeline axis (left-aligned) */}
      <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-white/20 md:hidden" />
      
      <div className="container mx-auto px-4">
        {itemsWithPositions.map((item, index) => (
          <TimelineItem
            key={`${item.year}-${index}`}
            data={item}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
