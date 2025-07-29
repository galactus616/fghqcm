import { create } from 'zustand';
import { requestOtp, verifyOtp } from '../api/store/storeAuth';
import { getStoreCategories } from '../api/store/storeCategories';
import axios from 'axios';

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

  // Categories state
  categories: [],
  loadingCategories: false,
  categoriesError: null,

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
      await verifyOtp(email, otp);
      await get().fetchStoreOwnerProfile();
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

  // Categories functions
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
}));

export default useStoreOwner; 