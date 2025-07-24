import React, { useState } from 'react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, XCircle, Loader2, Trash2, Minus, Plus, ArrowLeft, X } from 'lucide-react';
import { getAddresses, addAddress, deleteAddress, setDefaultAddress } from '../../api/user/user';
import LocationModal from '../../components/common/LocationModal';
import AddressModal from '../../components/common/AddressModal';
import { useTranslation } from "react-i18next";
import { useCurrencySymbol } from "../../utils/currencyUtils";

const CheckoutPage = () => {
  // Use the currency symbol hook for reactive updates
  const currencySymbol = useCurrencySymbol();
  const navigate = useNavigate();
  const { user, hydratedItems: cartItems, updateCartItem, removeFromCart, clearCart } = useStore();
  const { currentLocation, setLocationModalOpen, setCurrentLocation, selectedAddressId, setSelectedAddressId } = useStore();
  const { t } = useTranslation();
  const [addresses, setAddresses] = React.useState([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const [newAddress, setNewAddress] = React.useState('');
  const [newLabel, setNewLabel] = React.useState('Home');
  const [showNewAddress, setShowNewAddress] = React.useState(false);
  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = React.useState('cod');
  const [placingOrder, setPlacingOrder] = React.useState(false);
  const [coupon, setCoupon] = React.useState('');
  // Local state for AddressModal
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [pendingAddress, setPendingAddress] = React.useState(null);
  const handleAddressModalSave = (addressObj) => {
    setPendingAddress(addressObj);
    handleAddAddress(addressObj);
  };

  // Fetch addresses from backend
  React.useEffect(() => {
    async function fetchAddresses() {
      try {
        const data = await getAddresses();
        setAddresses(data);
        // Do not auto-select any address
        setSelectedAddressIdx(null);
      } catch {
        setAddresses([]);
      }
    }
    fetchAddresses();
  }, []);

  // Sync local selectedAddressIdx with global selectedAddressId
  React.useEffect(() => {
    if (!addresses.length) return;
    if (selectedAddressId) {
      const idx = addresses.findIndex(a => a._id === selectedAddressId);
      setSelectedAddressIdx(idx !== -1 ? idx : null);
    } else {
      setSelectedAddressIdx(null);
    }
  }, [selectedAddressId, addresses]);

  const handleAddAddress = async (addressObj) => {
    console.log('Address object received:', addressObj);
    // Require at least one of flat, area, or landmark
    if (!addressObj || (!addressObj.flat && !addressObj.area && !addressObj.landmark)) {
      return toast.error('Enter address');
    }
    try {
      const data = await addAddress({
        ...addressObj,
        isDefault: false // Do not set as default
      });
      setAddresses(data);
      setShowAddressModal(false);
      setPendingAddress(null);
      setSelectedAddressIdx(null); // Do not auto-select
      toast.success('Address added');
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId, idx) => {
    try {
      const data = await deleteAddress(addressId);
      setAddresses(data);
      if (selectedAddressIdx === idx) setSelectedAddressIdx(0);
      toast.success('Address deleted');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const cartTotals = React.useMemo(() => {
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
      0
    );
    const totalSavings = cartItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * ((Number(item.originalPrice) || 0) - (Number(item.price) || 0)),
      0
    );
    const deliveryCharge = 0;
    const handlingCharge = 4;
    const grandTotal = itemsTotal + deliveryCharge + (cartItems.length > 0 ? handlingCharge : 0);
    return {
      itemsTotal,
      totalSavings,
      deliveryCharge,
      handlingCharge,
      grandTotal,
    };
  }, [cartItems]);

  // Remove address handler
  const handleRemoveAddress = (addressId, idx) => {
    setAddresses(prev => prev.filter((_, i) => i !== idx));
    if (selectedAddressIdx === idx) setSelectedAddressIdx(0);
    // If removing the temporary current location, reset global state
    const addr = addresses[idx];
    if (addr && addr.isTemporary) {
      setCurrentLocation('Select location');
    }
  };

  // On place order, if selected address is temporary, save it permanently
  const handlePlaceOrder = async () => {
    const selectedAddress = addresses[selectedAddressIdx];
    if (!selectedAddress || !phone) {
      toast.error('Please provide delivery address and phone number.');
      return;
    }
    setPlacingOrder(true);
    try {
      // Send only the address _id to the backend
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          deliveryAddress: selectedAddress._id, // Only send the address ID
          phone,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order-success?orderId=${encodeURIComponent(data.order?.orderId || data.order?.id || '')}`);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (err) {
      toast.error('Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Cart item actions
  const handleQuantityChange = (productId, variantIndex, delta) => {
    const item = cartItems.find(item => item.productId === productId && item.variantIndex === variantIndex);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateCartItem(productId, variantIndex, newQuantity);
      } else {
        removeFromCart(productId, variantIndex);
      }
    }
  };

  // Only show saved addresses
  const displayAddresses = addresses;

  // Address type icons
  const ADDRESS_TYPE_ICONS = {
    Home: <span role="img" aria-label="Home">🏠</span>,
    Work: <span role="img" aria-label="Work">🏢</span>,
    Hotel: <span role="img" aria-label="Hotel">🏨</span>,
    Other: <span role="img" aria-label="Other">🏷️</span>,
  };

  return (
    <div className="font-sans bg-[#0a614d]/5 min-h-screen pb-10">
      <LocationModal />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <button
            className="flex items-center cursor-pointer gap-2 text-green-700 hover:underline font-medium text-base"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
            {t('back')}
          </button>
          <a
            href="/"
            className="text-green-700 hover:underline font-medium text-base"
          >
            {t('continue_shopping')}
          </a>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">{t('checkout')}</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-green-100">
              <h2 className="text-lg font-semibold text-green-700 mb-4">{t('shopping_cart', { count: cartItems.length })}</h2>
              {cartItems.length === 0 ? (
                <div className="text-gray-500">{t('your_cart_is_empty')}</div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="relative">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <div className="font-semibold text-gray-800 text-base mb-1">{item.name}</div>
                        <div className="text-xs text-gray-500 mb-1">{item.variantLabel}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantIndex, -1)}
                            className="p-1 bg-gray-200 cursor-pointer hover:bg-gray-300 rounded"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-2 text-gray-800 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantIndex, 1)}
                            className="p-1 bg-green-500 cursor-pointer hover:bg-green-600 text-white rounded"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-bold text-green-700 text-lg">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</div>
                        <button
                          className="flex cursor-pointer items-center gap-1 text-red-500 hover:underline text-xs"
                          onClick={() => removeFromCart(item.productId, item.variantIndex)}
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Order Summary Card */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 sticky top-28">
              {/* Address & Phone */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700 text-lg">Delivery Address</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
                  <div className="flex flex-col gap-2">
                    {(expanded ? displayAddresses : displayAddresses.slice(0, 3)).map((addr, idx) => {
                      const isSelected = selectedAddressIdx === idx;
                      return (
                        <label
                          key={addr._id}
                          className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 border transition-all duration-150
                            ${isSelected ? 'border-green-600 bg-green-50 shadow-sm' : 'border-gray-200 bg-white'}
                            hover:border-green-400 focus-within:ring-2 focus-within:ring-green-200`}
                          htmlFor={`address-radio-${idx}`}
                          style={{ position: 'relative', minHeight: 48 }}
                          tabIndex={0}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSelectedAddressIdx(idx);
                              setSelectedAddressId(addr._id);
                              setCurrentLocation([
                                addr.flat,
                                addr.floor,
                                addr.area,
                                addr.landmark
                              ].filter(Boolean).join(', '));
                            }
                          }}
                        >
                          <span className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${isSelected ? 'border-green-600 bg-green-600' : 'border-gray-300 bg-white'} transition-all`}>
                            {isSelected && <span className="w-2.5 h-2.5 bg-white rounded-full block" />}
                          </span>
                          <input
                            id={`address-radio-${idx}`}
                            type="radio"
                            name="address"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedAddressIdx(idx);
                              setSelectedAddressId(addr._id);
                              setCurrentLocation([
                                addr.flat,
                                addr.floor,
                                addr.area,
                                addr.landmark
                              ].filter(Boolean).join(', '));
                            }}
                            className="hidden"
                          />
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="flex items-center gap-2 text-gray-800 text-sm font-medium">
                              {ADDRESS_TYPE_ICONS[addr.label] || ADDRESS_TYPE_ICONS.Other}
                              <span className="font-semibold text-gray-700">{addr.label}</span>
                            </span>
                            <span className="block text-xs text-gray-500 mt-0.5 truncate max-w-xs" title={[
                              addr.flat,
                              addr.floor,
                              addr.area,
                              addr.landmark
                            ].filter(Boolean).join(', ')}>
                              {[
                                addr.flat,
                                addr.floor,
                                addr.area,
                                addr.landmark
                              ].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                    {addresses.length > 3 && (
                      <button
                        className="text-green-700 cursor-pointer text-xs mt-1 hover:underline self-start"
                        onClick={() => setExpanded(e => !e)}
                      >
                        {expanded ? 'Show less' : `Show all addresses (${addresses.length})`}
                      </button>
                    )}
                  </div>
                  {/* Modern button row */}
                  <div className="flex flex-row gap-2 mt-4">
                    <button
                      className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-0 py-2 rounded-full shadow-sm font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 border border-green-200"
                      onClick={() => {
                        setShowAddressModal(true);
                      }}
                      style={{ minWidth: 0 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Add Address
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    pattern="[0-9]{10,15}"
                  />
                </div>
              </div>
              {/* Coupon Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
                    placeholder="Enter coupon (coming soon)"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    disabled
                  />
                  <button
                    className="bg-green-200 text-green-700 px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
                    disabled
                  >Apply</button>
                </div>
              </div>
              {/* Order Summary */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Items ({cartItems.length})</span>
                  <span>{currencySymbol}{cartTotals.itemsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Your savings</span>
                  <span className="text-green-600">-{currencySymbol}{cartTotals.totalSavings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Delivery</span>
                  <span>{currencySymbol}{cartTotals.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Handling Charge</span>
                  <span>{currencySymbol}{cartTotals.handlingCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-800 text-lg border-t border-green-100 pt-2 mt-2">
                  <span>Grand Total</span>
                  <span>{currencySymbol}{cartTotals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
              {/* Payment Method */}
              <div className="mb-6">
                <h2 className="text-base font-semibold text-green-700 mb-2">Payment Method</h2>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-green-600"
                    />
                    <span className="font-semibold text-green-700">Cash on Delivery (COD)</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </label>
                  <label className="flex items-center gap-3 cursor-not-allowed opacity-60">
                    <input
                      type="radio"
                      name="payment"
                      disabled
                      className="accent-green-600"
                    />
                    <span className="font-semibold text-gray-400">UPI / Card / Netbanking (Coming Soon)</span>
                    <XCircle className="w-5 h-5 text-gray-400" />
                  </label>
                </div>
              </div>
              {/* Place Order Button */}
              <button
                className="w-full cursor-pointer bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-md hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handlePlaceOrder}
                disabled={placingOrder || cartItems.length === 0 || selectedAddressIdx === null}
              >
                {placingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Local AddressModal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleAddressModalSave}
      />
    </div>
  );
};

export default CheckoutPage;