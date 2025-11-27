import { getTranslations } from 'next-intl/server';
import SmoothScroll from '@/components/home/SmoothScroll';
import MaskAnimation from '@/components/betheflow/MaskAnimation';
import FlowDescription from '@/components/betheflow/FlowDescription';
import PhotoGallery from '@/components/betheflow/PhotoGallery';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'beTheFlow' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function BeTheFlowPage() {
  return (
    <SmoothScroll>
      <main>
        <MaskAnimation />
        <FlowDescription />
        <PhotoGallery />
      </main>
    </SmoothScroll>
  );
}