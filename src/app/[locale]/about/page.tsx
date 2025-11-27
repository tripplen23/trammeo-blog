import { getTranslations } from 'next-intl/server';
import AboutIntro from '@/components/about/AboutIntro';
import AboutDescription from '@/components/about/AboutDescription';
import AboutExploreMore from '@/components/about/explore-more';
import SmoothScroll from '@/components/home/SmoothScroll';
import BlackHoleEntrance from '@/components/about/BlackHoleEntrance';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage() {
  return (
    <SmoothScroll>
      <BlackHoleEntrance>
        <main className="min-h-screen bg-black">
          <AboutIntro />
          <AboutDescription />
          <AboutExploreMore />
        </main>
      </BlackHoleEntrance>
    </SmoothScroll>
  );
}