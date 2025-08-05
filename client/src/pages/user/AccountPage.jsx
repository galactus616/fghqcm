import React, { useEffect, useState } from "react";
import useStore from "../../store/useStore";
import { getCurrencySymbol, useCurrencySymbol } from "../../utils/currencyUtils";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../api/user/user";
import { User, LogOut, Edit2, Plus, Trash2, Star, Package, Heart, Settings, Image as ImageIcon, Inbox, MapPin, Bell, Globe, CreditCard, RefreshCcw, ChevronRight, Mail, Phone } from "lucide-react";
import axios from "axios";
import OrderDetailsModal from "../../components/user/OrderDetailsModal";
import { useTranslation } from 'react-i18next';
import AddressModal from '../../components/common/AddressModal';
import toast from 'react-hot-toast';

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
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-primary/10 placeholder-gray-400"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-primary/10 placeholder-gray-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-bd-red text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full cursor-pointer bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
        <h2 className="text-2xl font-bold text-center mb-6 text-primary flex items-center justify-center gap-2"><Lock className="w-6 h-6" /> Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-primary/10 placeholder-gray-400"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-primary/10 placeholder-gray-400"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-primary/10 placeholder-gray-400"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-bd-red text-sm">{error}</div>}
          {success && <div className="text-primary text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full cursor-pointer bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
    <section className="mb-8 bg-primary/10 rounded-xl p-6 shadow-sm border border-primary/30">
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
    <section className="mb-8 bg-primary/10 rounded-xl p-6 shadow-sm border border-primary/30">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
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
  { key: "profile", label: "Profile", icon: User },
  { key: "orders", label: "My Orders", icon: Package },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "cancellations", label: "Cancellations", icon: RefreshCcw },
  { key: "support", label: "Support", icon: Bell },
];

