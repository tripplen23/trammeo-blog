import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { routing } from '@/i18n/routing';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { AboutEntranceProvider } from '@/contexts/AboutEntranceContext';

// Pages that should not show footer (for infinite scroll experience)
const PAGES_WITHOUT_FOOTER = ['/nguoi-di-tren-may'];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'vi')) {
    notFound();
  }

  // Get current pathname to determine if footer should be hidden
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Check if current page should hide footer
  const shouldHideFooter = PAGES_WITHOUT_FOOTER.some((page) =>
    pathname.includes(page)
  );

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AboutEntranceProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          {!shouldHideFooter && <Footer />}
        </div>
      </AboutEntranceProvider>
    </NextIntlClientProvider>
  );
}