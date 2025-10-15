'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PostCard from './PostCard';
import type { Post } from '@/lib/sanity';

interface HorizontalPostsSectionProps {
  posts: Post[];
}

export default function HorizontalPostsSection({ posts }: HorizontalPostsSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <p className="text-xl text-betheflow">Chưa có bài viết nào. Hãy quay lại sau nhé! ☕</p>
      </div>
    );
  }

  // Render without animation during SSR
  if (!isMounted) {
    return (
      <div className="relative h-[150vh] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="w-full">
            <div className="mb-12 px-6 md:px-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl">☕</span>
                <h2 className="text-5xl md:text-6xl font-bold text-betheflow">
                  Góc Thư Giãn
                </h2>
              </div>
              <p className="text-xl text-amber-700/70 ml-20">
                Những câu chuyện đời thường, ngẫu nhiên và thoải mái
              </p>
            </div>
            
            <div className="flex gap-8 px-6 md:px-12">
              {[...posts, ...posts].map((post, index) => (
                <div 
                  key={`${post._id}-${index}`}
                  className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw]"
                >
                  <PostCard post={post} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <AnimatedSection posts={posts} />;
}

// Separate component for animated version that only renders client-side
function AnimatedSection({ posts }: HorizontalPostsSectionProps) {
  const container = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  return (
    <div ref={container} className="relative h-[150vh] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full">
          <div className="mb-12 px-6 md:px-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">☕</span>
              <h2 className="text-5xl md:text-6xl font-bold text-betheflow">
                Góc Thư Giãn
              </h2>
            </div>
            <p className="text-xl text-amber-700/70 ml-20">
              Những câu chuyện đời thường, ngẫu nhiên và thoải mái
            </p>
          </div>
          
          <motion.div 
            style={{ x }}
            className="flex gap-8 px-6 md:px-12"
          >
            {/* Duplicate posts for seamless scrolling effect */}
            {[...posts, ...posts].map((post, index) => (
              <div 
                key={`${post._id}-${index}`}
                className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw]"
              >
                <PostCard post={post} index={index} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

