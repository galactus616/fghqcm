import React from "react";

const ProductImageGallery = ({
  images,
  productName,
  selectedImageIdx,
  setSelectedImageIdx,
}) => {
  const imageList =
    images && images.length > 0 ? images : ["/path/to/default-image.png"];

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
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shadow group">
        <img
          src={imageList[selectedImageIdx]}
          alt={productName}
          className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </div>
    </div>
  );
};

export default ProductImageGallery; 