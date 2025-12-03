interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
}

export default function PaginationControls({
  currentPage: _currentPage,
  totalPages: _totalPages,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
  pageLabel,
}: PaginationControlsProps) {
  // Note: currentPage and totalPages are available via props if needed for future enhancements
  void _currentPage;
  void _totalPages;
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="px-4 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {previousLabel}
      </button>
      <span className="text-sm text-black font-medium">
        {pageLabel}
      </span>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="px-4 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {nextLabel}
      </button>
    </div>
  );
}
