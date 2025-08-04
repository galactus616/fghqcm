import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CategorySection = ({ categories }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Function to get category icon/emoji based on category name
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    
    if (name.includes('fruit') || name.includes('vegetable')) {
      return '🥬';
    } else if (name.includes('dairy') || name.includes('milk')) {
      return '🥛';
    } else if (name.includes('meat') || name.includes('fish')) {
      return '🥩';
    } else if (name.includes('snack') || name.includes('biscuit')) {
      return '🍪';
    } else if (name.includes('beverage') || name.includes('drink')) {
      return '🥤';
    } else if (name.includes('bakery') || name.includes('bread')) {
      return '🍞';
    } else if (name.includes('frozen') || name.includes('ice')) {
      return '🧊';
    } else if (name.includes('organic') || name.includes('natural')) {
      return '🌱';
    } else if (name.includes('spice') || name.includes('condiment')) {
      return '🧂';
    } else if (name.includes('grain') || name.includes('rice')) {
      return '🌾';
    } else if (name.includes('oil') || name.includes('ghee')) {
      return '🫒';
    } else if (name.includes('sweet') || name.includes('chocolate')) {
      return '🍫';
    } else if (name.includes('instant') || name.includes('ready')) {
      return '⚡';
    } else if (name.includes('fashion') || name.includes('clothing')) {
      return '👕';
    } else if (name.includes('gadget') || name.includes('electronics')) {
      return '📱';
    } else if (name.includes('stationery') || name.includes('office')) {
      return '✏️';
    } else if (name.includes('tea') || name.includes('coffee')) {
      return '☕';
    } else {
      return '🛒';
    }
  };

  return (
    <section className="w-full py-5 md:py-8 px-4 sm:px-6 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary pl-8 mb-4 md:mb-8">
          {t('Shop by Category')}
        </h2>
        
        <div className="grid grid-cols-4 md:grid-cols-4 gap-1 md:gap-3">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center cursor-pointer group p-0"
              onClick={() => navigate(`/category/${cat.id || cat._id || cat.name}`)}
            >
              {/* Circular Icon Container - Smaller on mobile, larger on desktop */}
              <div className="relative w-16 h-16 md:w-70 md:h-70 mb-1 md:mb-2">
                {/* Outer Green Ring */}
                <div className="absolute inset-0 rounded-full border-2 md:border-4 border-primary/70 group-hover:border-primary/90 transition-colors duration-300"></div>
                {/* Inner Orange Ring */}
                <div className="absolute inset-1 md:inset-2 rounded-full border-2 md:border-4 border-bd-red/70 group-hover:border-bd-red/90 transition-colors duration-300"></div>
                
                {/* Icon/Image Container */}
                <div className="absolute inset-2 md:inset-4 rounded-full bg-white flex items-center justify-center shadow-lg">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-2xl md:text-[12rem]">
                      {getCategoryIcon(cat.name)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Category Name */}
              <h3 className="text-xs md:text-lg font-bold text-gray-800 text-center">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

CategorySection.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      id: PropTypes.string,
      _id: PropTypes.string,
    })
  ).isRequired,
};

export default CategorySection;
