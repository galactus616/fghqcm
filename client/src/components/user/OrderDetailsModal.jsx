import React from 'react';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';


// Status tracker sub-component
const OrderStatusTracker = ({ currentStatus }) => {
  const statuses = ['Order Pending','Order Processing', 'Order Shipped', 'Order Delivered','Order Cancelled'];
  const currentIndex = statuses.findIndex(s => s.toLowerCase().includes(currentStatus?.toLowerCase() || ''));

  return (
    <div className="py-6">
      <div className="relative">
        {statuses.map((status, index) => {
          const isActive = index <= currentIndex;
          return (
            <div key={status} className="relative flex items-start pl-10 pb-10">
              {/* Vertical Line */}
              {index < statuses.length - 1 && (
                <div
                  className={`absolute left-[11px] top-[18px] h-full w-0.5 ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                />
              )}
              {/* Circle */}
              <div
                className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                {isActive && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
              {/* Text */}
              <p className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>{status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  // Dummy/fallback data
  const trackingNumber = order.trackingNumber || 'S123456cll';
  const courier = order.courier || 'abcdefgh';
  const deliveryAddress = order.deliveryAddress || '123, Anywhere, any city, any state, pincode';
  const pricing = {
    total: order.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
   
  };
  pricing.orderTotal = pricing.total;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 font-sans"
      onClick={onClose}
    >
      <div
        className="relative mx-4 flex h-full max-h-[95vh] w-full max-w-lg flex-col overflow-y-auto bg-white p-6 shadow-xl rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <Link to={'/orders'} onClick={onClose} className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <ArrowLeft className="h-5 w-5" />
            My Orders
          </Link>
          <Link to={'/'} className="flex items-center gap-4">
            <ShoppingBag className="h-6 w-6 text-gray-500" />
          </Link>
        </div>

        <div className="flex-grow">
          {/* Order Info */}
          <div className="py-6">
            <h2 className="text-xl font-bold text-gray-900">Order Confirmed</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tracking No- {trackingNumber} <br /> Courier - {courier}
            </p>
          </div>

          {/* Status Tracker */}
          <OrderStatusTracker currentStatus={order.status} />

          {/* Tracking Link Button */}
          {/* <button className="w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-800 transition hover:bg-gray-50">
            Open Tracking Link
          </button> */}

          {/* Delivery Address */}
          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <h3 className="font-bold text-gray-800">Delivery Address</h3>
            <p className="mt-1 text-sm text-gray-600">{order.deliveryAddress}</p>
          </div>

          {/* Pricing Details */}
          <div className="mt-4 rounded-lg border border-gray-200 p-4 text-sm">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Order Total</span><span>{pricing.orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Re-order Button */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            className="w-full rounded-lg border border-green-500 bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
            onClick={onClose}
          >
            Re-Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 