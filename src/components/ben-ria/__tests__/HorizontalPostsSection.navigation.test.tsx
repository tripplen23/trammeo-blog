import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostsExplorer from '../posts/PostsExplorer';
import type { Post } from '@/lib/sanity';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: { current: number; total: number }) => {
    const translations: Record<string, string> = {
      'latestPosts.title': 'Latest Posts',
      'seeAll': 'See All',
      'showLess': 'Show Less',
      'previous': 'Previous',
      'next': 'Next',
    };
    if (key === 'pageOf' && params) {
      return `Page ${params.current} of ${params.total}`;
    }
    return translations[key] || key;
  },
  useLocale: () => 'en',
}));

// Mock PostCard component
vi.mock('../PostCard', () => ({
  default: ({ post }: { post: Post }) => (
    <div data-testid={`post-card-${post._id}`}>
      {post.title.en}
    </div>
  ),
}));

// Helper function to create mock posts
const createMockPost = (id: string, publishedAt: string): Post => ({
  _id: id,
  title: { en: `Post ${id}`, vi: `Bài viết ${id}` },
  slug: { current: `post-${id}` },
  category: 'ben-ria-the-gioi',
  publishedAt,
  featured: false,
  topic: {
    title: { en: 'Test Topic', vi: 'Chủ đề test' },
    slug: { current: 'test-topic' },
  },
});

// Helper function to create mock topic
const createMockTopic = (id: string, title: string) => ({
  _id: id,
  title: { en: title, vi: title },
  slug: { current: id },
});

