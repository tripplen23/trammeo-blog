'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { urlForImage } from '@/lib/sanity';

// Video type matching Sanity schema
export interface VideoCardVideo {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail: {
    asset: {
      _ref: string;
      _type?: string;
    };
  };
  publishedAt?: string;
}

interface VideoCardProps {
  video: VideoCardVideo;
  onClick?: (video: VideoCardVideo) => void;
  onSelect?: (video: VideoCardVideo) => void;
  priority?: boolean;
}

export default function VideoCard({ 
  video, 
  onClick, 
  onSelect,
  priority = false,
}: VideoCardProps) {
  // Support both onClick and onSelect for backwards compatibility
  const handleVideoClick = onClick || onSelect;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, ignore error
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleClick = useCallback(() => {
    handleVideoClick?.(video);
  }, [handleVideoClick, video]);

  // Use 16:9 aspect ratio for horizontal thumbnails
  const thumbnailUrl = urlForImage(video.thumbnail)
    .width(800)
    .height(450)
    .url();

  return (
    <motion.div
      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      data-testid="video-card"
    >
      {/* Thumbnail Image */}
      <Image
        src={thumbnailUrl}
        alt={video.title}
        fill
        className={`object-cover transition-opacity duration-300 ${
          isHovered && videoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        sizes="(max-width: 768px) 50vw, 33vw"
        priority={priority}
      />

      {/* Video Preview on Hover */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isHovered && videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        loop
        playsInline
        preload="none"
        onLoadedData={() => setVideoLoaded(true)}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white text-sm md:text-base font-medium line-clamp-2">
          {video.title}
        </h3>
      </div>
    </motion.div>
  );
}
