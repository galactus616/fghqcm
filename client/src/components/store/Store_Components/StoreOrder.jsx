import React, { useState, useEffect, useMemo } from 'react';
import useStoreOwner from '../../../store/useStoreOwner';
import OrderReportCards from './OrderReportCards';
import OrderFilters from './OrderFilters';
import OrderTable from './OrderTable';
import ExportSuccessModal from './ExportSuccessModal';
import { exportOrdersToExcel } from './OrderExportService';

const StoreOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  // Mock data for demonstration - replace with actual API calls
  const mockOrders = [
    {
      id: '1',
      orderId: 'ORD-9876',
      customer: {
        name: 'Jahidul Islam',
        email: 'jahidul.islam@example.com',
        avatar: 'JI'
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
        name: 'Alia Parvin',
        email: 'alia.p@example.com',
        avatar: 'AS'
      },
      date: '2023-05-12T09:45:00Z',
      status: 'Processing',
      paymentMethod: 'COD',
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
        name: 'Johnson Mollah',
        email: 'mollah.j@example.com',
        avatar: 'RJ'
      },
      date: '2023-05-11T16:32:00Z',
      status: 'Shipped',
      paymentMethod: 'Credit Card',
      total: 199.99,
      items: [
        { name: 'Premium Coffee', quantity: 1, price: 199.99 }
      ]
    },
    {
      id: '4',
      orderId: 'ORD-9873',
      customer: {
        name: 'Wilson sk',
        email: 'sk.w@example.com',
        avatar: 'EW'
      },
      date: '2023-05-11T11:15:00Z',
      status: 'Pending',
      paymentMethod: 'COD',
      total: 49.99,
      items: [
        { name: 'Fresh Vegetables', quantity: 1, price: 49.99 }
      ]
    },
    {
      id: '5',
      orderId: 'ORD-9872',
      customer: {
        name: 'Mejbul Islam',
        email: 'mejbul.islam@example.com',
        avatar: 'MI'
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

  // Export handler
  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportOrdersToExcel(filteredOrders);
      if (result.success) {
        setExportResult(result);
        setShowSuccessModal(true);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to export orders. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Close success modal
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setExportResult(null);
  };

  // Order action handlers
  const handleViewOrder = (order) => {
    console.log('View order:', order);
    // TODO: Implement order view modal/page
  };

  const handleEditOrder = (order) => {
    console.log('Edit order:', order);
    // TODO: Implement order edit modal/page
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-500">Manage and track your store orders</p>
      </div>

      {/* Section 1: Report Cards */}
      <OrderReportCards reportData={reportData} />

      {/* Section 2: Filters */}
      <OrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        onExport={handleExport}
        exporting={exporting}
        hasOrders={filteredOrders.length > 0}
      />

      {/* Section 3: Orders Table */}
      <OrderTable
        orders={filteredOrders}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        onViewOrder={handleViewOrder}
        onEditOrder={handleEditOrder}
      />

      {/* Export Success Modal */}
      <ExportSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        exportCount={exportResult?.count || 0}
        fileName={exportResult?.fileName || ''}
      />
    </div>
  );
};

export default StoreOrder;