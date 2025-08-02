import React from 'react';
import {
  Eye,
  SquarePen,
  Package,
  CreditCard,
  DollarSign
} from 'lucide-react';

const OrderTable = ({ 
  orders, 
  loading, 
  error, 
  searchQuery,
  onViewOrder,
  onEditOrder 
}) => {
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
      case 'cod':
        return <span className="text-2xl pb-2 font-bold ">৳</span>;
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

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading orders...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
        {orders.map((order) => (
          <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-8 gap-4 items-center text-sm">
              <div className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
              </div>
              <div className="font-medium text-gray-900">{order.orderId}</div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-gray-900">{order.customer.name}</div>
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
              <div className="font-medium text-gray-900">
                <span className='text-2xl font-bold'>৳ </span> {order.total.toFixed(2)}
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => onViewOrder?.(order)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="View Order"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => onEditOrder?.(order)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Edit Order"
                >
                  <SquarePen className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
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
    </section>
  );
};

export default OrderTable; 