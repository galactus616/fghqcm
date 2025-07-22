import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(15);
  const { t } = useTranslation();

  // Extract orderId from query params
  const query = new URLSearchParams(location.search);
  const orderId = query.get("orderId");

  useEffect(() => {
    if (countdown === 0) {
      navigate("/orders");
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 bg-green-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center max-w-md w-full">
        <CheckCircle className="w-20 h-20 text-green-600 mb-4 animate-bounce" />
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 mb-2 text-center">
          {t('order_placed_thank_you')}
        </h1>
        <p className="text-green-700 text-lg font-semibold mb-4 text-center">
          {t('order_id')}: <span className="font-mono">{orderId || "-"}</span>
        </p>
        <p className="text-gray-700 text-center mb-6">
          {t('order_getting_ready')} <span className="font-semibold text-green-700">{t('my_orders')}</span>.
        </p>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          {t('redirecting_to')} <span className="text-green-700 font-medium">{t('my_orders')}</span> {t('in')}
          <span className="font-bold text-green-700 text-lg">{countdown}</span>...
        </div>
        <button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
          onClick={() => navigate("/orders")}
        >
          {t('go_to_my_orders_now')}
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 