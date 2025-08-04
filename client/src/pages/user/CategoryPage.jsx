import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/user/ProductCard';
import SubcategorySidebar from '../../components/user/SubcategorySidebar';
import MobileSubcategorySection from '../../components/user/MobileSubcategorySection';
import { ArrowLeft } from 'lucide-react';
import useStore from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { getSubcategoryIcon } from '../../utils/subcategoryIcons';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', link: '/' },
    { name: 'Categories', link: '/' },
    { name: category?.name || 'Category' }
  ];

  // Fetch category and products
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch categories
        let cats = useStore.getState().categories;
        if (!cats || cats.length === 0) {
          await useStore.getState().fetchCategories();
          cats = useStore.getState().categories;
        }
        
        const cat = cats.find(c => c.id === categoryId || c._id === categoryId || c.name === categoryId);
        setCategory(cat);
        
        if (cat) {
          // Fetch subcategories
          await fetchSubcategories(cat);
          // Fetch products
          await fetchProducts(cat);
        }
      } catch (err) {
        setError(t('failed_to_load_category_or_products'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categoryId, t]);

  // Fetch subcategories for a category
  const fetchSubcategories = async (cat) => {
    setLoadingSubcategories(true);
    try {
      await useStore.getState().fetchSubCategories(cat.id || cat._id);
      const storeSubcategories = useStore.getState().subCategories[cat.id || cat._id] || [];
      setSubcategories(storeSubcategories);
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Fetch products for a category
  const fetchProducts = async (cat) => {
    try {
      const { getProductsByCategory } = await import('../../api/user/products');
      const data = await getProductsByCategory(cat.id || cat._id);
      const productsArray = Array.isArray(data) ? data : [];
      setProducts(productsArray);
      setAllProducts(productsArray);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
      setAllProducts([]);
    }
  };

  // Filter products when subcategory changes
  useEffect(() => {
    if (selectedSubcategory === null) {
      setProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter(product => {
        const productSubcategoryId = product.subCategory?.id || product.subCategory?._id;
        const selectedSubcategoryId = selectedSubcategory.id || selectedSubcategory._id;
        return productSubcategoryId === selectedSubcategoryId;
      });
      setProducts(filteredProducts);
    }
  }, [selectedSubcategory, allProducts]);

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="font-sans bg-[#0a614d]/5 min-h-screen pb-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-8">
          <div className="text-center text-green-700 py-10 text-lg font-semibold">
            {t('loading_products')}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="font-sans bg-[#0a614d]/5 min-h-screen pb-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-8">
          <div className="text-center text-red-600 py-10">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#0a614d]/5 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-8">
        <Breadcrumbs items={breadcrumbItems} />
        
        {/* Navigation Header */}
        {/* <div className="hidden md:flex items-center justify-between mb-4">
          <button
            className="hidden md:flex items-center gap-2 cursor-pointer text-green-700 hover:underline font-medium text-base"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
            {t('back')}
          </button>
          <a
            href="/"
            className="text-green-700 hover:underline hidden md:block font-medium text-base"
          >
            {t('continue_shopping')}
          </a>
        </div> */}

        {/* Category Title */}
        <h1 className="md:block hidden text-2xl md:text-3xl font-bold text-green-800 mb-6">
          {category ? (
            <>
              {category.name}
              <span className="text-primary font-normal">
                {selectedSubcategory ? ` (${selectedSubcategory.name})` : ` (${t('all_products')})`}
              </span>
            </>
          ) : (
            t('category')
          )}
        </h1>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-5 md:gap-2">
          {/* Mobile Subcategory Section */}
          <MobileSubcategorySection
            category={category}
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
            onSubcategorySelect={handleSubcategorySelect}
            getSubcategoryIcon={getSubcategoryIcon}
          />

          {/* Desktop Subcategory Sidebar */}
          <div className="hidden lg:block">
            <SubcategorySidebar
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              onSubcategorySelect={handleSubcategorySelect}
              loading={loadingSubcategories}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                {selectedSubcategory 
                  ? t('no_products_found_in_this_subcategory') 
                  : t('no_products_found_in_this_category')
                }
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-1">
                {products.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 