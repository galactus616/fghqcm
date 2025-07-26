import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CategoriesSlide = ({ categories }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-6 px-2 sm:px-4 md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary">
          {t('Shop by Category')}
        </h2>
        <div className="flex gap-2">
          <button
            aria-label={t('Scroll left')}
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow transition cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            aria-label={t('Scroll right')}
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow transition cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center min-w-[110px] bg-white rounded-xl p-4 shadow-md hover:shadow-lg border border-primary/30 transition-all duration-200 cursor-pointer group"
            onClick={() => navigate(`/category/${cat.id || cat._id || cat.name}`)}
          >
            {cat.imageUrl ? (
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-12 h-12 object-cover rounded-full mb-2 border border-primary/30 group-hover:scale-110 transition-transform duration-200"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-2 text-2xl text-primary">
                ?
              </div>
            )}
            <span className="text-primary font-semibold text-sm text-center group-hover:text-primary/80 transition-colors duration-200">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

CategoriesSlide.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
    })
  ).isRequired,
};

export default CategoriesSlide;

const style = document.createElement("style");
style.innerHTML = `
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
`;
document.head.appendChild(style);
