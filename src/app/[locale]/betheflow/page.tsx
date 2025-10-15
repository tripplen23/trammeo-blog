import { client } from '@/lib/sanity';
import { postsByCategoryQuery } from '@/lib/queries';
import type { Post } from '@/lib/sanity';
import MaskAnimation from '@/components/betheflow/MaskAnimation';
import HorizontalPostsSection from '@/components/betheflow/HorizontalPostsSection';
import { getTranslations } from 'next-intl/server';
import SmoothScroll from '@/components/home/SmoothScroll';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'beTheFlow' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

async function getPosts() {
  const posts = await client.fetch<Post[]>(postsByCategoryQuery, {
    category: 'betheflow',
  });
  return posts;
}

export default async function BeTheFlowPage() {
  const posts = await getPosts();

  return (
    <SmoothScroll>
      <main>
        <MaskAnimation />
        <HorizontalPostsSection posts={posts} />
      </main>
    </SmoothScroll>
  );
}