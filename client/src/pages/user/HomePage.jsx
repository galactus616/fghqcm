import React, { useEffect } from "react";
import CategorySection from "../../components/user/CategorySection";
import PromoBanner from "../../components/user/PromoBanner";
import useStore from '../../store/useStore';
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const {
    categories,
    loadingCategories,
    productError,
    fetchMainCategories,
  } = useStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchMainCategories();
  }, []);

  return (
    <div className="font-sans bg-[#0a614d]/5 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        <div className="pt-10">
          <PromoBanner />
        </div>
        
        {/* Category Section */}
        {productError && <div className="text-center text-bd-red py-6">{t('product_error')}</div>}
        {!loadingCategories && !productError && categories.length > 0 && (
          <CategorySection categories={categories} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
