import React from "react";
import { Plus } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="border border-green-100 rounded-2xl p-5 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-200 flex flex-col justify-between w-56 bg-white group cursor-pointer">
      {/* Product Image */}
      <div className="flex justify-center items-center mb-4 h-32 w-full bg-green-50 rounded-xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-28 w-28 object-contain drop-shadow-sm"
        />
      </div>

      {/* Product Name */}
      <h2 className="text-base font-bold text-green-800 leading-snug line-clamp-2 mb-1 group-hover:text-green-600 transition-colors duration-200">
        {product.name}
      </h2>

      {/* Weight Badge */}
      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 w-max">
        {product.weight}
      </span>

      {/* Price Section */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-green-700">
            ₹{product.price}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{product.originalPrice}
          </span>
        </div>

        {/* Add Button */}
        <button className="flex items-center gap-1 text-white bg-green-600 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500">
          <Plus className="w-4 h-4" />
          ADD
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
