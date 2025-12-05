import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  CloudWalkerVideoRaw,
  serializeCloudWalkerVideo,
  deserializeCloudWalkerVideo,
  validateCloudWalkerVideo,
} from '../cloudWalkerTypes';

/**
 * **Feature: nguoi-di-tren-may, Property 14: Video Data Serialization Round-Trip**
 * **Validates: Requirements 6.1, 6.2, 6.3**
 *
 * For any valid Sanity video response, serializing to Video object and back
 * SHALL preserve all required fields (id, title, videoUrl, thumbnailUrl).
 */

// Arbitrary for generating valid Sanity asset references
const sanityAssetRefArb = fc.record({
  _ref: fc.stringMatching(/^image-[a-z0-9]+-[0-9]+x[0-9]+-[a-z]+$/),
  _type: fc.constant('reference'),
});

// Arbitrary for generating valid CloudWalkerVideoRaw objects
const cloudWalkerVideoRawArb: fc.Arbitrary<CloudWalkerVideoRaw> = fc.record({
  _id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  description: fc.option(fc.string({ maxLength: 1000 }), { nil: undefined }),
  videoUrl: fc.webUrl(),
  thumbnail: fc.record({
    asset: sanityAssetRefArb,
    hotspot: fc.option(
      fc.record({
        x: fc.float({ min: 0, max: 1 }),
        y: fc.float({ min: 0, max: 1 }),
        height: fc.float({ min: 0, max: 1 }),
        width: fc.float({ min: 0, max: 1 }),
      }),
      { nil: undefined }
    ),
    crop: fc.option(
      fc.record({
        top: fc.float({ min: 0, max: 1 }),
        bottom: fc.float({ min: 0, max: 1 }),
        left: fc.float({ min: 0, max: 1 }),
        right: fc.float({ min: 0, max: 1 }),
      }),
      { nil: undefined }
    ),
  }),
  publishedAt: fc.option(fc.date().map((d) => d.toISOString()), { nil: undefined }),
});

describe('CloudWalkerVideo Serialization', () => {
  it('Property 14: serializing then deserializing preserves required fields', () => {
    fc.assert(
      fc.property(cloudWalkerVideoRawArb, (rawVideo) => {
        // Serialize raw to video object
        const serialized = serializeCloudWalkerVideo(rawVideo);

        // Validate serialized object has all required fields
        expect(validateCloudWalkerVideo(serialized)).toBe(true);

        // Deserialize back to raw format
        const deserialized = deserializeCloudWalkerVideo(serialized);

        // Required fields should be preserved
        expect(deserialized._id).toBe(rawVideo._id);
        expect(deserialized.title).toBe(rawVideo.title);
        expect(deserialized.videoUrl).toBe(rawVideo.videoUrl);
        expect(deserialized.thumbnail.asset._ref).toBe(rawVideo.thumbnail.asset._ref);

        // Optional fields should be preserved when present
        if (rawVideo.description) {
          expect(deserialized.description).toBe(rawVideo.description);
        }
        if (rawVideo.publishedAt) {
          expect(deserialized.publishedAt).toBe(rawVideo.publishedAt);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('serialized video contains all required fields from Requirements 6.1', () => {
    fc.assert(
      fc.property(cloudWalkerVideoRawArb, (rawVideo) => {
        const serialized = serializeCloudWalkerVideo(rawVideo);

        // Requirements 6.1: id, title, description, videoUrl, thumbnailUrl
        expect(serialized).toHaveProperty('id');
        expect(serialized).toHaveProperty('title');
        expect(serialized).toHaveProperty('description');
        expect(serialized).toHaveProperty('videoUrl');
        expect(serialized).toHaveProperty('thumbnailUrl');

        // All required fields should be non-empty strings
        expect(typeof serialized.id).toBe('string');
        expect(serialized.id.length).toBeGreaterThan(0);
        expect(typeof serialized.title).toBe('string');
        expect(serialized.title.length).toBeGreaterThan(0);
        expect(typeof serialized.videoUrl).toBe('string');
        expect(serialized.videoUrl.length).toBeGreaterThan(0);
        expect(typeof serialized.thumbnailUrl).toBe('string');
        expect(serialized.thumbnailUrl.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('throws error when required fields are missing (Requirements 6.2)', () => {
    // Missing _id
    expect(() =>
      serializeCloudWalkerVideo({
        _id: '',
        title: 'Test',
        videoUrl: 'https://example.com/video.mp4',
        thumbnail: { asset: { _ref: 'image-abc-100x100-jpg' } },
      })
    ).toThrow('Missing required fields');

    // Missing title
    expect(() =>
      serializeCloudWalkerVideo({
        _id: 'test-id',
        title: '',
        videoUrl: 'https://example.com/video.mp4',
        thumbnail: { asset: { _ref: 'image-abc-100x100-jpg' } },
      })
    ).toThrow('Missing required fields');

    // Missing videoUrl
    expect(() =>
      serializeCloudWalkerVideo({
        _id: 'test-id',
        title: 'Test',
        videoUrl: '',
        thumbnail: { asset: { _ref: 'image-abc-100x100-jpg' } },
      })
    ).toThrow('Missing required fields');
  });

  it('formats data consistently for desktop and mobile (Requirements 6.3)', () => {
    fc.assert(
      fc.property(cloudWalkerVideoRawArb, (rawVideo) => {
        const serialized = serializeCloudWalkerVideo(rawVideo);

        // The same serialized format should work for both desktop and mobile
        // This means the structure is consistent regardless of viewport
        expect(serialized.id).toBeDefined();
        expect(serialized.title).toBeDefined();
        expect(serialized.videoUrl).toBeDefined();
        expect(serialized.thumbnailUrl).toBeDefined();
        expect(serialized.thumbnailAsset).toBeDefined();

        // Description should always be a string (empty if not provided)
        expect(typeof serialized.description).toBe('string');

        // publishedAt should be string or null
        expect(serialized.publishedAt === null || typeof serialized.publishedAt === 'string').toBe(
          true
        );
      }),
      { numRuns: 100 }
    );
  });
});
