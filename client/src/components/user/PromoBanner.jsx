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
      {/* Background Image with performance optimizations (Unchanged as requested) */}
      <img
        src="https://res.cloudinary.com/deepmitra/image/upload/v1752308252/nrd-D6Tu_L3chLE-unsplash_pwr8ug.jpg"
        alt="Fresh groceries including fruits, vegetables, and yogurt"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />

      {/* Enhanced gradient overlay (Unchanged as requested) */}
      <div className="absolute inset-0 bg-gradient-to-r to-transparent backdrop-blur-[2px]" />

      {/* Improved glassmorphic panel with a focus on the 30-min USP */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-12">
        <div className="bg-white/50 backdrop-blur-md ring-1 ring-white/50 p-4 md:p-6 rounded-2xl shadow-lg max-w-md transition-all hover:shadow-xl hover:ring-white/70">
          <div className="flex items-center mb-3">
            <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="ml-2 text-primary font-semibold text-md">
              {t('Delivery in 30 Minutes')}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
            {t('Craving Freshness?')}
            <br className="hidden sm:block" />
            {t('Get It Fast.')}
          </h1>

          <p className="mt-1 text-gray-800 text-xs md:text-sm font-medium max-w-[90%]">
            {t('From our store to your door in half an hour. Order now!')}
          </p>

          <button
            className="mt-4 inline-flex items-center justify-center bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
            aria-label={t('Start shopping now for 30-minute delivery')}
            onClick={() => navigate("/")}
          >
            <ShoppingCart className="w-3 h-3 mr-2" aria-hidden="true" />
            {t('Shop Now')}
            <ChevronRight className="w-3 h-3 ml-1.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;