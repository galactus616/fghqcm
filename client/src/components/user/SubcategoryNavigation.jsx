import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SubcategoryNavigation = ({
  selectedSubcategory,
  currentSubcategoryIndex,
  totalSubcategories,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
          canGoPrevious
            ? 'text-green-700 hover:bg-green-50 cursor-pointer'
            : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Previous</span>
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-green-800">
          {selectedSubcategory ? selectedSubcategory.name : 'All Products'}
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          {selectedSubcategory ? `${currentSubcategoryIndex + 1} of ${totalSubcategories}` : 'All Products'}
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
          canGoNext
            ? 'text-green-700 hover:bg-green-50 cursor-pointer'
            : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        <span className="text-sm">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

SubcategoryNavigation.propTypes = {
  selectedSubcategory: PropTypes.object,
  currentSubcategoryIndex: PropTypes.number.isRequired,
  totalSubcategories: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  canGoPrevious: PropTypes.bool.isRequired,
  canGoNext: PropTypes.bool.isRequired,
};

export default SubcategoryNavigation; 