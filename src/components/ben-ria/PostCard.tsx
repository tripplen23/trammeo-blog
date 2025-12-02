'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { urlForImage } from '@/lib/sanity';
import type { Post } from '@/lib/sanity';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const locale = useLocale() as 'en' | 'vi';
  const t = useTranslations('common');
  const title = post.title[locale] || post.title.vi;
  const excerpt = post.excerpt?.[locale] || post.excerpt?.vi || '';
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/ben-ria-the-gioi/${post.slug.current}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4">
          {post.coverImage?.asset && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <Image
                src={urlForImage(post.coverImage).width(800).height(600).url()}
                alt={post.coverImage?.alt || title || 'Blog post image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          )}
          {!post.coverImage?.asset && (
            <div className="w-full h-full bg-gradient-to-br from-[#E6D8C3] to-[#5D866C] flex items-center justify-center">
              <span className="text-white text-4xl font-bold opacity-20">
                {title?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="space-y-2">
          <time className="text-sm text-gray-500 font-medium">{formattedDate}</time>

          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-benria transition-colors duration-300 line-clamp-2">
            {title}
          </h3>

          {excerpt && (
            <p className="text-gray-600 line-clamp-3 leading-relaxed">{excerpt}</p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-[#E6D8C3] text-[#5D866C] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2">
            <span className="text-sm font-medium text-benria group-hover:underline">
              {t('readMore')} →
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
