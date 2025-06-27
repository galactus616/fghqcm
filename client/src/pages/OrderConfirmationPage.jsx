import React from "react";

const OrderConfirmationPage = ({ navigate, params }) => {
  const orderId = params.orderId || "N/A";
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md mt-10 sm:mt-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-green-500 mx-auto mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Thank you for your purchase.
        </p>
        <p className="text-gray-700 font-semibold mb-6">
          Your Order ID: <span className="text-green-600">{orderId}</span>
        </p>
        <p className="text-gray-600 mb-8">
          You will receive a confirmation email with details shortly. Your order
          will be delivered soon!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("home")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("orderHistory")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
