import React, { useEffect, useState } from "react";
import { useCurrencySymbol } from "../../utils/currencyUtils";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../../api/user/products";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../../store/useStore";
import { useTranslation } from "react-i18next";
import ProductCard from "../../components/user/ProductCard";

const ProductDetailsPage = () => {
  // Use the currency symbol hook for reactive updates
  const currencySymbol = useCurrencySymbol();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [related, setRelated] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const {
    addToCart,
    hydratedItems: cartItems,
    updateCartItem,
    removeFromCart,
  } = useStore();
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setProduct(null);
    setSelectedVariantIdx(0);
    setSelectedImageIdx(0);
    getProductById(productId)
      .then((data) => {
        setProduct(data);
        if (data.category && data.category.id) {
          getProductsByCategory(data.category.id).then((rel) => {
            setRelated(rel.filter((p) => p.id !== data.id).slice(0, 10));
          });
        }
      })
      .catch(() => setError(t("product_not_found")))
      .finally(() => setLoading(false));
  }, [productId, t]);

  if (loading)
    return <div className="p-8 text-center text-gray-500">{t("loading")}</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return null;

  const variant = product.variants?.[selectedVariantIdx] || {};
  const cartItem = cartItems.find(
    (item) =>
      item.productId === (product.id || product._id) &&
      item.variantIndex === selectedVariantIdx
  );

  const handleAddToCart = () => {
    try {
      addToCart({
        productId: product.id || product._id,
        variantIndex: selectedVariantIdx,
        quantity: 1,
      });
      toast.success(t("added_to_cart"));
    } catch {
      toast.error(t("failed_to_add_to_cart"));
    }
  };

  const handleIncrease = () => {
    if (cartItem) {
      updateCartItem(
        cartItem.productId,
        cartItem.variantIndex,
        cartItem.quantity + 1
      );
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

  const renderDescription = () => {
    if (!product.description) return null;
    const descriptionText = showMore
      ? product.description
      : product.description.slice(0, 250);
    const lines = descriptionText
      .split("\n")
      .filter((line) => line.trim() !== "");
    return (
      <ul className="space-y-2 list-disc list-inside text-gray-600 text-sm">
        {lines.map((line, index) => (
          <li key={index}>{line.replace(/^\s*-\s*/, "")}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="font-sans bg-[#0a614d]/5 min-h-screen pb-10">
      <section className="w-11/12 mx-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-8">
          {/* Back Button */}
          <button
            className="flex cursor-pointer items-center gap-2 text-primary hover:underline font-medium text-base mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
            {t("back")}
          </button>
          {/* Delivery Info Bar */}
          <div className="mb-6 flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-2 text-primary text-sm font-semibold">
            <span>🚚 {t("delivery_in_10_minutes")}</span>
            <span className="text-gray-500 font-normal">|</span>
            <span>{t("delivery_address_example")}</span>
          </div>
          {/* Main Product Card - Two Column Layout */}
          <div className="bg-white rounded-2xl shadow-lg border border-primary/30 p-6 md:p-8 flex flex-col lg:flex-row gap-12">
            {/* Left: Image Gallery */}
            <div className="flex flex-col items-center w-full lg:w-[400px]">
              <div className="border border-gray-200 rounded-2xl w-full aspect-square flex items-center justify-center p-4 mb-4 bg-gray-50">
                <img
                  src={product.images?.[selectedImageIdx] || product.imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex gap-2 justify-center">
                {(product.images && product.images.length > 0
                  ? product.images
                  : [product.imageUrl]
                ).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-14 h-14 cursor-pointer rounded-xl border-2 p-1 transition-all duration-200 ${
                      selectedImageIdx === idx
                        ? "border-primary"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain rounded-lg"
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* Right: Product Info - Clean Modern Layout */}
            <div className="flex-1 flex flex-col max-w-md justify-between mt-8 lg:mt-0">
              <div>
                {/* Category Badge */}
                <span
                  className="text-xs font-bold uppercase text-gray-500 bg-gray-100 rounded px-2 py-0.5 cursor-pointer hover:underline mb-2 inline-block"
                  onClick={() => {
                    if (typeof product.category === 'object' && product.category.id) {
                      navigate(`/category/${product.category.id}`);
                    } else if (typeof product.category === 'object' && product.category._id) {
                      navigate(`/category/${product.category._id}`);
                    } else if (typeof product.category === 'string') {
                      navigate(`/category/${product.category}`);
                    }
                  }}
                >
                  {typeof product.category === "object"
                    ? product.category.name
                    : product.category}
                </span>
                {/* Product Name */}
                <h1 className="text-3xl font-bold text-primary mb-1">{product.name}</h1>
                {/* Short Description */}
                <p className="text-gray-600 mb-4">{product.description?.slice(0, 60)}{product.description && product.description.length > 60 ? "..." : ""}</p>
                {/* Variant Selector */}
                {product.variants && product.variants.length > 1 && (
                  <div className="mb-4">
                    <label className="font-semibold text-gray-800 mb-2 block">{t("select_unit")}</label>
                    <div className="flex gap-2">
                      {product.variants.map((v, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`px-3 py-1 cursor-pointer rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                            selectedVariantIdx === idx
                              ? "bg-primary text-white border-primary"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedVariantIdx(idx)}
                        >
                          {v.quantityLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Price and Add Button Row */}
                <div className="flex items-center justify-between mb-4 gap-4">
                  <div>
                    <span className="text-2xl font-bold text-primary">{currencySymbol}{variant.discountedPrice ?? variant.price}</span>
                    {variant.discountedPrice && (
                      <span className="line-through text-gray-400 ml-2">{currencySymbol}{variant.price}</span>
                    )}
                    {variant.discountedPrice && variant.discountedPrice < variant.price && (
                      <span className="ml-2 text-bd-red font-semibold">{Math.round(((variant.price - variant.discountedPrice) / variant.price) * 100)}% OFF</span>
                    )}
                  </div>
                  {cartItem ? (
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden ">
                      <button
                        onClick={handleDecrease}
                        className="p-2 bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors duration-200"
                        aria-label={t("decrease_quantity")}
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="px-3 text-gray-800">{cartItem.quantity}</span>
                      <button
                        onClick={handleIncrease}
                        className="p-2 bg-primary cursor-pointer hover:bg-primary/80 text-white transition-colors duration-200"
                        aria-label={t("increase_quantity")}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
                      onClick={handleAddToCart}
                    >
                      <Plus className="w-4 h-4 inline-block mr-1" /> {t("add")}
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-2">{t("inclusive_of_all_taxes")}</div>
              </div>
              {/* Product Details Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h2 className="font-bold text-primary mb-2">{t("product_details")}</h2>
                <ul className="list-disc ml-5 text-gray-600">
                  <li>{product.description}</li>
                </ul>
                <div className="mt-2">
                  <span className="font-bold">{t("unit")}:</span> {variant.quantityLabel}
                </div>
              </div>
            </div>
          </div>
          {/* Related Products Section */}
        </div>
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-primary mb-4">
              {t("Top 10 Products In Category")}
            </h2>
            <div className="flex gap-4 overflow-x-auto w-full pb-4">
              {related.map((product) => (
                <div
                  key={product.id || product._id}
                  className="flex-shrink-0 flex-none"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetailsPage;
