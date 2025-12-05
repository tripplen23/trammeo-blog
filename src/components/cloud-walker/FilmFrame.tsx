'use client';

import { ReactNode, memo } from 'react';

interface FilmFrameProps {
  children: ReactNode;
  frameNumber?: number;
  showFrameNumber?: boolean;
}

// Film stock names for authentic look
const FILM_STOCKS = ['KODAK 5219', 'PORTRA 400', 'CINESTILL', 'VISION3'];

// Memoized FilmFrame for better performance - avoids re-renders when parent scrolls
const FilmFrame = memo(function FilmFrame({ 
  children, 
  frameNumber = 1,
  showFrameNumber = true 
}: FilmFrameProps) {
  // Format frame number like real film: 15A, 16A, etc.
  const frameLabel = `${frameNumber}A`;
  // Rotate through film stocks based on frame number
  const filmStock = FILM_STOCKS[frameNumber % FILM_STOCKS.length];

  return (
    <div className="relative group">
      {/* Film frame border with authentic film look */}
      <div className="relative rounded-sm overflow-hidden bg-gray-950 p-[4px]">
        {/* Inner frame with vintage border effect */}
        <div className="relative rounded-sm overflow-hidden border border-gray-700/50">
          {/* Vintage color grading overlay */}
          <div className="relative">
            {children}
            
            {/* Vignette effect - darkens corners like real film */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
              }}
            />
            
            {/* Subtle warm color cast - film look */}
            <div className="absolute inset-0 pointer-events-none bg-amber-500/[0.03] mix-blend-overlay" />
          </div>
          
          {/* Film frame corner marks - more prominent */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-amber-500/30 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-amber-500/30 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-amber-500/30 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-amber-500/30 pointer-events-none" />
          
          {/* Center crosshair marks - like film registration marks */}
          <div className="absolute top-1/2 left-2 w-2 h-[1px] bg-amber-500/20 -translate-y-1/2 pointer-events-none" />
          <div className="absolute top-1/2 right-2 w-2 h-[1px] bg-amber-500/20 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Film edge markings - outside the frame */}
        {showFrameNumber && (
          <>
            {/* Frame number - bottom right like real film */}
            <div className="absolute bottom-0.5 right-2 font-mono text-[8px] text-amber-600/60 tracking-wider pointer-events-none">
              {frameLabel}
            </div>
            
            {/* Film stock name - bottom left */}
            <div className="absolute bottom-0.5 left-2 font-mono text-[7px] text-amber-600/40 tracking-widest pointer-events-none">
              {filmStock}
            </div>
            
            {/* Arrow marker - like film direction indicator */}
            <div className="absolute top-0.5 right-2 font-mono text-[8px] text-amber-600/40 pointer-events-none">
              →
            </div>
          </>
        )}
      </div>

      {/* Light leak effect on hover - authentic film artifact */}
      <div 
        className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,140,0,0.08) 0%, transparent 40%, transparent 60%, rgba(255,80,80,0.05) 100%)',
        }}
      />
    </div>
  );
});

export default FilmFrame;