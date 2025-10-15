import { groq } from 'next-sanity';

// Get all posts
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage,
    publishedAt,
    featured,
    tags
  }
`;

// Get posts by category
export const postsByCategoryQuery = groq`
  *[_type == "post" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage,
    publishedAt,
    featured,
    tags
  }
`;

// Get single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage,
    content,
    publishedAt,
    featured,
    tags
  }
`;

// Get featured posts
export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage,
    publishedAt,
    tags
  }
`;

// Get related posts (same category, different slug)
export const relatedPostsQuery = groq`
  *[_type == "post" && category == $category && slug.current != $slug] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage,
    publishedAt,
    tags
  }
`;

// Get all authors
export const authorsQuery = groq`
  *[_type == "author"] {
    _id,
    name,
    bio,
    image,
    social
  }
`;




