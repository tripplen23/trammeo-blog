import PostsGrid from './PostsGrid';
import PaginationControls from './PaginationControls';
import type { Post } from '@/lib/sanity';

interface TopicSectionProps {
  title: string;
  posts: Post[];
  displayedPosts: Post[];
  isPaginationActive: boolean;
  shouldShowSeeAll: boolean;
  currentPage: number;
  totalPages: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onActivatePagination: () => void;
  onDeactivatePagination: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  seeAllLabel: string;
  showLessLabel: string;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
}

export default function TopicSection({
  title,
  posts,
  displayedPosts,
  isPaginationActive,
  shouldShowSeeAll,
  currentPage,
  totalPages,
  canGoPrevious,
  canGoNext,
  onActivatePagination,
  onDeactivatePagination,
  onPreviousPage,
  onNextPage,
  seeAllLabel,
  showLessLabel,
  previousLabel,
  nextLabel,
  pageLabel,
}: TopicSectionProps) {
  if (!posts.length) return null;

  return (
    <section>
      <div className="flex justify-between items-end mb-8 border-b border-black/10 pb-4">
        <h3 className="text-3xl md:text-4xl font-bold text-black">
          {title}
        </h3>
        {!isPaginationActive && shouldShowSeeAll && (
          <button
            onClick={onActivatePagination}
            className="text-sm font-medium uppercase tracking-wider text-black/60 hover:text-black transition-colors cursor-pointer"
          >
            {seeAllLabel}
          </button>
        )}
        {isPaginationActive && (
          <button
            onClick={onDeactivatePagination}
            className="text-sm font-medium uppercase tracking-wider text-black/60 hover:text-black transition-colors cursor-pointer"
          >
            {showLessLabel}
          </button>
        )}
      </div>

      {isPaginationActive && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPrevious={onPreviousPage}
          onNext={onNextPage}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          pageLabel={pageLabel}
        />
      )}

      <PostsGrid posts={displayedPosts} />
    </section>
  );
}
