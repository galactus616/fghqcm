import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../../store/useStore";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product }) => {
  // console.log(product);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const variant =
    product.variants?.[selectedVariantIdx] || product.variants?.[0] || {};
  const {
    addToCart,
    hydratedItems: cartItems,
    updateCartItem,
    removeFromCart,
    language,
  } = useStore();
  const { t } = useTranslation();
  const currencySymbol = language === 'bn' ? '৳' : 'Tk';

  // Find cart item for this product and selected variant
  const cartItem = cartItems.find(
    (item) =>
      item.productId === (product.id || product._id) &&
      item.variantIndex === selectedVariantIdx
  );

  // Get localized product name
  const getLocalizedName = () => {
    if (language === 'bn' && product.nameBn) {
      return product.nameBn;
    }
    return product.name;
  };

  // Get localized variant quantity label
  const getLocalizedQuantityLabel = (variant) => {
    if (language === 'bn' && variant.quantityLabelBn) {
      return variant.quantityLabelBn;
    }
    return variant.quantityLabel;
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id || product._id,
        variantIndex: selectedVariantIdx,
        quantity: 1,
      });
      toast.success(t("added_to_cart"));
    } catch {
      toast.error(t("failed_to_add_to_cart"));
    }
  };

  const handleIncrease = async () => {
    if (cartItem) {
      updateCartItem(
        cartItem.productId,
        cartItem.variantIndex,
        cartItem.quantity + 1
      );
    } else {
      await handleAddToCart();
    }
  };

  const handleDecrease = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateCartItem(
          cartItem.productId,
          cartItem.variantIndex,
          cartItem.quantity - 1
        );
      } else {
        removeFromCart(cartItem.productId, cartItem.variantIndex);
      }
    }
  };

  // Format prices with Bengali numerals if needed
  const formatPrice = (price) => {
    if (language === 'bn') {
      return price.toLocaleString('en-IN');
    }
    return price.toLocaleString('en-IN');
  };

  return (
    <section>
      <div className="relative rounded-xl p-2 sm:p-3 md:p-4 flex flex-col justify-between w-37 xsa:w-37 xsb:w-42 xsc:w-44 xsd:w-46.5 xse:w-49 sm:w-44 md:w-58 mda:w-60 mdb:w-62 lg:w-42 xl:w-60.5 bg-white group transition-all border-1 border-primary/30 duration-200 hover:shadow-md hover:border-primary">
        <div className=" ">
          {variant.discountedPrice &&
            variant.discountedPrice < variant.price && (
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {Math.round(
                    ((variant.price - variant.discountedPrice) / variant.price) *
                      100
                  )}
                  % OFF
                </span>
              </div>
            )}

          {/* Product Image */}
          <Link
            to={`/product/${product.id || product._id}`}
            className="block relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 sm:mb-3"
          >
            <img
              src={product.imageUrl || product.images?.[0]}
              alt={getLocalizedName()}
              className="w-full h-full object-contain"
            />
          </Link>

          <div className="flex flex-col flex-grow">
            {/* Product Name */}
             <Link
               to={`/product/${product.id || product._id}`}
               className="text-[11px] sm:text-[14px] md:text-[15px] font-semibold text-gray-800 leading-tight mt-1 mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2"
             >
               {getLocalizedName()}
             </Link>

            {/* Variant Selector - Always rendered but with conditional spacing */}
            <div
              className={hasMultipleVariants ? "mb-1 sm:mb-3" : "mb-1 sm:mb-3"}
            >
              {hasMultipleVariants ? (
                <div className="flex gap-1 lg:gap-1 flex-nowrap overflow-x-auto">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`px-2 md:px-3 py-1 rounded-md cursor-pointer border text-[8px] sm:text-[10px] font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                        selectedVariantIdx === idx
                          ? "bg-primary text-white border-primary"
                          : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:border-primary"
                      }`}
                      onClick={() => setSelectedVariantIdx(idx)}
                    >
                      {(() => {
                        const label = getLocalizedQuantityLabel(v);
                        return label?.length > 6 ? label.substring(0, 6) + '...' : label;
                      })()}
                    </button>
                  ))}
                </div>
              ) : (
                product.variants && (
                  <span className="inline-block bg-primary text-white text-[8px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-md border border-primary">
                    {(() => {
                      const label = getLocalizedQuantityLabel(product.variants[0]);
                      return label?.length > 6 ? label.substring(0, 6) + '...' : label;
                    })()}
                  </span>
                )
              )}
            </div>

            {/* Price and Add Button Section - horizontal layout at the bottom */}
            <div className="flex items-center justify-between mt-auto pt-1 flex-nowrap">
              <div className="flex flex-col">
                <div className="flex items-center flex-col-reverse">
                  <section className="text-[14px] flex gap-1 sm:text-[16px] md:text-[18px] font-bold text-primary">
                    <span>{currencySymbol}</span>
                    <span>{formatPrice(variant.discountedPrice ?? variant.price)}</span>
                  </section>
                  {variant.discountedPrice && (
                    <span className="text-[10px] sm:text-xs flex gap-1 text-gray-400 line-through">
                      <span>{currencySymbol}</span>
                      <span>{formatPrice(variant.price)}</span>
                    </span>
                  )}
                </div>
              </div>
              {cartItem ? (
                <div className="flex items-center border border-primary/30 rounded-md overflow-hidden ">
                  <button
                    onClick={handleDecrease}
                    className="p-2 bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors duration-200"
                    aria-label={t("decrease_quantity")}
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="px-3 text-gray-800">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="p-2 cursor-pointer bg-primary hover:bg-primary/80 text-white transition-colors duration-200"
                    aria-label={t("increase_quantity")}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  className="flex cursor-pointer items-center gap-1 flex-nowrap border-primary border-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-semibold hover:border-primary/80 transition-colors"
                  onClick={handleAddToCart}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="inline">{t("add")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;