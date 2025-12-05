import type { VideoCardVideo } from '@/components/cloud-walker/VideoCard';

/**
 * Extended video type with unique key for duplicated videos
 */
export interface DuplicatedVideo extends VideoCardVideo {
  _uniqueKey: string;
  _originalId: string;
}

/**
 * Duplicates videos to ensure minimum content for infinite scroll effect.
 * Each duplicated video gets a unique key to prevent React key conflicts.
 * 
 * @param videos - Original video array from Sanity
 * @param minItems - Minimum number of items needed for smooth scroll (default: 12)
 * @returns Array of videos with unique keys, length >= minItems
 */
export function duplicateVideosForInfiniteScroll(
  videos: VideoCardVideo[],
  minItems: number = 30
): DuplicatedVideo[] {
  // Handle empty array
  if (videos.length === 0) return [];
  
  // If already have enough videos, just add unique keys
  if (videos.length >= minItems) {
    return videos.map((video, index) => ({
      ...video,
      _uniqueKey: `${video._id}-0-${index}`,
      _originalId: video._id,
    }));
  }
  
  // Calculate minimum duplications needed
  const duplications = Math.ceil(minItems / videos.length);
  const result: DuplicatedVideo[] = [];
  
  for (let i = 0; i < duplications; i++) {
    videos.forEach((video, index) => {
      result.push({
        ...video,
        _uniqueKey: `${video._id}-${i}-${index}`,
        _originalId: video._id,
      });
    });
  }
  
  return result;
}

/**
 * Gets the unique key for a video, using _uniqueKey if available, otherwise _id
 */
export function getVideoKey(video: VideoCardVideo | DuplicatedVideo): string {
  return '_uniqueKey' in video ? video._uniqueKey : video._id;
}
