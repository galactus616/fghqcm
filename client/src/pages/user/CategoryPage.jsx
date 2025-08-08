import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../components/user/ProductCard';
import SubcategorySidebar from '../../components/user/SubcategorySidebar';
import MobileSubcategorySection from '../../components/user/MobileSubcategorySection';
import useStore from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { getSubcategoryIcon } from '../../utils/subcategoryIcons';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState(null);
  const [subSubSubcategories, setSubSubSubcategories] = useState([]);
  const [selectedSubSubSubcategory, setSelectedSubSubSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingSubSubcategories, setLoadingSubSubcategories] = useState(false);
  const [loadingSubSubSubcategories, setLoadingSubSubSubcategories] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const computedCurrentSelection = selectedSubcategory ? selectedSubSubcategory : selectedSubcategory;

  const breadcrumbItems = [
    { name: 'Home', link: '/' },
    { name: (selectedSubcategory?.name || category?.name || t('category')) },
    { name: (computedCurrentSelection?.name || t('all_products')) }
  ];

  const waitForAllSubcategoryFetches = async (mainCats, timeoutMs = 2000) => {
    const ids = mainCats.map(c => c.id || c._id);
    const start = Date.now();
    while (true) {
      const state = useStore.getState();
      const anyLoading = ids.some(id => state.loadingSubCategoriesByParent && state.loadingSubCategoriesByParent[id]);
      if (!anyLoading) return;
      if (Date.now() - start > timeoutMs) return;
      await new Promise(r => setTimeout(r, 50));
    }
  };

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      setError('');
      setSelectedSubSubcategory(null);
      setSelectedSubSubSubcategory(null);
      try {
        let cats = useStore.getState().categories;
        if (!cats || cats.length === 0) {
          await useStore.getState().fetchMainCategories();
          cats = useStore.getState().categories;
        }

        let cat = cats.find(c => c.id === categoryId || c._id === categoryId || c.name === categoryId);

        if (!cat) {
          const subcategoryResults = await Promise.all(
            cats.map(async (mainCat) => {
              try {
                const subcats = await useStore.getState().fetchSubCategoriesByParent(mainCat.id || mainCat._id);
                return subcats.map(sub => ({ ...sub, parentCategory: mainCat }));
              } catch {
                return [];
              }
            })
          );

          await waitForAllSubcategoryFetches(cats);

          const allSubcategories = [];
          cats.forEach(mainCat => {
            const subcats = useStore.getState().subCategories[mainCat.id || mainCat._id] || [];
            allSubcategories.push(...subcats.map(sub => ({ ...sub, parentCategory: mainCat })));
          });

          const foundSubcategory = allSubcategories.find(sub => sub.id === categoryId || sub._id === categoryId || sub.name === categoryId);

          if (foundSubcategory) {
            setCategory(foundSubcategory.parentCategory);
            setSelectedSubcategory(foundSubcategory);
            await fetchSubSubcategories(foundSubcategory);
            await fetchProducts(foundSubcategory);
            setLoading(false);
            return;
          }
        }

        setCategory(cat || null);

        if (cat) {
          await fetchSubcategories(cat);
          await fetchProducts(cat);
        } else {
          setError('Category not found');
        }
      } catch (err) {
        setError(t('failed_to_load_category_or_products'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categoryId, t]);

  const fetchSubcategories = async (cat) => {
    setLoadingSubcategories(true);
    try {
      const catId = cat.id || cat._id;
      await useStore.getState().fetchSubCategoriesByParent(catId);
      const storeSubcategories = useStore.getState().subCategories[catId] || [];
      setSubcategories(storeSubcategories);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const fetchSubSubcategories = async (subcat) => {
    setLoadingSubSubcategories(true);
    try {
      const subcatId = subcat.id || subcat._id;
      await useStore.getState().fetchSubCategoriesByParent(subcatId);
      const storeLevel3 = useStore.getState().subCategories[subcatId] || [];
      setSubSubcategories(storeLevel3);
    } finally {
      setLoadingSubSubcategories(false);
    }
  };

  const fetchProducts = async (catOrSubcat) => {
    try {
      const { getProductsByCategory } = await import('../../api/user/products');
      const cid = catOrSubcat.id || catOrSubcat._id;
      const data = await getProductsByCategory(cid);
      const productsArray = Array.isArray(data) ? data : [];
      setProducts(productsArray);
      setAllProducts(productsArray);
    } catch {
      setProducts([]);
      setAllProducts([]);
    }
  };

  useEffect(() => {
    let filtered = allProducts;

    if (selectedSubSubcategory) {
      const selectedL3Id = selectedSubSubcategory.id || selectedSubSubcategory._id;
      filtered = filtered.filter(p => (p.subSubCategory?.id || p.subSubCategory?._id) === selectedL3Id);
    }

    if (selectedSubSubSubcategory) {
      const selectedL4Id = selectedSubSubSubcategory.id || selectedSubSubSubcategory._id;
      filtered = filtered.filter(p => (p.subSubSubCategory?.id || p.subSubSubCategory?._id) === selectedL4Id);
    }

    setProducts(filtered);
  }, [selectedSubSubcategory, selectedSubSubSubcategory, allProducts]);

  const handleLevel3Select = async (subcategoryL3) => {
    setSelectedSubSubcategory(subcategoryL3);
    setSelectedSubSubSubcategory(null);
    setSubSubSubcategories([]);
    setLoadingSubSubSubcategories(true);

    try {
      const subcatId = subcategoryL3.id || subcategoryL3._id;
      await useStore.getState().fetchSubCategoriesByParent(subcatId);
      const storeLevel4 = useStore.getState().subCategories[subcatId] || [];
      setSubSubSubcategories(storeLevel4);
    } finally {
      setLoadingSubSubSubcategories(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">{t('loading_products')}</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  const listForSidebarOrMobile = selectedSubcategory ? subSubcategories : subcategories;
  const currentSelectionForSidebarOrMobile = computedCurrentSelection;
  const onSelectHandler = selectedSubcategory ? handleLevel3Select : setSelectedSubcategory;
  const isLoadingList = selectedSubcategory ? loadingSubSubcategories : loadingSubcategories;

  return (
    <div className="font-sans bg-[#0a614d]/5 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="md:block hidden text-2xl md:text-3xl font-bold text-green-800 mb-6">
          {(selectedSubcategory?.name || category?.name || t('category'))}
          <span className="text-primary font-normal">
            ({computedCurrentSelection?.name || t('all_products')})
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-5 md:gap-2">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <SubcategorySidebar
              subcategories={listForSidebarOrMobile}
              selectedSubcategory={currentSelectionForSidebarOrMobile}
              onSubcategorySelect={onSelectHandler}
              loading={isLoadingList}
            />
          </div>

          {/* Main Content: Topbar + Products */}
          <div className="flex-1 flex flex-col gap-4">
            {subSubSubcategories.length > 0 && (
              <div className="p-2 bg-white border border-green-200 rounded shadow-sm flex gap-2 overflow-x-auto">
                <button
                  className={`px-3 py-1 text-sm rounded cursor-pointer ${!selectedSubSubSubcategory ? 'bg-primary text-white' : 'bg-gray-200'}`}
                  onClick={() => setSelectedSubSubSubcategory(null)}
                >
                  All Products
                </button>
                {subSubSubcategories.map((sub4) => (
                  <button
                    key={sub4.id || sub4._id}
                    className={`px-3 py-1 text-sm rounded cursor-pointer ${
                      selectedSubSubSubcategory?.id === sub4.id ? 'bg-primary text-white' : 'bg-gray-200'
                    }`}
                    onClick={() => setSelectedSubSubSubcategory(sub4)}
                  >
                    {sub4.name}
                  </button>
                ))}
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                {t('no_products_found_in_this_subcategory')}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                {products.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Subcategories */}
        <MobileSubcategorySection
          category={{ name: selectedSubcategory?.name || category?.name || t('category') }}
          subcategories={listForSidebarOrMobile}
          selectedSubcategory={currentSelectionForSidebarOrMobile}
          onSubcategorySelect={onSelectHandler}
          getSubcategoryIcon={getSubcategoryIcon}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
