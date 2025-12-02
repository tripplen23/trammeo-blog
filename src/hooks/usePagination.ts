import { useState } from 'react';

export function usePagination() {
  const [paginationActive, setPaginationActive] = useState<Set<string>>(new Set());
  const [currentPages, setCurrentPages] = useState<Map<string, number>>(new Map());

  const activatePagination = (topicId: string) => {
    setPaginationActive(prev => new Set(prev).add(topicId));
    setCurrentPages(prev => new Map(prev).set(topicId, 0));
  };

  const deactivatePagination = (topicId: string) => {
    setPaginationActive(prev => {
      const newSet = new Set(prev);
      newSet.delete(topicId);
      return newSet;
    });
    setCurrentPages(prev => {
      const newMap = new Map(prev);
      newMap.delete(topicId);
      return newMap;
    });
  };

  const isPaginationActive = (topicId: string) => paginationActive.has(topicId);

  const getCurrentPage = (topicId: string) => currentPages.get(topicId) || 0;

  const goToNextPage = (topicId: string, totalPages: number) => {
    const currentPage = getCurrentPage(topicId);
    if (currentPage < totalPages - 1) {
      setCurrentPages(prev => new Map(prev).set(topicId, currentPage + 1));
    }
  };

  const goToPreviousPage = (topicId: string) => {
    const currentPage = getCurrentPage(topicId);
    if (currentPage > 0) {
      setCurrentPages(prev => new Map(prev).set(topicId, currentPage - 1));
    }
  };

  const canGoNext = (topicId: string, totalPages: number) => {
    return getCurrentPage(topicId) < totalPages - 1;
  };

  const canGoPrevious = (topicId: string) => {
    return getCurrentPage(topicId) > 0;
  };

  const resetPagination = () => {
    setPaginationActive(new Set());
    setCurrentPages(new Map());
  };

  return {
    isPaginationActive,
    getCurrentPage,
    activatePagination,
    deactivatePagination,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
    resetPagination,
  };
}
