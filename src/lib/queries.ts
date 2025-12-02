import { groq } from 'next-sanity';

// Get all posts
export const postsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage {
      asset,
      alt
    },
    publishedAt,
    featured,
    tags
  }
`;

// Get all topics
export const topicsQuery = groq`
  *[_type == "topic"] {
    _id,
    title,
    slug,
    description
  }
`;

// Get posts by category
export const postsByCategoryQuery = groq`
  *[_type == "post" && category == $category && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage {
      asset,
      alt
    },
    publishedAt,
    featured,
    tags,
    topic->{
      title,
      slug
    }
  }
`;

// Get single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage {
      asset,
      alt
    },
    content,
    publishedAt,
    featured,
    tags
  }
`;

// Get featured posts
export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage {
      asset,
      alt
    },
    publishedAt,
    tags
  }
`;

// Get related posts (same category, different slug)
export const relatedPostsQuery = groq`
  *[_type == "post" && category == $category && slug.current != $slug && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage {
      asset,
      alt
    },
    publishedAt,
    tags
  }
`;

// Get all authors
export const authorsQuery = groq`
  * [_type == "author"] {
  _id,
    name,
    bio,
    image,
    social
}
`;




