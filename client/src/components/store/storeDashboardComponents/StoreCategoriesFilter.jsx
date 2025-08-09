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
  const scrollContainerRefs = useRef({});
  const [selectedCategories, setSelectedCategories] = useState({
    level1: null,
    level2: null,
    level3: null,
    level4: null
  });
  const [isManualSelection, setIsManualSelection] = useState(false);

  // Auto-select categories when a category is selected
  useEffect(() => {
    if (selectedCategory !== "all") {
      // Find the category path for the selected category
      const categoryPath = findCategoryPath(selectedCategory, categories, subCategories);
      if (categoryPath) {
        setSelectedCategories(categoryPath);
      }
    } else {
      setSelectedCategories({
        level1: null,
        level2: null,
        level3: null,
        level4: null
      });
    }
  }, [selectedCategory, categories, subCategories]);

  // Reset manual selection flag when categories change
  useEffect(() => {
    setIsManualSelection(false);
  }, [categories]);

  const findCategoryPath = (categoryId, mainCategories, allSubCategories) => {
    // Search through all levels to find the category path
    for (const mainCat of mainCategories) {
      if (mainCat.value === categoryId) {
        return { level1: mainCat.value, level2: null, level3: null, level4: null };
      }
      
      const level2Categories = allSubCategories[mainCat.value] || [];
      for (const level2Cat of level2Categories) {
        const level2Id = level2Cat.id || level2Cat._id;
        if (level2Id === categoryId) {
          return { level1: mainCat.value, level2: level2Id, level3: null, level4: null };
        }
        
        const level3Categories = allSubCategories[level2Id] || [];
        for (const level3Cat of level3Categories) {
          const level3Id = level3Cat.id || level3Cat._id;
          if (level3Id === categoryId) {
            return { 
              level1: mainCat.value, 
              level2: level2Id, 
              level3: level3Id, 
              level4: null 
            };
          }
          
          const level4Categories = allSubCategories[level3Id] || [];
          for (const level4Cat of level4Categories) {
            const level4Id = level4Cat.id || level4Cat._id;
            if (level4Id === categoryId) {
              return { 
                level1: mainCat.value, 
                level2: level2Id, 
                level3: level3Id, 
                level4: level4Id 
              };
            }
          }
        }
      }
    }
    return null;
  };

  const scrollLeft = (level) => {
    const containerRef = scrollContainerRefs.current[level];
    if (containerRef) {
      containerRef.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = (level) => {
    const containerRef = scrollContainerRefs.current[level];
    if (containerRef) {
      containerRef.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = async (category, level) => {
    if (category.value === "all") {
      setSelectedCategories({
        level1: null,
        level2: null,
        level3: null,
        level4: null
      });
      setIsManualSelection(false);
      onCategorySelect(category.value);
      return;
    }

    // Extract the category ID
    const categoryId = category.value || category.id || category._id;

    // If clicking the same category at the same level, deselect it and all levels below
    if (selectedCategories[level] === categoryId) {
      const newSelectedCategories = { ...selectedCategories };
      // Clear this level and all levels below
      if (level === 'level1') {
        newSelectedCategories.level1 = null;
        newSelectedCategories.level2 = null;
        newSelectedCategories.level3 = null;
        newSelectedCategories.level4 = null;
      } else if (level === 'level2') {
        newSelectedCategories.level2 = null;
        newSelectedCategories.level3 = null;
        newSelectedCategories.level4 = null;
      } else if (level === 'level3') {
        newSelectedCategories.level3 = null;
        newSelectedCategories.level4 = null;
      } else if (level === 'level4') {
        newSelectedCategories.level4 = null;
      }
      setSelectedCategories(newSelectedCategories);
      setIsManualSelection(false);
      onCategorySelect("all");
      return;
    }

    // Set manual selection flag to prevent auto-close interference
    setIsManualSelection(true);
    
    // Update selected categories
    const newSelectedCategories = { ...selectedCategories };
    if (level === 'level1') {
      newSelectedCategories.level1 = categoryId;
      newSelectedCategories.level2 = null;
      newSelectedCategories.level3 = null;
      newSelectedCategories.level4 = null;
    } else if (level === 'level2') {
      newSelectedCategories.level2 = categoryId;
      newSelectedCategories.level3 = null;
      newSelectedCategories.level4 = null;
    } else if (level === 'level3') {
      newSelectedCategories.level3 = categoryId;
      newSelectedCategories.level4 = null;
    } else if (level === 'level4') {
      newSelectedCategories.level4 = categoryId;
    }
    setSelectedCategories(newSelectedCategories);
    
    // Fetch subcategories if not already loaded
    if (!subCategories[categoryId] && onFetchSubCategories) {
      await onFetchSubCategories(categoryId);
    }
    
    // Select the category
    onCategorySelect(categoryId);
    
    // Reset manual selection flag after a delay
    setTimeout(() => {
      setIsManualSelection(false);
    }, 2000);
  };

  const getCategoriesForLevel = (level) => {
    if (level === 'level1') {
      return categories.filter(category => category.value !== "all");
    } else if (level === 'level2' && selectedCategories.level1) {
      return (subCategories[selectedCategories.level1] || []).map(cat => ({
        value: cat.id || cat._id,
        label: cat.name,
        imageUrl: cat.imageUrl,
        level: 2
      }));
    } else if (level === 'level3' && selectedCategories.level2) {
      return (subCategories[selectedCategories.level2] || []).map(cat => ({
        value: cat.id || cat._id,
        label: cat.name,
        imageUrl: cat.imageUrl,
        level: 3
      }));
    } else if (level === 'level4' && selectedCategories.level3) {
      return (subCategories[selectedCategories.level3] || []).map(cat => ({
        value: cat.id || cat._id,
        label: cat.name,
        imageUrl: cat.imageUrl,
        level: 4
      }));
    }
    return [];
  };

  const getLevelTitle = (level) => {
    switch (level) {
      case 'level1':
        return 'Main Categories';
      case 'level2':
        return 'Sub Categories';
      case 'level3':
        return 'Sub-Sub Categories';
      case 'level4':
        return 'Sub-Sub-Sub Categories';
      default:
        return 'Categories';
    }
  };

  const getParentCategoryLabel = (level) => {
    if (level === 'level2' && selectedCategories.level1) {
      const parent = categories.find(cat => cat.value === selectedCategories.level1);
      return parent?.label;
    } else if (level === 'level3' && selectedCategories.level2) {
      const parent = (subCategories[selectedCategories.level1] || []).find(cat => (cat.id || cat._id) === selectedCategories.level2);
      return parent?.name;
    } else if (level === 'level4' && selectedCategories.level3) {
      const parent = (subCategories[selectedCategories.level2] || []).find(cat => (cat.id || cat._id) === selectedCategories.level3);
      return parent?.name;
    }
    return null;
  };

  const shouldShowLevel = (level) => {
    switch (level) {
      case 'level1':
        return true;
      case 'level2':
        return selectedCategories.level1 !== null;
      case 'level3':
        return selectedCategories.level2 !== null;
      case 'level4':
        // Only show level 4 if level 3 is selected AND (level 4 categories exist or are being loaded)
        if (selectedCategories.level3 === null) return false;
        const level4Categories = subCategories[selectedCategories.level3] || [];
        const isLevel4Loading = loadingSubCategories && !subCategories[selectedCategories.level3];
        return level4Categories.length > 0 || isLevel4Loading;
      default:
        return false;
    }
  };

  const isLevelLoading = (level) => {
    if (level === 'level2' && selectedCategories.level1) {
      return loadingSubCategories && !subCategories[selectedCategories.level1];
    } else if (level === 'level3' && selectedCategories.level2) {
      return loadingSubCategories && !subCategories[selectedCategories.level2];
    } else if (level === 'level4' && selectedCategories.level3) {
      return loadingSubCategories && !subCategories[selectedCategories.level3];
    }
    return false;
  };

  const renderCategoryRow = (level) => {
    if (!shouldShowLevel(level)) return null;

    const categoriesForLevel = getCategoriesForLevel(level);
    const isSelected = selectedCategories[level];
    const isLoading = isLevelLoading(level);
    const levelTitle = getLevelTitle(level);
    const parentLabel = getParentCategoryLabel(level);

  return (
      <div key={level} className="animate-in slide-in-from-top-2 duration-300">
        <section className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-gray-600">
              {levelTitle}
              {categoriesForLevel.length > 0 && (
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({categoriesForLevel.length})
                </span>
              )}
            </span>
            {parentLabel && (
              <span className="text-sm w-20 md:w-auto truncate text-primary bg-primary/10 px-2 py-1 rounded-full">
                {parentLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scrollLeft(level)}
              className="p-2 rounded-full cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
            >
              <ChevronLeft className="text-primary" />
            </button>
            <button 
              onClick={() => scrollRight(level)}
              className="p-2 rounded-full cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
            >
              <ChevronRight className="text-primary" />
            </button>
          </div>
        </section>
        
        <div 
          ref={(el) => { scrollContainerRefs.current[level] = el; }}
          className="flex gap-3 overflow-x-auto pb-2 px-1 pt-2 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {isLoading ? (
            // Loading skeleton
            [...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center w-24 h-24 lg:w-28 lg:h-28 p-2 rounded-lg border-2 border-gray-200 animate-pulse shrink-0"
              >
                <div className="w-full h-3/4 bg-gray-200 rounded mb-1"></div>
                <div className="w-full h-3 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : categoriesForLevel.length > 0 ? (
            categoriesForLevel.map((category) => {
              const categoryId = category.value || category.id || category._id;
              const isSelectedCategory = selectedCategories[level] === categoryId;
              
              return (
                <button
                  key={categoryId}
                  onClick={() => handleCategoryClick(category, level)}
                  className={`flex flex-col items-center w-24 h-24 lg:w-28 lg:h-28 p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer group shrink-0 ${
                    isSelectedCategory
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
              })
            ) : (
            // No categories message - only show for levels that should be displayed but have no items
              <div className="flex items-center justify-center w-full py-8">
              <p className="text-gray-500 text-sm">
                {level === 'level4' 
                  ? 'No sub-sub-subcategories available' 
                  : `No ${levelTitle.toLowerCase()} available`}
              </p>
              </div>
            )}
          </div>
        </div>
    );
  };

  return (
    <section className="w-full py-3 space-y-4">
      {/* Level 1 Categories */}
      {renderCategoryRow('level1')}
      
      {/* Level 2 Categories */}
      {renderCategoryRow('level2')}
      
      {/* Level 3 Categories */}
      {renderCategoryRow('level3')}
      
      {/* Level 4 Categories */}
      {renderCategoryRow('level4')}
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
