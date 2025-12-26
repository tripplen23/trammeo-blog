'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SanityImage {
    _type: 'image';
    asset: {
        _ref: string;
        _type: 'reference';
    };
}

interface Photo {
    _id: string;
    image: SanityImage;
    caption: string;
    location?: string;
    date?: string;
}

interface SpaceTravelGalleryProps {
    initialPhotos: Photo[];
}

export default function SpaceTravelGallery({ initialPhotos }: SpaceTravelGalleryProps) {
    const [photos] = useState<Photo[]>(initialPhotos);
    const [activeId, setActiveId] = useState<string | null>(null);
    
    // Mobile detection for responsive layout
    const isMobile = useMediaQuery('(max-width: 767px)');
    const photosPerRow = isMobile ? 1 : 4;

    // Handle click to zoom/activate
    const handlePhotoClick = (id: string) => {
        setActiveId(activeId === id ? null : id);
    };

    // Group photos into rows based on viewport (1 on mobile, 4 on desktop)
    const rows = useMemo(() => {
        const result: Photo[][] = [];
        for (let i = 0; i < photos.length; i += photosPerRow) {
            result.push(photos.slice(i, i + photosPerRow));
        }
        return result;
    }, [photos, photosPerRow]);

    // Find which row contains the active photo
    const activeRowIndex = useMemo(() => {
        if (!activeId) return -1;
        return rows.findIndex(row => row.some(photo => photo._id === activeId));
    }, [activeId, rows]);

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-b from-[#050510] via-[#0a0a20] to-[#050515] px-2 md:px-4 lg:px-6 py-8 md:py-12 overflow-hidden">
            {/* Galaxy Stars Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
                <div 
                    className="absolute inset-0 opacity-60 animate-[twinkle_8s_ease-in-out_infinite]" 
                    style={{
                        backgroundImage: `radial-gradient(2px 2px at 20px 30px, white, transparent),
                                          radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                                          radial-gradient(1px 1px at 90px 40px, white, transparent),
                                          radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
                                          radial-gradient(1px 1px at 230px 80px, white, transparent),
                                          radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent),
                                          radial-gradient(1px 1px at 370px 50px, white, transparent),
                                          radial-gradient(2px 2px at 450px 180px, rgba(255,255,255,0.8), transparent)`,
                        backgroundSize: '500px 500px'
                    }}
                />
                <div 
                    className="absolute inset-0 opacity-40 animate-[twinkle_12s_ease-in-out_infinite_reverse]" 
                    style={{
                        backgroundImage: `radial-gradient(1px 1px at 100px 150px, white, transparent),
                                          radial-gradient(2px 2px at 200px 50px, rgba(255,255,255,0.7), transparent),
                                          radial-gradient(1px 1px at 350px 200px, white, transparent),
                                          radial-gradient(2px 2px at 420px 100px, rgba(255,255,255,0.6), transparent)`,
                        backgroundSize: '500px 500px'
                    }}
                />
            </div>
            
            {/* Title Overlay */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                <h1 
                    className="text-[5vw] md:text-[6vw] lg:text-[7vw] font-black text-white leading-none text-center whitespace-nowrap tracking-[0.3em] uppercase opacity-[0.12]"
                    style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
                >
                    TRAMMEO.
                </h1>
            </div>

            {/* Photo Rows */}
            <div className="relative z-30 w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 space-y-6 md:space-y-8">
                {rows.map((row, rowIndex) => {
                    const isActiveRow = rowIndex === activeRowIndex;
                    
                    return (
                        <div 
                            key={rowIndex} 
                            className={`flex items-start ${
                                isMobile 
                                    ? 'flex-col gap-6 px-2' 
                                    : 'flex-row gap-3 md:gap-4 lg:gap-5'
                            }`}
                        >
                            {row.map((photo) => {
                                const isActive = activeId === photo._id;
                                const isInactiveInRow = isActiveRow && !isActive;
                                const shouldDim = activeId !== null && !isActive; // Mờ tất cả trừ hình đang active

                                const imageUrl = photo.image ? urlForImage(photo.image).url() : '';

                                // Mobile-specific styling: full width, no flex expansion
                                const mobileStyle = isMobile ? {
                                    flex: 'none' as const,
                                    width: '100%',
                                    maxWidth: 'calc(100vw - 2rem)',
                                    margin: isActive ? '0 auto' : undefined,
                                } : {
                                    flex: isActive ? 2 : isInactiveInRow ? 0.6 : 1,
                                    minWidth: isInactiveInRow ? '80px' : '0',
                                    maxWidth: isActive ? '500px' : 'none',
                                };

                                return (
                                    <motion.div
                                        key={photo._id}
                                        layout
                                        initial={false}
                                        animate={{
                                            flex: isMobile ? undefined : (isActive ? 2 : isInactiveInRow ? 0.6 : 1),
                                            opacity: shouldDim ? 0.4 : 1,
                                        }}
                                        transition={{ 
                                            duration: 0.4, 
                                            ease: [0.4, 0, 0.2, 1]
                                        }}
                                        className={`relative cursor-pointer group ${isMobile ? 'w-full' : ''}`}
                                        style={mobileStyle}
                                        onClick={() => handlePhotoClick(photo._id)}
                                    >
                                        {/* Polaroid Frame */}
                                        <div 
                                            className="relative shadow-xl transition-all duration-300 ease-out group-hover:shadow-2xl group-hover:-translate-y-1"
                                            style={{ 
                                                backgroundColor: '#EDE8DC',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)' 
                                            }}
                                        >
                                            {/* Image container */}
                                            <div className="p-2 pb-0">
                                                {photo.image && (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={photo.caption}
                                                        width={800}
                                                        height={600}
                                                        className="w-full h-auto object-cover"
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                    />
                                                )}
                                            </div>

                                            {/* Caption area */}
                                            <motion.div 
                                                className="px-3 py-3 md:py-4 overflow-hidden"
                                                animate={{
                                                    opacity: isInactiveInRow ? 0 : 1,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <h3 
                                                    className={`text-gray-700 transition-all duration-300 overflow-hidden ${
                                                        isActive 
                                                            ? 'text-sm md:text-base lg:text-lg break-words' 
                                                            : 'text-[10px] md:text-xs line-clamp-2'
                                                    }`} 
                                                    style={{ 
                                                        fontFamily: "var(--font-pacifico), cursive",
                                                        wordBreak: 'break-word',
                                                        overflowWrap: 'break-word',
                                                        maxWidth: '100%'
                                                    }}
                                                >
                                                    {photo.caption}
                                                </h3>
                                                
                                                {/* Location & Date - only when focused */}
                                                {isActive && (photo.location || photo.date) && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="mt-2 flex flex-wrap justify-between items-center text-gray-500 gap-1 overflow-hidden"
                                                        style={{ maxWidth: '100%' }}
                                                    >
                                                        {photo.location && (
                                                            <p 
                                                                className="text-[10px] md:text-xs lg:text-sm truncate max-w-[60%] md:max-w-none"
                                                                style={{ 
                                                                    fontFamily: "var(--font-pacifico), cursive",
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}
                                                            >
                                                                {photo.location}
                                                            </p>
                                                        )}
                                                        {photo.date && (
                                                            <p 
                                                                className="text-[10px] md:text-xs flex-shrink-0"
                                                                style={{ fontFamily: "var(--font-pacifico), cursive" }}
                                                            >
                                                                {new Date(photo.date).toLocaleDateString('vi-VN', {
                                                                    day: '2-digit',
                                                                    month: '2-digit', 
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Click outside to close */}
            {activeId && (
                <div
                    className="fixed inset-0 z-20 bg-black/20"
                    onClick={() => setActiveId(null)}
                />
            )}
        </div>
    );
}