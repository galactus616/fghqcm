import React from "react";
import ProductCard from "../components/ProductCard";

const ProductSection = ({ title, products }) => {
  return (
    <section className="my-6 px-4">
      <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
