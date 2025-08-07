import React from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown
} from 'lucide-react';

const OrderFilters = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedSort,
  setSelectedSort,
  onExport,
  exporting,
  hasOrders
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const paymentOptions = [
    { value: 'all', label: 'All Methods' },
    { value: 'credit card', label: 'Credit Card' },
    { value: 'COD', label: 'COD' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'total_high', label: 'High to Low' },
    { value: 'total_low', label: 'Low to High' }
  ];

  return (
    <section className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search orders by ID, customer, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer text-sm"
            >
              {paymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
          </div>

          {/* Action Buttons */}
          <div className="flex">
            <button 
              onClick={onExport}
              disabled={exporting || !hasOrders}
              className={`w-full px-3 sm:px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm ${
                exporting || !hasOrders
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">Exporting...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden">Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderFilters; 