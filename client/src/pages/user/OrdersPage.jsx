import React, { useEffect, useState } from 'react';
import { useCurrencySymbol } from "../../utils/currencyUtils";
import useStore from '../../store/useStore';
import { X, ShoppingBag, ArrowRight, Loader2, Truck, CheckCircle2, Clock, Ban, MoveRight } from 'lucide-react';
import axios from 'axios';
import OrderDetailsModal from '../../components/user/OrderDetailsModal';
import { useTranslation } from "react-i18next";
import Breadcrumbs from '../../components/common/Breadcrumbs';

const OrdersPage = () => {
  const currencySymbol = useCurrencySymbol();
  const { isLoggedIn } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { t } = useTranslation();

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', link: '/' },
    { name: 'My Orders' }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, { withCredentials: true });
        setOrders(res.data || []);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) fetchOrders();
    else setLoading(false);
  }, [isLoggedIn]);

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

  // Status color using brand colors
  const statusColor = (status) => {
    if (status === 'Delivered') return 'text-primary bg-green-50';
    if (status === 'In Transit') return 'text-[var(--color-amber)] bg-yellow-50';
    if (status === 'Pending') return 'text-yellow-800 bg-yellow-200';
    if (status === 'Cancelled') return 'text-bd-red bg-red-50';
    return 'text-[var(--color-gray)] bg-gray-50';
  };

  const statusIcon = (status) => {
    if (status === 'Delivered') return <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" aria-label="Delivered" />;
    if (status === 'In Transit') return <Truck className="w-4 h-4 text-amber-500 mr-1" aria-label="In Transit" />;
    if (status === 'Pending') return <Clock className="w-4 h-4 text-yellow-500 mr-1" aria-label="Pending" />;
    if (status === 'Cancelled') return <Ban className="w-4 h-4 text-red-500 mr-1" aria-label="Cancelled" />;
    return <MoveRight className="w-4 h-4 text-gray-400 mr-1" aria-label="Unknown" />;
  };

  const SkeletonOrder = () => (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-light p-0 overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-6 pt-6 pb-2 border-b border-gray-light bg-gray-light">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>
      <div className="divide-y divide-gray-light px-6">
        {[1,2].map(i => (
          <div key={i} className="flex items-center py-4 gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col items-end min-w-[120px]">
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center justify-end gap-2 px-6 py-4 border-t border-gray-light bg-gray-light">
        <div className="h-5 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <main className="font-sans bg-gray-100 min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold text-primary mb-8">{t('my_orders') || 'My Orders'}</h1>
        {loading ? (
          <section className="space-y-8" aria-label="Order list loading">
            {[1,2].map(i => <SkeletonOrder key={i} />)}
          </section>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--color-bd-red)]" role="alert">
            <X className="w-10 h-10 mb-2" />
            <span>{error}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--color-gray)]">
            <ShoppingBag className="w-16 h-16 mb-4 text-primary/30" />
            <h2 className="text-xl font-semibold mb-2">{t('no_orders') || 'No orders yet'}</h2>
            <p className="mb-6 text-center max-w-xs">{t('no_orders_cta') || 'Looks like you haven\'t placed any orders yet. Start shopping now!'}</p>
            <a href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
              {t('shop_now') || 'Shop Now'} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <section className="" aria-label="Order list">
            {orders.map(order => (
              <div
                key={order.id}
                className="w-full bg-white rounded-2xl border border-gray-200 mb-8 p-0 overflow-hidden group transition-all duration-150"
              >
                {/* Order summary row - clickable */}
                <button
                  type="button"
                  aria-label={`View details for order ${order.orderId}`}
                  className="flex w-full flex-col md:flex-row md:items-center justify-between gap-2 px-8 pt-6 pb-2 border-b border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 group-hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-primary">Order</span>
                    <span
                      className="bg-[var(--color-blue)]/10 text-[var(--color-blue)] px-2 py-0.5 rounded cursor-pointer font-mono text-xs hover:underline relative group/copy"
                      tabIndex={0}
                      title={order.orderId}
                      onClick={e => {e.stopPropagation(); navigator.clipboard.writeText(order.orderId);}}
                      aria-label="Copy order ID"
                    >
                      {order.orderId}
                      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs bg-black text-white rounded px-2 py-0.5 opacity-0 group-hover/copy:opacity-100 pointer-events-none transition-opacity">Copy</span>
                    </span>
                    <span className="text-[var(--color-gray)]">|</span>
                    <span className="text-[var(--color-gray)]">Order Placed:</span>
                    <span className="font-medium text-[var(--color-gray-dark)]">{formatOrderDate(order.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className={`flex items-center font-semibold px-3 py-1 rounded-full text-xs ${statusColor(order.status)}`}>{statusIcon(order.status)}{order.status}</span>
                    <span className="hidden md:inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                      <Truck className="w-4 h-4" />
                      {t('track_order') || 'Track Order'}
                    </span>
                  </div>
                </button>
                {/* Items */}
                <div className="divide-y divide-gray-100 px-8">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center py-4 gap-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md border border-gray-light"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[var(--color-gray-dark)] truncate text-base">{item.product.name}</div>
                        <div className="text-xs text-[var(--color-gray)]">Qty: {item.quantity}</div>
                      </div>
                      <div className="flex flex-col items-end min-w-[120px]">
                        <span className="font-semibold text-primary text-base">{currencySymbol}{item.product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Total row */}
                <div className="flex flex-row items-center justify-end gap-2 px-8 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="font-bold text-lg text-right text-primary">
                    {t('total') || 'Total'}: {currencySymbol}{order.total.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all" aria-modal="true" role="dialog">
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        </div>
      )}
    </main>
  );
};

export default OrdersPage;