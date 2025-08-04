import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SubcategoryFilter = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect,
}) => {
  const { t } = useTranslation();

  // Simplified icon mapping (same as sidebar)
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

  return (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ minWidth: 'max-content' }}>
      {/* "All" option */}
      <button
        onClick={() => onSubcategorySelect(null)}
        className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] cursor-pointer ${
          selectedSubcategory === null
            ? 'bg-primary/10 text-primary border-l-4 border-primary'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`}
        title={t('all_products')}
      >
        <div className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg text-sm ${
          selectedSubcategory === null 
            ? 'bg-primary/20 text-primary' 
            : 'bg-gray-200 text-gray-500'
        }`}>
          🛒
        </div>
        <span className="whitespace-nowrap">{t('all_products')}</span>
      </button>

      {/* Subcategory options */}
      {subcategories.map((subcategory) => (
        <button
          key={subcategory.id || subcategory._id}
          onClick={() => onSubcategorySelect(subcategory)}
          className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] cursor-pointer ${
            selectedSubcategory && (selectedSubcategory.id || selectedSubcategory._id) === (subcategory.id || subcategory._id)
              ? 'bg-primary/10 text-primary border-l-4 border-primary'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          title={subcategory.name}
        >
          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden flex items-center justify-center ${
            selectedSubcategory && (selectedSubcategory.id || selectedSubcategory._id) === (subcategory.id || subcategory._id)
              ? 'bg-primary/20' 
              : 'bg-gray-200'
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
      imageUrl: PropTypes.string,
    })
  ).isRequired,
  selectedSubcategory: PropTypes.object,
  onSubcategorySelect: PropTypes.func.isRequired,
};

export default SubcategoryFilter; 