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

  // Get categories and products from store state
  const { 
    categories, 
    loadingCategories, 
    categoriesError, 
    fetchCategories,
    products,
    loadingProducts,
    productsError,
    fetchProducts,
    fetchProductsByCategory
  } = useStoreOwner();

  // Fetch categories and products on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Fetch products when category changes
  useEffect(() => {
    if (selectedCategory !== "all") {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory, fetchProductsByCategory, fetchProducts]);

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

  // Transform API products to match the expected format
  const transformedProducts = useMemo(() => {
    return products.map(product => ({
      // id: product.id || product._id,
      name: product.name,
      sku: product.sku || 'comming soon' || product._id,
      price: product.variants?.[0]?.price || product.price || 0,
      stock: product.stock || 0,
      status: product.status || "active",
      description: product.description,
      image: product.imageUrl || product.images?.[0] || "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop",
      tags: product.tags || [],
      category: product.category
    }));
  }, [products]);

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

  // Filter products based on search, status, and filter
  const filteredProducts = useMemo(() => {
    let filtered = transformedProducts;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((product) =>
        product.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Sort filter
    switch (selectedFilter) {
      case "newest":
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price_low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "name_az":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_za":
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedStatus, selectedFilter, transformedProducts]);

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
        {loadingProducts ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse"
              >
                <section className=" p-4 rounded-t-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="w-full h-28 bg-gray-200 rounded-lg mb-2"></div>
                </section>
                <section className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
                      <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </section>
              </div>
            ))}
          </section>
        ) : productsError ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-red-600 mb-2">Error loading products</h3>
            <p className="text-red-500 mb-4">{productsError}</p>
            <button 
              onClick={() => fetchProducts()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 "
              >
                <section className=" p-4 rounded-t-lg">
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
                  <div className=" mx-auto w-48 h-48 rounded-lg mb-2 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop";
                      }}
                    />
                  </div>
                </section>
                <section className="p-4">
                  {/* Product Details */}
                  <div className="">
                    <h4 className="font-semibold text-gray-800">{product.name}</h4>
                    <p className="text-xs text-gray-500">
                      SKU: {product.sku} 
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
                      <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-primary/50 duration-200 cursor-pointer">
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
        )}

        {/* No Results Message */}
        {!loadingProducts && !productsError && filteredProducts.length === 0 && (
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
