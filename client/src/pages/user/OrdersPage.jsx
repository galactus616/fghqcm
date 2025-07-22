import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import { Package, X } from 'lucide-react';
import axios from 'axios';
import OrderDetailsModal from '../../components/user/OrderDetailsModal';
import { useTranslation } from "react-i18next";

const OrdersPage = () => {
  const { isLoggedIn } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, { withCredentials: true });
        setOrders(res.data || []);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) fetchOrders();
    else setLoading(false);
  }, [isLoggedIn]);

  // Helper for formatted date without seconds
  const formatOrderDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <main className="font-sans bg-green-50 min-h-screen pb-10 pt-8">
      <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8">
        <header className="flex items-center gap-2 mb-8">
          <Package className="w-7 h-7 text-green-600" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">My Orders</h1>
        </header>
        {loading ? (
          <div className="text-center text-green-700 py-10 text-lg" role="status">Loading your orders...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10" role="alert">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">{t('no_orders')}</div>
        ) : (
          <section className="space-y-8" aria-label="Order list">
            {orders.map(order => (
              <article
                key={order.id}
                tabIndex={0}
                className="bg-white rounded-2xl shadow-md border border-green-100 p-6 focus:ring-2 focus:ring-green-400 focus:outline-none hover:shadow-lg transition-shadow duration-200 group"
                onClick={() => setSelectedOrder(order)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedOrder(order); }}
                aria-label={`View details for order ${order.orderId}`}
              >
                <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-500">Order ID:</span>
                    <span className="font-semibold text-gray-800" aria-label="Order ID">{order.orderId}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-500">Placed on:</span>
                    <span className="font-medium text-green-700" aria-label="Order date">{formatOrderDate(order.date)}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`font-semibold px-2 py-1 rounded text-xs ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      aria-label={`Order status: ${order.status}`}>{order.status}</span>
                  </div>
                </header>
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-base">Items:</h3>
                  <ul className="divide-y divide-gray-100" aria-label="Order items">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center py-2 gap-4">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-md border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 truncate" title={item.product.name}>{item.product.name}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-semibold text-green-700 text-sm">₹{item.product.price.toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-4">
                    <span className="font-bold text-lg text-green-800">{t('total')}: ₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="mt-4 cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}
                  aria-label={`Open details for order ${order.orderId}`}
                >
                  View Details
                </button>
              </article>
            ))}
          </section>
        )}
      </div>
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </main>
  );
};

export default OrdersPage; 