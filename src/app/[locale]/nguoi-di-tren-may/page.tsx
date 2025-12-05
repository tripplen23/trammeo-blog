import { client } from '@/lib/sanity';
import { cloudWalkerVideosQuery } from '@/lib/queries';
import { CloudWalkerGallery } from '@/components/cloud-walker';
import { getTranslations } from 'next-intl/server';
import type { VideoCardVideo } from '@/components/cloud-walker';
import { CloudWalkerPageWrapper } from '@/components/cloud-walker';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cloudWalker' });
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function NguoiDiTrenMayPage() {
  const videos: VideoCardVideo[] = await client.fetch(cloudWalkerVideosQuery);

  return (
    <CloudWalkerPageWrapper>
      <main className="min-h-screen">
        <CloudWalkerGallery videos={videos} />
      </main>
    </CloudWalkerPageWrapper>
  );
}