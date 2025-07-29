import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Eye,
} from "lucide-react";
import StoreCategoriesFilter from "./StoreCategoriesFilter";
import useStoreOwner from "../../../store/useStoreOwner";

const StoreProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("newest");

  // Get categories from store state
  const { categories, loadingCategories, categoriesError, fetchCategories } = useStoreOwner();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Transform API categories to match the expected format
  const transformedCategories = useMemo(() => {
    const allCategories = [
      { value: "all", label: "All Categories" },
      ...categories.map(cat => ({
        value: cat.id || cat._id,
        label: cat.name,
        imageUrl: cat.imageUrl
      }))
    ];
    return allCategories;
  }, [categories]);

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Out of Stock", label: "Out of Stock" },
    { value: "draft", label: "Draft" },
  ];

  const filters = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "name_az", label: "Name: A to Z" },
    { value: "name_za", label: "Name: Z to A" },
  ];

  // Sample products data with descriptions - replace with actual data from your API
  const sampleProducts = [
    {
      id: 1,
      name: "Orange 500g",
      sku: "Orange-005",
      price: 75.99,
      stock: 30,
      status: "active",
      description: "Fresh and juicy oranges, perfect for juicing or eating. Rich in vitamin C and antioxidants.",
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop",
      tags: ["Seasonal", "Fresh", "Vitamin C"],
    },
    {
      id: 2,
      name: "Carrots 1kg",
      sku: "Carrot-001",
      price: 45.5,
      stock: 25,
      status: "active",
      description: "Organic carrots rich in beta-carotene. Perfect for salads, soups, or as a healthy snack.",
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop",
      tags: ["Fresh", "Organic", "Beta-carotene"],
    },
    {
      id: 3,
      name: "Mangoes 3pcs",
      sku: "Mango-003",
      price: 120.0,
      stock: 15,
      status: "active",
      description: "Sweet and ripe mangoes, the king of fruits. Perfect for desserts, smoothies, or eating fresh.",
      image:
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop",
      tags: ["Seasonal", "Fresh", "Sweet"],
    },
    {
      id: 4,
      name: "Adidas Samba",
      sku: "Samba-001",
      price: 8999.0,
      stock: 8,
      status: "active",
      description: "Classic Adidas Samba sneakers. Comfortable, stylish, and perfect for casual wear.",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
      tags: ["Premium", "Limited", "Sneakers"],
    },
    {
      id: 5,
      name: "Broccoli 500g",
      sku: "Broccoli-002",
      price: 65.0,
      stock: 20,
      status: "active",
      description: "Fresh broccoli florets, rich in vitamins and minerals. Great for stir-fries and salads.",
      image:
        "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&h=200&fit=crop",
      tags: ["Fresh", "Healthy", "Vitamins"],
    },
    {
      id: 6,
      name: "Apple Juice 1L",
      sku: "Apple-Juice-001",
      price: 150.0,
      stock: 12,
      status: "active",
      description: "Pure apple juice made from fresh apples. No added sugar, 100% natural.",
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop",
      tags: ["Beverage", "Natural", "No Sugar"],
    },
    {
      id: 7,
      name: "Chocolate Cookies",
      sku: "Choc-Cookie-001",
      price: 85.5,
      stock: 25,
      status: "active",
      description: "Delicious chocolate chip cookies. Perfect with tea or coffee, made with premium ingredients.",
      image:
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop",
      tags: ["Bakery", "Chocolate", "Sweet"],
    },
    {
      id: 8,
      name: "Green Tea 100g",
      sku: "Green-Tea-001",
      price: 200.0,
      stock: 18,
      status: "active",
      description: "Premium green tea leaves. Rich in antioxidants and perfect for daily consumption.",
      image:
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop",
      tags: ["Tea", "Antioxidants", "Healthy"],
    },
    {
      id: 9,
      name: "Notebook A4",
      sku: "Notebook-A4-001",
      price: 120.0,
      stock: 30,
      status: "Out of Stock",
      description: "High-quality A4 notebook with lined pages. Perfect for students and professionals.",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
      tags: ["Stationery", "Paper", "Writing"],
    },
    {
      id: 10,
      name: "Instant Noodles",
      sku: "Noodles-001",
      price: 45.0,
      stock: 50,
      status: "Inactive",
      description: "Quick and easy instant noodles. Ready in 3 minutes, perfect for a quick meal.",
      image:
        "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&h=200&fit=crop",
      tags: ["Instant", "Quick", "Meal"],
    },
  ];

  // Search functionality - searches across ALL fields including numbers, status, and any data
  const filteredProducts = useMemo(() => {
    let filtered = [...sampleProducts];

    // Search filter - now searches across ALL fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => {
        // Create a comprehensive searchable text from ALL product fields
        const searchableText = [
          product.name,
          product.description,
          product.sku,
          product.status,
          product.price.toString(),
          product.stock.toString(),
          product.id.toString(),
          ...product.tags
        ].join(' ').toLowerCase();
        
        // Also check for exact number matches
        const exactMatches = [
          product.price === parseFloat(query),
          product.stock === parseInt(query),
          product.id === parseInt(query)
        ];
        
        return searchableText.includes(query) || exactMatches.some(match => match);
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      // For now, we'll use tags to simulate category filtering
      // In real implementation, you'd have a category field
      filtered = filtered.filter(product => 
        product.tags.some(tag => 
          tag.toLowerCase().includes(selectedCategory.replace('_', ' '))
        )
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    // Sort filter
    switch (selectedFilter) {
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name_az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_za":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedStatus, selectedFilter]);

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

  // Function to get status color based on status value
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "inactive":
        return "text-red-600 bg-red-50 border-red-200";
      case "out of stock":
        return "text-gray-500 bg-gray-50 border-gray-200";
      case "draft":
        return "text-black bg-gray-100 border-gray-300";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <>
      <section className="space-y-2">
        {/* Text Section */}
        <section className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-gray-800">Your Products</h3>
          <p className="text-gray-500">Manage your products and inventory</p>
        </section>

        {/* Search and Filters Section */}
        <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, description, SKU, price, stock, status, ID, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Category Select */}
            <div className="relative min-w-[180px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={loadingCategories}
                className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  loadingCategories ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                {loadingCategories ? (
                  <option value="all">Loading categories...</option>
                ) : (
                  transformedCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute text-primary right-3 top-1/2 transform -translate-y-1/2  w-4 h-4 pointer-events-none" />
            </div>

            {/* Status Select */}
            <div className="relative min-w-[160px]">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
            </div>

            {/* Filter Select */}
            <div className="relative min-w-[180px]">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
              >
                {filters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Category Icons Filter */}
        {loadingCategories ? (
          <section className="w-full py-3">
            <section className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Categories</span>
            </section>
            <div className="flex gap-3 overflow-x-auto pb-2 px-1">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center w-16 h-16 sm:w-18 sm:h-18 md:w-24 md:h-24 lg:w-28 lg:h-28 p-2 rounded-lg border-2 border-gray-200 animate-pulse"
                >
                  <div className="w-full h-3/4 bg-gray-200 rounded mb-1"></div>
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </section>
        ) : categoriesError ? (
          <section className="w-full py-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">
                Error loading categories: {categoriesError}
              </p>
            </div>
          </section>
        ) : (
          <StoreCategoriesFilter
            categories={transformedCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {/* Search Results Info */}
        {searchQuery.trim() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              Found <span className="font-semibold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''} 
              matching "<span className="font-semibold">{searchQuery}</span>"
            </p>
          </div>
        )}

        {/* Products Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 "
            >
                  <section className="bg-[#E4FFCB]  p-4 rounded-t-lg">
              {/* Product Header */}
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 border text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
                <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                  <MoreHorizontal className="w-4 h-4 bg-white p-1 rounded-full" />
                </button>
              </div>

              {/* Product Image */}
              <div className="w-full h-28 rounded-lg mb-2 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
</section>
<section className="p-4">
              {/* Product Details */}
              <div className="">
                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                <p className="text-xs text-gray-500">
                  SKU: {product.sku} | ID: # {product.id}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-800">
                    <span className="text-2xl font-bold text-gray-800">৳ </span>{product.price}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    In Stock: {product.stock}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex gap-1 flex-wrap">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-primary/50  duration-200 cursor-pointer">
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                    Add +
                  </button>
                </div>
              </div>
              </section>
            </div>
          ))}
        </section>

        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">
              {searchQuery.trim() 
                ? `No products match "${searchQuery}". Try adjusting your search terms.`
                : "No products match the current filters. Try adjusting your selection."
              }
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default StoreProducts;
