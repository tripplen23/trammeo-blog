import { getTranslations } from 'next-intl/server';
import { client } from '@/lib/sanity';
import { postsByCategoryQuery, topicsQuery } from '@/lib/queries';
import type { Post } from '@/lib/sanity';
import IntroHero from '@/components/ben-ria/IntroHero';
import PostsExplorer from '@/components/ben-ria/posts/PostsExplorer';
import SmoothScroll from '@/components/home/SmoothScroll';
import TransitionEffect from '@/components/shared/TransitionEffect';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'benRia' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface Topic {
  _id: string;
  title: {
    en: string;
    vi: string;
  };
  slug: {
    current: string;
  };
  description?: {
    en: string;
    vi: string;
  };
}

async function getData() {
  const [posts, topics] = await Promise.all([
    client.fetch<Post[]>(postsByCategoryQuery, {
      category: 'ben-ria-the-gioi',
    }),
    client.fetch<Topic[]>(topicsQuery),
  ]);
  return { posts, topics };
}

export default async function BenRiaPage() {
  const { posts, topics } = await getData();

  return (
    <SmoothScroll>
      <TransitionEffect />
      <main>
        <IntroHero />
        <PostsExplorer posts={posts} topics={topics} />
      </main>
    </SmoothScroll>
  );
}