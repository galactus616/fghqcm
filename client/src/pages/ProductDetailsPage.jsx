import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../api/products";
import { Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import useStore from '../store/useStore';
// Note: react-image-magnify is not used in the final design to keep it clean, but can be re-added if needed.

const RelatedProducts = ({ products }) => (
  <div className="flex gap-4 overflow-x-auto pb-4">
    {products.map((product) => (
      // DESIGN CHANGE: Updated related product card style for a cleaner, bordered look.
      <div key={product.id} className="flex-shrink-0 w-36 h-36 border border-gray-200 rounded-xl flex items-center justify-center p-2">
        <img src={product.images?.[0] || product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
      </div>
    ))}
  </div>
);

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  // DESIGN CHANGE: Added separate state for selected image to decouple it from variant selection.
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [related, setRelated] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const { addToCart, hydratedItems: cartItems, updateCartItem, removeFromCart } = useStore();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setProduct(null);
    setSelectedVariantIdx(0);
    setSelectedImageIdx(0); // Reset image index on new product
    getProductById(id)
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
  }, [id]);

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

  // Helper for description formatting, assuming description might contain bullet points marked with '*'
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
// console.log(product)

  return (
    // DESIGN CHANGE: Removed main container background/shadow for a cleaner page feel.
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-sm text-gray-700 mb-6">Delivery in 10 minutes<br />123, Anywhere, state- pincode</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Column: Product Image Gallery */}
        <div className="flex flex-col">
           {/* DESIGN CHANGE: Main image has a border now, not a background color. */}
          <div className="border border-gray-200 rounded-2xl w-full aspect-square flex items-center justify-center p-4 mb-4">
            <img
              src={product.images?.[selectedImageIdx] || product.imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex gap-3 justify-center">
            {(product.images).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                // DESIGN CHANGE: Updated thumbnail styles to match design.
                className={`w-20 h-20 rounded-xl border-2 p-1 transition-all duration-200 ${selectedImageIdx === idx ? 'border-green-500' : 'border-gray-200 hover:border-gray-400'}`}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt={`${product.name} thumbnail ${idx+1}`} className="h-full w-full object-contain rounded-lg" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-md text-gray-500 mb-4">Product Details</p>

          <div className="mb-6">
            <label className="font-semibold text-gray-800 mb-3 block">Select Unit</label>
            <div className="flex gap-3">
              {product.variants?.map((v, idx) => (
                 // DESIGN CHANGE: Variant selectors are now image-based buttons to match the design.
                <button
                  key={idx}
                  type="button"
                  className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-colors p-2 ${
                    selectedVariantIdx === idx ? 'border-green-500' : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedVariantIdx(idx)}
                >
                  <img src={product.images?.[idx] || product.imageUrl} alt={v.quantityLabel} className="h-16 object-contain" />
                  <span className="text-xs mt-1 text-gray-600">{v.quantityLabel}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-3xl font-bold text-gray-800">₹{variant.discountedPrice ?? variant.price}</span>
              {variant.discountedPrice && (
                <span className="text-lg text-gray-400 line-through ml-3">MRP ₹{variant.price}</span>
              )}
              <div className="text-xs text-gray-500 mt-1">(Inclusive of all taxes)</div>
            </div>

            {/* DESIGN CHANGE: Updated cart button/stepper style to be a solid green button. */}
            {cartItem ? (
                <div className="flex items-center bg-green-600 text-white rounded-lg font-bold">
                    <button onClick={handleDecrease} className="px-4 py-3 hover:bg-green-700 rounded-l-lg transition-colors" aria-label="Decrease quantity">
                        <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-4 text-lg">{cartItem.quantity}</span>
                    <button onClick={handleIncrease} className="px-4 py-3 hover:bg-green-700 rounded-r-lg transition-colors" aria-label="Increase quantity">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <button onClick={handleAddToCart} className="bg-green-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>ADD</span>
                </button>
            )}
          </div>
        </div>
      </div>

      {/* --- DESIGN CHANGE: Moved Product Details and Unit info below the main grid --- */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Product Details</h2>
        <div className="prose prose-sm max-w-none text-gray-600">
          {renderDescription()}
        </div>
        
        {product.description && product.description.length > 250 && (
          <button className="text-green-600 font-semibold text-sm mt-3" onClick={() => setShowMore(v => !v)}>
            {showMore ? 'View less details' : 'View more details'}
          </button>
        )}

        <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800">Unit</h3>
            <p className="text-gray-600">{variant.quantityLabel}</p>
        </div>
      </div>


      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top 10 Products in Category</h2>
          <RelatedProducts products={related} />
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;