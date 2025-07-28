import React from "react";
import PropTypes from "prop-types";

const StoreCategoriesFilter = ({ categories, selectedCategory, onCategorySelect }) => {
  // Category images mapping - using the actual images from public/storeimages
  const categoryImages = {
    vegetables: "/storeimages/vegitables.png",
    meat: "/storeimages/meat.png",
    fruits: "/storeimages/fruits.png",
    beverages: "/storeimages/coldrings.png",
    snacks: "/storeimages/snacks.png",
    cookies: "/storeimages/cookies.png",
    coffee: "/storeimages/Tea & coffees.png",
    electronics: "/storeimages/gadgets.png",
    clothing: "/storeimages/fashions.png",
    stationery: "/storeimages/stetonary.png",
    chocolate: "/storeimages/chocklets.png",
    instant_food: "/storeimages/instant food.png",
  };

  return (
    <section className="w-full py-3">
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar scroll-smooth px-1">
        {categories
          .filter((category) => category.value !== "all" && categoryImages[category.value])
          .map((category) => (
            <button
              key={category.value}
              onClick={() => onCategorySelect(category.value)}
              className={`flex flex-col items-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer group shrink-0 ${
                selectedCategory === category.value
                  ? "border-primary bg-primary/10 shadow-md transform "
                  : "border-gray-200 hover:border-primary/40 hover:bg-gray-50 "
              }`}
            >
              <div className="w-full h-3/4 flex items-center justify-center mb-1">
                <img
                  src={categoryImages[category.value]}
                  alt={category.label}
                  className="w-full h-full object-contain rounded transition-transform duration-200"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-primary transition-colors duration-200 truncate w-full">
                {category.label}
              </span>
            </button>
          ))}
      </div>
    </section>
  );
};

StoreCategoriesFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
};

export default StoreCategoriesFilter;

// Add CSS for better scrollbar hiding
const style = document.createElement("style");
style.innerHTML = `
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.scroll-smooth {
  scroll-behavior: smooth;
}
`;
document.head.appendChild(style); 