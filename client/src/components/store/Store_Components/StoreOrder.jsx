import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Eye,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  CreditCard,
  User,
  Calendar,
  MoreHorizontal,
  SquarePen
} from 'lucide-react';
import useStoreOwner from '../../../store/useStoreOwner';
import { Edit2 } from 'lucide-react';

const StoreOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for demonstration - replace with actual API calls
  const mockOrders = [
    {
      id: '1',
      orderId: 'ORD-9876',
      customer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'JD'
      },
      date: '2023-05-12T10:23:00Z',
      status: 'Delivered',
      paymentMethod: 'Credit Card',
      total: 129.99,
      items: [
        { name: 'Fresh Apples', quantity: 2, price: 45.99 },
        { name: 'Organic Bananas', quantity: 1, price: 38.01 }
      ]
    },
    {
      id: '2',
      orderId: 'ORD-9875',
      customer: {
        name: 'Alice Smith',
        email: 'alice.smith@example.com',
        avatar: 'AS'
      },
      date: '2023-05-12T09:45:00Z',
      status: 'Processing',
      paymentMethod: 'Credit Card',
      total: 89.99,
      items: [
        { name: 'Fresh Milk', quantity: 2, price: 44.99 },
        { name: 'Bread', quantity: 1, price: 45.00 }
      ]
    },
    {
      id: '3',
      orderId: 'ORD-9874',
      customer: {
        name: 'Robert Johnson',
        email: 'robert.j@example.com',
        avatar: 'RJ'
      },
      date: '2023-05-11T16:32:00Z',
      status: 'Shipped',
      paymentMethod: 'PayPal',
      total: 199.99,
      items: [
        { name: 'Premium Coffee', quantity: 1, price: 199.99 }
      ]
    },
    {
      id: '4',
      orderId: 'ORD-9873',
      customer: {
        name: 'Emma Wilson',
        email: 'emma.w@example.com',
        avatar: 'EW'
      },
      date: '2023-05-11T11:15:00Z',
      status: 'Pending',
      paymentMethod: 'Bank Transfer',
      total: 49.99,
      items: [
        { name: 'Fresh Vegetables', quantity: 1, price: 49.99 }
      ]
    },
    {
      id: '5',
      orderId: 'ORD-9872',
      customer: {
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        avatar: 'MB'
      },
      date: '2023-05-10T14:20:00Z',
      status: 'Delivered',
      paymentMethod: 'Credit Card',
      total: 75.50,
      items: [
        { name: 'Organic Eggs', quantity: 2, price: 37.75 }
      ]
    }
  ];

  // Mock report data
  const reportData = {
    completedOrders: { value: 128, trend: 12.5, trendDirection: 'up' },
    pendingOrders: { value: 42, trend: 3.2, trendDirection: 'down' },
    totalRevenue: { value: 12426, trend: 8.3, trendDirection: 'up' },
    cancelledOrders: { value: 7, trend: 2.1, trendDirection: 'up' }
  };

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    // Payment method filter
    if (selectedPaymentMethod !== 'all') {
      filtered = filtered.filter(order => order.paymentMethod.toLowerCase() === selectedPaymentMethod.toLowerCase());
    }

    // Sort
    switch (selectedSort) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'total_high':
        filtered = [...filtered].sort((a, b) => b.total - a.total);
        break;
      case 'total_low':
        filtered = [...filtered].sort((a, b) => a.total - b.total);
        break;
      default:
        break;
    }

    return filtered;
  }, [orders, searchQuery, selectedStatus, selectedPaymentMethod, selectedSort]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return <CreditCard className="w-4 h-4" />;
      case 'paypal':
        return <Package className="w-4 h-4" />;
      case 'bank transfer':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

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
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank transfer', label: 'Bank Transfer' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'total_high', label: 'High to Low' },
    { value: 'total_low', label: 'Low to High' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-500">Manage and track your store orders</p>
      </div>

      {/* Section 1: Report Cards from Last Week */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Completed Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1">
              {reportData.completedOrders.trendDirection === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${
                reportData.completedOrders.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {reportData.completedOrders.trend}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{reportData.completedOrders.value}</p>
            <p className="text-sm text-gray-500">Completed Orders</p>
            <p className="text-xs text-gray-400 mt-1">from last week</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex items-center gap-1">
              {reportData.pendingOrders.trendDirection === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${
                reportData.pendingOrders.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {reportData.pendingOrders.trend}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{reportData.pendingOrders.value}</p>
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-xs text-gray-400 mt-1">from last week</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1">
              {reportData.totalRevenue.trendDirection === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${
                reportData.totalRevenue.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {reportData.totalRevenue.trend}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">${reportData.totalRevenue.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xs text-gray-400 mt-1">from last month</p>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex items-center gap-1">
              {reportData.cancelledOrders.trendDirection === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${
                reportData.cancelledOrders.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {reportData.cancelledOrders.trend}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{reportData.cancelledOrders.value}</p>
            <p className="text-sm text-gray-500">Cancelled Orders</p>
            <p className="text-xs text-gray-400 mt-1">from last week</p>
          </div>
        </div>
      </section>

      {/* Section 2: Filter Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders by ID, customer, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
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
          <div className="relative min-w-[180px]">
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
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
          <div className="relative min-w-[160px]">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
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
          <div className="flex gap-2">
            {/* <button className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:border-primary/50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button> */}
            <button className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Data Table */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                </div>
                <div>ORDER ID</div>
                <div>CUSTOMER</div>
                <div>DATE</div>
                <div>STATUS</div>
                <div>PAYMENT</div>
                <div>TOTAL</div>
                <div>ACTION</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-8 gap-4 items-center text-sm">
                    <div className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    </div>
                    <div className="font-medium text-gray-900">{order.orderId}</div>
                    <div className="flex items-center gap-3 ">
                      {/* <div className="w-6 h-6  bg-primary/10 rounded-full flex items-center justify-baseline text-primary font-medium text-xs">
                        {order.customer.avatar}
                      </div> */}
                      <div>
                        <div className="font-medium text-gray-900">{order.customer.name}</div>
                        {/* <div className="text-xs text-gray-500">{order.customer.email}</div> */}
                      </div>
                    </div>
                    <div className="text-gray-600">{formatDate(order.date)}</div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      {getPaymentIcon(order.paymentMethod)}
                      {order.paymentMethod}
                    </div>
                    <div className="font-medium text-gray-900">${order.total.toFixed(2)}</div>
                    <div>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <SquarePen className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {searchQuery.trim() 
                    ? `No orders match "${searchQuery}". Try adjusting your search terms.`
                    : "No orders match the current filters. Try adjusting your selection."
                  }
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default StoreOrder;