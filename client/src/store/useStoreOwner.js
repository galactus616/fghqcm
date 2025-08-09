import { create } from 'zustand';
import { requestOtp, verifyOtp } from '../api/store/storeAuth';
import { getStoreCategories, getStoreSubCategories} from '../api/store/storeCategories';
import { getStoreProducts, getStoreProductsByCategory } from '../api/store/storeProducts';
import axios from 'axios';
import { getMyInventory } from '../api/store/storeInventory';

const getProfile = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/store/auth/profile`, { withCredentials: true });
  return res.data;
};

const logout = async () => {
  await axios.post(`${import.meta.env.VITE_API_BASE_URL}/store/auth/logout`, {}, { withCredentials: true });
};

const useStoreOwner = create((set, get) => ({
  storeOwner: null,
  isStoreOwnerLoggedIn: false,
  isStoreOwnerAuthLoading: true,

  // Categories state - Updated for 4 levels
  categories: [], // Level 1 categories
  subCategories: {}, // Store subcategories for each parent category (all levels)
  loadingCategories: false,
  loadingSubCategories: false,
  loadingSubCategoriesByParent: {}, // Track loading per parent id
  categoriesError: null,

  // Products state
  products: [],
  loadingProducts: false,
  productsError: null,

  // Inventory state
  inventory: [],
  

  async fetchStoreOwnerProfile() {
    set({ isStoreOwnerAuthLoading: true });
    try {
      const res = await getProfile();
      set({ storeOwner: res.storeOwner, isStoreOwnerLoggedIn: true, isStoreOwnerAuthLoading: false });
    } catch (err) {
      set({ storeOwner: null, isStoreOwnerLoggedIn: false, isStoreOwnerAuthLoading: false });
    }
  },

  async refreshProfile() {
    try {
      const res = await getProfile();
      set({ storeOwner: res.storeOwner, isStoreOwnerLoggedIn: true });
      return res.storeOwner;
    } catch (err) {
      console.error('Error refreshing profile:', err);
      return null;
    }
  },

  async loginWithOtp(email, otp) {
    set({ isStoreOwnerAuthLoading: true });
    try {
      const response = await verifyOtp(email, otp);
      await get().fetchStoreOwnerProfile();
      return response;
    } catch (err) {
      set({ storeOwner: null, isStoreOwnerLoggedIn: false, isStoreOwnerAuthLoading: false });
      throw err;
    }
  },

  async logoutStoreOwner() {
    await logout();
    set({ storeOwner: null, isStoreOwnerLoggedIn: false });
  },

  async requestOtp(email) {
    return requestOtp(email);
  },

  // Categories functions - Updated for 4 levels
  async fetchCategories() {
    set({ loadingCategories: true, categoriesError: null });
    try {
      const data = await getStoreCategories();
      set({ categories: Array.isArray(data) ? data : [], loadingCategories: false });
    } catch (err) {
      set({ categories: [], loadingCategories: false, categoriesError: 'Failed to load categories' });
      console.error('Failed to fetch categories:', err);
    }
  },

  async fetchSubCategories(parentCategoryId) {
    const state = get();
    // If already loading this specific parent, skip
    if (state.loadingSubCategoriesByParent[parentCategoryId]) {
      console.log('Store: Skipping fetch for', parentCategoryId, '- already loading');
      return state.subCategories[parentCategoryId] || [];
    }
    // If we already have subcategories for this parent, do nothing
    if (state.subCategories[parentCategoryId] && state.subCategories[parentCategoryId].length > 0) {
      console.log('Store: Skipping fetch for', parentCategoryId, '- already have data');
      return state.subCategories[parentCategoryId];
    }

    console.log('Store: Starting fetch for parent category ID:', parentCategoryId);
    set({
      loadingSubCategories: true,
      loadingSubCategoriesByParent: {
        ...state.loadingSubCategoriesByParent,
        [parentCategoryId]: true,
      },
    });
    try {
      const data = await getStoreSubCategories(parentCategoryId);
      console.log('Store: Successfully fetched subcategories for', parentCategoryId, ':', data.length, 'items');
      const subcategories = Array.isArray(data) ? data : [];
      set((current) => ({
        subCategories: {
          ...current.subCategories,
          [parentCategoryId]: subcategories,
        },
        loadingSubCategoriesByParent: {
          ...current.loadingSubCategoriesByParent,
          [parentCategoryId]: false,
        },
        loadingSubCategories: false,
      }));
      return subcategories;
    } catch (err) {
      console.error('Store: Failed to fetch subcategories for', parentCategoryId, ':', err);
      const emptyArray = [];
      set((current) => ({
        subCategories: {
          ...current.subCategories,
          [parentCategoryId]: emptyArray,
        },
        loadingSubCategoriesByParent: {
          ...current.loadingSubCategoriesByParent,
          [parentCategoryId]: false,
        },
        loadingSubCategories: false,
      }));
      return emptyArray;
    }
  },

  // Products functions
  async fetchProducts() {
    set({ loadingProducts: true, productsError: null });
    try {
      const data = await getStoreProducts();
      set({ products: Array.isArray(data) ? data : [], loadingProducts: false });
    } catch (err) {
      set({ products: [], loadingProducts: false, productsError: 'Failed to load products' });
      console.error('Failed to fetch products:', err);
    }
  },

  async fetchProductsByCategory(categoryId) {
    if (categoryId === 'all') {
      return get().fetchProducts();
    }
    
    set({ loadingProducts: true, productsError: null });
    try {
      const data = await getStoreProductsByCategory(categoryId);
      set({ products: Array.isArray(data) ? data : [], loadingProducts: false });
    } catch (err) {
      set({ products: [], loadingProducts: false, productsError: 'Failed to load products for this category' });
      console.error('Failed to fetch products by category:', err);
    }
  },

  // Inventroy functions
  async fetchMyInventory(){
    try {
      const data = await getMyInventory();
      set({ inventory: Array.isArray(data) ? data : []})
    } catch (error) {
      set({ inventory: []})
      console.error("Failed to fetch inventory")
    }
  }
}));

export default useStoreOwner; 