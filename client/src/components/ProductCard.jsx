import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import useStore from '../store/useStore';
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const variant = product.variants?.[selectedVariantIdx] || product.variants?.[0] || {};
  const { addToCart, hydratedItems: cartItems, updateCartItem, removeFromCart } = useStore();

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id || product._id,
        variantIndex: selectedVariantIdx,
        quantity: 1
      });
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  // Find cart item for this product and selected variant
  const cartItem = cartItems.find(
    (item) =>
      (item.productId === (product.id || product._id)) &&
      item.variantIndex === selectedVariantIdx
  );

  const handleIncrease = async () => {
    if (cartItem) {
      updateCartItem(cartItem.productId, cartItem.variantIndex, cartItem.quantity + 1);
    } else {
      await handleAddToCart();
    }
  };

  const handleDecrease = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateCartItem(cartItem.productId, cartItem.variantIndex, cartItem.quantity - 1);
      } else {
        removeFromCart(cartItem.productId, cartItem.variantIndex);
      }
    }
  };
// console.log(product)
  return (
    <div className="border border-gray-100 rounded-xl p-2 sm:p-3 md:p-4 flex flex-col justify-between w-44 md:w-56  bg-white group transition-all duration-200 hover:shadow-md hover:border-gray-200">
      <div className="relative">
      
      {/* Badges */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-10">
        {product.isBestSeller ? (
          <span className="bg-amber-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
            BESTSELLER
          </span>
        ) : product.isFeatured ? (
          <span className="bg-blue-600 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
            FEATURED
          </span>
        ) : null}
      </div>

      {/* Product Image */}
      <div className="flex justify-center items-center h-24 sm:h-28 md:h-32 lg:h-36 object-fill w-full bg-gray-50 rounded-lg overflow-hidden">
        <Link to={`/product/${product.id || product._id}`}>
        <img
          src={product.images?.[0] || product.imageUrl}
          alt={product.name}
          className="h-36 w-full object-contain"
        />
        </Link>
      </div>

      {/* Product Info */}
      <div className="mt-2 sm:mt-3 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider">
          {typeof product.category === 'object' ? product.category.name : product.category}
        </span>
        
        {/* Product Name */}
        <Link to={`/product/${product.id || product._id}`} className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-gray-800 leading-tight mt-1 mb-1 sm:mb-2 line-clamp-2">
          {product.name}
        </Link>

        {/* Variant Selector - Always rendered but with conditional spacing */}
        <div className={hasMultipleVariants ? 'mb-1 sm:mb-3' : 'mb-1 sm:mb-3'}>
          {hasMultipleVariants ? (
            <div className="flex gap-1 sm:gap-1.5 flex-nowrap overflow-x-auto pb-1">
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`px-2 sm:px-3 py-1 rounded-lg border text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedVariantIdx === idx
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedVariantIdx(idx)}
                >
                  {v.quantityLabel}
                </button>
              ))}
            </div>
          ) : (
            product.variants && (
              <span className="inline-block bg-green-600 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-lg border border-green-600">
                {product.variants[0].quantityLabel}
              </span>
            )
          )}
        </div>

        {/* Price and Add Button Section - horizontal layout at the bottom */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[14px] sm:text-[16px] md:text-[18px] font-bold text-green-700">
                ₹{variant.discountedPrice ?? variant.price}
              </span>
              {variant.discountedPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  ₹{variant.price}
                </span>
              )}
            </div>
          </div>
          {cartItem ? (
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden ">
              <button
                onClick={handleDecrease}
                className="p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-gray-700" />
              </button>
              <span className="px-3 text-gray-800">
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="p-2 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              className="flex items-center gap-1 text-white bg-green-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-semibold hover:bg-green-700 transition-colors"
              onClick={handleAddToCart}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="inline">ADD</span>
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductCard;




