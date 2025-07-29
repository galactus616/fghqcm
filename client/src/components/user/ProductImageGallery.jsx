import React, { useState, useRef } from "react";

const ProductImageGallery = ({
  images,
  productName,
  selectedImageIdx,
  setSelectedImageIdx,
  zoomLevel = 200, // Default to 2x zoom (200%)
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const imageList =
    images && images.length > 0 ? images : ["/path/to/default-image.png"];

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMagnifierPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {imageList.length > 1 && (
        <div className="flex md:flex-col gap-2 justify-center md:justify-start">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIdx(idx)}
              className={`w-16 h-16 cursor-pointer rounded-lg border p-1 transition-all duration-200 flex-shrink-0 shadow-sm ${
                selectedImageIdx === idx
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-gray-200 hover:border-primary"
              }`}
              aria-label={`View image ${idx + 1}`}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="h-full w-full object-contain rounded-md"
              />
            </button>
          ))}
        </div>
      )}
      
      <div className="flex-1 flex gap-4">
        {/* Main Image Container */}
        <div 
          className="relative w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shadow group cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={imageRef}
        >
          <img
            src={imageList[selectedImageIdx]}
            alt={productName}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      {/* Magnifier Container - Positioned to overlay the ProductInfo area */}
      {showMagnifier && (
        <div className="fixed lg:absolute lg:left-[calc(50%+1rem)] lg:top-1/3 lg:w-[calc(50%-6rem)] lg:h-[calc(100vh-6rem)] z-50 border-2 border-gray-300 rounded-lg overflow-hidden shadow-2xl bg-white">
          <div 
            className="w-full h-full relative overflow-hidden"
            style={{
              backgroundImage: `url(${imageList[selectedImageIdx]})`,
              backgroundSize: `${zoomLevel}%`,
              backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery; 