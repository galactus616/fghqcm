import React from "react";

const ProductDetailsGrid = ({ product }) => {
  // Example fallback data if product fields are missing
  const details = [
    { label: "Type", value: product.type || "Organic Fresh Produce" },
    { label: "Weight", value: product.weight || "Approx. 500g per pack (varies by variant)" },
    { label: "Origin", value: product.origin || "Locally Sourced" },
    { label: "Storage", value: product.storage || "Store at room temperature until ripe, then refrigerate." },
    { label: "Benefits", value: product.benefits || "Rich in Vitamin K, Folate, Vitamin C, Potassium, and healthy monounsaturated fatty acids." },
    { label: "Best Uses", value: product.bestUses || "Guacamole, salads, toasts, smoothies, and as a healthy side dish." },
    { label: "Certifications", value: product.certifications || "Certified Organic, Non-GMO." },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 mt-8 mb-12">
      <h2 className="text-2xl font-bold text-primary mb-6">Product Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700 text-base">
        {details.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="font-semibold min-w-[120px]">{item.label}:</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailsGrid; 