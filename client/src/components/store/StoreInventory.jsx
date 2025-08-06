import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Minus,
  Edit,
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  Settings,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Grid3X3,
  List,
} from "lucide-react";
import useStoreOwner from "../../store/useStoreOwner";
import axios from "axios";
import sampleData from "../../data/sampleInventory.json";

const Inventory = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("newest");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isEditingStock, setIsEditingStock] = useState(null);
  const [editStockValue, setEditStockValue] = useState("");
  const [showLowStockAlert, setShowLowStockAlert] = useState(false);
  const [useSampleData, setUseSampleData] = useState(true); // Toggle for demo data
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [editingStatus, setEditingStatus] = useState(null); // Track which item is editing status

  // Get store data
  const {
    categories,
    products,
    loadingCategories,
    loadingProducts,
    fetchCategories,
    fetchProducts,
  } = useStoreOwner();

  // Fetch data on component mount
  useEffect(() => {
    if (useSampleData) {
      // Use sample data
      setInventory(sampleData.inventory);
      setLoading(false);
      setError(null);
    } else {
      // Use real API data
      fetchCategories();
      fetchProducts();
      fetchInventory();
    }
  }, [fetchCategories, fetchProducts, useSampleData]);

  // Fetch inventory data
  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/inventory/my`,
        {
          withCredentials: true,
        }
      );
      setInventory(response.data.inventory || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add product to inventory
  const addToInventory = async (productId, stock = 1) => {
    if (useSampleData) {
      // Simulate adding to sample data
      const newItem = {
        _id: `inv_${Date.now()}`,
        storeId: "store_001",
        productId: products.find((p) => p._id === productId) || {
          _id: productId,
          name: "New Product",
          imageUrl: "https://placehold.co/400x400/F0FDF4/1C6F40?text=New",
          mainCategory: { name: "Uncategorized" },
        },
        stock: stock,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInventory((prev) => [...prev, newItem]);
    } else {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/inventory`,
          {
            productId,
            stock,
          },
          { withCredentials: true }
        );
        fetchInventory(); // Refresh inventory
      } catch (err) {
        console.error("Failed to add to inventory:", err);
      }
    }
  };

  // Update inventory stock
  const updateInventoryStock = async (inventoryId, newStock) => {
    if (useSampleData) {
      // Simulate updating sample data
      setInventory((prev) =>
        prev.map((item) =>
          item._id === inventoryId
            ? { ...item, stock: newStock, updatedAt: new Date().toISOString() }
            : item
        )
      );
      setIsEditingStock(null);
      setEditStockValue("");
    } else {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/inventory/${inventoryId}`,
          {
            stock: newStock,
          },
          { withCredentials: true }
        );
        fetchInventory(); // Refresh inventory
        setIsEditingStock(null);
        setEditStockValue("");
      } catch (err) {
        console.error("Failed to update inventory:", err);
      }
    }
  };

  // Remove from inventory
  const removeFromInventory = async (inventoryId) => {
    if (useSampleData) {
      // Simulate removing from sample data
      setInventory((prev) => prev.filter((item) => item._id !== inventoryId));
    } else {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/inventory/${inventoryId}`,
          {
            withCredentials: true,
          }
        );
        fetchInventory(); // Refresh inventory
      } catch (err) {
        console.error("Failed to remove from inventory:", err);
      }
    }
  };

  // Calculate inventory statistics
  const inventoryStats = useMemo(() => {
    const totalItems = inventory.length;
    const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
    const lowStockItems = inventory.filter(
      (item) => item.stock <= 10 && item.stock > 0
    ).length;
    const outOfStockItems = inventory.filter((item) => item.stock === 0).length;
    const activeItems = inventory.filter((item) => item.isActive).length;

    return {
      totalItems,
      totalStock,
      lowStockItems,
      outOfStockItems,
      activeItems,
      averageStock: totalItems > 0 ? Math.round(totalStock / totalItems) : 0,
    };
  }, [inventory]);

  // Filter and sort inventory
  const filteredInventory = useMemo(() => {
    let filtered = inventory;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        const product = item.productId;
        const productName = product?.name || "";
        const productDescription = product?.description || "";
        const stockLevel = item.stock?.toString() || "";

        return (
          productName.toLowerCase().includes(query) ||
          productDescription.toLowerCase().includes(query) ||
          stockLevel.includes(query) ||
          product?._id?.toLowerCase().includes(query) ||
          product?.mainCategory?.name?.toLowerCase().includes(query) ||
          product?.subCategory?.name?.toLowerCase().includes(query)
        );
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.productId.mainCategory?._id === selectedCategory ||
          item.productId.mainCategory?.name === selectedCategory
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      switch (selectedStatus) {
        case "active":
          filtered = filtered.filter((item) => item.isActive);
          break;
        case "inactive":
          filtered = filtered.filter((item) => !item.isActive);
          break;
        case "out_of_stock":
          filtered = filtered.filter((item) => item.stock === 0);
          break;
        case "critical":
          filtered = filtered.filter(
            (item) => item.stock > 0 && item.stock <= 5
          );
          break;
        case "low_stock":
          filtered = filtered.filter(
            (item) => item.stock > 5 && item.stock <= 10
          );
          break;
        case "in_stock":
          filtered = filtered.filter((item) => item.stock > 10);
          break;
        default:
          break;
      }
    }

    // Sort filter
    switch (selectedFilter) {
      case "newest":
        filtered = [...filtered].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        filtered = [...filtered].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "stock_high":
        filtered = [...filtered].sort((a, b) => b.stock - a.stock);
        break;
      case "stock_low":
        filtered = [...filtered].sort((a, b) => a.stock - b.stock);
        break;
      case "name_az":
        filtered = [...filtered].sort((a, b) =>
          a.productId.name.localeCompare(b.productId.name)
        );
        break;
      case "name_za":
        filtered = [...filtered].sort((a, b) =>
          b.productId.name.localeCompare(a.productId.name)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [
    inventory,
    searchQuery,
    selectedCategory,
    selectedStatus,
    selectedFilter,
  ]);

  // Handle stock editing
  const handleEditStock = (item) => {
    setIsEditingStock(item._id);
    setEditStockValue(item.stock.toString());
  };

  const handleSaveStock = () => {
    const newStock = parseInt(editStockValue);
    if (!isNaN(newStock) && newStock >= 0) {
      updateInventoryStock(isEditingStock, newStock);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingStock(null);
    setEditStockValue("");
  };

  // Handle item selection
  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map((item) => item._id));
    }
  };

  // Get categories for filtering
  const availableCategories = useMemo(() => {
    if (useSampleData) {
      return sampleData.categories;
    }
    return categories;
  }, [useSampleData, categories]);

  // Status options
  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active Products" },
    { value: "inactive", label: "Inactive Products" },
    { value: "out_of_stock", label: "Out of Stock" },
    { value: "critical", label: "Critical Stock" },
    { value: "low_stock", label: "Low Stock" },
    { value: "in_stock", label: "In Stock" },
  ];

  // Filter options
  const filters = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "stock_high", label: "Stock: High to Low" },
    { value: "stock_low", label: "Stock: Low to High" },
    { value: "name_az", label: "Name: A to Z" },
    { value: "name_za", label: "Name: Z to A" },
  ];

  // Helper functions for Dynamic Stock Status
  const getStockStatusColor = (stock) => {
    if (stock === 0) return "text-red-600 bg-red-50 border-red-200";
    if (stock <= 5) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (stock <= 10) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getStockStatusText = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Critical";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  // Helper functions for Manual Status
  const getManualStatusColor = (isActive) => {
    return isActive
      ? "text-green-600 bg-green-50 border-green-200"
      : "text-gray-500 bg-gray-50 border-gray-200";
  };

  const getManualStatusText = (isActive) => {
    return isActive ? "Active" : "Inactive";
  };

  // Function to handle manual status change
  const handleStatusChange = async (itemId, newStatus) => {
    try {
      if (useSampleData) {
        // Update sample data
        setInventory((prev) =>
          prev.map((item) =>
            item._id === itemId
              ? { ...item, isActive: newStatus === "active" }
              : item
          )
        );
      } else {
        // Update via API
        const response = await axios.patch(
          `/api/store/inventory/${itemId}/status`,
          {
            isActive: newStatus === "active",
          }
        );

        if (response.data.success) {
          setInventory((prev) =>
            prev.map((item) =>
              item._id === itemId
                ? { ...item, isActive: newStatus === "active" }
                : item
            )
          );
        }
      }
      setEditingStatus(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Inventory Management
            </h3>
            <p className="text-gray-500">
              Track and manage your product stock levels
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-gray-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">Table</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-gray-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="text-sm font-medium">Grid</span>
              </button>
            </div>

            {/* Data Source Toggle */}
            <button
              onClick={() => setUseSampleData(!useSampleData)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                useSampleData
                  ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
            >
              <Database className="w-4 h-4" />
              {useSampleData ? "Sample Data" : "Live Data"}
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventoryStats.totalItems}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventoryStats.totalStock}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Low Stock Items
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {inventoryStats.lowStockItems}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {inventoryStats.outOfStockItems}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by product name, description, stock level, category, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Select */}
          <div className="relative min-w-[180px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
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

      {/* Search Results Info */}
      {searchQuery.trim() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 text-sm">
                Found{" "}
                <span className="font-semibold">
                  {filteredInventory.length}
                </span>{" "}
                item{filteredInventory.length !== 1 ? "s" : ""}
                matching "<span className="font-semibold">{searchQuery}</span>"
              </span>
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                {selectedItems.length} item
                {selectedItems.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItems([])}
                className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Inventory View */}
      <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading inventory...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchInventory}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : viewMode === "table" ? (
          // Table View
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredInventory.length &&
                        filteredInventory.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Stock Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Product Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Last Updated
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const product = item.productId;
                  const isSelected = selectedItems.includes(item._id);
                  const isEditing = isEditingStock === item._id;

                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-gray-50 ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleItemSelect(item._id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/48x48/F0FDF4/1C6F40?text=P";
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              SKU: {product._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {product.mainCategory?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editStockValue}
                              onChange={(e) =>
                                setEditStockValue(e.target.value)
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              min="0"
                            />
                            <button
                              onClick={handleSaveStock}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {item.stock}
                            </span>
                            <button
                              onClick={() => handleEditStock(item)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStockStatusColor(
                            item.stock
                          )}`}
                        >
                          {getStockStatusText(item.stock)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {editingStatus === item._id ? (
                          <select
                            value={item.isActive ? "active" : "inactive"}
                            onChange={(e) =>
                              handleStatusChange(item._id, e.target.value)
                            }
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            autoFocus
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${getManualStatusColor(
                                item.isActive
                              )}`}
                            >
                              {getManualStatusText(item.isActive)}
                            </span>
                            <button
                              onClick={() => setEditingStatus(item._id)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Edit status"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromInventory(item._id)}
                            className="p-1 text-sm text-red-600 hover:text-red-700 hover:underline"
                            title="Remove from inventory"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          // Grid View
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredInventory.map((item) => {
                const product = item.productId;
                const isSelected = selectedItems.includes(item._id);
                const isEditing = isEditingStock === item._id;

                return (
                  <div
                    key={item._id}
                    className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-blue-500 border-blue-200"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleItemSelect(item._id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/48x48/F0FDF4/1C6F40?text=P";
                            }}
                          />
                        </div>
                        <button
                          onClick={() => removeFromInventory(item._id)}
                          className="p-1 text-sm text-red-600 hover:text-red-700 hover:underline"
                          title="Remove from inventory"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      {/* Product Info */}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          SKU: {product._id.slice(-8)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {product.mainCategory?.name || "Uncategorized"}
                        </p>
                      </div>

                      {/* Stock Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Stock Level
                          </span>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={editStockValue}
                                onChange={(e) =>
                                  setEditStockValue(e.target.value)
                                }
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                                min="0"
                              />
                              <button
                                onClick={handleSaveStock}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">
                                {item.stock}
                              </span>
                              <button
                                onClick={() => handleEditStock(item)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Stock Status Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Stock Status
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStockStatusColor(
                              item.stock
                            )}`}
                          >
                            {getStockStatusText(item.stock)}
                          </span>
                        </div>

                        {/* Product Status Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Product Status
                          </span>
                          {editingStatus === item._id ? (
                            <select
                              value={item.isActive ? "active" : "inactive"}
                              onChange={(e) =>
                                handleStatusChange(item._id, e.target.value)
                              }
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full border ${getManualStatusColor(
                                  item.isActive
                                )}`}
                              >
                                {getManualStatusText(item.isActive)}
                              </span>
                              <button
                                onClick={() => setEditingStatus(item._id)}
                                className="text-gray-400 hover:text-gray-600"
                                title="Edit status"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Last Updated */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Updated</span>
                          <span className="text-xs text-gray-600">
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredInventory.length === 0 && (
          <div className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No inventory items found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery.trim()
                ? `No items match "${searchQuery}". Try adjusting your search.`
                : "Your inventory is empty. Add products from the Products section."}
            </p>
            <button
              onClick={() =>
                (window.location.href = "/store/dashboard/store_products")
              }
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Products
            </button>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h4 className="text-lg font-medium text-gray-800 mb-4">
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() =>
              (window.location.href = "/store/dashboard/store_products")
            }
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary/50 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Products</p>
              <p className="text-sm text-gray-500">
                Add new products to inventory
              </p>
            </div>
          </button>

          <button
            onClick={() => setShowLowStockAlert(true)}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-yellow-500/50 hover:bg-yellow-50 transition-colors"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Low Stock Alert</p>
              <p className="text-sm text-gray-500">View items with low stock</p>
            </div>
          </button>

          <button
            onClick={
              useSampleData
                ? () => setInventory(sampleData.inventory)
                : fetchInventory
            }
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500/50 hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Refresh Data</p>
              <p className="text-sm text-gray-500">
                Update inventory information
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Low Stock Alert Modal */}
      {showLowStockAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Low Stock Alert
              </h3>
            </div>
            <div className="space-y-3 mb-6">
              {inventory
                .filter((item) => item.stock <= 10 && item.stock > 0)
                .map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.productId.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Current stock: {item.stock}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditStock(item)}
                      className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                ))}
              {inventory.filter((item) => item.stock <= 10 && item.stock > 0)
                .length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No low stock items found.
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowLowStockAlert(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
