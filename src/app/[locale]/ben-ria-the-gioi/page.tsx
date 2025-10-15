import { getTranslations } from 'next-intl/server';
import { client } from '@/lib/sanity';
import { postsByCategoryQuery } from '@/lib/queries';
import type { Post } from '@/lib/sanity';
import IntroHero from '@/components/ben-ria/IntroHero';
import DescriptionSection from '@/components/ben-ria/DescriptionSection';
import ParallaxTextSection from '@/components/ben-ria/ParallaxTextSection';
import ContentSection from '@/components/ben-ria/ContentSection';
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
        {/* Hero with Parallax */}
        <IntroHero />
        
        {/* Large Text Description */}
        <DescriptionSection />
        
        {/* First Parallax Section */}
        <ParallaxTextSection 
          title="Văn Học & Sáng Tạo"
          subtitle="Khám phá những câu chuyện từ góc nhìn độc đáo, nơi ngôn từ trở thành cầu nối giữa trái tim và tâm hồn"
          bgColor="from-[#C2A68C] via-[#5D866C] to-[#E6D8C3]"
        />
        
        {/* Content Section */}
        <ContentSection />
        
        {/* Horizontal Scrolling Posts */}
        <HorizontalPostsSection posts={posts} />
        
        {/* Second Parallax Section */}
        <ParallaxTextSection 
          title="Bên Rìa Thế Giới"
          subtitle="Mỗi bài viết là một hành trình khám phá, một góc nhìn mới về cuộc sống xung quanh ta"
          bgColor="from-[#5D866C] via-[#C2A68C] to-[#F5F5F0]"
        />
        
        {/* Final spacing */}
        <div className="h-screen bg-gradient-to-b from-[#F5F5F0] to-[#E6D8C3] flex items-center justify-center">
          <p className="text-4xl md:text-5xl font-bold text-[#5D866C] text-center px-6">
            Scroll để khám phá thêm...
          </p>
        </div>
      </main>
    </SmoothScroll>
  );
}