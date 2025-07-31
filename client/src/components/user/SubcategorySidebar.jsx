import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SubcategorySidebar = ({ 
  subcategories, 
  selectedSubcategory, 
  onSubcategorySelect, 
  loading = false 
}) => {
  const { t } = useTranslation();

  // Default subcategory icons based on common categories
  const getSubcategoryIcon = (subcategoryName) => {
    const name = subcategoryName.toLowerCase();
    
    if (name.includes('apple') || name.includes('fruit')) {
      return '🍎';
    } else if (name.includes('banana')) {
      return '🍌';
    } else if (name.includes('grape')) {
      return '🍇';
    } else if (name.includes('potato')) {
      return '🥔';
    } else if (name.includes('tomato')) {
      return '🍅';
    } else if (name.includes('onion')) {
      return '🧅';
    } else if (name.includes('carrot')) {
      return '🥕';
    } else if (name.includes('cucumber')) {
      return '🥒';
    } else if (name.includes('pepper') || name.includes('capsicum')) {
      return '🫑';
    } else if (name.includes('lettuce') || name.includes('leafy')) {
      return '🥬';
    } else if (name.includes('broccoli')) {
      return '🥦';
    } else if (name.includes('cauliflower')) {
      return '🥬';
    } else if (name.includes('mushroom')) {
      return '🍄';
    } else if (name.includes('garlic')) {
      return '🧄';
    } else if (name.includes('ginger')) {
      return '🫚';
    } else if (name.includes('lemon') || name.includes('lime')) {
      return '🍋';
    } else if (name.includes('orange')) {
      return '🍊';
    } else if (name.includes('mango')) {
      return '🥭';
    } else if (name.includes('strawberry')) {
      return '🍓';
    } else if (name.includes('blueberry')) {
      return '🫐';
    } else if (name.includes('pineapple')) {
      return '🍍';
    } else if (name.includes('watermelon')) {
      return '🍉';
    } else if (name.includes('melon')) {
      return '🍈';
    } else if (name.includes('peach')) {
      return '🍑';
    } else if (name.includes('pear')) {
      return '🍐';
    } else if (name.includes('cherry')) {
      return '🍒';
    } else if (name.includes('kiwi')) {
      return '🥝';
    } else if (name.includes('avocado')) {
      return '🥑';
    } else if (name.includes('coconut')) {
      return '🥥';
    } else {
      // Default icon for unknown subcategories
      return '🥬';
    }
  };

  if (loading) {
    return (
      <div className="w-64 bg-white rounded-lg shadow-md p-4">
        <div className="space-y-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4 sticky top-20">
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {/* "All" option to show all products */}
        <button
          onClick={() => onSubcategorySelect(null)}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-green-50 ${
            selectedSubcategory === null 
              ? 'bg-green-100 text-green-800 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-700'
          }`}
        >
          <span className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600">
            🛒
          </span>
          <span className="font-medium">{t('all_products')}</span>
        </button>

        {/* Subcategory options */}
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id || subcategory._id}
            onClick={() => onSubcategorySelect(subcategory)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-green-50 ${
              selectedSubcategory && (selectedSubcategory.id || selectedSubcategory._id) === (subcategory.id || subcategory._id)
                ? 'bg-green-100 text-green-800 border-l-4 border-green-600' 
                : 'text-gray-700 hover:text-green-700'
            }`}
          >
            <span className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600">
              {getSubcategoryIcon(subcategory.name)}
            </span>
            <span className="font-medium">{subcategory.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

SubcategorySidebar.propTypes = {
  subcategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      _id: PropTypes.string,
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
    })
  ).isRequired,
  selectedSubcategory: PropTypes.object,
  onSubcategorySelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default SubcategorySidebar; 