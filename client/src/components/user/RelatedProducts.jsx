import React from "react";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";

const RelatedProducts = ({ products }) => {
  const { t } = useTranslation();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-6">
        {t("You might also like")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts; 