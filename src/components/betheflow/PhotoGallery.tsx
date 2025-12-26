'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, MoreHorizontal, ExternalLink } from 'lucide-react';
import { client, urlForImage } from '@/lib/sanity';
import { galleryPhotosQuery } from '@/lib/queries';
import {
  GalleryPost,
  CategoryFilter as CategoryFilterType,
  filterPostsByCategory,
  handleFilterChange,
  GalleryPaginationState,
} from '@/lib/galleryTypes';
import CategoryFilter from './CategoryFilter';
import ImageCarousel from './ImageCarousel';

const ITEMS_PER_PAGE = 9;

/**
 * PhotoCard component - displays a single gallery post in the grid
 * Requirements: 5.1 - Display carousel indicators for multi-image posts
 */
interface PhotoCardProps {
  photo: GalleryPost;
  onClick: () => void;
}

function PhotoCard({ photo, onClick }: PhotoCardProps) {
  const firstImage = photo.images?.[0];
  const imageCount = photo.images?.length || 0;
  const hasMultipleImages = imageCount > 1;

  if (!firstImage) {
    return null;
  }

  return (
    <div
      className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-100"
      onClick={onClick}
    >
      <Image
        src={urlForImage(firstImage).width(600).height(600).quality(80).url()}
        alt={photo.caption}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        loading="lazy"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

      {/* Carousel Indicator Dots - Requirements: 5.1 */}
      {hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {Array.from({ length: imageCount }).map((_, idx) => (
            <div
              key={idx}
              className="w-1.5 h-1.5 rounded-full bg-white/70"
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </div>
  );
}


/**
 * PhotoModal component - displays full photo with ImageCarousel and portfolio link
 * Requirements: 5.2, 6.1, 6.2, 6.3
 */
interface PhotoModalProps {
  photo: GalleryPost | null;
  onClose: () => void;
}

function PhotoModal({ photo, onClose }: PhotoModalProps) {
  if (!photo) return null;

  const hasPortfolioLink = photo.portfolioLink && photo.portfolioLink.trim() !== '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-sm overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Section with ImageCarousel - Requirements: 5.2 */}
          <div className="relative w-full md:w-[60%] bg-black flex items-center justify-center aspect-square md:aspect-auto">
            <div className="relative w-full h-full min-h-[300px] md:min-h-[600px]">
              <ImageCarousel images={photo.images} alt={photo.caption} />
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-[40%] flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src="/images/intro.webp"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">trammeo</p>
                  {photo.location && (
                    <p className="text-xs text-gray-700 font-medium">{photo.location}</p>
                  )}
                </div>
              </div>
              <MoreHorizontal className="text-gray-500 cursor-pointer" />
            </div>

            {/* Caption Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/intro.webp"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm text-black">
                    <span className="font-bold mr-2">trammeo</span>
                    {photo.caption}
                  </p>
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    {photo.date || '2d ago'}
                  </p>
                </div>
              </div>

              {/* Portfolio Link - Requirements: 6.1, 6.2, 6.3 */}
              {hasPortfolioLink && (
                <div className="mt-4 pt-4 border-t">
                  <a
                    href={photo.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>View Portfolio</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white hover:opacity-70 z-[70]"
          onClick={onClose}
        >
          <X size={32} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}


/**
 * Main PhotoGallery component
 */
export default function PhotoGallery() {
  const [allPhotos, setAllPhotos] = useState<GalleryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [paginationState, setPaginationState] = useState<GalleryPaginationState>({
    currentPage: 0,
    currentFilter: 'littleLifeAtArt',
  });
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPost | null>(null);

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await client.fetch(galleryPhotosQuery);
        setAllPhotos(data);
        // Set the correct filter after photos are loaded
        setPaginationState({
          currentPage: 0,
          currentFilter: 'littleLifeAtArt'
        });
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Filter photos by category - Requirements: 4.2, 4.3
  const filteredPhotos = useMemo(() => {
    return filterPostsByCategory(allPhotos, paginationState.currentFilter);
  }, [allPhotos, paginationState.currentFilter]);

  // Calculate total pages based on filtered photos
  const totalPages = useMemo(
    () => Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE),
    [filteredPhotos.length]
  );

  // Get current photos for the page
  const currentPhotos = useMemo(() => {
    return filteredPhotos.slice(
      paginationState.currentPage * ITEMS_PER_PAGE,
      (paginationState.currentPage + 1) * ITEMS_PER_PAGE
    );
  }, [filteredPhotos, paginationState.currentPage]);

  // Handle category filter change with pagination reset - Requirements: 4.4
  const handleCategoryChange = useCallback((newFilter: CategoryFilterType) => {
    setPaginationState((current) => handleFilterChange(current, newFilter));
  }, []);

  const handleNextPage = () => {
    if (paginationState.currentPage < totalPages - 1) {
      setPaginationState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (paginationState.currentPage > 0) {
      setPaginationState((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const handlePhotoClick = (photo: GalleryPost) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (selectedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  if (isLoading || !isMounted) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (allPhotos.length === 0) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center text-gray-500">
        <p>No photos yet.</p>
        <p className="text-sm mt-2">Upload photos in Sanity Studio.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center w-full relative">
          <p className="text-sm text-gray-500 uppercase tracking-widest">Go with the flow</p>
          <h2 className="text-xl font-medium mt-1">Show my works</h2>
        </div>
      </div>

      {/* Category Filter - Requirements: 4.1 */}
      <div className="mb-8">
        <CategoryFilter
          selectedCategory={paginationState.currentFilter}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Empty state for filtered results */}
      {filteredPhotos.length === 0 && (
        <div className="w-full h-[300px] flex flex-col items-center justify-center text-gray-500">
          <p>No photos in this category.</p>
        </div>
      )}

      {/* Photo Grid */}
      {filteredPhotos.length > 0 && (
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${paginationState.currentFilter}-${paginationState.currentPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 md:gap-4"
            >
              {currentPhotos.map((photo) => (
                <PhotoCard key={photo._id} photo={photo} onClick={() => handlePhotoClick(photo)} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-8 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={paginationState.currentPage === 0}
            className={`p-3 rounded-full transition-all duration-200 ${
              paginationState.currentPage === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-black bg-white shadow-md hover:bg-gray-100 hover:scale-110'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPaginationState((prev) => ({ ...prev, currentPage: idx }))}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  paginationState.currentPage === idx
                    ? 'bg-black scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={paginationState.currentPage === totalPages - 1}
            className={`p-3 rounded-full transition-all duration-200 ${
              paginationState.currentPage === totalPages - 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-black bg-white shadow-md hover:bg-gray-100 hover:scale-110'
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Photo Modal with ImageCarousel and Portfolio Link */}
      <PhotoModal photo={selectedPhoto} onClose={handleCloseModal} />
    </div>
  );
}
