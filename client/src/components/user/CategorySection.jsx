import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStore from '../../store/useStore';

const CategorySection = ({ categories }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { fetchSubCategoriesByParent, subCategories, loadingSubCategories } = useStore();

  const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop";

  // Load subcategories for all main categories (only if not already loaded)
  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach(category => {
        const categoryId = category.id || category._id;
        // Only fetch if not already loaded
        if (!subCategories[categoryId] || subCategories[categoryId].length === 0) {
          fetchSubCategoriesByParent(categoryId);
        }
      });
    }
    // Note: subCategories in deps may cause extra renders if not memoized in store
  }, [categories, fetchSubCategoriesByParent, subCategories]);

  const handleSubCategoryClick = (subCategory) => {
    const subCatId = subCategory.id || subCategory._id;
    if (subCatId) {
      navigate(`/category/${subCatId}`);
    }
  };

  return (
    <section className="w-full py-5 md:py-8 px-4 sm:px-6 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {categories.map((mainCategory, mainIdx) => {
          const currentSubCategories = subCategories[mainCategory.id || mainCategory._id] || [];
          
          return (
            <div key={mainIdx} className="space-y-4">
              {/* Main Category Heading */}
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                {mainCategory.name}
              </h2>
              
              {/* Subcategories Grid - Simple images side by side */}
              {loadingSubCategories ? (
                <div className="grid grid-cols-4 gap-1">
                  {[...Array(8)].map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center animate-pulse"
                    >
                      {/* Image skeleton */}
                      <div className="w-full h-32 md:h-40 bg-gray-200 rounded-lg mb-2"></div>
                      {/* Text skeleton - matches the large text styling */}
                      <div className="text-center px-1 pb-2 w-full">
                        <div className="h-4 md:h-8 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 md:h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1">
                  {currentSubCategories.map((subCat) => {
                    const subCatId = subCat.id || subCat._id;
                    return (
                      <div
                        key={subCatId}
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => handleSubCategoryClick(subCat)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSubCategoryClick(subCat); }}
                        aria-label={subCat.displayName || subCat.name}
                      >
                        {/* Simple Image - No circular CSS styling */}
                        <div className="">
                          {subCat.imageUrl ? (
                            <img
                              src={subCat.imageUrl}
                              alt={subCat.name}
                              className="w-full h-full object-cover transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = FALLBACK_IMAGE_URL;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-lg md:text-xl">🛒</span>
                            </div>
                          )}
                        </div>
                        {/* Category Display Name */}
                        <div className="text-center px-1 pb-2">
                          <h3 className="text-sm md:text-4xl font-semibold text-[#243240]">
                            {subCat.displayName || subCat.name}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
