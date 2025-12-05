'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import type { VideoCardVideo } from './VideoCard';

interface VideoModalProps {
  video: VideoCardVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle Escape key to close modal
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Add/remove escape key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // Reset state and stop video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    // Reset error and loading state when modal opens/closes
    if (isOpen) {
      setVideoError(false);
      setIsLoading(true);
    }
  }, [isOpen]);

  // Handle video error
  const handleVideoError = useCallback(() => {
    setVideoError(true);
    setIsLoading(false);
  }, []);

  // Handle video loaded
  const handleVideoLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!video) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
          data-testid="video-modal-backdrop"
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-4xl mx-4"
            data-testid="video-modal-content"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
              data-testid="video-modal-close"
            >
              <X size={28} />
            </button>

            {/* Video container */}
            <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
              {/* Loading indicator */}
              {isLoading && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* Error state */}
              {videoError ? (
                <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-900 text-white">
                  <AlertCircle size={48} className="text-red-400 mb-4" />
                  <p className="text-lg font-medium">Video không thể phát</p>
                  <p className="text-sm text-gray-400 mt-2">Vui lòng thử lại sau</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  controls
                  playsInline
                  preload="auto"
                  className="w-full aspect-video"
                  data-testid="video-modal-player"
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoaded}
                  onCanPlay={handleVideoLoaded}
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Video info */}
              <div className="p-4 bg-gradient-to-t from-black/90 to-transparent">
                <h2 className="text-white text-lg md:text-xl font-semibold">
                  {video.title}
                </h2>
                {video.description && (
                  <p className="text-white/70 text-sm mt-2 line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
