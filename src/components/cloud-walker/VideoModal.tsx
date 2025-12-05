'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { VideoCardVideo } from './VideoCard';

interface VideoModalProps {
  video: VideoCardVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Stop video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

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
              <video
                ref={videoRef}
                src={video.videoUrl}
                controls
                autoPlay
                className="w-full aspect-video"
                data-testid="video-modal-player"
              >
                Your browser does not support the video tag.
              </video>

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
