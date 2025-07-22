import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/user/ProductCard';
import { ArrowLeft } from 'lucide-react';
import useStore from '../../store/useStore';
import { useTranslation } from 'react-i18next';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch all categories from store or API
        let cats = useStore.getState().categories;
        if (!cats || cats.length === 0) {
          await useStore.getState().fetchCategories();
          cats = useStore.getState().categories;
        }
        const cat = cats.find(c => c.id === categoryId || c._id === categoryId || c.name === categoryId);
        setCategory(cat);
        // Fetch products for this category
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/categories/${cat?.id || cat?._id || categoryId}/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(t('failed_to_load_category_or_products'));
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndProducts();
  }, [categoryId, t]);

  return (
    <div className="font-sans bg-green-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <button
            className="flex items-center gap-2 cursor-pointer text-green-700 hover:underline font-medium text-base"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
            {t('back')}
          </button>
          <a
            href="/"
            className="text-green-700 hover:underline font-medium text-base"
          >
            {t('continue_shopping')}
          </a>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">
          {category ? category.name : t('category')}
        </h1>
        {loading ? (
          <div className="text-center text-green-700 py-10 text-lg font-semibold">{t('loading_products')}</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-10">{t('no_products_found_in_this_category')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map(product => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default CategoryPage; 