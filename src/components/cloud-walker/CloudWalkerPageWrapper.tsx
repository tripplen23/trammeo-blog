'use client';

import { useEffect, useState } from 'react';

interface CloudWalkerPageWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for the Cloud Walker page that:
 * 1. Hides the browser scrollbar on desktop
 * 2. Prevents default page scroll on desktop (we use custom parallax scroll)
 * 3. Allows normal scroll on mobile
 */
export default function CloudWalkerPageWrapper({ children }: CloudWalkerPageWrapperProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => {
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  useEffect(() => {
    // Only hide scrollbar on desktop
    if (!isDesktop) return;

    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.documentElement.style.height;
    const originalBodyHeight = document.body.style.height;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.body.style.height = '100vh';

    return () => {
      // Restore original styles on unmount
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.height = originalHeight;
      document.body.style.height = originalBodyHeight;
    };
  }, [isDesktop]);

  return <>{children}</>;
}