import { useState, useEffect } from 'react';

export const useSubcategoryNavigation = (subcategories, selectedSubcategory, onSubcategorySelect) => {
  const [currentSubcategoryIndex, setCurrentSubcategoryIndex] = useState(0);

  // Update current index when selected subcategory changes
  useEffect(() => {
    if (selectedSubcategory) {
      const index = subcategories.findIndex(sub => 
        (sub.id || sub._id) === (selectedSubcategory.id || selectedSubcategory._id)
      );
      setCurrentSubcategoryIndex(index >= 0 ? index : 0);
    } else {
      setCurrentSubcategoryIndex(0);
    }
  }, [selectedSubcategory, subcategories]);

  const goToPreviousSubcategory = () => {
    if (currentSubcategoryIndex > 0) {
      const prevSubcategory = subcategories[currentSubcategoryIndex - 1];
      onSubcategorySelect(prevSubcategory);
      setCurrentSubcategoryIndex(currentSubcategoryIndex - 1);
    }
  };

  const goToNextSubcategory = () => {
    if (currentSubcategoryIndex < subcategories.length - 1) {
      const nextSubcategory = subcategories[currentSubcategoryIndex + 1];
      onSubcategorySelect(nextSubcategory);
      setCurrentSubcategoryIndex(currentSubcategoryIndex + 1);
    }
  };

  const canGoPreviousSubcategory = currentSubcategoryIndex > 0;
  const canGoNextSubcategory = currentSubcategoryIndex < subcategories.length - 1;

  return {
    currentSubcategoryIndex,
    goToPreviousSubcategory,
    goToNextSubcategory,
    canGoPreviousSubcategory,
    canGoNextSubcategory,
  };
}; 