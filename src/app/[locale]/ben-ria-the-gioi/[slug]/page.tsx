import { client, urlForImage } from '@/lib/sanity';
import { postBySlugQuery, relatedPostsQuery } from '@/lib/queries';
import type { Post } from '@/lib/sanity';
import { PortableText } from 'next-sanity';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import PostCard from '@/components/ben-ria/PostCard';
import ParallaxSection from '@/components/shared/ParallaxSection';
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
    title,
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
    <main className="min-h-screen bg-black">
      {/* Hero with Parallax */}
      {post.coverImage?.asset && (
        <ParallaxSection
          imageSrc={urlForImage(post.coverImage).width(1920).height(1080).url()}
          imageAlt={post.coverImage.alt || title}
          speed={0.5}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg px-6">
            {title}
          </h1>
          <time className="text-lg font-medium drop-shadow">{formattedDate}</time>
        </ParallaxSection>
      )}

      {/* Content */}
      <article className="w-full py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-4 py-2 bg-pink-50 text-benria rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Portable Text Content */}
          <div className="blog-content w-full space-y-6">
            <PortableText
              value={content}
              components={{
                types: {
                  image: ({ value }) => (
                    <div className="my-12 relative h-[500px] w-full">
                      <Image
                        src={urlForImage(value).width(1200).height(800).url()}
                        alt={value.alt || 'Post image'}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ),
                },
                block: {
                  h1: ({ children }) => (
                    <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-8 text-white">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-white">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-white">
                      {children}
                    </h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="text-lg md:text-xl font-bold mt-6 mb-3 text-white">
                      {children}
                    </h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className="text-base md:text-lg font-bold mt-4 mb-2 text-white">
                      {children}
                    </h6>
                  ),
                  normal: ({ children }) => (
                    <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-200">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-benria pl-6 py-4 my-8 italic text-lg md:text-xl text-gray-300 bg-gray-800/50 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  callout: ({ children }) => (
                    <div className="bg-blue-900/30 border-l-4 border-blue-400 p-6 my-8 rounded-r-lg">
                      <p className="text-lg md:text-xl leading-relaxed text-gray-200">
                        {children}
                      </p>
                    </div>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="list-disc list-outside ml-10 pl-4 my-6 space-y-2 text-base md:text-lg text-gray-300">
                      {children}
                    </ul>
                  ),
                  number: ({ children }) => (
                    <ol className="list-decimal list-outside ml-10 pl-4 my-6 space-y-2 text-base md:text-lg text-gray-300">
                      {children}
                    </ol>
                  ),
                  checkbox: ({ children }) => (
                    <ul className="list-none ml-10 my-6 space-y-2 text-base md:text-lg text-gray-300">
                      {children}
                    </ul>
                  ),
                },
                listItem: {
                  bullet: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  number: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  checkbox: ({ children }) => (
                    <li className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1.5 h-5 w-5 rounded border-gray-300"
                        disabled
                      />
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                },
                marks: {
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  underline: ({ children }) => (
                    <span className="underline">{children}</span>
                  ),
                  'strike-through': ({ children }) => (
                    <span className="line-through opacity-75">{children}</span>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-800 text-pink-400 px-2 py-1 rounded text-base font-mono">
                      {children}
                    </code>
                  ),
                  highlight: ({ children }) => (
                    <mark className="bg-yellow-400 text-gray-900 px-1 rounded">{children}</mark>
                  ),
                  link: ({ children, value }) => {
                    const target = value?.blank ? '_blank' : undefined;
                    const rel = value?.blank ? 'noopener noreferrer' : undefined;
                    return (
                      <a
                        href={value?.href}
                        target={target}
                        rel={rel}
                        className="text-benria hover:underline font-medium transition-colors"
                      >
                        {children}
                      </a>
                    );
                  },
                  color: ({ children, value }) => {
                    const colorMap: Record<string, string> = {
                      gray: 'text-gray-400',
                      brown: 'text-amber-400',
                      orange: 'text-orange-400',
                      yellow: 'text-yellow-400',
                      green: 'text-green-400',
                      blue: 'text-blue-400',
                      purple: 'text-purple-400',
                      pink: 'text-pink-400',
                      red: 'text-red-400',
                    };
                    const colorClass = colorMap[value?.value] || '';
                    return <span className={colorClass}>{children}</span>;
                  },
                },
              }}
            />
          </div>

          {/* Back Link */}
          <div className="mt-16 pt-8 border-t border-gray-300 text-center">
            <Link
              href="/ben-ria-the-gioi"
              className="inline-flex items-center text-white hover:text-gray-200 hover:underline text-lg font-medium"
            >
              ← {t('backTo', { section: 'Bên Rìa Thế Giới' })}
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="w-full bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">{t('relatedPosts')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost._id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}