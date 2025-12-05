'use client';

import { useRouter } from '@/i18n/routing';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useLoading } from '@/contexts/LoadingContext';

interface NavSection {
  id: string;
  color: string;
  link: string;
}

export default function AnimatedNavigation() {
  const router = useRouter();
  const t = useTranslations('home');
  const { startLoading } = useLoading();

  const sections: NavSection[] = [
    { id: 'about', color: '#6366f1', link: '/about' },
    { id: 'benRia', color: '#5D866C', link: '/ben-ria-the-gioi' },
    { id: 'beTheFlow', color: '#f59e0b', link: '/betheflow' },
    { id: 'nguoiDiTrenMay', color: '#87CEEB', link: '/nguoi-di-tren-may' },
    { id: 'duHanhKhongGian', color: '#4e3a75ff', link: '/du-hanh-khong-gian' },
  ];

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, color: string) => {
    gsap.to(e.currentTarget, {
      top: '-2vw',
      backgroundColor: color,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      top: '0',
      backgroundColor: 'white',
      duration: 0.3,
      delay: 0.1,
      ease: 'power2.out',
    });
  };

  const handleClick = (link: string) => {
    startLoading();
    router.push(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Minimal Header: Logo + Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black py-4 px-6">
        <div className="flex items-center justify-between">
          <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Trammeo.
          </span>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Navigation Sections */}
      <div className="flex items-center flex-1 pt-16">
        <div className="relative w-full">
          {sections.map((section) => (
            <div
              key={section.id}
              className="relative border-t border-black text-black cursor-pointer bg-white"
              style={{
                marginBottom: '-2vw',
              }}
              onMouseEnter={(e) => handleMouseEnter(e, section.color)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(section.link)}
            >
              <p className="m-0 text-[5vw] pl-[10px] uppercase pointer-events-none select-none font-bold tracking-tight py-4">
                {t(section.id as 'about' | 'benRia' | 'beTheFlow' | 'nguoiDiTrenMay' | 'duHanhKhongGian')}
              </p>
            </div>
          ))}
          <div className="border-t border-black" />
        </div>
      </div>
    </div>
  );
}