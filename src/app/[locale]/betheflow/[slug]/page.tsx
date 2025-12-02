import { client, urlForImage } from '@/lib/sanity';
import { postBySlugQuery, relatedPostsQuery } from '@/lib/queries';
import type { Post } from '@/lib/sanity';
import { PortableText } from 'next-sanity';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import PostCard from '@/components/betheflow/PostCard';
import ParallaxSection from '@/components/betheflow/ParallaxSection';
import { Link } from '@/i18n/routing';

interface PostPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

async function getPost(slug: string) {
  const post = await client.fetch<Post>(postBySlugQuery, { slug });
  if (!post) return null;
  return post;
}

async function getRelatedPosts(category: string, slug: string) {
  const posts = await client.fetch<Post[]>(relatedPostsQuery, {
    category,
    slug,
  });
  return posts;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug, locale } = await params;
  const post = await getPost(slug);

  if (!post) return { title: 'Post Not Found' };

  const title = post.title[locale as 'en' | 'vi'] || post.title.en;
  const excerpt = post.excerpt?.[locale as 'en' | 'vi'] || post.excerpt?.en || '';

  return {
    title: `${title} - BeTheFlow`,
    description: excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const locale = await getLocale() as 'en' | 'vi';
  const t = await getTranslations({ locale, namespace: 'common' });
  
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, slug);
  const title = post.title[locale] || post.title.en;
  const content = post.content[locale] || post.content.en;
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      {/* Hero with Parallax */}
      {post.coverImage?.asset && (
        <ParallaxSection
          imageSrc={urlForImage(post.coverImage).width(1920).height(1080).url()}
          imageAlt={post.coverImage.alt || title}
          speed={0.6}
        >
          <div className="text-5xl mb-4">☕</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h1>
          <time className="text-lg font-medium drop-shadow">{formattedDate}</time>
        </ParallaxSection>
      )}

      {/* Content */}
      <article className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 bg-amber-100 text-betheflow rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Portable Text Content */}
          <div className="prose prose-lg prose-amber max-w-none">
            <PortableText
              value={content}
              components={{
                types: {
                  image: ({ value }) => (
                    <div className="my-8 relative h-96 rounded-xl overflow-hidden">
                      <Image
                        src={urlForImage(value).width(800).height(600).url()}
                        alt={value.alt || 'Post image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ),
                },
                marks: {
                  link: ({ children, value }) => (
                    <a
                      href={value.href}
                      className="text-betheflow hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                },
                block: {
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-betheflow pl-4 italic my-6 text-gray-700">
                      {children}
                    </blockquote>
                  ),
                },
              }}
            />
          </div>

          {/* Back Link */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/betheflow"
              className="inline-flex items-center text-betheflow hover:underline font-medium"
            >
              ← {t('backTo', { section: 'BeTheFlow' })}
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('relatedPosts')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost, index) => (
              <PostCard key={relatedPost._id} post={relatedPost} index={index} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}




