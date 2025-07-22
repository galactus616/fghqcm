import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/store/auth`;

export const registerStoreOwner = async (email) => {
  return axios.post(`${API_BASE}/register`, { email });
};

export const requestOtp = async (email) => {
  return axios.post(`${API_BASE}/login/request-otp`, { email });
};

export const verifyOtp = async (email, otp) => {
  return axios.post(`${API_BASE}/login/verify-otp`, { email, otp });
};