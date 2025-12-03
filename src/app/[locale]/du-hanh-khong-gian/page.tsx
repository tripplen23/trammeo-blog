import { client } from '@/lib/sanity';
import { spaceTravelPhotosQuery } from '@/lib/queries';
import SpaceTravelGallery from '@/components/space-travel/SpaceTravelGallery';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function SpaceTravelPage() {
    const photos = await client.fetch(spaceTravelPhotosQuery);

    return (
        <main className="min-h-screen pt-24">
            <SpaceTravelGallery initialPhotos={photos} />
        </main>
    );
}
