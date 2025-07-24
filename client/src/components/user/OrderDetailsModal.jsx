import React from 'react';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";


// Status tracker sub-component
const OrderStatusTracker = ({ currentStatus }) => {
  const { t } = useTranslation();
  // Only show normal path
  const statuses = [t('order_pending'), t('order_processing'), t('order_shipped'), t('order_delivered')];
  const currentIndex = statuses.findIndex(s => s.toLowerCase().includes(currentStatus?.toLowerCase() || ''));

  // If cancelled, show tracker up to currentIndex (or Pending if not found)
  const isCancelled = currentStatus === 'Cancelled';
  const effectiveIndex = isCancelled ? (currentIndex === -1 ? 0 : currentIndex) : currentIndex;

  return (
    <div className="py-6">
      <div className="relative">
        {statuses.map((status, index) => {
          // If cancelled, only highlight up to effectiveIndex
          const isActive = index <= effectiveIndex && !isCancelled;
          // If cancelled, highlight up to effectiveIndex, but not after
          const isPast = isCancelled && index <= effectiveIndex;
          return (
            <div key={status} className="relative flex items-start pl-10 pb-10">
              {/* Vertical Line */}
              {index < statuses.length - 1 && (
                <div
                  className={`absolute left-[11px] top-[18px] h-full w-0.5 ${isActive || isPast ? 'bg-green-500' : 'bg-gray-200'}`}
                />
              )}
              {/* Circle */}
              <div
                className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full ${isActive || isPast ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                {(isActive || isPast) && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
              {/* Text */}
              <p className={`font-medium ${isActive || isPast ? 'text-gray-800' : 'text-gray-400'}`}>{status}</p>
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <div className="mt-4 flex items-center justify-center">
          <span className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold text-sm">{t('order_cancelled')}</span>
        </div>
      )}
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const { t } = useTranslation();

  // Format delivery address if it's an object
  let formattedAddress = '';
  if (order.deliveryAddress && typeof order.deliveryAddress === 'object') {
    const { label, flat, floor, area, landmark } = order.deliveryAddress;
    formattedAddress = [
      label ? `${label}` : '',
      flat,
      floor,
      area,
      landmark
    ].filter(Boolean).join(', ');
  } else {
    formattedAddress = order.deliveryAddress || '';
  }
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
        className="relative mx-4 flex h-full max-h-[95vh] w-full max-w-xl flex-col overflow-y-auto bg-white p-0 shadow-xl rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-green-50 rounded-t-2xl">
          <button onClick={onClose} className="flex items-center gap-2 text-lg font-bold text-gray-800 hover:text-green-700">
            <ArrowLeft className="h-5 w-5" />
            {t('my_orders')}
          </button>
          <span className="text-xs text-gray-400">{t('order_id')}: <span className="font-mono text-gray-700">{order.orderId}</span></span>
        </div>

        <div className="flex-grow px-6 py-4">
          {/* Order Meta */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{t('placed_on')}</span>
              <span className="font-medium text-green-700 text-sm">{new Date(order.date).toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{t('status')}</span>
              <span className={`font-semibold px-2 py-1 rounded text-xs ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
            </div>
          </div>

          {/* Address */}
          <div className="mb-4 rounded-lg border border-gray-200 p-4 bg-gray-50">
            <h3 className="font-bold text-gray-800 text-sm mb-1">{t('delivery_address')}</h3>
            <p className="text-sm text-gray-600">{formattedAddress}</p>
          </div>

          {/* Items List */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 text-sm mb-2">{t('items')}</h3>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 py-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-md border border-gray-100 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate" title={item.product.name}>{item.product.name}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-green-700 text-sm">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Details */}
          <div className="rounded-lg border border-green-100 p-4 text-sm bg-green-50 flex flex-col gap-2">
            <div className="flex justify-between font-bold text-gray-900">
              <span>{t('order_total')}</span><span>₹{pricing.orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Status Tracker and Actions */}
        <div className="px-6 pb-6">
          <OrderStatusTracker currentStatus={order.status} />
          <button
            className="w-full rounded-lg border border-green-500 bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 cursor-pointer mt-2"
            onClick={onClose}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 