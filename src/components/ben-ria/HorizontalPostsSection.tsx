'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PostCard from './PostCard';
import type { Post } from '@/lib/sanity';

interface HorizontalPostsSectionProps {
  posts: Post[];
}

export default function HorizontalPostsSection({ posts }: HorizontalPostsSectionProps) {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(['0%', '-100%']); // Initial fallback

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  useEffect(() => {
    const updateRange = () => {
      if (cardsRef.current) {
        const scrollWidth = cardsRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const totalTranslate = scrollWidth - viewportWidth;

        // Ensure we scroll enough to see the end, adding a bit of padding buffer
        setRange(['0px', `-${totalTranslate + 48}px`]);
      }
    };

    // Update initially and on resize
    updateRange();
    window.addEventListener('resize', updateRange);

    // Also update when posts change (though they likely won't in this client component)
    return () => window.removeEventListener('resize', updateRange);
  }, [posts]);

  const x = useTransform(scrollYProgress, [0, 1], range);

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <p className="text-xl text-[#5D866C]">Chưa có bài viết nào. Hãy quay lại sau nhé!</p>
      </div>
    );
  }

  return (
    <div ref={container} className="relative h-[300vh] bg-[#F5F5F0]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full">
          <div className="mb-12 px-6 md:px-12">
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-4">
              Bài Viết Mới Nhất
            </h2>
            <p className="text-xl text-black/70">
              Khám phá những câu chuyện và suy nghĩ mới
            </p>
          </div>

          <motion.div
            ref={cardsRef}
            style={{ x }}
            className="flex gap-8 px-6 md:px-12 w-max"
          >
            {/* Duplicate posts for seamless scrolling effect */}
            {[...posts, ...posts].map((post, index) => (
              <div
                key={`${post._id}-${index}`}
                className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw]"
              >
                <PostCard post={post} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}