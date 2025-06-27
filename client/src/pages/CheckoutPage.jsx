import React, { useState, useEffect, useContext } from "react";
import Toast from "../components/Toast";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { placeOrder as apiPlaceOrder } from "../api/orders";

const CheckoutPage = ({ navigate }) => {
  const { cart, getTotalItems, getTotalPrice, clearCart } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!user) {
      navigate("login");
    } else if (getTotalItems() === 0) {
      navigate("cart");
    }
  }, [user, navigate, getTotalItems]);

  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      setError("Please provide a delivery address and phone number.");
      showToast("Please fill all required fields.", "error");
      return;
    }

    if (selectedPaymentMethod !== "cod") {
      showToast("Only Cash on Delivery is currently supported.", "error");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const orderData = {
        deliveryAddress: address,
        phone,
        paymentMethod: selectedPaymentMethod,
        items: cart.map((item) => ({
          productId: item.product.id || item.product._id,
          quantity: item.quantity,
        })),
      };
      const { order } = await apiPlaceOrder(orderData);
      showToast(`Order ${order.id} placed successfully!`, "success");
      await clearCart(); // Clear cart after successful order
      navigate("orderConfirmation", { orderId: order.id });
    } catch (err) {
      console.error("Order placement error:", err);
      setError(err.message || "Failed to place order. Please try again.");
      showToast(err.message || "Failed to place order.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
              Delivery Information
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}
            <div className="space-y-4 mb-8">
              <div>
                <label
                  htmlFor="address"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors"
                  rows="4"
                  placeholder="Street Address, City, State, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="+91 XXXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
              Payment Method
            </h2>
            <div className="space-y-4">
              {/* Cash on Delivery */}
              <div
                className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 cursor-pointer"
                onClick={() => setSelectedPaymentMethod("cod")}
              >
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="cod"
                  className="form-radio text-green-600 h-5 w-5"
                  checked={selectedPaymentMethod === "cod"}
                  onChange={() => setSelectedPaymentMethod("cod")}
                />
                <label
                  htmlFor="cashOnDelivery"
                  className="text-lg font-medium text-gray-800"
                >
                  Cash on Delivery (COD)
                </label>
              </div>
              {/* UPI (Disabled) */}
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 flex items-center space-x-3 opacity-60 cursor-not-allowed">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  className="form-radio text-gray-400 h-5 w-5"
                  checked={selectedPaymentMethod === "upi"}
                  onChange={() => {}}
                  disabled
                />
                <label
                  htmlFor="upi"
                  className="text-lg font-medium text-gray-600"
                >
                  UPI
                </label>
                <span className="ml-auto text-sm text-gray-500 font-semibold px-2 py-1 bg-gray-200 rounded-full">
                  Coming Soon
                </span>
              </div>
              {/* Credit/Debit Card (Disabled) */}
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 flex items-center space-x-3 opacity-60 cursor-not-allowed">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  className="form-radio text-gray-400 h-5 w-5"
                  checked={selectedPaymentMethod === "card"}
                  onChange={() => {}}
                  disabled
                />
                <label
                  htmlFor="card"
                  className="text-lg font-medium text-gray-600"
                >
                  Credit/Debit Card
                </label>
                <span className="ml-auto text-sm text-gray-500 font-semibold px-2 py-1 bg-gray-200 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Currently, only Cash on Delivery is available. Other payment
              methods will be enabled soon!
            </p>
          </div>

          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 text-gray-700 mb-6">
              {cart.map((item) => (
                <div
                  key={item.product.id || item.product._id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                <span>Subtotal:</span>
                <span>${getTotalPrice()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Delivery Fee:</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl font-bold text-gray-800">
              <span>Total Payable:</span>
              <span>${getTotalPrice()}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-8 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Place Order
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
