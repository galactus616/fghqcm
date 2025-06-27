import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getOrders as apiGetOrders } from "../api/orders"; // Uses API now

const OrderHistoryPage = ({ navigate }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate("login");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedOrders = await apiGetOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter text-gray-700">
        <p className="mt-20">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter">
        <div className="container mx-auto px-4 py-8 text-center text-red-600 text-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("dashboard")}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Order History
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-2xl mx-auto">
            <p className="text-lg text-gray-700">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("home")}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    Order #{order.orderId}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  Date:{" "}
                  <span className="font-medium">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-600 mb-4">
                  Total:{" "}
                  <span className="font-medium text-green-700">
                    ${order.total.toFixed(2)}
                  </span>
                </p>
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-2">
                    Items:
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {order.items.map((item) => (
                      <li key={item.product.id || item.product._id}>
                        {item.product.name} x {item.quantity} ($
                        {(item.product.price * item.quantity).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-gray-600 mb-4">
                  Delivery Address:{" "}
                  <span className="font-medium">{order.deliveryAddress}</span>
                </p>
                <button
                  onClick={() =>
                    console.log(`View details for order ${order.orderId}`)
                  }
                  className="w-full py-2 border border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-all"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
