import React, { useState } from "react";
import { Plus } from "lucide-react";

const ProductCard = ({ product }) => {
  // Default to first variant
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const variant = product.variants?.[selectedVariantIdx] || product.variants?.[0] || {};

  return (
    <div className="border border-green-100 rounded-2xl p-5 shadow-md flex flex-col justify-between w-56 bg-white group">
      {/* Product Image */}
      <div className="flex justify-center items-center mb-4 h-32 w-full bg-green-50 rounded-xl overflow-hidden">
        <img
          src={product.images?.[0] || product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Badges */}
      <div className="flex gap-2 mb-1">
        {product.isBestSeller && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Best Seller</span>
        )}
        {product.isFeatured && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Featured</span>
        )}
      </div>

      {/* Product Name */}
      <h2 className="text-base font-bold text-green-800 leading-snug line-clamp-2 mb-1">
        {product.name}
      </h2>
      {/* Category */}
      <span className="text-xs text-green-600 font-medium mb-1">
        {typeof product.category === 'object' && product.category !== null ? product.category.name : product.category}
      </span>

      {/* Variant Selector */}
      {product.variants && product.variants.length > 1 && (
        <select
          className="mb-2 px-2 py-1 rounded border border-green-200 text-xs text-green-800 bg-green-50 focus:outline-none"
          value={selectedVariantIdx}
          onChange={e => setSelectedVariantIdx(Number(e.target.value))}
        >
          {product.variants.map((v, idx) => (
            <option value={idx} key={idx}>
              {v.quantityLabel} - ₹{v.discountedPrice ?? v.price}
            </option>
          ))}
        </select>
      )}
      {product.variants && product.variants.length === 1 && (
        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 w-max">
          {product.variants[0].quantityLabel}
        </span>
      )}

      {/* Price Section */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-green-700">
            ₹{variant.discountedPrice ?? variant.price}
          </span>
          {variant.discountedPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{variant.price}
            </span>
          )}
        </div>

        {/* Add Button */}
        <button
          className="flex items-center gap-1 text-white bg-green-600 px-4 py-2 rounded-lg text-sm font-bold shadow focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer transition-transform duration-150 hover:scale-105 hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          ADD
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
