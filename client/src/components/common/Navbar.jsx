import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// Navbar component
export default function Navbar() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(
    "Dumduma, Bhubaneswar, Odisha"
  );
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Tata Tea Gold",
      quantity: 1,
      price: 238,
      originalPrice: 280,
      imageUrl: "https://placehold.co/50x50/F0F0F0/000000?text=Tea",
    },
    {
      id: 2,
      name: "Britannia Marie Gold",
      quantity: 2,
      price: 50,
      originalPrice: 60,
      imageUrl: "https://placehold.co/50x50/F0F0F0/000000?text=Biscuit",
    },
    {
      id: 3,
      name: "Amul Milk",
      quantity: 1,
      price: 30,
      originalPrice: 35,
      imageUrl: "https://placehold.co/50x50/F0F0F0/000000?text=Milk",
    },
  ]);

  // Calculate cart totals
  const cartTotals = React.useMemo(() => {
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const totalSavings = cartItems.reduce(
      (sum, item) => sum + item.quantity * (item.originalPrice - item.price),
      0
    );
    const deliveryCharge = 0;
    const handlingCharge = 4;
    const grandTotal = itemsTotal + deliveryCharge + handlingCharge;

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
    setIsLocationModalOpen(false);
    setIsProfileDropdownOpen(false);
    setIsCartOpen(false);
  };

  // Manage body scroll when overlays are open
  useEffect(() => {
    const hasOverlayOpen =
      isLocationModalOpen || isProfileDropdownOpen || isCartOpen;

    if (hasOverlayOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isLocationModalOpen, isProfileDropdownOpen, isCartOpen]);

  const openLocationModal = () => {
    closeAllOverlays();
    setIsLocationModalOpen(true);
  };

  const toggleProfileDropdown = () => {
    closeAllOverlays();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleCart = () => {
    closeAllOverlays();
    setIsCartOpen(!isCartOpen);
  };

  const handleDetectLocation = () => {
    alert("Detecting your location...");
    setCurrentLocation("Your Detected Location");
    setIsLocationModalOpen(false);
  };

  const handleSaveAddress = (newAddress) => {
    setCurrentLocation(newAddress);
    setIsLocationModalOpen(false);
  };

  const handleProfileMenuItemClick = (item) => {
    alert(`Clicked: ${item}`);
    setIsProfileDropdownOpen(false);
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Profile menu items
  const profileMenuItems = [
    {
      label: "My Orders",
      action: () => handleProfileMenuItemClick("My Orders"),
    },
    {
      label: "Saved Addresses",
      action: () => handleProfileMenuItemClick("Saved Addresses"),
    },
    {
      label: "E-Gift Cards",
      action: () => handleProfileMenuItemClick("E-Gift Cards"),
    },
    { label: "FAQ's", action: () => handleProfileMenuItemClick("FAQ's") },
    {
      label: "Account Privacy",
      action: () => handleProfileMenuItemClick("Account Privacy"),
    },
    {
      label: "Log Out",
      action: () => handleProfileMenuItemClick("Log Out"),
      isDestructive: true,
    },
  ];

  return (
    <div className="font-sans">
      <nav className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8 w-full shadow-sm">
        <div className="w-full flex flex-wrap items-center justify-between md:flex-nowrap">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 order-1">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg shadow-sm">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
                  <path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" />
                  <circle cx="9" cy="9" r="1" />
                  <circle cx="15" cy="9" r="1" />
                  <circle cx="9" cy="13" r="1" />
                  <circle cx="15" cy="13" r="1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-green-700">
                  SwiftCart
                </span>
                <span className="text-xs text-green-600 font-medium">
                  Quick & Fresh
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center space-x-3 md:hidden order-2">
            <button
              onClick={toggleProfileDropdown}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              aria-label="Toggle profile menu"
            >
              <User className="w-6 h-6" />
            </button>

            <button
              onClick={toggleCart}
              className="relative p-2 text-green-600 hover:bg-green-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
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
            onClick={openLocationModal}
          >
            <span className="font-medium text-green-700">Location</span>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              <span className="font-medium text-gray-800">
                {currentLocation}
              </span>
              <ChevronDown className="w-4 h-4 ml-1 text-green-600" />
            </div>
          </div>

          {/* Mobile Location */}
          <div
            className="flex flex-col text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200 w-full mt-3 md:hidden order-3 p-2 rounded-lg"
            onClick={openLocationModal}
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-gray-800">{currentLocation}</span>
              <ChevronDown className="w-4 h-4 ml-1 text-green-600" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-6 w-full md:w-auto mt-3 md:mt-0 order-4 md:order-3 max-w-2xl">
            <div className="relative flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
              <Search className="absolute left-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full py-3 pl-10 pr-4 bg-transparent text-gray-800 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Desktop Profile */}
          <div className="relative hidden md:block ml-6 order-4 min-w-[140px]">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center text-gray-700 cursor-pointer hover:bg-green-50 transition-colors duration-200 p-3 rounded-lg hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full justify-center border border-gray-200 hover:border-green-200"
            >
              <User className="w-5 h-5 mr-2 text-green-600" />
              <span className="font-medium">My Profile</span>
              <ChevronDown
                className={`w-4 h-4 ml-1 transform transition-transform duration-200 text-green-600 ${
                  isProfileDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 ring-1 ring-gray-200 border border-gray-100">
                {profileMenuItems.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    onClick={item.action}
                    className={`block px-4 py-2 text-sm hover:bg-green-50 rounded-md mx-2 my-1 transition-colors duration-200 ${
                      item.isDestructive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-700 hover:text-green-700"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Cart Button */}
          <button
            onClick={toggleCart}
            className="relative hidden md:flex items-center bg-green-600 text-white py-3 px-6 rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ml-6 order-5 min-w-[140px] justify-center"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="font-medium">My Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Profile Dropdown */}
        {isProfileDropdownOpen && (
          <div className="md:hidden mt-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              <div className="pl-6 pb-2 space-y-2 border-l border-gray-200 ml-2">
                {profileMenuItems.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    onClick={item.action}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 rounded-md ${
                      item.isDestructive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </a>
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
      {isLocationModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-600/50 z-40 transition-opacity duration-300"
            onClick={() => setIsLocationModalOpen(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Change Location
                </h2>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleDetectLocation}
                  className="w-full flex items-center justify-center bg-green-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Detect my location
                </button>

                <div className="flex items-center text-gray-500 justify-center">
                  <span className="mx-2">OR</span>
                </div>

                <div className="relative flex items-center bg-gray-100 rounded-lg overflow-hidden shadow-inner-sm">
                  <Search className="absolute left-3 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search delivery location"
                    className="w-full py-3 pl-10 pr-4 bg-transparent text-gray-800 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSaveAddress(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">
                  Your saved addresses
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">Work</p>
                    <p className="text-sm text-gray-600">
                      Floor 2, 64, Opposite of Satgachi board, beside a tea
                      stall there is a small lane Amarpalli, South Dumdum
                    </p>
                    <div className="flex space-x-3 mt-3">
                      <button
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md"
                        aria-label="Edit address"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-md"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
              <h2 className="text-xl font-semibold text-gray-800">My Cart</h2>
              <button
                onClick={toggleCart}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Your cart is empty.
                </div>
              ) : (
                <>
                  <div className="bg-green-50 bg-opacity-80 text-green-700 font-medium p-3 rounded-lg flex justify-between items-center text-sm">
                    <span>Your total savings</span>
                    <span>₹{cartTotals.totalSavings.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center bg-blue-50 bg-opacity-80 text-blue-700 p-3 rounded-lg text-sm">
                    <span className="mr-2">📦</span>
                    <span>
                      Shipment of {cartItems.length} item
                      {cartItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ₹{item.price.toFixed(2)}{" "}
                            <span className="line-through text-gray-400">
                              ₹{item.originalPrice.toFixed(2)}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="px-3 text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Bill details
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Items total</span>
                        <span>₹{cartTotals.itemsTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saved</span>
                        <span className="text-green-600">
                          ₹{cartTotals.totalSavings.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery charge</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Handling charge</span>
                        <span>₹{cartTotals.handlingCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                        <span>Grand total</span>
                        <span>₹{cartTotals.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Tip your delivery partner
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your kindness means a lot! 100% of your tip will go
                      directly to your delivery partner.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[20, 30, 50].map((amount) => (
                        <button
                          key={amount}
                          className="flex-1 min-w-[80px] py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          ₹{amount}
                        </button>
                      ))}
                      <button className="flex-1 min-w-[80px] py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                        Custom
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Cancellation Policy
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
              <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg flex items-center justify-between shadow-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                <span className="font-bold text-lg">
                  ₹{cartTotals.grandTotal.toFixed(2)}
                </span>
                <span className="flex items-center">
                  Proceed{" "}
                  <ChevronDown className="w-5 h-5 ml-2 rotate-[-90deg]" />
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
