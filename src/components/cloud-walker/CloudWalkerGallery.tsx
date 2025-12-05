'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParallaxScrollContainer from './ParallaxScrollContainer';
import VideoModal from './VideoModal';
import type { VideoCardVideo } from './VideoCard';
import { duplicateVideosForInfiniteScroll, type DuplicatedVideo } from '@/lib/videoDuplication';

interface CloudWalkerGalleryProps {
  videos: VideoCardVideo[];
  isLoading?: boolean;
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="flex gap-4 md:gap-6 lg:gap-8 px-4 md:px-8 lg:px-12 py-8">
      {/* Left column skeletons */}
      <div className="flex-1 flex flex-col gap-4 md:gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={`left-${i}`}
            className="aspect-[3/4] bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
      {/* Right column skeletons */}
      <div className="flex-1 flex flex-col gap-4 md:gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={`right-${i}`}
            className="aspect-[3/4] bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
    >
      <div className="w-24 h-24 mb-6 rounded-full bg-gray-800 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h2 className="text-xl md:text-2xl font-medium text-white mb-2">
        Chưa có video nào
      </h2>
      <p className="text-gray-400 max-w-md">
        Hãy quay lại sau để xem những video mới nhất.
      </p>
    </motion.div>
  );
}

export default function CloudWalkerGallery({ videos, isLoading = false }: CloudWalkerGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoCardVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Duplicate videos for infinite scroll effect (minimum 20 items for better coverage)
  const duplicatedVideos = useMemo(() => {
    return duplicateVideosForInfiniteScroll(videos, 20);
  }, [videos]);

  // Split duplicated videos into left and right columns for desktop parallax effect
  // Alternating distribution: even indices go left, odd indices go right
  const { leftColumnVideos, rightColumnVideos } = useMemo(() => {
    const left: DuplicatedVideo[] = [];
    const right: DuplicatedVideo[] = [];

    duplicatedVideos.forEach((video, index) => {
      if (index % 2 === 0) {
        left.push(video);
      } else {
        right.push(video);
      }
    });

    return { leftColumnVideos: left, rightColumnVideos: right };
  }, [duplicatedVideos]);

  const handleVideoSelect = useCallback((video: VideoCardVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  }, []);

  return (
    <div className="min-h-screen bg-black" data-testid="cloud-walker-gallery">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSkeleton />
          </motion.div>
        ) : videos.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ParallaxScrollContainer
              leftColumnVideos={leftColumnVideos}
              rightColumnVideos={rightColumnVideos}
              onVideoSelect={handleVideoSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}