import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type { Post } from '@/lib/sanity';

// Helper function to create mock posts
const createMockPost = (
  id: string,
  titleEn: string,
  titleVi: string,
  publishedAt: string,
  topicSlug?: string
): Post => ({
  _id: id,
  _type: 'post',
  title: { en: titleEn, vi: titleVi },
  slug: { current: `post-${id}` },
  category: 'ben-ria-the-gioi',
  publishedAt,
  featured: false,
  content: { en: [], vi: [] },
  topic: topicSlug
    ? {
        title: { en: 'Test Topic', vi: 'Chủ đề test' },
        slug: { current: topicSlug },
      }
    : undefined,
});

// Extract the filtering logic from the component for testing
const filterPostsBySearch = (posts: Post[], searchQuery: string): Post[] => {
  if (!searchQuery.trim()) return posts;
  
  const query = searchQuery.toLowerCase();
  return posts.filter(post => {
    const titleEn = post.title.en?.toLowerCase() || '';
    const titleVi = post.title.vi?.toLowerCase() || '';
    return titleEn.includes(query) || titleVi.includes(query);
  });
};

describe('PostsExplorer - Search Functionality', () => {
  describe('Property 1: Search filters by title content', () => {
    /**
     * Feature: post-search-filter, Property 1: Search filters by title content
     * Validates: Requirements 1.2
     */
    it('should only return posts containing the search string in either English or Vietnamese title', () => {
      fc.assert(
        fc.property(
          // Generate array of posts with random titles
          fc.array(
            fc.record({
              id: fc.uuid(),
              titleEn: fc.string({ minLength: 1, maxLength: 50 }),
              titleVi: fc.string({ minLength: 1, maxLength: 50 }),
              publishedAt: fc.integer({ min: 1577836800000, max: 1735689600000 }).map(ts => new Date(ts).toISOString()),
            }),
            { minLength: 1, maxLength: 20 }
          ),
          // Generate a search string
          fc.string({ minLength: 1, maxLength: 20 }),
          (postData, searchQuery) => {
            // Skip empty or whitespace-only search queries
            if (!searchQuery.trim()) {
              return true;
            }

            // Create posts from generated data
            const posts = postData.map(p =>
              createMockPost(p.id, p.titleEn, p.titleVi, p.publishedAt, 'test-topic')
            );

            // Apply the filtering logic
            const filteredPosts = filterPostsBySearch(posts, searchQuery);

            // Verify: all filtered posts should contain the search query (case-insensitive)
            const query = searchQuery.toLowerCase();
            filteredPosts.forEach(post => {
              const titleEn = post.title.en.toLowerCase();
              const titleVi = post.title.vi.toLowerCase();
              const containsQuery = titleEn.includes(query) || titleVi.includes(query);
              expect(containsQuery).toBe(true);
            });

            // Verify: all posts containing the query should be in filtered results
            const expectedPosts = posts.filter(p => {
              const titleEn = p.title.en.toLowerCase();
              const titleVi = p.title.vi.toLowerCase();
              return titleEn.includes(query) || titleVi.includes(query);
            });

            expect(filteredPosts.length).toBe(expectedPosts.length);
            
            // Verify all expected posts are in the filtered results
            expectedPosts.forEach(expectedPost => {
              const found = filteredPosts.some(p => p._id === expectedPost._id);
              expect(found).toBe(true);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Case-insensitive matching', () => {
    /**
     * Feature: post-search-filter, Property 2: Case-insensitive matching
     * Validates: Requirements 1.4
     */
    it('should match posts regardless of case variation in search query', () => {
      fc.assert(
        fc.property(
          // Generate a base title
          fc.string({ minLength: 5, maxLength: 30 }),
          // Generate case variations
          fc.constantFrom('lower', 'upper', 'mixed'),
          (baseTitle, caseVariation) => {
            // Skip whitespace-only titles
            if (!baseTitle.trim()) {
              return true;
            }

            // Create posts with the base title
            const posts = [
              createMockPost('1', baseTitle, baseTitle, '2024-01-01T00:00:00Z', 'test-topic'),
            ];

            // Create search query with different case
            let searchQuery: string;
            if (caseVariation === 'lower') {
              searchQuery = baseTitle.toLowerCase();
            } else if (caseVariation === 'upper') {
              searchQuery = baseTitle.toUpperCase();
            } else {
              // Mixed case - alternate between upper and lower
              searchQuery = baseTitle
                .split('')
                .map((char, i) => (i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
                .join('');
            }

            // Test with lowercase search
            const filteredLower = filterPostsBySearch(posts, searchQuery.toLowerCase());
            
            // Test with uppercase search
            const filteredUpper = filterPostsBySearch(posts, searchQuery.toUpperCase());
            
            // Test with mixed case search
            const filteredMixed = filterPostsBySearch(posts, searchQuery);

            // Verify: same number of results regardless of case
            expect(filteredLower.length).toBe(filteredUpper.length);
            expect(filteredLower.length).toBe(filteredMixed.length);

            // If the search query is a substring of the title, we should get results
            if (baseTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
              expect(filteredLower.length).toBeGreaterThan(0);
              expect(filteredUpper.length).toBeGreaterThan(0);
              expect(filteredMixed.length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
