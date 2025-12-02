import { useMemo } from 'react';
import type { Post } from '@/lib/sanity';

interface Topic {
  _id: string;
  slug: {
    current: string;
  };
}

export function usePostFiltering(posts: Post[], searchQuery: string, topics: Topic[]) {
  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    
    const query = searchQuery.toLowerCase();
    return posts.filter(post => {
      const titleEn = post.title.en?.toLowerCase() || '';
      const titleVi = post.title.vi?.toLowerCase() || '';
      return titleEn.includes(query) || titleVi.includes(query);
    });
  }, [posts, searchQuery]);

  // Group posts by topic
  const groupedPosts = useMemo(() => {
    const groups: Record<string, Post[]> = {};

    // Initialize groups for all topics
    topics.forEach(topic => {
      groups[topic._id] = [];
    });
    groups['general'] = [];

    filteredPosts.forEach(post => {
      const topicSlug = post.topic?.slug?.current;

      if (topicSlug) {
        const topic = topics.find(t => t.slug.current === topicSlug);
        if (topic) {
          groups[topic._id].push(post);
        } else {
          groups['general'].push(post);
        }
      } else {
        groups['general'].push(post);
      }
    });

    return groups;
  }, [filteredPosts, topics]);

  return { filteredPosts, groupedPosts };
}
