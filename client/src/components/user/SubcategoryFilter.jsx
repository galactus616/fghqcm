import React from 'react';
import PropTypes from 'prop-types';

const SubcategoryFilter = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect,
  getSubcategoryIcon
}) => {
  return (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ minWidth: 'max-content' }}>
      <button
        onClick={() => onSubcategorySelect(null)}
        className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] ${
          selectedSubcategory === null
            ? 'bg-green-100 text-primary border-l-4 border-primary'
            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
        }`}
      >
        <span className="text-sm sm:text-base">🛒</span>
        <span className="whitespace-nowrap">All Products</span>
      </button>
      {subcategories.map((subcategory) => (
        <button
          key={subcategory.id || subcategory._id}
          onClick={() => onSubcategorySelect(subcategory)}
          className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] ${
            selectedSubcategory && (selectedSubcategory.id || selectedSubcategory._id) === (subcategory.id || subcategory._id)
              ? 'bg-green-100 text-primary border-l-4 border-primary'
              : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
          }`}
        >
          <span className="text-sm sm:text-base">{getSubcategoryIcon(subcategory.name)}</span>
          <span className="whitespace-nowrap">{subcategory.name}</span>
        </button>
      ))}
    </div>
  );
};

SubcategoryFilter.propTypes = {
  subcategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      _id: PropTypes.string,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedSubcategory: PropTypes.object,
  onSubcategorySelect: PropTypes.func.isRequired,
  getSubcategoryIcon: PropTypes.func.isRequired,
};

export default SubcategoryFilter; 