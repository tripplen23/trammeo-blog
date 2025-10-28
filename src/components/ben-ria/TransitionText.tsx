"use client";

import React, { useEffect, useRef } from 'react';

interface TransitionTextProps {
  title?: string | string[];
  lines: string[];
}

const TransitionText: React.FC<TransitionTextProps> = ({ title, lines }) => {
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-30% 0px -30% 0px', // Reduces the effective viewport height
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target instanceof HTMLElement) {
          // More aggressive fade curve
          const normalizedRatio = Math.max(0, (entry.intersectionRatio - 0.3) / 0.4);
          const opacity = 0.1 + (Math.pow(normalizedRatio, 4) * 0.9);
          entry.target.style.opacity = opacity.toString();
        }
      });
    }, options);

    // Store refs in a variable inside the effect
    const currentRefs = lineRefs.current;
    currentRefs.forEach((line) => {
      if (line) observer.observe(line);
    });

    return () => {
      currentRefs.forEach((line) => {
        if (line) observer.unobserve(line);
      });
    };
  }, []);

  return (
    <section className="w-full py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-[var(--color-gradient-start)] via-primary to-[var(--color-gradient-end)] text-transparent bg-clip-text">
          {Array.isArray(title) ? (
            <div className="flex flex-col items-center gap-2 sm:gap-4">
              {title.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          ) : (
            title
          )}
        </h2>
        <div ref={containerRef} className="space-y-4 sm:space-y-6 md:space-y-8">
          {lines.map((line, index) => (
            <p
              key={index}
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
              className="ml-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white transition-opacity duration-700"
              style={{ opacity: 0.1 }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransitionText; 