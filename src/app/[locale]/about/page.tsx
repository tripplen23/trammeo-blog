import { getTranslations } from 'next-intl/server';
import AboutIntro from '@/components/about/AboutIntro';
import AboutDescription from '@/components/about/AboutDescription';
import AboutStory from '@/components/about/AboutStory';
import AboutExploreMore from '@/components/about/explore-more';
import SmoothScroll from '@/components/home/SmoothScroll';
import ScrollGallery from '@/components/about/ScrollGallery';
import InteractiveDescription from '@/components/about/InteractiveDescription';

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
      <main className="min-h-screen bg-black">
        <AboutIntro />
        <AboutDescription />
        {/* Scroll Gallery with auto-playing sections */}
        <ScrollGallery />
        {/* Interactive section with hover effects */}
        <InteractiveDescription />
        <AboutExploreMore>
          <AboutStory />
        </AboutExploreMore>
      </main>
    </SmoothScroll>
  );
}

