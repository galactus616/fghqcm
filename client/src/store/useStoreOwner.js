import { create } from 'zustand';
import { requestOtp, verifyOtp } from '../api/store/storeAuth';
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
}));

export default useStoreOwner; 