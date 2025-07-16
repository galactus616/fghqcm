import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../api/products";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useStore from '../store/useStore';

const RelatedProducts = ({ products }) => (
  <div className="flex gap-4 overflow-x-auto pb-4">
    {products.map((product) => (
      <div key={product.id} className="flex-shrink-0 w-36 h-36 border border-gray-200 rounded-xl flex items-center justify-center p-2 bg-white">
        <img src={product.images?.[0] || product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
      </div>
    ))}
  </div>
);

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [related, setRelated] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const { addToCart, hydratedItems: cartItems, updateCartItem, removeFromCart } = useStore();

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
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return null;

  const variant = product.variants?.[selectedVariantIdx] || {};
  const cartItem = cartItems.find(
    (item) => (item.productId === (product.id || product._id)) && item.variantIndex === selectedVariantIdx
  );

  const handleAddToCart = () => {
    try {
      addToCart({
        productId: product.id || product._id,
        variantIndex: selectedVariantIdx,
        quantity: 1
      });
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleIncrease = () => {
    if (cartItem) {
      updateCartItem(cartItem.productId, cartItem.variantIndex, cartItem.quantity + 1);
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

  const renderDescription = () => {
    if (!product.description) return null;
    const descriptionText = showMore ? product.description : product.description.slice(0, 250);
    const lines = descriptionText.split('\n').filter(line => line.trim() !== '');
    return (
      <ul className="space-y-2 list-disc list-inside text-gray-600 text-sm">
        {lines.map((line, index) => (
          <li key={index}>{line.replace(/^\s*-\s*/, '')}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="font-sans bg-green-50 min-h-screen pb-10">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-8 pt-8">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 text-green-700 hover:underline font-medium text-base mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        {/* Delivery Info Bar */}
        <div className="mb-6 flex items-center gap-3 bg-green-100 border border-green-200 rounded-lg px-4 py-2 text-green-800 text-sm font-semibold">
          <span>🚚 Delivery in 10 minutes</span>
          <span className="text-gray-500 font-normal">|</span>
          <span>123, Anywhere, state- pincode</span>
        </div>
        {/* Main Product Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          {/* Left: Image Gallery */}
          <div className="flex flex-col items-center w-full lg:w-1/2">
            <div className="border border-gray-200 rounded-2xl w-full aspect-square flex items-center justify-center p-4 mb-4 bg-gray-50">
              <img
                src={product.images?.[selectedImageIdx] || product.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex gap-2 justify-center">
              {(product.images && product.images.length > 0 ? product.images : [product.imageUrl]).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl border-2 p-1 transition-all duration-200 ${selectedImageIdx === idx ? 'border-green-500' : 'border-gray-200 hover:border-gray-400'}`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx+1}`} className="h-full w-full object-contain rounded-lg" />
                </button>
              ))}
            </div>
          </div>
          {/* Right: Product Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </span>
                {product.isBestSeller && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BESTSELLER</span>
                )}
                {product.isFeatured && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">FEATURED</span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">{product.name}</h1>
              <div className="text-gray-500 text-sm mb-4">{product.description?.slice(0, 60)}{product.description && product.description.length > 60 ? '...' : ''}</div>
              {/* Variant Selector */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-4">
                  <label className="font-semibold text-gray-800 mb-2 block">Select Unit</label>
                  <div className="flex gap-2">
                    {product.variants.map((v, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
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
                </div>
              )}
              {/* Price and Cart Controls */}
              <div className="flex items-center justify-between mb-6 mt-2">
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold text-green-700">₹{variant.discountedPrice ?? variant.price}</span>
                  {variant.discountedPrice && (
                    <span className="text-md text-gray-400 line-through ml-2">MRP ₹{variant.price}</span>
                  )}
                  <div className="text-xs text-gray-500 mt-1">(Inclusive of all taxes)</div>
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
                    className="flex items-center gap-1 text-white bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                    onClick={handleAddToCart}
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD</span>
                  </button>
                )}
              </div>
            </div>
            {/* Product Details Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-lg font-bold text-green-800 mb-2">Product Details</h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                {renderDescription()}
              </div>
              {product.description && product.description.length > 250 && (
                <button className="text-green-600 font-semibold text-sm mt-3" onClick={() => setShowMore(v => !v)}>
                  {showMore ? 'View less details' : 'View more details'}
                </button>
              )}
              <div className="mt-6">
                <h3 className="text-base font-bold text-gray-800">Unit</h3>
                <p className="text-gray-600">{variant.quantityLabel}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Related Products Section */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-green-800 mb-4">Top 10 Products in Category</h2>
            <RelatedProducts products={related} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;