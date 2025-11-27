import { getTranslations } from 'next-intl/server';
import { client } from '@/lib/sanity';
import { postsByCategoryQuery } from '@/lib/queries';
import type { Post } from '@/lib/sanity';
import ZoomParallax from '@/components/ben-ria/ZoomParallax';
import IntroHero from '@/components/ben-ria/IntroHero';

import HorizontalPostsSection from '@/components/ben-ria/HorizontalPostsSection';
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

async function getPosts() {
  const posts = await client.fetch<Post[]>(postsByCategoryQuery, {
    category: 'ben-ria-the-gioi',
  });
  return posts;
}

export default async function BenRiaPage() {
  const posts = await getPosts();

  return (
    <SmoothScroll>
      <TransitionEffect />
      <main>
        {/* Zoom Parallax Effect */}
        <IntroHero />
        <ZoomParallax />

        {/* Transition Text Section */}
        {/* 
        <TransitionText 
          title="Bên Rìa Thế Giới"
          lines={[
            "Sinh ra giữa nhịp sống sôi động của Sài Gòn, việc thả hồn vào những con chữ với cô luôn là không gian để cô lưu lại những phút giây chậm rãi giữa một thế giới hiếm khi ngừng thở.",
            "Bên Rìa Thế Giới là một không gian mà nơi đó cô được thở chậm lại, được lắng nghe chính mình, và đôi khi là lắng nghe cả thế giới đang thì thầm bên tai.",
            "...",
          ]}
        />
        */}

        {/* Horizontal Scrolling Posts */}
        <HorizontalPostsSection posts={posts} />
      </main>
    </SmoothScroll>
  );
}