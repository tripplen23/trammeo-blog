'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Post } from '@/lib/sanity';
import { usePagination } from '@/hooks/usePagination';
import { usePostFiltering } from '@/hooks/usePostFiltering';
import SearchBar from './SearchBar';
import TopicFilters from './TopicFilters';
import TopicSection from './TopicSection';

interface Topic {
  _id: string;
  title: {
    en: string;
    vi: string;
  };
  slug: {
    current: string;
  };
  description?: {
    en: string;
    vi: string;
  };
}

interface PostsExplorerProps {
  posts: Post[];
  topics: Topic[];
}

const POSTS_PER_PAGE = 3;

export default function PostsExplorer({ posts, topics }: PostsExplorerProps) {
  const t = useTranslations('benRia');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const pagination = usePagination();
  const { groupedPosts } = usePostFiltering(posts, searchQuery, topics);

  const handleTopicChange = (topicId: string | null) => {
    setSelectedTopic(topicId);
    pagination.resetPagination();
  };

  const getDisplayedPosts = (topicId: string, allPosts: Post[]) => {
    const sortedPosts = [...allPosts].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    if (!pagination.isPaginationActive(topicId)) {
      return sortedPosts.slice(0, POSTS_PER_PAGE);
    }

    const pageIndex = pagination.getCurrentPage(topicId);
    const start = pageIndex * POSTS_PER_PAGE;
    const end = (pageIndex + 1) * POSTS_PER_PAGE;
    return sortedPosts.slice(start, end);
  };

  const getTotalPages = (postCount: number) => Math.ceil(postCount / POSTS_PER_PAGE);
  const shouldShowSeeAll = (postCount: number) => postCount > POSTS_PER_PAGE;

  const filteredTopics = selectedTopic
    ? topics.filter(t => t._id === selectedTopic)
    : topics;

  const showGeneral = groupedPosts['general']?.length > 0 && 
    (!selectedTopic || selectedTopic === 'general');

  return (
    <div className="min-h-screen bg-[#F5F5F0] py-20 px-6 md:px-12">
      <div className="mb-12">
        <h2 className="text-5xl md:text-6xl font-bold text-black mb-8">
          {t('latestPosts.title')}
        </h2>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('search.placeholder')}
        />

        <TopicFilters
          topics={topics}
          selectedTopic={selectedTopic}
          onTopicChange={handleTopicChange}
          showGeneral={groupedPosts['general']?.length > 0}
        />
      </div>

      <div className="space-y-20">
        {filteredTopics.map(topic => {
          const topicPosts = groupedPosts[topic._id];
          const displayedPosts = getDisplayedPosts(topic._id, topicPosts);
          const totalPages = getTotalPages(topicPosts.length);

          return (
            <TopicSection
              key={topic._id}
              title={topic.title?.en}
              posts={topicPosts}
              displayedPosts={displayedPosts}
              isPaginationActive={pagination.isPaginationActive(topic._id)}
              shouldShowSeeAll={shouldShowSeeAll(topicPosts.length)}
              currentPage={pagination.getCurrentPage(topic._id) + 1}
              totalPages={totalPages}
              canGoPrevious={pagination.canGoPrevious(topic._id)}
              canGoNext={pagination.canGoNext(topic._id, totalPages)}
              onActivatePagination={() => pagination.activatePagination(topic._id)}
              onDeactivatePagination={() => pagination.deactivatePagination(topic._id)}
              onPreviousPage={() => pagination.goToPreviousPage(topic._id)}
              onNextPage={() => pagination.goToNextPage(topic._id, totalPages)}
              seeAllLabel={t('seeAll')}
              showLessLabel={t('showLess')}
              previousLabel={t('previous')}
              nextLabel={t('next')}
              pageLabel={t('pageOf', {
                current: pagination.getCurrentPage(topic._id) + 1,
                total: totalPages,
              })}
            />
          );
        })}

        {showGeneral && (
          <TopicSection
            title="General"
            posts={groupedPosts['general']}
            displayedPosts={getDisplayedPosts('general', groupedPosts['general'])}
            isPaginationActive={pagination.isPaginationActive('general')}
            shouldShowSeeAll={shouldShowSeeAll(groupedPosts['general'].length)}
            currentPage={pagination.getCurrentPage('general') + 1}
            totalPages={getTotalPages(groupedPosts['general'].length)}
            canGoPrevious={pagination.canGoPrevious('general')}
            canGoNext={pagination.canGoNext('general', getTotalPages(groupedPosts['general'].length))}
            onActivatePagination={() => pagination.activatePagination('general')}
            onDeactivatePagination={() => pagination.deactivatePagination('general')}
            onPreviousPage={() => pagination.goToPreviousPage('general')}
            onNextPage={() => pagination.goToNextPage('general', getTotalPages(groupedPosts['general'].length))}
            seeAllLabel={t('seeAll')}
            showLessLabel={t('showLess')}
            previousLabel={t('previous')}
            nextLabel={t('next')}
            pageLabel={t('pageOf', {
              current: pagination.getCurrentPage('general') + 1,
              total: getTotalPages(groupedPosts['general'].length),
            })}
          />
        )}
      </div>
    </div>
  );
}
