'use client';

import { useRouter } from '@/i18n/routing';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';

interface NavSection {
  id: string;
  color: string;
  link: string;
}

export default function AnimatedNavigation() {
  const router = useRouter();
  const t = useTranslations('home');

  const sections: NavSection[] = [
    { id: 'about', color: '#6366f1', link: '/about' },
    { id: 'benRia', color: '#5D866C', link: '/ben-ria-the-gioi' },
    { id: 'beTheFlow', color: '#f59e0b', link: '/betheflow' },
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
    router.push(link);
  };

  return (
    <div className="flex items-center min-h-screen">
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
              {t(section.id as 'about' | 'benRia' | 'beTheFlow' | 'duHanhKhongGian')}
            </p>
          </div>
        ))}
        <div className="border-t border-black" />
      </div>
    </div>
  );
}