// Types for Cloud Walker Video feature

export interface SanityAssetReference {
  _ref: string;
  _type?: string;
}

export interface SanityImageAsset {
  asset: SanityAssetReference;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Raw response from Sanity GROQ query
export interface CloudWalkerVideoRaw {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail: SanityImageAsset;
  publishedAt?: string;
}

// Serialized video object for component use
export interface CloudWalkerVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  thumbnailAsset: SanityAssetReference;
  publishedAt: string | null;
}

// Serialize raw Sanity response to CloudWalkerVideo
export function serializeCloudWalkerVideo(raw: CloudWalkerVideoRaw): CloudWalkerVideo {
  if (!raw._id || !raw.title || !raw.videoUrl || !raw.thumbnail?.asset?._ref) {
    throw new Error('Missing required fields in video data');
  }

  return {
    id: raw._id,
    title: raw.title,
    description: raw.description || '',
    videoUrl: raw.videoUrl,
    thumbnailUrl: buildThumbnailUrl(raw.thumbnail.asset._ref),
    thumbnailAsset: raw.thumbnail.asset,
    publishedAt: raw.publishedAt || null,
  };
}

// Deserialize CloudWalkerVideo back to raw format (for round-trip testing)
export function deserializeCloudWalkerVideo(video: CloudWalkerVideo): CloudWalkerVideoRaw {
  return {
    _id: video.id,
    title: video.title,
    description: video.description || undefined,
    videoUrl: video.videoUrl,
    thumbnail: {
      asset: video.thumbnailAsset,
    },
    publishedAt: video.publishedAt || undefined,
  };
}

// Build thumbnail URL from Sanity asset reference
function buildThumbnailUrl(ref: string): string {
  // Sanity asset refs follow pattern: image-{id}-{dimensions}.{format}
  // Example: image-abc123-800x600-jpg
  const parts = ref.replace('image-', '').split('-');
  if (parts.length >= 2) {
    const id = parts.slice(0, -1).join('-');
    const formatPart = parts[parts.length - 1];
    return `https://cdn.sanity.io/images/${id}.${formatPart}`;
  }
  return ref;
}

// Validate that all required fields are present
export function validateCloudWalkerVideo(video: CloudWalkerVideo): boolean {
  return !!(
    video.id &&
    video.title &&
    video.videoUrl &&
    video.thumbnailUrl &&
    video.thumbnailAsset?._ref
  );
}
