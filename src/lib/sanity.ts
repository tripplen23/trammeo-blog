import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { PortableTextBlock } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

// Types
export interface LocalizedString {
  en: string;
  vi: string;
}

export interface LocalizedText {
  en: string;
  vi: string;
}

// Using Sanity's Portable Text block type
export interface LocalizedContent {
  en: PortableTextBlock[];
  vi: PortableTextBlock[];
}

export interface Post {
  _id: string;
  _type: 'post';
  title: LocalizedString;
  slug: {
    current: string;
  };
  category: 'ben-ria-the-gioi' | 'betheflow';
  excerpt?: LocalizedText;
  coverImage?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  content: LocalizedContent;
  publishedAt: string;
  featured: boolean;
  tags?: string[];
  topic?: {
    title: LocalizedString;
    slug: {
      current: string;
    };
  };
}

export interface Author {
  _id: string;
  _type: 'author';
  name: string;
  bio?: LocalizedText;
  image?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  social?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}