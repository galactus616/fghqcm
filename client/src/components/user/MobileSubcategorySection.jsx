import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SubcategoryFilter from './SubcategoryFilter';

const MobileSubcategorySection = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect,
  getSubcategoryIcon,
  category
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll capabilities
  const checkScrollCapabilities = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const newCanScrollLeft = scrollLeft > 0;
      const newCanScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
      
      setCanScrollLeft(newCanScrollLeft);
      setCanScrollRight(newCanScrollRight);
    }
  };

  // Check scroll capabilities on mount and when subcategories change
  useEffect(() => {
    checkScrollCapabilities();
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(checkScrollCapabilities, 100);
    return () => clearTimeout(timer);
  }, [subcategories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.6; // Reduced from 0.7 for better UX
      
      const newScrollLeft = direction === "left" 
        ? Math.max(0, scrollLeft - scrollAmount)
        : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Update scroll capabilities after scrolling
      setTimeout(checkScrollCapabilities, 300);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollCapabilities);
      return () => scrollContainer.removeEventListener('scroll', checkScrollCapabilities);
    }
  }, []);

  return (
    <div className="lg:hidden">
      <div className="bg-white rounded-lg border border-primary/30 p-3 sm:p-4 pb-0">
        {/* Navigation Buttons for Horizontal Scroll */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-green-800">
            {category ? category.name : 'Category'}
          </h3>
          <div className="flex gap-1 sm:gap-2">
            <button
              aria-label="Scroll left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 sm:p-2.5 rounded-full shadow transition cursor-pointer ${
                canScrollLeft 
                  ? 'bg-green-100 hover:bg-green-200 text-green-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 sm:p-2.5 rounded-full shadow transition cursor-pointer ${
                canScrollRight 
                  ? 'bg-green-100 hover:bg-green-200 text-green-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            minHeight: '70px' // Increased minimum height for better touch targets
          }}
        >
          <SubcategoryFilter
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
            onSubcategorySelect={onSubcategorySelect}
            getSubcategoryIcon={getSubcategoryIcon}
          />
        </div>
      </div>
    </div>
  );
};

MobileSubcategorySection.propTypes = {
  subcategories: PropTypes.array.isRequired,
  selectedSubcategory: PropTypes.object,
  onSubcategorySelect: PropTypes.func.isRequired,
  getSubcategoryIcon: PropTypes.func.isRequired,
};

export default MobileSubcategorySection; 