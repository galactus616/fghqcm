import React from "react";
import { Plus, Minus, Star, PackageCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/useStore";

const ProductInfo = ({
  product,
  selectedVariantIdx,
  setSelectedVariantIdx,
  cartItem,
  handleAddToCart,
  handleIncrease,
  handleDecrease,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useStore();
  const variant = product.variants?.[selectedVariantIdx] || {};
  const currencySymbol = language === 'bn' ? '৳' : 'Tk';

  // Get localized product name
  const getLocalizedName = () => {
    if (language === 'bn' && product.nameBn) {
      return product.nameBn;
    }
    return product.name;
  };

  // Get localized product description
  const getLocalizedDescription = () => {
    if (language === 'bn' && product.descriptionBn) {
      return product.descriptionBn;
    }
    return product.shortDescription || product.description;
  };

  // Get localized variant quantity label
  const getLocalizedQuantityLabel = (variant) => {
    if (language === 'bn' && variant.quantityLabelBn) {
      return variant.quantityLabelBn;
    }
    return variant.quantityLabel;
  };

  // Format prices with Bengali numerals if needed
  const formatPrice = (price) => {
    if (language === 'bn') {
      return price.toLocaleString('en-IN');
    }
    return price.toLocaleString('en-IN');
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">
      <div className="mb-2">
        <span
          className="text-sm font-semibold text-primary hover:underline cursor-pointer"
          onClick={() => {
            const categoryId =
              product.mainCategory?.id || product.mainCategory?._id || 
              product.category?.id || product.category?._id || product.category;
            if (categoryId) {
              navigate(`/category/${categoryId}`);
            }
          }}
        >
          {product.mainCategory?.name || product.category?.name || "Category"}
        </span>
        {product.subCategory && (
          <span className="text-sm text-gray-500 ml-2">
            › {product.subCategory.name}
          </span>
        )}
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
        {getLocalizedName()}
      </h1>
      <p className="text-gray-600 mb-4 text-sm sm:text-base">{getLocalizedDescription()}</p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
        <div className="flex items-center">
          {[...Array(4)].map((_, i) => (
            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
          ))}
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 fill-current" />
          <span className="text-gray-600 ml-2 text-xs sm:text-sm">(12 Reviews)</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span className="text-xs sm:text-sm font-medium text-primary">
            In Stock
          </span>
        </div>
      </div>

      {product.variants && product.variants.length > 1 && (
        <div className="mb-6">
          <label className="font-semibold text-gray-800 mb-2 block text-sm sm:text-base">
            {t("select_unit")}
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {product.variants.map((v, idx) => (
              <button
                key={idx}
                type="button"
                className={`px-3 sm:px-4 py-2 cursor-pointer rounded-lg border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedVariantIdx === idx
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-gray-800 border-gray-300 hover:border-primary"
                }`}
                onClick={() => setSelectedVariantIdx(idx)}
                style={{ cursor: 'pointer' }}
              >
                {getLocalizedQuantityLabel(v)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              {currencySymbol}
              {formatPrice(variant.discountedPrice ?? variant.price)}
            </span>
            {variant.discountedPrice && (
              <span className="line-through text-gray-400 ml-2 text-sm sm:text-base">
                {currencySymbol}
                {formatPrice(variant.price)}
              </span>
            )}
          </div>
          {variant.discountedPrice && variant.discountedPrice < variant.price && (
            <span className="text-xs sm:text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {Math.round(
                ((variant.price - variant.discountedPrice) / variant.price) *
                  100
              )}
              % Off
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t("inclusive_of_all_taxes")}
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {cartItem ? (
          <div className="flex w-full max-w-xs items-center justify-between bg-white rounded-lg shadow h-10 sm:h-12 overflow-hidden border border-gray-200">
            <button
              onClick={handleDecrease}
              className="h-full w-10 sm:w-12 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Decrease Quantity"
              style={{ cursor: 'pointer' }}
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            <span className="text-base sm:text-lg font-semibold text-gray-800 select-none">
              {cartItem.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="h-full w-10 sm:w-12 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Increase Quantity"
              style={{ cursor: 'pointer' }}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          </div>
        ) : (
          <button
            className="h-10 sm:h-12 w-full max-w-xs px-4 sm:px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            onClick={handleAddToCart}
            style={{ cursor: 'pointer' }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add To Cart
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-3 sm:px-4 py-2 sm:py-3 mb-6 font-medium text-sm sm:text-base shadow-sm">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 4h1a2 2 0 002-2v-5a2 2 0 00-2-2h-1.5M7 16H6a2 2 0 01-2-2v-5a2 2 0 012-2h1.5m0 0V7a2 2 0 012-2h2a2 2 0 012 2v2.5m-6 0h6" /></svg>
        Estimated Delivery: <span className="font-bold ml-1">Within 11 minutes</span>
      </div>
    </div>
  );
};

export default ProductInfo;