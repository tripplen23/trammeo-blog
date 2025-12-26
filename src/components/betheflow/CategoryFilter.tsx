'use client';

import { CategoryFilter as CategoryFilterType, CATEGORY_LABELS } from '@/lib/galleryTypes';

/**
 * Props for CategoryFilter component
 * Requirements: 4.1, 4.4
 */
interface CategoryFilterProps {
  selectedCategory: CategoryFilterType;
  onCategoryChange: (category: CategoryFilterType) => void;
}

/**
 * All available category filter options in display order
 */
const FILTER_OPTIONS: CategoryFilterType[] = ['littleLifeAtArt', 'theHomeCafe'];

/**
 * CategoryFilter component for filtering gallery posts by category
 * Renders filter buttons for "Little life in Art", "Nhà cafe"
 * 
 * Requirements: 4.1 - Display category filter options
 * Requirements: 4.4 - Supports filter change callback for pagination reset
 * 
 * @param selectedCategory - Currently selected category filter
 * @param onCategoryChange - Callback when category selection changes
 */
export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  // Force default to littleLifeAtArt if selectedCategory is invalid
  const activeCategory = (selectedCategory === 'littleLifeAtArt' || selectedCategory === 'theHomeCafe') 
    ? selectedCategory 
    : 'littleLifeAtArt';
  
  console.log('CategoryFilter - selectedCategory:', selectedCategory);
  console.log('CategoryFilter - activeCategory:', activeCategory);
  
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {FILTER_OPTIONS.map((category) => {
        const isActive = activeCategory === category;
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${
              isActive
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white border-yellow-600 shadow-lg shadow-yellow-900/20'
                : 'bg-transparent text-white border-white/30 hover:border-yellow-500/70 hover:text-yellow-400 focus:border-yellow-500/70 focus:text-yellow-400'
            }`}
            aria-pressed={isActive}
            aria-label={`Filter by ${CATEGORY_LABELS[category]}`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        );
      })}
    </div>
  );
}
