import React from "react";
import { ShoppingCart, Leaf, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PromoBanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <section
      className="relative w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden shadow-md"
      aria-label={t("Special offer: Get your groceries delivered in 30 minutes")}
    >
      {/* Background Image with performance optimizations */}
      <img
        src="https://res.cloudinary.com/deepmitra/image/upload/v1752308252/nrd-D6Tu_L3chLE-unsplash_pwr8ug.jpg"
        alt="Fresh fruits and vegetables"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r to-transparent backdrop-blur-[2px]" />

      {/* Improved glassmorphic panel focused on fresh fruits & vegetables */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-12">
        <div className="bg-white/50 backdrop-blur-md ring-1 ring-white/50 p-4 md:p-6 rounded-2xl shadow-lg max-w-md transition-all hover:shadow-xl hover:ring-white/70">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center">
              <Leaf className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="ml-2 text-primary font-semibold text-sm">
                {t('Fresh & Organic')}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="ml-1 text-primary font-semibold text-sm">
                {t('30 Min')}
              </span>
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
            {t('Fresh Fruits &')}
            <br className="hidden sm:block" />
            {t('Vegetables')}
          </h1>

          <p className="mt-1 text-gray-800 text-xs md:text-sm font-medium max-w-[90%]">
            {t('Farm-fresh produce delivered in 30 minutes. Order now!')}
          </p>

          <button
            className="mt-4 inline-flex items-center justify-center bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
            aria-label={t('Shop fresh fruits and vegetables')}
            onClick={() => navigate("/category/Fruits & vegetables")}
          >
            <ShoppingCart className="w-3 h-3 mr-2" aria-hidden="true" />
            {t('Shop Fresh')}
            <ChevronRight className="w-3 h-3 ml-1.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;