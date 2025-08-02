import React, { useRef } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StoreCategoriesFilter = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full py-3 ">
      {/* buttons for navigatin   */}
      <section className="flex items-center justify-between mb-3">
        <span className="text-lg font-medium">Categories</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
          >
            <ChevronLeft className="text-primary" />
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
          >
            <ChevronRight className="text-primary" />
          </button>
        </div>
      </section>
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {categories
          .filter(category => category.value !== "all")
          .map((category) => (
            <button
              key={category.value}
              onClick={() => onCategorySelect(category.value)}
              className={`flex flex-col items-center w-16 h-16 sm:w-18 sm:h-18 md:w-24 md:h-24 lg:w-28 lg:h-28 p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer group shrink-0 ${
                selectedCategory === category.value
                  ? "border-primary bg-primary/10 shadow-md transform "
                  : "border-gray-200 hover:border-primary/40 hover:bg-gray-50 "
              }`}
            >
              <div className="w-full h-3/4 flex items-center justify-center mb-1">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.label}
                    className="w-full h-full object-contain rounded transition-transform duration-200"
                    onError={(e) => {
                      // Hide image if it fails to load
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-primary transition-colors duration-200 truncate w-full">
                {category.label}
              </span>
            </button>
          ))}
      </div>
    </section>
  );
};

StoreCategoriesFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
    })
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
};

export default StoreCategoriesFilter;
