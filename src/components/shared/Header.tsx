'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useAboutEntrance } from '@/contexts/AboutEntranceContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { hasEntered } = useAboutEntrance();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/about', label: t('about').toLowerCase() },
    { href: '/ben-ria-the-gioi', label: t('edgeOfTheWorld') },
    { href: '/du-hanh-khong-gian', label: 'du hành không gian' },
    { href: '/betheflow', label: '#betheflow' },
  ];

  // Check if we're on a white-background page (about)
  const isWhitePage = pathname === '/about';
  // Check if we're on space travel page (galaxy background)
  const isSpacePage = pathname === '/du-hanh-khong-gian';
  const shouldBeBlack = (mounted && isScrolled) || isWhitePage;

  // Hide header on about page until user has entered through BlackHoleEntrance
  const isAboutPage = pathname === '/about';
  if (isAboutPage && !hasEntered) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${shouldBeBlack ? 'bg-white/95 backdrop-blur-md shadow-sm' : isSpacePage ? 'bg-gradient-to-b from-black/80 to-transparent' : 'bg-transparent'
        }`}
    >
      <div className={`w-full py-6 px-10 ${isSpacePage ? 'pb-3' : ''}`}>
        {/* Brand Name Centered */}
        <div className="text-center mb-4">
          <Link
            href="/"
            className={`text-2xl md:text-3xl font-bold bottom-20 tracking-tight hover:opacity-70 transition-all duration-300 ${shouldBeBlack ? 'text-black' : 'text-white'
              }`}
          >
            Trammeo.
          </Link>
        </div>

        {/* Navigation Links Centered */}
        <nav className="flex items-center justify-center gap-8 md:gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-normal transition-all duration-300 lowercase ${shouldBeBlack
                ? (pathname === link.href ? 'text-black font-medium' : 'text-gray-600 hover:text-black')
                : isSpacePage
                  ? (pathname === link.href ? 'text-white font-medium' : 'text-white/80 hover:text-white')
                  : (pathname === link.href ? 'text-white font-medium' : 'text-white/80 hover:text-white')
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language Switcher - Top Right Corner */}
        <div className="absolute top-6 right-10">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}