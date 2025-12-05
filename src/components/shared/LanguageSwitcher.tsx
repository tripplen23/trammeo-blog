'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 text-sm bg-white/10 backdrop-blur-sm rounded-full p-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLanguageChange(loc)}
          className={`px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all duration-200 ${
            locale === loc
              ? 'bg-white text-black shadow-md'
              : 'text-white/70 hover:text-white hover:bg-white/20'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