export default function AccountPage() {
  const { user, isLoggedIn, logout, updateProfile } = useStore();
  // Use the currency symbol hook for reactive updates
  const currencySymbol = useCurrencySymbol();
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false); // <-- add this line
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("Home");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingAddress, setPendingAddress] = useState(null);
  const { t } = useTranslation();
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");

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
        let ordersData = Array.isArray(res.data) ? res.data.slice(0, 3) : [];
        // Patch deliveryAddress to full object if it's an ID
        ordersData = ordersData.map(order => {
          if (order.deliveryAddress && typeof order.deliveryAddress === 'string' && addresses.length > 0) {
            const found = addresses.find(addr => addr._id === order.deliveryAddress);
            if (found) {
              return { ...order, deliveryAddress: found };
            }
          }
          return order;
        });
        setOrders(ordersData);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }
    if (isLoggedIn) fetchOrders();
  }, [isLoggedIn, addresses]);

  // User loading state
  useEffect(() => {
    if (user === null && !isLoggedIn) {
      setUserLoading(false);
    } else if (user !== null) {
      setUserLoading(false);
    }
  }, [user, isLoggedIn]);

  useEffect(() => {
    setProfileName(user?.name || "");
    setProfilePhone(user?.phone || "");
    setProfileEmail(user?.email || "");
  }, [user]);

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    try {
      const data = await addAddress({ label: newLabel, address: newAddress });
      setAddresses(data);
      setShowAddAddress(false);
      setNewAddress("");
      setNewLabel("Home");
      toast.success('Address added successfully!');
    } catch (err) {
      // Optionally show error
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const data = await deleteAddress(addressId);
      setAddresses(data);
      toast.success('Address deleted successfully!');
    } catch {}
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleAddressModalSave = async (address) => {
    try {
      if (address._id) {
        const data = await updateAddress(address._id, address);
        setAddresses(data);
        toast.success('Address updated successfully!');
      } else {
        const data = await addAddress(address);
        setAddresses(data);
        toast.success('Address added successfully!');
      }
      setShowAddressModal(false);
      setPendingAddress(null);
    } catch (err) {
      alert('Failed to save address. Please try again.');
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
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
    <div className="min-h-screen bg-primary/10 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-primary/30 flex flex-col min-h-screen justify-between">
        {/* Profile Info */}
        <div>
          <div className="flex flex-col items-center py-5 px-6 bg-white border-b border-primary/30">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl text-primary font-bold shadow mb-4 select-none">
              {user?.photoUrl
                ? <img src={user.photoUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                : (user?.name?.trim() ? user.name.trim()[0].toUpperCase() : <User className="w-10 h-10" />)
              }
            </div>
            <div className="text-lg font-bold text-gray-900 mb-2">{user?.name?.trim() || <span className="text-gray-400 font-normal">Set your name</span>}</div>
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 rounded px-3 py-1 w-full">
                {/* Email icon */}
                <Mail className="w-4 h-4" />
                <span className="truncate">{user?.email || <span className="text-gray-300">Add your email</span>}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 rounded px-3 py-1 w-full">
                {/* Phone icon */}
                <Phone className="w-4 h-4" />
                <span className="truncate">{user?.phone || <span className="text-gray-300">Add your phone</span>}</span>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex flex-col gap-1 my-4">
            {SIDEBAR_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-3 px-8 py-3 w-full text-left rounded-lg font-medium text-base transition-all capitalize cursor-pointer
                    ${activeTab === tab.key ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-gray-700 hover:bg-primary/10"}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.label}</span>
                  {activeTab === tab.key && <ChevronRight className="ml-auto w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </nav>
        </div>
        {/* Logout */}
        <div className="border-t border-primary/30 py-2">
          <button
            className="flex items-center gap-3 w-full py-3 px-8 rounded-lg font-medium text-base text-bd-red hover:bg-bd-red/10 transition-all cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" strokeWidth={2.5} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-12 px-4 md:px-12 bg-primary/10">
        <div className="w-full max-w-3xl">
          {activeTab === "profile" && (
            <section className="bg-white rounded-2xl p-8 border border-primary/30 flex flex-col gap-6 mb-8">
              <h3 className="font-bold text-2xl text-primary mb-4">Profile</h3>
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await updateProfile({ name: profileName, email: profileEmail });
                    toast.success('Profile updated successfully!');
                  } catch {
                    toast.error('Failed to update profile.');
                  }
                }}
              >
                {/* Avatar removed - only show fields below */}
                <label className="block">
                  <span className="text-gray-700 font-medium">Name</span>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-primary/10 placeholder-gray-400"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700 font-medium">Phone</span>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-primary/30 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                    value={profilePhone}
                    readOnly
                    disabled
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700 font-medium">Email</span>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-primary/10 placeholder-gray-400"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition border border-primary mt-2 cursor-pointer"
                >Save Changes</button>
              </form>
            </section>
          )}
          {activeTab === "orders" && (
            <section className="bg-white rounded-2xl p-8 border border-primary/30 flex flex-col gap-6 mb-8">
              <h3 className="font-bold text-2xl text-primary mb-4">My Orders</h3>
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
                  {orders.map((order) => {
                    // Format delivery address for display
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
                    return (
                      <div key={order.id || order._id} className="p-4 rounded-lg border border-gray-200 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-2 cursor-pointer hover:bg-primary/10 transition" onClick={() => setSelectedOrder(order)}>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs text-primary">Order ID:</span>
                            <span className="font-semibold text-primary text-base">{order.orderId}</span>
                            <span className="text-xs text-primary">Placed on:</span>
                            <span className="font-medium text-primary text-xs">{new Date(order.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">Status:</span>
                            <span className={`font-semibold px-2 py-1 rounded text-xs ${order.status === 'Delivered' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                            {formattedAddress && (
                              <span className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-xs">{formattedAddress}</span>
                            )}
                          </div>
                        </div>
                        <div className="font-bold text-primary text-base flex-shrink-0">₹{order.total?.toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            </section>
          )}
          {activeTab === "addresses" && (
            <section className="bg-white rounded-2xl p-8 border border-primary/30 flex flex-col gap-6 mb-8">
              <h3 className="font-bold text-2xl text-primary mb-4">Saved Addresses</h3>
              <div className="flex items-center justify-between mb-2">
                <button
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition-all text-base border border-primary"
                  onClick={() => {
                    setPendingAddress(null);
                    setShowAddressModal(true);
                  }}
                >
                  <Plus className="w-5 h-5" /> Add Address
                </button>
              </div>
              {addressLoading ? (
                <div className="text-gray-400 py-8 text-center">Loading addresses...</div>
              ) : addressError ? (
                <div className="text-bd-red py-8 text-center">{addressError}</div>
              ) : addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <MapPin className="w-12 h-12 mb-2 text-primary/20" />
                  <div className="text-lg font-medium">No addresses saved.</div>
                  <div className="text-sm">Add your address to get started.</div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {addresses.map((addr) => {
                    // Format address for display
                    const formatted = [
                      addr.flat,
                      addr.floor,
                      addr.area,
                      addr.landmark
                    ].filter(Boolean).join(', ');
                    return (
                      <div
                        key={addr._id}
                        className="flex items-center gap-3 p-4 rounded-lg border border-primary/30 bg-white cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-primary text-base">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-semibold">Default</span>
                            )}
                          </div>
                          <div className="text-gray-600 text-sm truncate max-w-xs">{formatted}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="text-blue hover:underline text-xs px-2 py-1 rounded hover:bg-blue/10 flex items-center gap-1 border border-blue/30 cursor-pointer"
                            onClick={() => {
                              setPendingAddress({ ...addr, _id: addr._id });
                              setShowAddressModal(true);
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" /></svg>
                            Edit
                          </button>
                          <button
                            className="text-bd-red hover:underline text-xs px-2 py-1 rounded hover:bg-bd-red/10 flex items-center gap-1 border border-bd-red/30 cursor-pointer"
                            onClick={() => handleDeleteAddress(addr._id)}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
          {activeTab === "payment" && (
            <section className="bg-white rounded-2xl p-8 border border-primary/30 flex flex-col gap-6 mb-8">
              <h3 className="font-bold text-2xl text-primary mb-4">Payment Methods</h3>
              <div className="flex items-center justify-between mb-4">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white cursor-pointer rounded-lg font-semibold hover:bg-primary/80 transition-all text-base border border-primary"
                  onClick={() => alert("Add payment method functionality coming soon!")}
                >
                  <Plus className="w-5 h-5" /> Add New Payment Method
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-lg p-4 border border-primary/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">Credit Card (**** **** **** 1234)</span>
                      <span className="text-gray-500 text-sm">Expires: 12/25</span>
                    </div>
                  </div>
                  <button className="text-bd-red hover:underline text-sm cursor-pointer">Remove</button>
                </div>
                <div className="bg-white rounded-lg p-4 border border-primary/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">Credit Card (**** **** **** 5678)</span>
                      <span className="text-gray-500 text-sm">Expires: 01/26</span>
                    </div>
                  </div>
                  <button className="text-bd-red hover:underline text-sm cursor-pointer">Remove</button>
                </div>
              </div>
            </section>
          )}
          {activeTab === "cancellations" && (
            <section className="bg-white rounded-2xl p-8 border border-primary/30 flex flex-col gap-6 mb-8">
              <h3 className="font-bold text-2xl text-primary mb-4">Cancellations</h3>
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-lg p-4 border border-primary/30 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">Order #123456789</span>
                    <span className="text-gray-500 text-sm">Cancelled on: 2023-10-20</span>
                  </div>
                  <button className="text-primary hover:underline text-sm cursor-pointer">View Details</button>
                </div>
                <div className="bg-white rounded-lg p-4 border border-primary/30 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">Order #987654321</span>
                    <span className="text-gray-500 text-sm">Cancelled on: 2023-10-15</span>
                  </div>
                  <button className="text-primary hover:underline text-sm cursor-pointer">View Details</button>
                </div>
              </div>
            </section>
          )}
          {activeTab === "support" && (
            <section className="bg-white rounded-2xl p-8 border border-primary/30 flex flex-col gap-6 mb-8">
              <h3 className="font-bold text-2xl text-primary mb-4">Support</h3>
              <form className="bg-white rounded-lg p-6 border border-primary/30 flex flex-col gap-4 w-full mx-auto">
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="ticketType" className="block font-semibold text-gray-700 mb-2">
                      Ticket Type <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="ticketType" 
                      id="ticketType" 
                      className="w-full border border-primary/30 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
                      required
                    >
                      <option value="">Select ticket type</option>
                      <option value="order-issue">Order Issue</option>
                      <option value="payment-problem">Payment Problem</option>
                      <option value="delivery-delay">Delivery Delay</option>
                      <option value="product-quality">Product Quality Issue</option>
                      <option value="refund-request">Refund Request</option>
                      <option value="account-issue">Account Issue</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="billing-inquiry">Billing Inquiry</option>
                      <option value="return-request">Return Request</option>
                      <option value="general-inquiry">General Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="ticketSubject" className="block font-semibold text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="ticketSubject" 
                      id="ticketSubject" 
                      placeholder="Brief description of your issue"
                      className="w-full border border-primary/30 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="ticketDescription" className="block font-semibold text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      name="ticketDescription" 
                      id="ticketDescription"
                      className="w-full border border-primary/30 rounded-lg p-3 min-h-[120px] resize-y focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400" 
                      placeholder="Please provide detailed information about your issue. Include order numbers, dates, and any relevant details to help us assist you better..."
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-all duration-200 border border-primary cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Support Ticket
                </button>
              </form>
              
              <div className="flex flex-col items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Need immediate assistance?</span>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a href="mailto:support@example.com" className="text-primary hover:underline flex items-center gap-2 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#fff" d="M4 12v24h40V12z"/>
                      <path fill="#e53935" d="M44 12H4l20 15z"/>
                      <path fill="#c62828" d="M44 12v24L24 27z"/>
                      <path fill="#fbc02d" d="M4 36V12l20 15z"/>
                    </svg> 
                    support@example.com
                  </a>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-700 font-medium">Response time: 24-48 hours</span>
                </div>
              </div>
            </section>
          )}
          <EditProfileModal
            isOpen={editProfileOpen}
            onClose={() => setEditProfileOpen(false)}
            user={user}
            onSave={updateProfile}
          />
          <AddressModal
            isOpen={showAddressModal}
            onClose={() => { setShowAddressModal(false); setPendingAddress(null); }}
            onSave={handleAddressModalSave}
            address={pendingAddress}
          />
        </div>
      </main>
    </div>
  );
}