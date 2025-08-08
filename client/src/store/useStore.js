import {create} from 'zustand';
import { getProfile, logout as apiLogout, sendOtp, verifyOtp } from '../api/user/auth';
import { getCart as apiGetCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart, mergeCart as apiMergeCart } from '../api/user/cart';
import { getProductById } from '../api/user/products';
import { getAllLocalCartItems, addToLocalCart, setLocalCart, clearLocalCart } from '../utils/localCart';
import { getCategories as apiGetCategories, getSubCategories as apiGetSubCategories } from '../api/user/categories';
import debounce from 'lodash.debounce';
import { updateProfile as apiUpdateProfile } from '../api/user/user';
import i18n from "../i18n";

const useStore = create((set, get) => ({
  // Auth slice
  user: null,
  isLoggedIn: false,
  isAuthLoading: false,
  async fetchProfile() {
    set({ isAuthLoading: true });
    try {
      const res = await getProfile();
      set({ user: res.data.user, isLoggedIn: true, isAuthLoading: false });
    } catch (err) {
      // Silently handle 401 Unauthorized (not logged in)
      set({ user: null, isLoggedIn: false, isAuthLoading: false });
      // Optionally, only log unexpected errors
      if (err?.response?.status !== 401) {
        console.error('Failed to fetch profile:', err);
      }
    }
  },
  async logout() {
    await apiLogout();
    set({ user: null, isLoggedIn: false });
  },
  async loginWithOtp(phone, otp) {
    try {
      const data = await verifyOtp(phone, otp);
      set({ user: data.user, isLoggedIn: true });
      // Merge guest cart if it exists
      const guestItems = getAllLocalCartItems();
      if (guestItems && guestItems.length > 0) {
        try {
          await apiMergeCart(guestItems);
          clearLocalCart();
        } catch (mergeError) {
          console.error('Failed to merge cart:', mergeError);
          // Continue with login even if merge fails
        }
      }
      // Fetch the updated backend cart
      await get().fetchCart();
      return data;
    } catch (err) {
      set({ user: null, isLoggedIn: false });
      throw err;
    }
  },
  async updateProfile(profileObj) {
    try {
      const res = await apiUpdateProfile(profileObj);
      if (res.user) {
        set({ user: res.user });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  // Cart slice
  items: [],
  hydratedItems: [],
  cartLoading: false,
  cartError: null,
  async fetchCart() {
    set({ cartLoading: true, cartError: null });
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      try {
        const data = await apiGetCart();
        // The API returns the cart items directly, not wrapped in an 'items' property
        const cartItems = Array.isArray(data) ? data : [];
        set({ items: cartItems, hydratedItems: cartItems, cartLoading: false });
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        set({ items: [], hydratedItems: [], cartError: 'Failed to load cart', cartLoading: false });
      }
    } else {
      try {
        const localItems = getAllLocalCartItems();
        set({ items: localItems });
        if (localItems.length === 0) {
          set({ hydratedItems: [], cartLoading: false });
          return;
        }
        // Hydrate guest cart
        const hydrated = await Promise.all(localItems.map(async (item) => {
          try {
            const product = await getProductById(item.productId);
            if (!product || !Array.isArray(product.variants)) {
              return {
                ...item,
                name: 'Unavailable',
                imageUrl: '/vite.svg',
                price: 0,
                originalPrice: 0,
                variantLabel: '',
              };
            }
            const variant = product.variants[item.variantIndex] || {};
            return {
              ...item,
              name: product.name || 'Unavailable',
              imageUrl: product.images?.[0] || product.imageUrl || '/vite.svg',
              price: typeof variant.discountedPrice === 'number' ? variant.discountedPrice : (typeof variant.price === 'number' ? variant.price : 0),
              originalPrice: typeof variant.price === 'number' ? variant.price : 0,
              variantLabel: variant.quantityLabel || '',
            };
          } catch {
            return {
              ...item,
              name: 'Unavailable',
              imageUrl: '/vite.svg',
              price: 0,
              originalPrice: 0,
              variantLabel: '',
            };
          }
        }));
        set({ hydratedItems: hydrated, cartLoading: false });
      } catch {
        set({ items: [], hydratedItems: [], cartError: 'Failed to load local cart', cartLoading: false });
      }
    }
  },
  async addToCart(item) {
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      // Optimistic UI: update cart immediately
      const prevCart = get().items;
      let found = false;
      const newCart = prevCart.map(cartItem => {
        if (cartItem.productId === item.productId && cartItem.variantIndex === item.variantIndex) {
          found = true;
          return { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) };
        }
        return cartItem;
      });
      const optimisticCart = found ? newCart : [...prevCart, { ...item }];
      set({ items: optimisticCart, hydratedItems: optimisticCart });
      try {
        const response = await apiAddToCart(item);
        if (response && response.cart) {
          set({ items: [...response.cart], hydratedItems: [...response.cart] });
        } else {
          await get().fetchCart();
        }
      } catch (error) {
        set({ items: prevCart, hydratedItems: prevCart });
        console.error('Failed to add to cart:', error);
        toast.error('Failed to add to cart. Please try again.');
      }
    } else {
      addToLocalCart(item);
      await get().fetchCart();
    }
  },

  // --- Optimistic UI helpers ---
  _debouncedUpdateCartItem: debounce(async (productId, variantIndex, quantity, prevCart) => {
    try {
      const response = await apiUpdateCartItem(productId, variantIndex, quantity);
      if (response && response.cart) {
        set({ items: [...response.cart], hydratedItems: [...response.cart] });
      } else {
        await get().fetchCart();
      }
    } catch (error) {
      set({ items: prevCart, hydratedItems: prevCart });
      toast.error('Failed to update cart. Please try again.');
    }
  }, 300),

  _debouncedRemoveFromCart: debounce(async (productId, variantIndex, prevCart) => {
    try {
      const response = await apiRemoveFromCart(productId, variantIndex);
      if (response && response.cart) {
        set({ items: [...response.cart], hydratedItems: [...response.cart] });
      } else {
        await get().fetchCart();
      }
    } catch (error) {
      set({ items: prevCart, hydratedItems: prevCart });
      toast.error('Failed to remove from cart. Please try again.');
    }
  }, 300),

  updateCartItem(productId, variantIndex, quantity) {
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      // Optimistic UI: update cart immediately
      const prevCart = get().items;
      const newCart = prevCart.map(item =>
        item.productId === productId && item.variantIndex === variantIndex
          ? { ...item, quantity }
          : item
      );
      set({ items: newCart, hydratedItems: newCart });
      // Debounced API call
      get()._debouncedUpdateCartItem(productId, variantIndex, quantity, prevCart);
    } else {
      const items = getAllLocalCartItems().map((item) =>
        item.productId === productId && item.variantIndex === variantIndex
          ? { ...item, quantity }
          : item
      ).filter((item) => item.quantity > 0);
      setLocalCart(items);
      get().fetchCart();
    }
  },

  removeFromCart(productId, variantIndex) {
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      // Optimistic UI: update cart immediately
      const prevCart = get().items;
      const newCart = prevCart.filter(item => !(item.productId === productId && item.variantIndex === variantIndex));
      set({ items: newCart, hydratedItems: newCart });
      // Debounced API call
      get()._debouncedRemoveFromCart(productId, variantIndex, prevCart);
    } else {
      const items = getAllLocalCartItems().filter(
        (item) => !(item.productId === productId && item.variantIndex === variantIndex)
      );
      setLocalCart(items);
      get().fetchCart();
    }
  },
  async clearCart() {
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      await apiClearCart();
      await get().fetchCart();
    } else {
      clearLocalCart();
      await get().fetchCart();
    }
  },

  // Product/category slice
  categories: [],
  subCategories: {}, // Store subcategories for each main category
  loadingCategories: false,
  loadingSubCategories: false,
  // New: track loading per parent id to allow parallel fetches
  loadingSubCategoriesByParent: {},
  productError: null,
  async fetchMainCategories() {
    set({ loadingCategories: true, productError: null });
    try {
      console.log('Store: Fetching main categories...');
      const data = await apiGetCategories();
      console.log('Store: Main categories fetched:', data);
      set({ categories: Array.isArray(data) ? data : [], loadingCategories: false });
    } catch (err) {
      console.error('Store: Failed to fetch main categories:', err);
      set({ categories: [], loadingCategories: false, productError: 'Failed to load categories' });
    }
  },
  async fetchSubCategoriesByParent(parentCategoryId) {
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
      loadingSubCategoriesByParent: {
        ...state.loadingSubCategoriesByParent,
        [parentCategoryId]: true,
      },
    });
    try {
      const data = await apiGetSubCategories(parentCategoryId);
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
      }));
      return emptyArray;
    }
  },
  setProductError(error) {
    set({ productError: error });
  },

  // Orders slice
  orders: [],
  ordersLoading: false,
  ordersError: null,
  async fetchOrders() {
    set({ ordersLoading: true, ordersError: null });
    try {
      const res = await fetch('/api/orders', { credentials: 'include' });
      const data = await res.json();
      set({ orders: data || [], ordersLoading: false });
    } catch (error) {
      set({ orders: [], ordersLoading: false, ordersError: 'Failed to load orders' });
    }
  },

  // Global location state
  currentLocation: 'Select location',
  setCurrentLocation: (location) => set({ currentLocation: location }),
  isLocationModalOpen: false,
  setLocationModalOpen: (isOpen) => set({ isLocationModalOpen: isOpen }),

  // Global selected address state
  selectedAddressId: null,
  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
  
  language: "en",
  setLanguage: (lang) => {
    set({ language: lang });
    i18n.changeLanguage(lang);
  },
}));

export default useStore; 
