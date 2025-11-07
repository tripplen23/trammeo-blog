'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity';
import type { Post } from '@/lib/sanity';

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const title = post.title.vi;
  const excerpt = post.excerpt?.vi || '';
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('vi', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/betheflow/${post.slug.current}`}>
      <motion.article
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
      >
        <div className="relative overflow-hidden aspect-[16/10]">
          {post.coverImage && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Image
                src={urlForImage(post.coverImage).width(800).height(500).url()}
                alt={post.coverImage.alt || title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-transparent to-transparent" />
          
          {/* Coffee Steam Effect */}
          <div className="absolute bottom-4 right-4 text-white text-4xl opacity-70 group-hover:opacity-100 transition-opacity">
            ☕
          </div>
        </div>

        <div className="p-6 space-y-3">
          <time className="text-sm text-amber-600 font-semibold">{formattedDate}</time>
          
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-betheflow transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          
          {excerpt && (
            <p className="text-gray-600 line-clamp-2 leading-relaxed">{excerpt}</p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-amber-50 text-betheflow rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-betheflow group-hover:gap-3 transition-all">
              Đọc Thêm
            </span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
