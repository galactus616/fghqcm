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

  // Simplified icon mapping
  const getSubcategoryIcon = (subcategoryName) => {
    const name = subcategoryName.toLowerCase();
    
    const iconMap = {
      apple: '🍎', banana: '🍌', grape: '🍇', potato: '🥔', tomato: '🍅',
      onion: '🧅', carrot: '🥕', cucumber: '🥒', pepper: '🫑', capsicum: '🫑',
      lettuce: '🥬', leafy: '🥬', broccoli: '🥦', cauliflower: '🥬',
      mushroom: '🍄', garlic: '🧄', ginger: '🫚', lemon: '🍋', lime: '🍋',
      orange: '🍊', mango: '🥭', strawberry: '🍓', blueberry: '🫐',
      pineapple: '🍍', watermelon: '🍉', melon: '🍈', peach: '🍑',
      pear: '🍐', cherry: '🍒', kiwi: '🥝', avocado: '🥑', coconut: '🥥'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) return icon;
    }
    
    return '🥬'; // Default icon
  };

  if (loading) {
    return (
      <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-100 p-3">
        <div className="space-y-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-100 p-3 sticky top-24">
      <div className="space-y-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-140px)]">
        {/* "All" option */}
        <button
          onClick={() => onSubcategorySelect(null)}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50 group cursor-pointer ${
            selectedSubcategory === null 
              ? 'bg-primary/10 text-primary border-l-4 border-primary' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title={t('all_products')}
        >
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
            selectedSubcategory === null 
              ? 'bg-primary/20 text-primary' 
              : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
          }`}>
            🛒
          </div>
          <span className="font-medium text-sm">{t('all_products')}</span>
        </button>

        {/* Subcategory options */}
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id || subcategory._id}
            onClick={() => onSubcategorySelect(subcategory)}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50 group cursor-pointer ${
              selectedSubcategory && (selectedSubcategory.id || selectedSubcategory._id) === (subcategory.id || subcategory._id)
                ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title={subcategory.name}
          >
            <div className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center ${
              selectedSubcategory && (selectedSubcategory.id || selectedSubcategory._id) === (subcategory.id || subcategory._id)
                ? 'bg-primary/20' 
                : 'bg-gray-100 group-hover:bg-gray-200'
            }`}>
              {subcategory.imageUrl ? (
                <img
                  src={subcategory.imageUrl}
                  alt={subcategory.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span className={`text-sm ${subcategory.imageUrl ? 'hidden' : 'block'}`}>
                {getSubcategoryIcon(subcategory.name)}
              </span>
            </div>
            
            <span className="font-medium text-sm truncate flex-1 text-left">
              {subcategory.name}
            </span>
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