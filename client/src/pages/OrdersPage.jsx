import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { Package, X } from 'lucide-react';
import axios from 'axios';

const OrdersPage = () => {
  const { isLoggedIn } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
          <Package className="w-7 h-7 text-green-600" /> My Orders
        </h1>
        {loading ? (
          <div className="text-center text-green-700 py-10 text-lg">Loading your orders...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">You have not placed any orders yet.</div>
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
                    <span className="text-sm text-gray-500">Order ID:</span>
                    <span className="font-semibold text-gray-800">{order.orderId}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-500">Placed on:</span>
                    <span className="font-medium text-green-700">{new Date(order.date).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`font-semibold ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Items:</h3>
                  <ul className="divide-y divide-gray-100">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center py-2 gap-4">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded-md border border-gray-100" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{item.product.name}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-semibold text-green-700 text-sm">₹{item.product.price.toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-4">
                    <span className="font-bold text-lg text-green-800">Total: ₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative border border-green-100">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-green-600" /> Order Details
            </h2>
            <div className="mb-2 flex flex-col gap-1">
              <span className="text-sm text-gray-500">Order ID:</span>
              <span className="font-semibold text-gray-800">{selectedOrder.orderId}</span>
            </div>
            <div className="mb-2 flex flex-col gap-1">
              <span className="text-sm text-gray-500">Placed on:</span>
              <span className="font-medium text-green-700">{new Date(selectedOrder.date).toLocaleString()}</span>
            </div>
            <div className="mb-2 flex flex-col gap-1">
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`font-semibold ${selectedOrder.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{selectedOrder.status}</span>
            </div>
            <div className="mb-2 flex flex-col gap-1">
              <span className="text-sm text-gray-500">Delivery Address:</span>
              <span className="font-medium text-gray-800">{selectedOrder.deliveryAddress}</span>
            </div>
            <div className="mb-2 flex flex-col gap-1">
              <span className="text-sm text-gray-500">Phone:</span>
              <span className="font-medium text-gray-800">{selectedOrder.phone}</span>
            </div>
            <div className="mb-2 flex flex-col gap-1">
              <span className="text-sm text-gray-500">Payment Method:</span>
              <span className="font-medium text-gray-800 capitalize">{selectedOrder.paymentMethod || 'COD'}</span>
            </div>
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Items:</h3>
              <ul className="divide-y divide-gray-100">
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx} className="flex items-center py-2 gap-4">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded-md border border-gray-100" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.product.name}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-green-700 text-sm">₹{item.product.price.toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-4">
                <span className="font-bold text-lg text-green-800">Total: ₹{selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 