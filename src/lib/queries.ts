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

// Get space travel photos
export const spaceTravelPhotosQuery = groq`
  *[_type == "spaceTravelPhoto"] | order(date desc) {
    _id,
    image {
      asset,
      hotspot,
      crop
    },
    caption,
    location,
    date
  }
`;

// Get cloud walker videos
export const cloudWalkerVideosQuery = groq`
  *[_type == "cloudWalkerVideo" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    description,
    "videoUrl": videoFile.asset->url,
    thumbnail {
      asset,
      hotspot,
      crop
    },
    publishedAt
  }
`;

// Get all gallery photos with new fields (images array, category, portfolioLink)
// Backward compatible: converts old 'image' field to 'images' array if needed
// Requirements: 2.1, 2.4
export const galleryPhotosQuery = groq`
  *[_type == "galleryPhoto" && !(_id in path("drafts.**"))] | order(date desc) {
    _id,
    "images": select(
      defined(images) => images[] {
        asset,
        hotspot,
        crop
      },
      defined(image) => [image {
        asset,
        hotspot,
        crop
      }],
      []
    ),
    category,
    portfolioLink,
    caption,
    location,
    date
  }
`;

// Get gallery photos by category
// Backward compatible: converts old 'image' field to 'images' array if needed
// Requirements: 4.2
export const galleryPhotosByCategoryQuery = groq`
  *[_type == "galleryPhoto" && category == $category && !(_id in path("drafts.**"))] | order(date desc) {
    _id,
    "images": select(
      defined(images) => images[] {
        asset,
        hotspot,
        crop
      },
      defined(image) => [image {
        asset,
        hotspot,
        crop
      }],
      []
    ),
    category,
    portfolioLink,
    caption,
    location,
    date
  }
`;