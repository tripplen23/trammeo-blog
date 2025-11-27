'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, MoreHorizontal } from 'lucide-react';
import { client, urlForImage } from '@/lib/sanity';

import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const ITEMS_PER_PAGE = 9;

interface Photo {
    _id: string;
    image: SanityImageSource;
    caption: string;
    location?: string;
    date?: string;
}

export default function PhotoGallery() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const query = `*[_type == "galleryPhoto"] | order(date desc)`;
                const data = await client.fetch(query);
                setPhotos(data);
            } catch (error) {
                console.error('Error fetching photos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    // Calculate total pages
    const totalPages = useMemo(() => Math.ceil(photos.length / ITEMS_PER_PAGE), [photos.length]);

    // Get current photos
    const currentPhotos = useMemo(() => {
        return photos.slice(
            currentPage * ITEMS_PER_PAGE,
            (currentPage + 1) * ITEMS_PER_PAGE
        );
    }, [photos, currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handlePhotoClick = (photo: Photo) => {
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

    if (isLoading) {
        return (
            <div className="w-full h-[600px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (photos.length === 0) {
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

            {/* Photo Grid */}
            <div className="relative min-h-[600px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 md:gap-4"
                    >
                        {currentPhotos.map((photo) => (
                            <div
                                key={photo._id}
                                className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-100"
                                onClick={() => handlePhotoClick(photo)}
                            >
                                <Image
                                    src={urlForImage(photo.image).width(600).height(600).quality(80).url()}
                                    alt={photo.caption}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    loading="lazy"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-8 mt-8">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        className={`p-3 rounded-full transition-all duration-200 ${currentPage === 0
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
                                onClick={() => setCurrentPage(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentPage === idx ? 'bg-black scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to page ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className={`p-3 rounded-full transition-all duration-200 ${currentPage === totalPages - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-black bg-white shadow-md hover:bg-gray-100 hover:scale-110'
                            }`}
                        aria-label="Next page"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}

            {/* Instagram Style Modal */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-sm overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image Section */}
                            <div className="relative w-full md:w-[60%] bg-black flex items-center justify-center aspect-square md:aspect-auto">
                                <div className="relative w-full h-full min-h-[300px] md:min-h-[600px]">
                                    <Image
                                        src={urlForImage(selectedPhoto.image).width(1200).height(1200).quality(90).url()}
                                        alt={selectedPhoto.caption}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                        priority
                                    />
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
                                            {selectedPhoto.location && (
                                                <p className="text-xs text-gray-700 font-medium">{selectedPhoto.location}</p>
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
                                                {selectedPhoto.caption}
                                            </p>
                                            <p className="text-xs text-gray-600 font-medium mt-1">
                                                {selectedPhoto.date || '2d ago'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-white hover:opacity-70 z-[70]"
                            onClick={handleCloseModal}
                        >
                            <X size={32} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