describe('PostsExplorer - Page Navigation Behavior', () => {
  describe('6.1 Next button functionality', () => {
    it('should increment page index when Next button is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts to have 3 pages (3, 3, 1)
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination by clicking See All
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Verify we're on page 1
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      
      // Click Next button
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify page index incremented to page 2
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });
    });

    it('should update displayed posts to next page when Next is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts with distinct IDs
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Verify first page shows posts 1, 2, 3 (most recent)
      expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('post-card-3')).toBeInTheDocument();
      expect(screen.queryByTestId('post-card-4')).not.toBeInTheDocument();
      
      // Click Next
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify second page shows posts 4, 5, 6
      await waitFor(() => {
        expect(screen.queryByTestId('post-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('post-card-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('post-card-3')).not.toBeInTheDocument();
        expect(screen.getByTestId('post-card-4')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-5')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-6')).toBeInTheDocument();
      });
    });

    it('should disable Next button when on last page', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts to have 3 pages
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Next button should be enabled on page 1
      let nextButton = screen.getByText('Next');
      expect(nextButton).not.toBeDisabled();
      
      // Navigate to page 2
      await user.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });
      
      // Next button should still be enabled on page 2
      nextButton = screen.getByText('Next');
      expect(nextButton).not.toBeDisabled();
      
      // Navigate to page 3 (last page)
      await user.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
      });
      
      // Next button should be disabled on last page
      nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });
  });

  describe('6.2 Previous button functionality', () => {
    it('should decrement page index when Previous button is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts to have 3 pages
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to page 2
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });
      
      // Click Previous button
      const previousButton = screen.getByText('Previous');
      await user.click(previousButton);
      
      // Verify page index decremented to page 1
      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });
    });

    it('should update displayed posts to previous page when Previous is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to page 2
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify we're on page 2 with posts 4, 5, 6
      await waitFor(() => {
        expect(screen.getByTestId('post-card-4')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-5')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-6')).toBeInTheDocument();
      });
      
      // Click Previous
      const previousButton = screen.getByText('Previous');
      await user.click(previousButton);
      
      // Verify we're back on page 1 with posts 1, 2, 3
      await waitFor(() => {
        expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-3')).toBeInTheDocument();
        expect(screen.queryByTestId('post-card-4')).not.toBeInTheDocument();
      });
    });

    it('should disable Previous button when on first page', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts to have 3 pages
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Previous button should be disabled on page 1
      let previousButton = screen.getByText('Previous');
      expect(previousButton).toBeDisabled();
      
      // Navigate to page 2
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });
      
      // Previous button should be enabled on page 2
      previousButton = screen.getByText('Previous');
      expect(previousButton).not.toBeDisabled();
      
      // Navigate back to page 1
      await user.click(previousButton);
      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });
      
      // Previous button should be disabled again on page 1
      previousButton = screen.getByText('Previous');
      expect(previousButton).toBeDisabled();
    });
  });

  describe('7.1 See All activation', () => {
    it('should activate pagination mode when See All is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 5 posts (more than 3 to show See All button)
      const posts = [
        createMockPost('1', '2024-01-05T00:00:00Z'),
        createMockPost('2', '2024-01-04T00:00:00Z'),
        createMockPost('3', '2024-01-03T00:00:00Z'),
        createMockPost('4', '2024-01-02T00:00:00Z'),
        createMockPost('5', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Verify See All button is visible initially
      const seeAllButton = screen.getByText('See All');
      expect(seeAllButton).toBeInTheDocument();
      
      // Verify pagination controls are not visible
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
      
      // Click See All
      await user.click(seeAllButton);
      
      // Verify pagination mode is activated
      await waitFor(() => {
        // Pagination controls should appear
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
    });

    it('should set page index to 0 when See All is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 5 posts
      const posts = [
        createMockPost('1', '2024-01-05T00:00:00Z'),
        createMockPost('2', '2024-01-04T00:00:00Z'),
        createMockPost('3', '2024-01-03T00:00:00Z'),
        createMockPost('4', '2024-01-02T00:00:00Z'),
        createMockPost('5', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Click See All
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Verify page index is set to 0 (page 1 of 2)
      await waitFor(() => {
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      });
    });

    it('should display pagination controls when See All is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 5 posts
      const posts = [
        createMockPost('1', '2024-01-05T00:00:00Z'),
        createMockPost('2', '2024-01-04T00:00:00Z'),
        createMockPost('3', '2024-01-03T00:00:00Z'),
        createMockPost('4', '2024-01-02T00:00:00Z'),
        createMockPost('5', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Click See All
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Verify pagination controls appear
      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      });
    });

    it('should hide See All button when pagination is activated', async () => {
      const user = userEvent.setup();
      
      // Create 5 posts
      const posts = [
        createMockPost('1', '2024-01-05T00:00:00Z'),
        createMockPost('2', '2024-01-04T00:00:00Z'),
        createMockPost('3', '2024-01-03T00:00:00Z'),
        createMockPost('4', '2024-01-02T00:00:00Z'),
        createMockPost('5', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Verify See All button is visible initially
      const seeAllButton = screen.getByText('See All');
      expect(seeAllButton).toBeInTheDocument();
      
      // Click See All
      await user.click(seeAllButton);
      
      // Verify See All button is hidden
      await waitFor(() => {
        expect(screen.queryByText('See All')).not.toBeInTheDocument();
      });
      
      // Verify Show Less button appears instead
      expect(screen.getByText('Show Less')).toBeInTheDocument();
    });
  });

  describe('7.2 Show Less deactivation', () => {
    it('should deactivate pagination mode when Show Less is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 5 posts
      const posts = [
        createMockPost('1', '2024-01-05T00:00:00Z'),
        createMockPost('2', '2024-01-04T00:00:00Z'),
        createMockPost('3', '2024-01-03T00:00:00Z'),
        createMockPost('4', '2024-01-02T00:00:00Z'),
        createMockPost('5', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Verify pagination is active
      await waitFor(() => {
        expect(screen.getByText('Show Less')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      
      // Click Show Less
      const showLessButton = screen.getByText('Show Less');
      await user.click(showLessButton);
      
      // Verify pagination mode is deactivated
      await waitFor(() => {
        expect(screen.queryByText('Previous')).not.toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
        expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
      });
    });

    it('should clear page index when Show Less is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts to have multiple pages
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to page 2
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify we're on page 2
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });
      
      // Click Show Less
      const showLessButton = screen.getByText('Show Less');
      await user.click(showLessButton);
      
      // Verify pagination is deactivated
      await waitFor(() => {
        expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
      });
      
      // Re-activate pagination and verify we're back on page 1
      const seeAllButtonAgain = screen.getByText('See All');
      await user.click(seeAllButtonAgain);
      
      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });
    });

    it('should hide pagination controls when Show Less is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 5 posts
      const posts = [
        createMockPost('1', '2024-01-05T00:00:00Z'),
        createMockPost('2', '2024-01-04T00:00:00Z'),
        createMockPost('3', '2024-01-03T00:00:00Z'),
        createMockPost('4', '2024-01-02T00:00:00Z'),
        createMockPost('5', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Verify pagination controls are visible
      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      });
      
      // Click Show Less
      const showLessButton = screen.getByText('Show Less');
      await user.click(showLessButton);
      
      // Verify pagination controls are hidden
      await waitFor(() => {
        expect(screen.queryByText('Previous')).not.toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
        expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
      });
    });

    it('should show See All button again when Show Less is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 5 posts
      const posts = [
        createMockPost('1', '2024-01-05T00:00:00Z'),
        createMockPost('2', '2024-01-04T00:00:00Z'),
        createMockPost('3', '2024-01-03T00:00:00Z'),
        createMockPost('4', '2024-01-02T00:00:00Z'),
        createMockPost('5', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Verify See All is hidden and Show Less is visible
      await waitFor(() => {
        expect(screen.queryByText('See All')).not.toBeInTheDocument();
        expect(screen.getByText('Show Less')).toBeInTheDocument();
      });
      
      // Click Show Less
      const showLessButton = screen.getByText('Show Less');
      await user.click(showLessButton);
      
      // Verify See All button reappears
      await waitFor(() => {
        expect(screen.getByText('See All')).toBeInTheDocument();
        expect(screen.queryByText('Show Less')).not.toBeInTheDocument();
      });
    });

    it('should display first 3 posts when Show Less is clicked', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Verify initial state shows first 3 posts
      expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('post-card-3')).toBeInTheDocument();
      expect(screen.queryByTestId('post-card-4')).not.toBeInTheDocument();
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to page 2
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify we're on page 2 with posts 4, 5, 6
      await waitFor(() => {
        expect(screen.getByTestId('post-card-4')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-5')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-6')).toBeInTheDocument();
        expect(screen.queryByTestId('post-card-1')).not.toBeInTheDocument();
      });
      
      // Click Show Less
      const showLessButton = screen.getByText('Show Less');
      await user.click(showLessButton);
      
      // Verify we're back to showing first 3 posts
      await waitFor(() => {
        expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-3')).toBeInTheDocument();
        expect(screen.queryByTestId('post-card-4')).not.toBeInTheDocument();
        expect(screen.queryByTestId('post-card-5')).not.toBeInTheDocument();
        expect(screen.queryByTestId('post-card-6')).not.toBeInTheDocument();
      });
    });
  });

  describe('9.1 Topics with 3 or fewer posts', () => {
    it('should display all posts for topic with 0 posts', () => {
      const posts: Post[] = [];
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Topic section heading should not render when there are no posts
      // (though the filter button will still be present)
      const topicHeadings = screen.queryAllByRole('heading', { name: 'Test Topic' });
      expect(topicHeadings).toHaveLength(0);
      
      // No post cards should be rendered
      expect(screen.queryByTestId(/post-card-/)).not.toBeInTheDocument();
    });

    it('should display all posts for topic with 1 post', () => {
      const posts = [
        createMockPost('1', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Should display the 1 post
      expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
      
      // See All button should not be visible
      expect(screen.queryByText('See All')).not.toBeInTheDocument();
      
      // Pagination controls should not be visible
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('should display all posts for topic with 2 posts', () => {
      const posts = [
        createMockPost('1', '2024-01-02T00:00:00Z'),
        createMockPost('2', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Should display both posts
      expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-card-2')).toBeInTheDocument();
      
      // See All button should not be visible
      expect(screen.queryByText('See All')).not.toBeInTheDocument();
      
      // Pagination controls should not be visible
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('should display all posts for topic with exactly 3 posts', () => {
      const posts = [
        createMockPost('1', '2024-01-03T00:00:00Z'),
        createMockPost('2', '2024-01-02T00:00:00Z'),
        createMockPost('3', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Should display all 3 posts
      expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('post-card-3')).toBeInTheDocument();
      
      // See All button should not be visible (only shows when > 3 posts)
      expect(screen.queryByText('See All')).not.toBeInTheDocument();
      
      // Pagination controls should not be visible
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('should never show pagination controls for topics with 3 or fewer posts', async () => {
      const user = userEvent.setup();
      
      // Create 3 posts
      const posts = [
        createMockPost('1', '2024-01-03T00:00:00Z'),
        createMockPost('2', '2024-01-02T00:00:00Z'),
        createMockPost('3', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Verify no See All button
      expect(screen.queryByText('See All')).not.toBeInTheDocument();
      
      // Verify no pagination controls
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
      expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
      
      // Try clicking on the topic heading (should not activate pagination)
      const topicTitle = screen.getByRole('heading', { name: 'Test Topic' });
      await user.click(topicTitle);
      
      // Still no pagination controls
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });
  });

  describe('8.1 Filter change behavior', () => {
    it('should reset pagination state when All filter is clicked', async () => {
      const user = userEvent.setup();
      
      // Create two topics with posts
      const posts = [
        { ...createMockPost('1', '2024-01-07T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('2', '2024-01-06T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('3', '2024-01-05T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('4', '2024-01-04T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('5', '2024-01-03T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
      ];
      
      const topics = [createMockTopic('topic-a', 'Topic A')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to page 2
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify we're on page 2
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
      });
      
      // Click All filter
      const allButton = screen.getByText('All');
      await user.click(allButton);
      
      // Verify pagination is reset - pagination controls should be hidden
      await waitFor(() => {
        expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
        expect(screen.queryByText('Show Less')).not.toBeInTheDocument();
      });
      
      // Verify See All button is back
      expect(screen.getByText('See All')).toBeInTheDocument();
    });

    it('should reset pagination state when topic filter is clicked', async () => {
      const user = userEvent.setup();
      
      // Create two topics with posts
      const posts = [
        { ...createMockPost('1', '2024-01-07T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('2', '2024-01-06T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('3', '2024-01-05T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('4', '2024-01-04T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('5', '2024-01-03T00:00:00Z'), topic: { title: { en: 'Topic B', vi: 'Topic B' }, slug: { current: 'topic-b' } } },
        { ...createMockPost('6', '2024-01-02T00:00:00Z'), topic: { title: { en: 'Topic B', vi: 'Topic B' }, slug: { current: 'topic-b' } } },
        { ...createMockPost('7', '2024-01-01T00:00:00Z'), topic: { title: { en: 'Topic B', vi: 'Topic B' }, slug: { current: 'topic-b' } } },
        { ...createMockPost('8', '2024-01-01T00:00:00Z'), topic: { title: { en: 'Topic B', vi: 'Topic B' }, slug: { current: 'topic-b' } } },
      ];
      
      const topics = [
        createMockTopic('topic-a', 'Topic A'),
        createMockTopic('topic-b', 'Topic B'),
      ];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Filter to Topic A using getByRole to target the button specifically
      const topicAButton = screen.getByRole('button', { name: 'Topic A' });
      await user.click(topicAButton);
      
      // Activate pagination for Topic A
      await waitFor(() => {
        expect(screen.getByText('See All')).toBeInTheDocument();
      });
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to page 2
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify we're on page 2
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
      });
      
      // Click Topic B filter using getByRole to target the button specifically
      const topicBButton = screen.getByRole('button', { name: 'Topic B' });
      await user.click(topicBButton);
      
      // Verify pagination is reset - pagination controls should be hidden
      await waitFor(() => {
        expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
        expect(screen.queryByText('Show Less')).not.toBeInTheDocument();
      });
      
      // Verify See All button is back for Topic B
      expect(screen.getByText('See All')).toBeInTheDocument();
    });

    it('should reset pagination state when General filter is clicked', async () => {
      const user = userEvent.setup();
      
      // Create posts with and without topics
      const posts = [
        { ...createMockPost('1', '2024-01-07T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('2', '2024-01-06T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('3', '2024-01-05T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('4', '2024-01-04T00:00:00Z'), topic: { title: { en: 'Topic A', vi: 'Topic A' }, slug: { current: 'topic-a' } } },
        { ...createMockPost('5', '2024-01-03T00:00:00Z'), topic: undefined },
        { ...createMockPost('6', '2024-01-02T00:00:00Z'), topic: undefined },
        { ...createMockPost('7', '2024-01-01T00:00:00Z'), topic: undefined },
        { ...createMockPost('8', '2024-01-01T00:00:00Z'), topic: undefined },
      ];
      
      const topics = [createMockTopic('topic-a', 'Topic A')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Filter to Topic A using getByRole to target the button specifically
      const topicAButton = screen.getByRole('button', { name: 'Topic A' });
      await user.click(topicAButton);
      
      // Activate pagination for Topic A
      await waitFor(() => {
        expect(screen.getByText('See All')).toBeInTheDocument();
      });
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to page 2
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify we're on page 2
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
      });
      
      // Click General filter
      const generalButton = screen.getByText('General');
      await user.click(generalButton);
      
      // Verify pagination is reset - pagination controls should be hidden
      await waitFor(() => {
        expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
        expect(screen.queryByText('Show Less')).not.toBeInTheDocument();
      });
      
      // Verify See All button is back for General
      expect(screen.getByText('See All')).toBeInTheDocument();
    });
  });

  describe('9.2 Last page with partial posts', () => {
    it('should display only 1 post on last page when topic has 7 posts', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts (3 pages: 3, 3, 1)
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to page 2
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      let nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify we're on page 2
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });
      
      // Navigate to page 3 (last page)
      nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Verify we're on page 3
      await waitFor(() => {
        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
      });
      
      // Verify only 1 post is displayed (post 7)
      expect(screen.getByTestId('post-card-7')).toBeInTheDocument();
      expect(screen.queryByTestId('post-card-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-3')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-4')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-5')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-6')).not.toBeInTheDocument();
    });

    it('should disable Next button on last page with 1 post', async () => {
      const user = userEvent.setup();
      
      // Create 7 posts (3 pages: 3, 3, 1)
      const posts = [
        createMockPost('1', '2024-01-07T00:00:00Z'),
        createMockPost('2', '2024-01-06T00:00:00Z'),
        createMockPost('3', '2024-01-05T00:00:00Z'),
        createMockPost('4', '2024-01-04T00:00:00Z'),
        createMockPost('5', '2024-01-03T00:00:00Z'),
        createMockPost('6', '2024-01-02T00:00:00Z'),
        createMockPost('7', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to last page
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      
      let nextButton = screen.getByText('Next');
      await user.click(nextButton); // Go to page 2
      
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });
      
      nextButton = screen.getByText('Next');
      await user.click(nextButton); // Go to page 3
      
      await waitFor(() => {
        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
      });
      
      // Verify Next button is disabled
      nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });

    it('should display only 2 posts on last page when topic has 8 posts', async () => {
      const user = userEvent.setup();
      
      // Create 8 posts (3 pages: 3, 3, 2)
      const posts = [
        createMockPost('1', '2024-01-08T00:00:00Z'),
        createMockPost('2', '2024-01-07T00:00:00Z'),
        createMockPost('3', '2024-01-06T00:00:00Z'),
        createMockPost('4', '2024-01-05T00:00:00Z'),
        createMockPost('5', '2024-01-04T00:00:00Z'),
        createMockPost('6', '2024-01-03T00:00:00Z'),
        createMockPost('7', '2024-01-02T00:00:00Z'),
        createMockPost('8', '2024-01-01T00:00:00Z'),
      ];
      
      const topics = [createMockTopic('test-topic', 'Test Topic')];
      
      render(<PostsExplorer posts={posts} topics={topics} />);
      
      // Activate pagination
      const seeAllButton = screen.getByText('See All');
      await user.click(seeAllButton);
      
      // Navigate to last page
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      
      let nextButton = screen.getByText('Next');
      await user.click(nextButton); // Go to page 2
      
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });
      
      nextButton = screen.getByText('Next');
      await user.click(nextButton); // Go to page 3
      
      await waitFor(() => {
        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
      });
      
      // Verify only 2 posts are displayed (posts 7 and 8)
      expect(screen.getByTestId('post-card-7')).toBeInTheDocument();
      expect(screen.getByTestId('post-card-8')).toBeInTheDocument();
      expect(screen.queryByTestId('post-card-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-3')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-4')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-5')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-card-6')).not.toBeInTheDocument();
    });
  });
});

