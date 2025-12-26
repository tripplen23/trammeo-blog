'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useAboutEntrance } from '@/contexts/AboutEntranceContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { hasEntered } = useAboutEntrance();

  // Toggle mobile menu open/close
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  // Close mobile menu
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/ben-ria-the-gioi', label: t('edgeOfTheWorld') },
    { href: '/betheflow', label: '#betheflow' },
    { href: '/nguoi-di-tren-may', label: t('cloudWalker') },
    { href: '/du-hanh-khong-gian', label: t('spaceTravel') },
  ];

  // Check if we're on home page - hide full header
  const isHomePage = pathname === '/';
  // Check if we're on a white-background page (about)
  const isWhitePage = pathname === '/about';
  // Check if we're on space travel page (galaxy background)
  const isSpacePage = pathname === '/du-hanh-khong-gian';
  // Check if we're on cloud walker page (custom scroll, always dark header)
  const isCloudWalkerPage = pathname === '/nguoi-di-tren-may';
  // Only turn header white on scroll for non-special pages
  const shouldBeBlack = (mounted && isScrolled && !isCloudWalkerPage) || isWhitePage;

  // Hide header on home page (has its own minimal header)
  if (isHomePage) {
    return null;
  }

  // Hide header on about page until user has entered through BlackHoleEntrance
  const isAboutPage = pathname === '/about';
  if (isAboutPage && !hasEntered) {
    return null;
  }

  // Burger icon color based on theme
  const burgerColor = shouldBeBlack ? 'bg-black' : 'bg-white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${shouldBeBlack ? 'bg-white/95 backdrop-blur-md shadow-sm' : isSpacePage ? 'bg-gradient-to-b from-black/80 to-transparent' : 'bg-transparent'
        }`}
    >
      <div className={`w-full py-6 px-10 ${isSpacePage ? 'pb-3' : ''}`}>
        {/* Mobile Header Layout: Logo left, Burger right */}
        <div className="flex md:hidden items-center justify-between">
          <Link
            href="/"
            className={`text-2xl font-bold tracking-tight hover:opacity-70 transition-all duration-300 ${shouldBeBlack ? 'text-black' : 'text-white'
              }`}
          >
            Trammeo.
          </Link>
          
          {/* Burger Menu Icon - Mobile Only */}
          <button
            onClick={toggleMobileMenu}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {/* Top line - rotates to form X */}
            <span
              className={`block w-6 h-0.5 ${burgerColor} transition-all duration-300 ease-in-out origin-center ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            {/* Middle line - fades out */}
            <span
              className={`block w-6 h-0.5 ${burgerColor} transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`}
            />
            {/* Bottom line - rotates to form X */}
            <span
              className={`block w-6 h-0.5 ${burgerColor} transition-all duration-300 ease-in-out origin-center ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Desktop Header Layout: Brand centered, nav below */}
        <div className="hidden md:block">
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

          {/* Navigation Links Centered - Desktop Only */}
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

          {/* Language Switcher - Top Right Corner - Desktop Only */}
          <div className="absolute top-6 right-10">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel - Slides from right */}
      <div
        className={`fixed top-0 right-0 h-full w-72 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } ${shouldBeBlack ? 'bg-white' : 'bg-black/95 backdrop-blur-md'}`}
      >
        {/* Navigation Links */}
        <nav className="flex flex-col px-6 pt-20 space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={`text-lg transition-all duration-300 lowercase ${
                shouldBeBlack
                  ? pathname === link.href
                    ? 'text-black font-medium'
                    : 'text-gray-600 hover:text-black'
                  : pathname === link.href
                    ? 'text-white font-medium'
                    : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language Switcher at bottom */}
        <div className="absolute bottom-8 left-6 right-6">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}