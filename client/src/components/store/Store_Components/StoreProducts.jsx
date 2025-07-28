import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Eye,
} from "lucide-react";
import StoreCategoriesFilter from "./StoreCategoriesFilter";

const StoreProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("newest");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "vegetables", label: "Vegetables" },
    { value: "meat", label: "Meat" },
    { value: "fruits", label: "Fruits" },
    { value: "beverages", label: "Beverages" },
    { value: "snacks", label: "Snacks" },
    { value: "cookies", label: "Cookies" },
    { value: "coffee", label: "Tea & Coffee" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Fashion" },
    { value: "stationery", label: "Stationery" },
    { value: "chocolate", label: "Chocolate" },
    { value: "instant_food", label: "Instant Food" },
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "out_of_stock", label: "Out of Stock" },
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

  // Sample products data - replace with actual data from your API
  const sampleProducts = [
    {
      id: 1,
      name: "Orange 500g",
      sku: "Orange-005",
      price: 75.99,
      stock: 30,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop",
      tags: ["Seasonal", "Fresh"],
    },
    {
      id: 2,
      name: "Carrots 1kg",
      sku: "Carrot-001",
      price: 45.5,
      stock: 25,
      status: "active",
      image:
        "../../../../public/storeimages/storeproductimages/25_Best_Companion_Plants_For_Peppers_+_What_To_Avoid__Printable_Chart__-_Grow_Hot_Peppers-removebg-preview 1.png",
      tags: ["Fresh", "Organic"],
    },
    {
      id: 3,
      name: "Mangoes 3pcs",
      sku: "Mango-003",
      price: 120.0,
      stock: 15,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop",
      tags: ["Seasonal", "Fresh"],
    },
    {
      id: 4,
      name: "Adidas Samba",
      sku: "Samba-001",
      price: 8999.0,
      stock: 8,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
      tags: ["Premium", "Limited"],
    },
    {
      id: 5,
      name: "Broccoli 500g",
      sku: "Broccoli-002",
      price: 65.0,
      stock: 20,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&h=200&fit=crop",
      tags: ["Fresh", "Healthy"],
    },
    {
      id: 6,
      name: "Orange 500g",
      sku: "Orange-005",
      price: 75.99,
      stock: 30,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop",
      tags: ["Seasonal", "Fresh"],
    },
    {
      id: 7,
      name: "Carrots 1kg",
      sku: "Carrot-001",
      price: 45.5,
      stock: 25,
      status: "active",
      image:
        "../../../../public/storeimages/storeproductimages/25_Best_Companion_Plants_For_Peppers_+_What_To_Avoid__Printable_Chart__-_Grow_Hot_Peppers-removebg-preview 1.png",
      tags: ["Fresh", "Organic"],
    },
    {
      id: 8,
      name: "Mangoes 3pcs",
      sku: "Mango-003",
      price: 120.0,
      stock: 15,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop",
      tags: ["Seasonal", "Fresh"],
    },
    {
      id: 9,
      name: "Adidas Samba",
      sku: "Samba-001",
      price: 8999.0,
      stock: 8,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
      tags: ["Premium", "Limited"],
    },
    {
      id: 10,
      name: "Broccoli 500g",
      sku: "Broccoli-002",
      price: 65.0,
      stock: 20,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&h=200&fit=crop",
      tags: ["Fresh", "Healthy"],
    },
  ];

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
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
                placeholder="Search your products"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
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
        <StoreCategoriesFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Products Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 "
            >
                  <section className="bg-[#E4FFCB]  p-4 rounded-t-lg">
              {/* Product Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 border-primary bg-white text-primary text-xs font-medium rounded-full">
                  {product.status === "active" ? "Active" : product.status}
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
                  SKU: {product.sku} | ID: #{product.id}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-800">
                    ৳ {product.price}
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
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                    View
                  </button>
                </div>
              </div>
              </section>
            </div>
          ))}
        </section>
      </section>
    </>
  );
};

export default StoreProducts;
