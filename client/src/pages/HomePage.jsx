import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoriesSlide from "../components/CategoriesSlide";
import PromoBanner from "../components/PromoBanner";
import ProductSection from "../components/ProductSection";

// Dummy product data for demonstration
const sampleProducts = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=300&q=80",
    name: "Fresh Apples",
    weight: "1kg",
    price: 120,
    originalPrice: 150,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=300&q=80",
    name: "Organic Tomatoes",
    weight: "500g",
    price: 60,
    originalPrice: 80,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=400&q=80",
    name: "Whole Wheat Bread",
    weight: "400g",
    price: 45,
    originalPrice: 55,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    name: "Milk (Toned)",
    weight: "1L",
    price: 55,
    originalPrice: 60,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
    name: "Potato Chips",
    weight: "200g",
    price: 40,
    originalPrice: 50,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    name: "Dishwash Liquid",
    weight: "750ml",
    price: 99,
    originalPrice: 120,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=300&q=80",
    name: "Eggs (Farm Fresh)",
    weight: "12 pcs",
    price: 85,
    originalPrice: 100,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    name: "Instant Noodles",
    weight: "70g",
    price: 15,
    originalPrice: 20,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
    name: "Imported Chocolate",
    weight: "100g",
    price: 120,
    originalPrice: 150,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    name: "Toilet Cleaner",
    weight: "1L",
    price: 110,
    originalPrice: 130,
  },
];

const CategorySkeleton = () => (
  <section className="w-full py-6 px-2 sm:px-4 md:px-8">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 w-40 bg-green-100 rounded animate-pulse" />
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-green-100 rounded-full animate-pulse" />
        <div className="h-8 w-8 bg-green-100 rounded-full animate-pulse" />
      </div>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center min-w-[110px] bg-white rounded-xl p-4 shadow-md border border-green-100"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full mb-2 animate-pulse" />
          <div className="h-4 w-16 bg-green-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </section>
);

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/products/categories");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="font-sans bg-green-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        {/* Category Slide Section */}
        {error && <div className="text-center text-red-600 py-6">{error}</div>}
        {loading && <CategorySkeleton />}
        {!loading && !error && categories.length > 0 && (
          <CategoriesSlide categories={categories} />
        )}
        <div className="pt-6">
          <PromoBanner />
        </div>
        <div className="space-y-10 mt-6">
          <ProductSection
            title="Handpicked for You"
            products={sampleProducts.slice(0, 4)}
            cardClassName="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            titleClassName="text-green-800 font-bold text-xl md:text-2xl mb-4"
          />
          <ProductSection
            title="Everyone's Favorite"
            products={sampleProducts.slice(2, 6)}
            cardClassName="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            titleClassName="text-green-800 font-bold text-xl md:text-2xl mb-4"
          />
          <ProductSection
            title="Home Essentials Hub"
            products={sampleProducts.slice(4, 8)}
            cardClassName="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            titleClassName="text-green-800 font-bold text-xl md:text-2xl mb-4"
          />
          <ProductSection
            title="From Farm to Your Fridge"
            products={sampleProducts
              .slice(0, 2)
              .concat(sampleProducts.slice(6, 7))}
            cardClassName="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            titleClassName="text-green-800 font-bold text-xl md:text-2xl mb-4"
          />
          <ProductSection
            title="Just Landed!"
            products={sampleProducts.slice(7, 9)}
            cardClassName="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            titleClassName="text-green-800 font-bold text-xl md:text-2xl mb-4"
          />
          <ProductSection
            title="Quick Grab Deals"
            products={sampleProducts.slice(3, 7)}
            cardClassName="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            titleClassName="text-green-800 font-bold text-xl md:text-2xl mb-4"
          />
          <ProductSection
            title="Don't Miss These!"
            products={sampleProducts.slice(1, 5)}
            cardClassName="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            titleClassName="text-green-800 font-bold text-xl md:text-2xl mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
