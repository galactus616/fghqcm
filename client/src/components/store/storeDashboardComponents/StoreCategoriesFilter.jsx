import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StoreCategoriesFilter = ({
  categories,
  selectedCategory,
  onCategorySelect,
  subCategories = {},
  loadingSubCategories = false,
  onFetchSubCategories,
}) => {
  const scrollContainerRef = useRef(null);
  const subScrollContainerRef = useRef(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [isManualSelection, setIsManualSelection] = useState(false);

  // Auto-select main category when a subcategory is selected
  useEffect(() => {
    if (selectedCategory !== "all") {
      // Find which main category this subcategory belongs to
      const mainCategory = categories.find(cat => 
        cat.value !== "all" && subCategories[cat.value]?.some(sub => sub.value === selectedCategory)
      );
      if (mainCategory) {
        setSelectedMainCategory(mainCategory.value);
      }
    }
    // Remove the else clause that was causing the issue
    // Only auto-select main category when a subcategory is selected, not when deselecting
  }, [selectedCategory, categories, subCategories]);

  // Auto-close subcategory section if selected main category has no subcategories
  useEffect(() => {
    // Don't interfere if we're in the middle of a manual selection
    if (isManualSelection) return;
    
    if (selectedMainCategory && !loadingSubCategories) {
      // Only check after loading is complete and we have the subcategories data
      const currentSubCategories = subCategories[selectedMainCategory] || [];
      if (currentSubCategories.length === 0) {
        // Close the subcategory section if no subcategories are available
        // But only if we're not currently loading
        setTimeout(() => {
          setSelectedMainCategory(null);
        }, 1000); // Give user time to see the "no subcategories" message
      }
    }
  }, [selectedMainCategory, subCategories, loadingSubCategories, isManualSelection]);

  // Reset manual selection flag when categories change
  useEffect(() => {
    setIsManualSelection(false);
  }, [categories]);

  const scrollLeft = (containerRef) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = (containerRef) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  const handleMainCategoryClick = async (category) => {
    if (category.value === "all") {
      setSelectedMainCategory(null);
      setIsManualSelection(false);
      onCategorySelect(category.value);
      return;
    }

    // If clicking the same main category, deselect it
    if (selectedMainCategory === category.value) {
      setSelectedMainCategory(null);
      setIsManualSelection(false);
      onCategorySelect("all");
      return;
    }

    // Set manual selection flag to prevent auto-close interference
    setIsManualSelection(true);
    
    // Select the new main category
    setSelectedMainCategory(category.value);
    
    // Fetch subcategories if not already loaded
    if (!subCategories[category.value] && onFetchSubCategories) {
      await onFetchSubCategories(category.value);
    }
    
    // Reset manual selection flag after a delay
    setTimeout(() => {
      setIsManualSelection(false);
    }, 2000); // Give enough time for subcategories to load and display
  };

  const handleSubCategoryClick = (subCategory) => {
    onCategorySelect(subCategory.value);
  };

  // Get subcategories for the selected main category
  const currentSubCategories = selectedMainCategory ? (subCategories[selectedMainCategory] || []) : [];

  // Transform subcategories to match the expected format
  const transformedSubCategories = currentSubCategories.map(subCat => ({
    value: subCat.id || subCat._id,
    label: subCat.name,
    imageUrl: subCat.imageUrl,
    level: 2
  }));

  return (
    <section className="w-full py-3 space-y-4">
      {/* Main Categories Row */}
      <div>
        <section className="flex items-center justify-between mb-3">
          <span className="text-lg font-medium">Categories</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scrollLeft(scrollContainerRef)}
              className="p-2 rounded-full cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
            >
              <ChevronLeft className="text-primary" />
            </button>
            <button 
              onClick={() => scrollRight(scrollContainerRef)}
              className="p-2 rounded-full cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
            >
              <ChevronRight className="text-primary" />
            </button>
          </div>
        </section>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-2 px-1 pt-2 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {categories
            .filter(category => category.value !== "all")
            .map((category) => {
              const isSelected = selectedMainCategory === category.value;
              
              return (
                <button
                  key={category.value}
                  onClick={() => handleMainCategoryClick(category)}
                  className={`flex flex-col items-center w-18 h-18 md:w-24 md:h-24 lg:w-28 lg:h-28 p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer group shrink-0 ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md transform scale-105"
                      : "border-gray-200 hover:border-primary/40 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-full h-3/4 flex items-center justify-center mb-1">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.label}
                        className="w-full h-full object-contain rounded transition-transform duration-200"
                        onError={(e) => {
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
              );
            })}
        </div>
      </div>

      {/* Subcategories Row - Only show when a main category is selected */}
      {selectedMainCategory && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <section className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-gray-600">
                Subcategories
                {transformedSubCategories.length > 0 && (
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({transformedSubCategories.length})
                  </span>
                )}
              </span>
              {selectedMainCategory && (
                <span className="text-sm w-20 md:w-auto truncate text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {categories.find(cat => cat.value === selectedMainCategory)?.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollLeft(subScrollContainerRef)}
                className="p-2 rounded-full cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
              >
                <ChevronLeft className="text-primary" />
              </button>
              <button 
                onClick={() => scrollRight(subScrollContainerRef)}
                className="p-2 rounded-full cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
              >
                <ChevronRight className="text-primary" />
              </button>
            </div>
          </section>
          
          <div 
            ref={subScrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 px-1 pt-2 scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {loadingSubCategories ? (
              // Loading skeleton for subcategories
              [...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center w-24 h-24 lg:w-28 lg:h-28 p-2 rounded-lg border-2 border-gray-200 animate-pulse shrink-0"
                >
                  <div className="w-full h-3/4 bg-gray-200 rounded mb-1"></div>
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : transformedSubCategories.length > 0 ? (
              transformedSubCategories.map((subCategory) => {
                const isSelected = selectedCategory === subCategory.value;
                
                return (
                  <button
                    key={subCategory.value}
                    onClick={() => handleSubCategoryClick(subCategory)}
                    className={`flex flex-col items-center w-24 h-24 lg:w-28 lg:h-28 p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer group shrink-0 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md transform scale-105"
                        : "border-gray-200 hover:border-primary/40 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-full h-3/4 flex items-center justify-center mb-1">
                      {subCategory.imageUrl ? (
                        <img
                          src={subCategory.imageUrl}
                          alt={subCategory.label}
                          className="w-full h-full object-contain rounded transition-transform duration-200"
                          onError={(e) => {
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
                      {subCategory.label}
                    </span>
                  </button>
                );
              })
            ) : (
              // No subcategories message
              <div className="flex items-center justify-center w-full py-8">
                <p className="text-gray-500 text-sm">No subcategories available</p>
              </div>
            )}
          </div>
        </div>
      )}
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
  subCategories: PropTypes.object,
  loadingSubCategories: PropTypes.bool,
  onFetchSubCategories: PropTypes.func,
};

export default StoreCategoriesFilter;
