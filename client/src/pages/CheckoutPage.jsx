import React, { useState } from 'react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, XCircle, Loader2, Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { getAddresses, addAddress, deleteAddress, setDefaultAddress } from '../api/user';

function LocationModal({ isOpen, onClose, onSave }) {
  const [input, setInput] = useState('');
  const handleDetect = () => {
    setInput('Your Detected Location');
    toast.success('Location detected!');
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Use Current Location
        </h2>
        <input
          type="text"
          className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400 mb-4"
          placeholder="Enter your address or use detect"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition"
            onClick={handleDetect}
          >Detect Location</button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            onClick={() => { if (input.trim()) { onSave(input.trim()); onClose(); } else { toast.error('Enter or detect an address'); } }}
          >Save</button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition ml-auto"
            onClick={onClose}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, hydratedItems: cartItems, updateCartItem, removeFromCart, clearCart } = useStore();
  const [addresses, setAddresses] = React.useState([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [newAddress, setNewAddress] = React.useState('');
  const [newLabel, setNewLabel] = React.useState('Home');
  const [showNewAddress, setShowNewAddress] = React.useState(false);
  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = React.useState('cod');
  const [placingOrder, setPlacingOrder] = React.useState(false);
  const [coupon, setCoupon] = React.useState('');

  // Fetch addresses from backend
  React.useEffect(() => {
    async function fetchAddresses() {
      try {
        const data = await getAddresses();
        setAddresses(data);
        // Select default address if exists
        const defaultIdx = data.findIndex(a => a.isDefault);
        setSelectedAddressIdx(defaultIdx !== -1 ? defaultIdx : 0);
      } catch {
        setAddresses([]);
      }
    }
    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return toast.error('Enter address');
    try {
      const data = await addAddress({ label: newLabel, address: newAddress, isDefault: addresses.length === 0 });
      setAddresses(data);
      setShowNewAddress(false);
      setNewAddress('');
      setNewLabel('Home');
      setSelectedAddressIdx(data.length - 1);
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

  const handleSetDefault = async (addressId) => {
    try {
      const data = await setDefaultAddress(addressId);
      setAddresses(data);
      const defaultIdx = data.findIndex(a => a.isDefault);
      setSelectedAddressIdx(defaultIdx !== -1 ? defaultIdx : 0);
      toast.success('Default address set');
    } catch {
      toast.error('Failed to set default');
    }
  };

  const handleSaveLocation = async (loc) => {
    try {
      const data = await addAddress({ label: 'Current Location', address: loc });
      setAddresses(data);
      setSelectedAddressIdx(data.length - 1);
      toast.success('Location address added');
    } catch {
      toast.error('Failed to add location address');
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

  const handlePlaceOrder = async () => {
    if (!addresses[selectedAddressIdx] || !phone) {
      toast.error('Please provide delivery address and phone number.');
      return;
    }
    setPlacingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          deliveryAddress: addresses[selectedAddressIdx],
          phone,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order-success?orderId=${encodeURIComponent(data.orderId || data.id || '')}`);
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

  return (
    <div className="font-sans bg-green-50 min-h-screen pb-10">
      <LocationModal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} onSave={handleSaveLocation} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <button
            className="flex items-center gap-2 text-green-700 hover:underline font-medium text-base"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <a
            href="/"
            className="text-green-700 hover:underline font-medium text-base"
          >
            Continue Shopping
          </a>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-green-100">
              <h2 className="text-lg font-semibold text-green-700 mb-4">Shopping Cart ({cartItems.length})</h2>
              {cartItems.length === 0 ? (
                <div className="text-gray-500">Your cart is empty.</div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                      <div className="flex-1 w-full">
                        <div className="font-semibold text-gray-800 text-base mb-1">{item.name}</div>
                        <div className="text-xs text-gray-500 mb-1">{item.variantLabel}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantIndex, -1)}
                            className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-2 text-gray-800 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantIndex, 1)}
                            className="p-1 bg-green-500 hover:bg-green-600 text-white rounded"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-bold text-green-700 text-lg">₹{(item.price * item.quantity).toFixed(2)}</div>
                        <button
                          className="flex items-center gap-1 text-red-500 hover:underline text-xs"
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
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-3">
                  <div className="flex flex-col gap-2">
                    {(expanded ? addresses : addresses.slice(0, 3)).map((addr, idx) => {
                      const isSelected = selectedAddressIdx === idx;
                      return (
                        <label
                          key={addr._id}
                          className={`flex gap-3 items-start cursor-pointer rounded-lg px-3 py-3 border transition-all duration-150
                            ${isSelected ? 'border-green-600 bg-green-50 shadow-md' : 'border-green-200 bg-white'}
                            ${addr.isDefault ? 'ring-2 ring-green-400' : ''}
                            hover:border-green-400`}
                          htmlFor={`address-radio-${idx}`}
                          style={{ position: 'relative' }}
                        >
                          <input
                            id={`address-radio-${idx}`}
                            type="radio"
                            name="address"
                            checked={isSelected}
                            onChange={() => setSelectedAddressIdx(idx)}
                            className="accent-green-600 mt-1"
                          />
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="block text-gray-800 text-sm break-words whitespace-normal w-full">
                              <span className="font-semibold text-green-700 mr-2">{addr.label}:</span> {addr.address}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {addr.isDefault ? (
                                <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded">Default</span>
                              ) : (
                                <button
                                  type="button"
                                  className="text-xs text-green-700 hover:underline"
                                  onClick={e => { e.stopPropagation(); handleSetDefault(addr._id); }}
                                >
                                  Set Default
                                </button>
                              )}
                              <button
                                type="button"
                                className="text-xs text-red-500 hover:underline ml-2"
                                onClick={e => { e.stopPropagation(); handleDeleteAddress(addr._id, idx); }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                    {addresses.length > 3 && (
                      <button
                        className="text-green-700 text-xs mt-1 hover:underline self-start"
                        onClick={() => setExpanded(e => !e)}
                      >
                        {expanded ? 'Show less' : `Show all addresses (${addresses.length})`}
                      </button>
                    )}
                  </div>
                  {showNewAddress ? (
                    <div className="flex flex-col gap-2 mt-3">
                      <input
                        type="text"
                        className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
                        placeholder="Enter new address"
                        value={newAddress}
                        onChange={e => setNewAddress(e.target.value)}
                      />
                      <input
                        type="text"
                        className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
                        placeholder="Label (e.g. Home, Work)"
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                          onClick={handleAddAddress}
                        >Save</button>
                        <button
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                          onClick={() => { setShowNewAddress(false); setNewAddress(''); setNewLabel('Home'); }}
                        >Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                        onClick={() => setShowNewAddress(true)}
                      >+ Add New Address</button>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                        onClick={() => setShowLocationModal(true)}
                      >+ Use Current Location</button>
                    </div>
                  )}
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
                  <span>₹{cartTotals.itemsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Your savings</span>
                  <span className="text-green-600">-₹{cartTotals.totalSavings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Delivery</span>
                  <span>₹{cartTotals.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Handling Charge</span>
                  <span>₹{cartTotals.handlingCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-800 text-lg border-t border-green-100 pt-2 mt-2">
                  <span>Grand Total</span>
                  <span>₹{cartTotals.grandTotal.toFixed(2)}</span>
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
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-md hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handlePlaceOrder}
                disabled={placingOrder || cartItems.length === 0}
              >
                {placingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;