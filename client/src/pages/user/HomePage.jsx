import React, { useEffect } from "react";
import CategoriesSlide from "../../components/user/CategoriesSlide";
import PromoBanner from "../../components/user/PromoBanner";
import useStore from '../../store/useStore';
import ProductSection from "../../components/user/ProductSection";
import { useTranslation } from "react-i18next";

const CategorySkeleton = () => (
  <section className="w-full py-6 px-2 sm:px-4 md:px-8">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 w-40 bg-green-100 rounded animate-pulse" />
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-green-100 rounded-full animate-pulse" />
        <div className="h-8 w-8 bg-green-100 rounded-full animate-pulse" />
      </div>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center min-w-[110px] bg-white rounded-xl p-4 shadow-md border border-green-100"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full mb-2 animate-pulse" />
          <div className="h-4 w-16 bg-green-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </section>
);

const ProductsSkeleton = () => (
  <div className="space-y-10 mt-6">
    {[...Array(3)].map((_, idx) => (
      <div key={idx}>
        <div className="h-6 w-48 bg-green-100 rounded mb-4 animate-pulse" />
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-48 h-64 bg-white rounded-xl shadow-md border border-green-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const HomePage = () => {
  const {
    categories,
    categoryProducts,
    loadingCategories,
    loadingProducts,
    productError,
    fetchCategories,
    fetchProductsForCategories,
  } = useStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchProductsForCategories();
    // eslint-disable-next-line
  }, [categories]);

  return (
    <div className="font-sans bg-green-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        {/* Category Slide Section */}
        {productError && <div className="text-center text-red-600 py-6">{t('product_error')}</div>}
        {loadingCategories && <CategorySkeleton />}
        {!loadingCategories && !productError && categories.length > 0 && (
          <CategoriesSlide categories={categories} />
        )}
        <div className="pt-6">
          <PromoBanner />
        </div>
        {loadingProducts ? (
          <ProductsSkeleton />
        ) : (
          <div className="space-y-10  mt-6">
            {categories.map((cat) => (
              <ProductSection
                key={cat.id}
                title={cat.name}
                products={(categoryProducts[cat.name] || []).slice(0, 6)}
                categoryId={cat.id}
                cardClassName="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
                titleClassName="text-green-800 font-bold text-xl md:text-2xl mb-4"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
