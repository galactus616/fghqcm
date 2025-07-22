import { create } from 'zustand';
import { requestOtp, verifyOtp } from '../api/store/storeAuth';
import axios from 'axios';

const getProfile = async () => {
  const res = await axios.get('/api/store/auth/profile', { withCredentials: true });
  return res.data;
};

const logout = async () => {
  await axios.post('/api/store/auth/logout', {}, { withCredentials: true });
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
}));

export default useStoreOwner; 