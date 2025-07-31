import React, { useState } from 'react';
import { X, Plus, Minus, Package, Tag, DollarSign, BarChart3, Eye, ShoppingCart, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const StoreProductsModal = ({ isOpen, onClose, product }) => {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Handle escape key to close modal and body scroll lock
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToInventory = () => {
    // TODO: Implement add to inventory functionality
    toast.success('Product added to inventory!');
    onClose();
  };

  const handleImageSelect = (index) => {
    setSelectedImageIdx(index);
  };

  const handleVariantSelect = (index) => {
    setSelectedVariantIdx(index);
    setQuantity(1); // Reset quantity when variant changes
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const currentVariant = product.variants?.[selectedVariantIdx] || {};
  const currentPrice = currentVariant.price || product.price || 0;
  const currentDiscountedPrice = currentVariant.discountedPrice || product.discountedPrice;
  const images = product.images || [product.imageUrl] || [];
  
  // Calculate discount percentage
  const discountPercentage = currentDiscountedPrice && currentPrice > currentDiscountedPrice 
    ? Math.round(((currentPrice - currentDiscountedPrice) / currentPrice) * 100)
    : 0;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={images[selectedImageIdx] || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop";
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIdx
                          ? 'border-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1547514701-42782101795e?w=64&h=64&fit=crop";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                {/* Category */}
                {(product.mainCategory || product.category) && (
                  <div className="text-sm text-primary font-medium mb-2">
                    {product.mainCategory?.name || product.category?.name || 'Product'}
                    {product.subCategory && (
                      <span className="text-gray-500 ml-2">› {product.subCategory.name}</span>
                    )}
                  </div>
                )}
                
                <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
                
                {/* Status, SKU, and Labels */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' :
                    product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                  <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                  {product.isBestSeller && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
                      Best Seller
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200">
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
              </div>

              {/* Price Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-gray-800">
                      ৳{currentDiscountedPrice && currentDiscountedPrice < currentPrice ? currentDiscountedPrice.toFixed(2) : currentPrice.toFixed(2)}
                    </span>
                    {currentDiscountedPrice && currentDiscountedPrice < currentPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ৳{currentPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <span className="px-3 py-1 bg-gray-100 text-primary text-sm font-medium rounded-full">
                      {discountPercentage}% Off
                    </span>
                  )}
                </div>
                {currentDiscountedPrice && currentDiscountedPrice < currentPrice && (
                  <div className="text-sm text-green-600 font-medium">
                    Save ৳{(currentPrice - currentDiscountedPrice).toFixed(2)}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Inclusive of all taxes
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Select Unit</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => handleVariantSelect(index)}
                        className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                          index === selectedVariantIdx
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'
                        }`}
                      >
                        {variant.quantityLabel}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Info */}
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <BarChart3 className="w-4 h-4" />
                <span>In Stock</span>
                <span className="text-gray-600">({product.stock || 0} units available)</span>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Quantity to Add</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                <Truck className="w-4 h-4" />
                <span>Estimated Delivery: Within 10 minutes</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleAddToInventory}
                  className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add to Inventory
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProductsModal;