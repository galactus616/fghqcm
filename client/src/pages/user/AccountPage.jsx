import React, { useEffect, useState } from "react";
import useStore from "../../store/useStore";
import { getCurrencySymbol } from "../../utils/currencyUtils";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../api/user/user";
import { LogOut, Edit2, Plus, Trash2, Star, Package, User, Heart, Settings, Image as ImageIcon, Inbox, MapPin, Bell, Globe, CreditCard, RefreshCcw, Star as StarIcon, ChevronRight } from "lucide-react";
import axios from "axios";
import OrderDetailsModal from "../../components/user/OrderDetailsModal";
import { useTranslation } from 'react-i18next';

function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setError("");
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSave({ name, email });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <button
          className="absolute top-3 cursor-pointer right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Add ChangePasswordModal (UI only)
function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Only UI, no backend
    setTimeout(() => {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
      } else {
        setSuccess("Password changed successfully (UI only)");
      }
      setLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <button
          className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700 flex items-center justify-center gap-2"><Lock className="w-6 h-6" /> Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Wishlist Section (UI only)
function WishlistSection() {
  return (
    <section className="mb-8 bg-green-50 rounded-xl p-6 shadow-sm border border-green-100">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-pink-500" />
        <h3 className="font-semibold text-gray-800 text-xl">Wishlist</h3>
      </div>
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <Heart className="w-12 h-12 mb-2 text-pink-200" />
        <div className="text-lg font-medium">No wishlist items yet.</div>
        <div className="text-sm">Add products to your wishlist to see them here.</div>
      </div>
    </section>
  );
}

// Settings Section (UI only)
function SettingsSection() {
  return (
    <section className="mb-8 bg-green-50 rounded-xl p-6 shadow-sm border border-green-100">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-gray-800 text-xl">Settings & Preferences</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-yellow-500" />
          <span className="font-medium text-gray-700">Notifications</span>
          <span className="ml-auto text-xs text-gray-400">(Coming soon)</span>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-700">Language</span>
          <span className="ml-auto text-xs text-gray-400">(Coming soon)</span>
        </div>
      </div>
    </section>
  );
}

const SIDEBAR_TABS = [
  { key: "orders", label: "My Orders", icon: Package },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "cancellations", label: "Cancellations", icon: RefreshCcw },
  { key: "support", label: "Support", icon: Bell },
];

