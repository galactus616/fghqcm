import React, { useEffect } from "react";
import {
  Search,
  ChevronDown,
  ShoppingCart,
  MapPin,
  Pencil,
  Trash2,
  X,
  User,
  Plus,
  Minus,
  Package,
  Gift,
  HelpCircle,
  Shield,
  LogOut,
  Settings,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";
import useStore from "../../store/useStore";
import LocationModal from "./LocationModal";
import { useTranslation } from "react-i18next";
import { useCurrencySymbol } from "../../utils/currencyUtils";

// Navbar component
export default function Navbar() {
  // Use the currency symbol hook for reactive updates
  const currencySymbol = useCurrencySymbol();
  const navigate = useNavigate();
  // Zustand store hooks
  const {
    user,
    isLoggedIn,
    hydratedItems: cartItems,
    cartLoading,
    cartError,
    fetchProfile,
    logout,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    currentLocation,
    setCurrentLocation,
    isLocationModalOpen,
    setLocationModalOpen,
    language,
    setLanguage,
  } = useStore();
  const { t, i18n } = useTranslation();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] =
    React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMessage, setAuthMessage] = React.useState("");
  const [loginRedirect, setLoginRedirect] = React.useState(null);

  // Calculate cart totals
  const cartTotals = React.useMemo(() => {
    const itemsTotal = cartItems.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
      0
    );
    const totalSavings = cartItems.reduce(
      (sum, item) =>
        sum +
        (Number(item.quantity) || 0) *
          ((Number(item.originalPrice) || 0) - (Number(item.price) || 0)),
      0
    );
    const deliveryCharge = 0;
    const handlingCharge = 4;
    const grandTotal =
      itemsTotal + deliveryCharge + (cartItems.length > 0 ? handlingCharge : 0);
    return {
      itemsTotal,
      totalSavings,
      deliveryCharge,
      handlingCharge,
      grandTotal,
    };
  }, [cartItems]);

  // Close all overlays when any is opened
  const closeAllOverlays = () => {
    setLocationModalOpen(false);
    setIsProfileDropdownOpen(false);
    setIsCartOpen(false);
  };

  const openLocationModal = () => {
    closeAllOverlays();
    setLocationModalOpen(true);
  };

  const toggleProfileDropdown = () => {
    closeAllOverlays();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleCart = () => {
    closeAllOverlays();
    setIsCartOpen(!isCartOpen);
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `http://localhost:5000/api/location?lat=${latitude}&lon=${longitude}`
          );
          if (!response.ok) throw new Error("Failed to fetch address");
          const data = await response.json();
          let address = data.display_name;
          if (data.address) {
            address =
              data.address.suburb ||
              data.address.neighbourhood ||
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state ||
              data.display_name;
            if (data.address.city && data.address.state) {
              address = `${data.address.city}, ${data.address.state}`;
            } else if (data.address.town && data.address.state) {
              address = `${data.address.town}, ${data.address.state}`;
            } else if (data.address.village && data.address.state) {
              address = `${data.address.village}, ${data.address.state}`;
            }
          }
          setCurrentLocation(address);
          toast.success("Location detected successfully!");
        } catch (err) {
          toast.error("Failed to detect address. Please try again.");
        }
      },
      (error) => {
        toast.error(
          error.message || "Failed to get your location. Please allow location access."
        );
      }
    );
  };

  // const handleSaveAddress = (newAddress) => {
  //   setCurrentLocation(newAddress);
  //   setIsLocationModalOpen(false);
  // };

  // const handleProfileMenuItemClick = (item) => {
  //   alert(`Clicked: ${item}`);
  //   setIsProfileDropdownOpen(false);
  // };

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

  // Fetch profile and cart on mount
  useEffect(() => {
    const fetchAll = async () => {
      await fetchProfile();
      // fetchCart will use the updated isLoggedIn value
      await fetchCart();
    };
    fetchAll();
    // eslint-disable-next-line
  }, []);

  // Refetch cart when auth state changes
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    toast.success("Logged out successfully");
  };

  // Minimal profile menu items
  const minimalProfileMenuItems = isLoggedIn
    ? [
        { label: "My Orders", icon: Package, action: () => navigate('/orders') },
        { label: "Account", icon: Settings, action: () => navigate('/account') },
        { label: "Log Out", icon: LogOut, action: handleLogout, isDestructive: true },
      ]
    : [];

  // Helper to get user initial and short name
  const getUserInitial = (user) => {
    if (!user) return '';
    if (user.name && user.name.length > 0) return user.name[0].toUpperCase();
    if (user.email && user.email.length > 0) return user.email[0].toUpperCase();
    return '';
  };
  const getUserShortName = (user) => {
    if (!user) return 'Guest';
    if (user.name && user.name.length > 0) return user.name.split(' ')[0];
    if (user.email && user.email.length > 0) return user.email.split('@')[0];
    return 'Guest';
  };
  return (
    <div className="font-sans">
      <nav className="bg-white border-b border-[#0a614d]/30 py-2 px-4 sm:px-6 lg:px-8 w-full shadow-sm">
        <div className="w-full flex flex-wrap items-center justify-between md:flex-nowrap">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 order-1 mr-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="https://res.cloudinary.com/deepmitra/image/upload/v1753344029/qbd_logo_svg_onzssf.svg" alt="QBD Logo" className="h-[68px] object-contain" draggable={false} />
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center space-x-3 md:hidden order-2">
            {/* Language Toggle for Mobile */}
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="rounded cursor-pointer text-[#0a614d] text-sm px-3 py-2 focus:outline-none bg-[#0a614d]/10 focus:ring-2 focus:ring-[#0a614d]"
              aria-label="Toggle language"
            >
              {language === "en" ? "En" : "Bn"}
            </button>
            <button
              onClick={() => {
                closeAllOverlays();
                if (isLoggedIn) {
                  toggleProfileDropdown();
                } else {
                  setLoginRedirect(null);
                  setIsAuthModalOpen(true);
                }
              }}
              className="cursor-pointer p-2 text-[#0a614d] hover:bg-[#0a614d]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a614d] transition-colors duration-200"
              aria-label="Toggle profile menu"
            >
              <User className="w-6 h-6" />
            </button>

            <button
              onClick={toggleCart}
              className="relative cursor-pointer p-2 text-[#0a614d] hover:bg-[#0a614d]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a614d] transition-colors duration-200"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Location */}
          <div
            className="hidden md:flex flex-col text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200 ml-6 order-2 min-w-[200px] p-2 rounded-lg"
            style={{ border: '1px solid #0a614d1a' }}
            onClick={openLocationModal}
          >
            <span className="font-medium text-[#0a614d]">{t("location")}</span>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-[#0a614d]" />
              <span className="font-medium text-gray-800 truncate max-w-[140px]" title={currentLocation}>
                {currentLocation}
              </span>
              <ChevronDown className="w-4 h-4 ml-1 text-[#0a614d]" />
            </div>
          </div>

          {/* Mobile Location */}
          <div
            className="flex flex-col text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200 w-full mt-3 md:hidden order-3 p-2 rounded-lg"
            onClick={openLocationModal}
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-gray-800 truncate max-w-[140px]" title={currentLocation}>
                {currentLocation}
              </span>
              <ChevronDown className="w-4 h-4 ml-1 text-green-600" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-6 w-full md:w-auto mt-3 md:mt-0 order-4 md:order-3 max-w-2xl">
            <div className="relative flex items-center bg-gray-50 rounded-lg overflow-hidden border border-[#0a614d]/30 hover:border-[#0a614d] transition-colors duration-200">
              <Search className="absolute left-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("search_placeholder")}
                className="w-full py-3 pl-10 pr-4 bg-transparent text-gray-800 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Desktop Profile */}
          <div className="hidden md:flex items-center ml-6 order-4 min-w-[140px] gap-2">
            {/* Language Toggle for Desktop */}
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="ml-2 cursor-pointer rounded text-[#0a614d] text-sm px-4  p-3 bg-[#0a614d]/10 focus:outline-none focus:ring-2 focus:ring-[#0a614d]"
              aria-label="Toggle language"
            >
              {language === "en" ? "En" : "Bn"}
            </button>
            {/* Profile Button + Dropdown Wrapper */}
            <div className="relative">
              {isLoggedIn && user ? (
                <button
                  onClick={toggleProfileDropdown}
                  className={`flex items-center cursor-pointer p-2 rounded-full border border-[#0a614d]/30 hover:border-[#0a614d] transition-all duration-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0a614d] ${isProfileDropdownOpen ? 'ring-2 ring-[#0a614d]/80 bg-[#0a614d]/10 border-[#0a614d]' : ''}`}
                  style={{ minHeight: 40, minWidth: 40 }}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a614d]/10 text-[#0a614d] font-semibold text-base border border-[#0a614d]/30 shadow-sm">
                    {getUserInitial(user) || <User className="w-4 h-4 text-[#0a614d]/50" />}
                  </span>
                  <span className="ml-2 font-medium text-gray-900 truncate max-w-[70px] text-sm">{getUserShortName(user)}</span>
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 text-green-600 flex-shrink-0 ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center text-gray-700 cursor-pointer hover:bg-[#0a614d]/10 transition-colors duration-200 p-2 rounded-full hover:text-[#0a614d] focus:outline-none focus:ring-2 focus:ring-[#0a614d] border border-[#0a614d]/30 hover:border-[#0a614d] bg-white"
                  style={{ minHeight: 40, minWidth: 40 }}
                >
                  <User className="w-5 h-5 mr-2 text-[#0a614d]" />
                  <span className="font-medium">Login</span>
                </button>
              )}
              {isLoggedIn && isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-50 ring-1 ring-[#0a614d]/30 border border-[#0a614d]/30"
                  style={{ pointerEvents: 'auto', zIndex: 9999 }}
                >
                  {minimalProfileMenuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={index}
                        type="button"
                        onMouseDown={e => {
                          e.stopPropagation();
                          item.action();
                        }}
                        className={`flex items-center cursor-pointer w-full text-left px-3 py-2 text-sm rounded-md my-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          item.isDestructive
                            ? "text-red-600 hover:bg-red-50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        tabIndex={0}
                      >
                        <IconComponent className={`w-4 h-4 mr-3 flex-shrink-0 ${item.isDestructive ? 'text-red-500' : 'text-gray-500'}`} />
                        <span>{t(item.label.replace(/ /g, '_').toLowerCase()) || item.label}</span>

                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Desktop Cart Button */}
            <button
              onClick={toggleCart}
              className="relative hidden cursor-pointer md:flex items-center bg-[#006a4e] text-white py-3 px-6 rounded-lg shadow-sm hover:bg-[#0a614d]/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0a614d] focus:ring-offset-2 order-5 min-w-[100px] justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span className="font-medium">{t("my_cart")}</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Profile Dropdown or Login Button */}
        {isLoggedIn && isProfileDropdownOpen && (
          <div
            className="md:hidden mt-4 border-t border-gray-200 pt-4"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          >
            <div className="flex flex-col space-y-3">
              <div className="pl-6 pb-2 space-y-2 border-l border-gray-200 ml-2">
                {minimalProfileMenuItems.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className={`block w-full cursor-pointer text-left px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      item.isDestructive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    tabIndex={0}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Profile Dropdown Overlay */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 bg-transparent z-30"
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}

      {/* Location Modal */}
      <LocationModal />

      {/* Cart Side Panel */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-600/50 z-40 transition-opacity duration-300"
            onClick={toggleCart}
          ></div>

          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col transform transition-transform duration-300 ease-out ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800">{t("my_cart")}</h2>
              <button
                onClick={toggleCart}
                className="text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cartError ? (
                <div className="text-center text-red-600 py-10">
                  {cartError}
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Your cart is empty.
                </div>
              ) : (
                <>
                  <div className="bg-primary/10 bg-opacity-80 text-primary font-medium p-3 rounded-lg flex justify-between items-center text-sm">
                    <span>{"Your total savings"}</span>
                    <span>{currencySymbol}{cartTotals.totalSavings.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center bg-blue-50 bg-opacity-80 text-primary p-3 rounded-lg text-sm">
                    <span className="mr-2">📦</span>
                    <span>
                      Shipment of {cartItems.length} item
                      {cartItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item._id || item.id || `${item.productId}-${item.variantIndex}`}
                        className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                      >
                        <img
                          src={item.imageUrl || '/vite.svg'}
                          alt={item.name || 'Unavailable'}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800">
                            {item.name || 'Unavailable'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {currencySymbol}{(item.price ?? 0).toFixed(2)}{' '}
                            <span className="line-through text-gray-400">
                              {currencySymbol}{(item.originalPrice ?? 0).toFixed(2)}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantIndex, -1)}
                            className="p-2 bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer duration-200"
                            aria-label={`Decrease quantity of ${item.name || 'Unavailable'}`}
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="px-3 text-gray-800">
                            {item.quantity ?? 1}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantIndex, 1)}
                            className="p-2 bg-primary cursor-pointer hover:bg-primary-dark text-white transition-colors duration-200"
                            aria-label={`Increase quantity of ${item.name || 'Unavailable'}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">{t("bill_details")}</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>{t("items_total")}</span>
                        <span>{currencySymbol}{cartTotals.itemsTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("saved")}</span>
                        <span className="text-primary">
                          {currencySymbol}{cartTotals.totalSavings.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("delivery_charge")}</span>
                        <span className="text-primary">FREE</span>
                      </div>
                      {cartItems.length > 0 && (
                        <div className="flex justify-between">
                          <span>{t("handling_charge")}</span>
                          <span>{currencySymbol}{cartTotals.handlingCharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                        <span>{t("grand_total")}</span>
                        <span>
                          {currencySymbol}
                          {cartItems.length > 0
                            ? cartTotals.grandTotal.toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      {t("tip_your_delivery_partner")}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your kindness means a lot! 100% of your tip will go
                      directly to your delivery partner.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[20, 30, 50].map((amount) => (
                        <button
                          key={amount}
                          className="flex-1  min-w-[80px] py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                          {currencySymbol}{amount}
                        </button>
                      ))}
                      <button className="flex-1 min-w-[80px] py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer duration-200">
                        Custom
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      {t("cancellation_policy")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Orders cannot be cancelled once packed for delivery. In
                      case of unexpected delays, a refund will be provided, if
                      applicable.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 left-0 right-0 shadow-lg">
              <button
                className="w-full bg-primary text-white py-3 px-4 cursor-pointer rounded-lg flex items-center justify-between shadow-md hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={async () => {
                  if (!isLoggedIn) {
                    setAuthMessage("You need to login to proceed to checkout.");
                    setLoginRedirect("/checkout");
                    setIsAuthModalOpen(true);
                  } else {
                    toggleCart();
                    navigate('/checkout');
                  }
                }}
                disabled={cartItems.length === 0}
              >
                <span className="font-bold text-lg">
                  {currencySymbol}{cartTotals.grandTotal.toFixed(2)}
                </span>
                <span className="flex items-center">
                  Proceed{' '}
                  <ChevronDown className="w-5 h-5 ml-2 rotate-[-90deg]" />
                </span>
              </button>
            </div>
          </div>
        </>
      )}
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={async (didLogin) => {
          setIsAuthModalOpen(false);
          if (didLogin) {
            await fetchProfile();
            if (loginRedirect) {
              navigate(loginRedirect);
              setLoginRedirect(null);
            }
          }
        }}
      >
        {authMessage && (
          <div className="text-center text-red-600 font-medium mb-4">{authMessage}</div>
        )}
      </AuthModal>
    </div>
  );
}
