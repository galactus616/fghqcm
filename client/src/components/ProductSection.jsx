import React from "react";
import ProductCard from './ProductCard';

const ProductSection = ({ title, products, isLoggedIn }) => {
  return (
    <section className="my-6 px-4">
      <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-4">
        {title}
      </h2>
      <div className="overflow-x-auto flex items-center justify-between md:gap-0 gap-4">
        {products.map((product, idx) => (
          <div key={idx} className="flex-shrink-0 flex-none">
            <ProductCard product={product} isLoggedIn={isLoggedIn} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
