'use client';

/**
 * Film grain and scratch overlay for authentic vintage aesthetic
 * Combines noise pattern with subtle vertical scratches
 */
export default function FilmGrainOverlay() {
  return (
    <>
      {/* Film grain texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
        aria-hidden="true"
      />
      
      {/* Subtle film scratches - vertical lines */}
      <div 
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, transparent 20%, rgba(255,255,255,0.3) 20.5%, transparent 21%, transparent 100%),
            linear-gradient(90deg, transparent 0%, transparent 45%, rgba(255,255,255,0.2) 45.3%, transparent 45.6%, transparent 100%),
            linear-gradient(90deg, transparent 0%, transparent 78%, rgba(255,255,255,0.25) 78.2%, transparent 78.5%, transparent 100%)
          `,
          backgroundSize: '100% 100%',
        }}
        aria-hidden="true"
      />
      
      {/* Warm color cast - like aged film */}
      <div 
        className="fixed inset-0 pointer-events-none z-30 bg-amber-900/[0.02] mix-blend-multiply"
        aria-hidden="true"
      />
    </>
  );
}
