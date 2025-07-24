import React from "react";
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

const ProductSection = ({ title, products, isLoggedIn, categoryId }) => {
  const navigate = useNavigate();
  return (
    <section className="my-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#0a614d]">
          {title}
        </h2>
        <button
          className="text-[#0a614d] cursor-pointer hover:text-[#0a614d]/80 font-semibold text-sm md:text-base px-3 py-1 rounded-lg border border-[#0a614d]/30 bg-[#0a614d]/5 hover:bg-[#0a614d]/10 transition"
          onClick={() => navigate(`/category/${categoryId}`)}
        >
          See All
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {products.map((product, idx) => (
          <div key={idx} className="flex-shrink-0 flex-none">
            <ProductCard product={product} isLoggedIn={isLoggedIn} />
          </div>
        ))}
      </div>
    </section>
  );
};

// Hide scrollbar utility
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

export default ProductSection;
