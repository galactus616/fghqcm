import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { Package, X } from 'lucide-react';
import axios from 'axios';
import OrderDetailsModal from '../components/OrderDetailsModal';
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
        const res = await axios.get('/api/orders', { withCredentials: true });
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

  return (
    <div className="font-sans bg-green-50 min-h-screen pb-10 pt-8">
      <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-8 flex items-center gap-2">
          <Package className="w-7 h-7 text-green-600" /> {t('my_orders')}
        </h1>
        {loading ? (
          <div className="text-center text-green-700 py-10 text-lg">{t('loading_orders')}</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">{t('no_orders')}</div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-500">{t('order_id')}:</span>
                    <span className="font-semibold text-gray-800">{order.orderId}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-500">{t('placed_on')}:</span>
                    <span className="font-medium text-green-700">{new Date(order.date).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-500">{t('status')}:</span>
                    <span className={`font-semibold ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{t(order.status.toLowerCase())}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('items')}</h3>
                  <ul className="divide-y divide-gray-100">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center py-2 gap-4">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded-md border border-gray-100" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{item.product.name}</div>
                          <div className="text-sm text-gray-500">{t('qty')}: {item.quantity}</div>
                        </div>
                        <div className="font-semibold text-green-700 text-sm">₹{item.product.price.toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-4">
                    <span className="font-bold text-lg text-green-800">{t('total')}: ₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage; 