export default function AccountPage() {
  const { user, isLoggedIn, logout, updateProfile } = useStore();
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("Home");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { t } = useTranslation();

  // Fetch addresses
  useEffect(() => {
    async function fetchAddresses() {
      setAddressLoading(true);
      setAddressError("");
      try {
        const data = await getAddresses();
        setAddresses(data);
      } catch {
        setAddressError("Failed to load addresses");
      } finally {
        setAddressLoading(false);
      }
    }
    if (isLoggedIn) fetchAddresses();
  }, [isLoggedIn]);

  // Fetch recent orders
  useEffect(() => {
    async function fetchOrders() {
      setOrdersLoading(true);
      try {
        const res = await axios.get("/api/orders", { withCredentials: true });
        setOrders(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }
    if (isLoggedIn) fetchOrders();
  }, [isLoggedIn]);

  // User loading state
  useEffect(() => {
    if (user === null && !isLoggedIn) {
      setUserLoading(false);
    } else if (user !== null) {
      setUserLoading(false);
    }
  }, [user, isLoggedIn]);

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    try {
      const data = await addAddress({ label: newLabel, address: newAddress, isDefault: addresses.length === 0 });
      setAddresses(data);
      setShowAddAddress(false);
      setNewAddress("");
      setNewLabel("Home");
    } catch (err) {
      // Optionally show error
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const data = await deleteAddress(addressId);
      setAddresses(data);
    } catch {}
  };

  const handleSetDefault = async (addressId) => {
    try {
      const data = await setDefaultAddress(addressId);
      setAddresses(data);
    } catch {}
  };

  const handleLogout = async () => {
    await logout();
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }
  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow text-center">
        <h2 className="text-3xl font-bold mb-4">{t('account')}</h2>
        <p className="text-gray-600 text-lg">{t('you_are_not_logged_in')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-16 p-0 md:p-0 bg-white rounded-2xl border border-green-100 flex flex-col md:flex-row min-h-[600px]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-green-50 border-r border-green-100 flex flex-col items-center md:items-stretch py-8 px-0 md:px-4 gap-8">
        {/* Avatar and user info */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-20 h-20 rounded-full bg-white border border-green-200 flex items-center justify-center text-5xl font-bold text-green-700">
            <ImageIcon className="w-12 h-12 text-green-200" />
          </div>
          <div className="text-lg font-bold text-gray-900 text-center">{user?.name?.trim() ? user.name : t('no_name_set')}</div>
          <div className="text-gray-400 text-sm text-center">{user?.email?.trim() ? user.email : t('no_email_set')}</div>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-1 w-full">
          {SIDEBAR_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex cursor-pointer items-center gap-3 px-6 py-3 w-full text-left rounded-lg font-medium text-base transition-all
                  ${activeTab === tab.key ? "bg-white text-green-700 border border-green-200" : "text-gray-700 hover:bg-green-100"}`}
              >
                <Icon className="w-5 h-5" />
                <span>{t(tab.label.replace(/\s+/g, '_').toLowerCase())}</span>
                {activeTab === tab.key && <ChevronRight className="ml-auto w-4 h-4 text-green-500" />}
              </button>
            );
          })}
        </nav>
        <div className="flex-1" />
        <button
          className="flex cursor-pointer items-center gap-2 px-6 py-3 w-full text-left rounded-lg font-medium text-base text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" /> {t('logout')}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 flex flex-col">
        {activeTab === "orders" && (
          <section className="w-full max-w-2xl mx-auto bg-green-50 rounded-xl p-8 border border-green-100 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-xl text-gray-900">My Orders</h3>
              <a
                href="/orders"
                className="text-green-700 hover:underline text-base font-medium flex items-center gap-1"
              >
                <Package className="w-5 h-5" /> View All
              </a>
            </div>
            {ordersLoading ? (
              <div className="text-gray-400 py-8 text-center">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Inbox className="w-12 h-12 mb-2" />
                <div className="text-lg font-medium">No recent orders.</div>
                <div className="text-sm">Your recent orders will appear here.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div key={order.id || order._id} className="p-4 rounded-lg border border-gray-200 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-2 cursor-pointer hover:bg-green-50 transition" onClick={() => setSelectedOrder(order)}>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs text-gray-500">Order ID:</span>
                      <span className="font-semibold text-gray-800 text-base">{order.orderId}</span>
                      <span className="text-xs text-gray-500">Placed on:</span>
                      <span className="font-medium text-green-700 text-xs">{new Date(order.date).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-500">Status:</span>
                      <span className={`font-semibold px-2 py-1 rounded text-xs ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                    </div>
                    <div className="font-bold text-green-800 text-base">{getCurrencySymbol()}{order.total?.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
          </section>
        )}
        {activeTab === "addresses" && (
          <section className="w-full max-w-2xl mx-auto bg-green-50 rounded-xl p-8 border border-green-100 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-xl text-gray-900">Saved Addresses</h3>
              <button
                className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all text-base border border-green-600"
                onClick={() => setShowAddAddress((v) => !v)}
              >
                <Plus className="w-5 h-5" /> Add Address
              </button>
            </div>
            {addressLoading ? (
              <div className="text-gray-400 py-8 text-center">Loading addresses...</div>
            ) : addressError ? (
              <div className="text-red-600 py-8 text-center">{addressError}</div>
            ) : addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <MapPin className="w-12 h-12 mb-2 text-green-200" />
                <div className="text-lg font-medium">No addresses saved.</div>
                <div className="text-sm">Add your address to get started.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`flex items-center gap-3 p-4 rounded-lg border ${addr.isDefault ? "border-green-500 bg-white" : "border-gray-200 bg-white"}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 text-base">{addr.label}</span>
                        {addr.isDefault && <span className="text-green-600 text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3" /> Default</span>}
                      </div>
                      <div className="text-gray-600 text-sm truncate max-w-xs">{addr.address}</div>
                    </div>
                    {!addr.isDefault && (
                      <button
                        className="text-green-600 cursor-pointer hover:underline text-xs px-2 py-1 rounded hover:bg-green-50"
                        onClick={() => handleSetDefault(addr._id)}
                      >Set Default</button>
                    )}
                    <button
                      className="text-red-500 hover:underline text-xs px-2 py-1 rounded hover:bg-red-50 flex items-center gap-1"
                      onClick={() => handleDeleteAddress(addr._id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            {showAddAddress && (
              <div className="flex flex-col gap-2 mt-6 bg-white p-4 rounded-xl border border-gray-200">
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
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition border border-green-600"
                    onClick={handleAddAddress}
                  >Save</button>
                  <button
                    className="bg-gray-100 cursor-pointer text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-200"
                    onClick={() => { setShowAddAddress(false); setNewAddress(""); setNewLabel("Home"); }}
                  >Cancel</button>
                </div>
              </div>
            )}
          </section>
        )}
        {activeTab === "payment" && (
          <section className="w-full max-w-2xl mx-auto bg-green-50 rounded-xl p-8 border border-green-100 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white cursor-pointer rounded-lg font-semibold hover:bg-green-700 transition-all text-base border border-green-600"
                onClick={() => alert("Add payment method functionality coming soon!")}
              >
                <Plus className="w-5 h-5" /> Add New Payment Method
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">Credit Card (**** **** **** 1234)</span>
                    <span className="text-gray-500 text-sm">Expires: 12/25</span>
                  </div>
                </div>
                <button className="text-red-500 hover:underline text-sm cursor-pointer">Remove</button>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">Credit Card (**** **** **** 5678)</span>
                    <span className="text-gray-500 text-sm">Expires: 01/26</span>
                  </div>
                </div>
                <button className="text-red-500 hover:underline text-sm cursor-pointer">Remove</button>
              </div>
            </div>
          </section>
        )}
        {activeTab === "cancellations" && (
          <section className="w-full max-w-2xl mx-auto bg-green-50 rounded-xl p-8 border border-green-100 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Cancellations</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">Order #123456789</span>
                  <span className="text-gray-500 text-sm">Cancelled on: 2023-10-20</span>
                </div>
                <button className="text-green-600 hover:underline text-sm cursor-pointer">View Details</button>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">Order #987654321</span>
                  <span className="text-gray-500 text-sm">Cancelled on: 2023-10-15</span>
                </div>
                <button className="text-green-600 hover:underline text-sm cursor-pointer">View Details</button>
              </div>
            </div>
          </section>
        )}
        {activeTab === "support" && (
          <section className="w-full max-w-2xl mx-auto bg-green-50 rounded-xl p-8 border border-green-100 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-6 h-6 text-yellow-500" />
              <h3 className="font-semibold text-xl text-gray-900">Support</h3>
            </div>
            <form className="bg-white rounded-lg p-6 border border-green-100 flex flex-col gap-4 max-w-lg mx-auto">
              <label className="font-semibold text-gray-700">Raise a Support Ticket</label>
              <textarea className="border border-green-200 rounded-lg p-3 min-h-[100px] resize-y focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400" placeholder="Describe your issue or question..." />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition border border-green-600 cursor-pointer">Submit Ticket</button>
            </form>
            <div className="flex flex-col items-center gap-2 mt-6">
              <span className="text-gray-700 font-medium">Or contact us via Gmail:</span>
              <a href="mailto:support@example.com" className="text-green-700 hover:underline flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48"><path fill="#fff" d="M4 12v24h40V12z"/><path fill="#e53935" d="M44 12H4l20 15z"/><path fill="#c62828" d="M44 12v24L24 27z"/><path fill="#fbc02d" d="M4 36V12l20 15z"/></svg> support@example.com</a>
            </div>
          </section>
        )}
        <EditProfileModal
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          user={user}
          onSave={updateProfile}
        />
      </main>
    </div>
  );
}